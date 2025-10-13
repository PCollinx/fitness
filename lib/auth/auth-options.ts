import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { User } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import prisma from "../prisma";

// Session types are now defined in types/next-auth.d.ts

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type assertion to fix adapter compatibility
  // Allow linking OAuth accounts to existing users with the same email
  // This is safe because OAuth providers verify email ownership
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("🔗 Account linked:", {
        userId: user.id,
        provider: account.provider,
        email: user.email,
      });
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email, // Ensure name is never null
          image: user.image || undefined, // Convert null to undefined
        } as any; // Type assertion to fix NextAuth compatibility
      },
    }),
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: any;
      account?: any;
    }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      // Always fetch the latest user data to get onboarding status
      if (token.email) {
        try {
          const userData = await prisma.user.findUnique({
            where: { email: token.email },
            include: {
              fitnessGoals: true,
            },
          });

          if (userData) {
            token.role = userData.role;
            token.fitnessGoals = userData.fitnessGoals.map((fg) => fg.goalType);

            // For existing users, if onboardingCompleted is null and they have fitness goals,
            // consider them as having completed onboarding
            const hasCompletedOnboarding =
              userData.onboardingCompleted ||
              (userData.fitnessGoals && userData.fitnessGoals.length > 0);

            token.onboardingCompleted = hasCompletedOnboarding;
            token.hasCompletedOnboarding = hasCompletedOnboarding;
          } else {
            console.log("⚠️ No user found in database for email:", token.email);
            // For users not in database yet (first OAuth login or during account creation)
            // Mark as NOT completed so they go through onboarding
            token.fitnessGoals = [];
            token.onboardingCompleted = false;
            token.hasCompletedOnboarding = false;
          }
        } catch (error) {
          console.error("❌ Error fetching user data for JWT:", error);
          // On error, default to requiring onboarding
          token.fitnessGoals = [];
          token.onboardingCompleted = false;
          token.hasCompletedOnboarding = false;
        }
      }

      console.log("🎫 Final token state:", {
        id: token.id,
        email: token.email,
        onboardingCompleted: token.onboardingCompleted,
      });

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("📋 Session callback triggered:", {
        hasToken: !!token,
        hasSessionUser: !!session.user,
        tokenId: token.id,
        tokenEmail: token.email,
        sessionUserEmail: session.user?.email,
      });

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fitnessGoals = token.fitnessGoals;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;

        console.log("✅ Session updated with token data:", {
          userId: session.user.id,
          email: session.user.email,
          role: session.user.role,
          hasCompletedOnboarding: session.user.hasCompletedOnboarding,
          fitnessGoalsCount: session.user.fitnessGoals?.length || 0,
        });
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Allow sign in from credentials provider
        if (account?.provider === "credentials") {
          console.log("✅ Credentials sign-in attempt for:", user?.email);
          return true;
        }

        // Handle OAuth providers (Google, etc.)
        if (account?.provider === "google" || account?.provider === "oauth") {
          console.log("✅ OAuth sign-in attempt for:", user?.email);

          if (!user?.email) {
            console.log("❌ No email provided by OAuth provider");
            return false;
          }

          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            console.log("👤 User exists in database with ID:", existingUser.id);

            // Check if this specific OAuth account is already linked
            const accountAlreadyLinked = existingUser.accounts.some(
              (acc) => 
                acc.provider === account.provider && 
                acc.providerAccountId === account.providerAccountId
            );

            if (accountAlreadyLinked) {
              console.log("✅ OAuth account already linked, allowing sign in");
              return true;
            }

            // Check if ANY OAuth account from this provider is linked
            const providerAlreadyLinked = existingUser.accounts.some(
              (acc) => acc.provider === account.provider
            );

            if (providerAlreadyLinked) {
              console.log("⚠️ Different account from same provider already linked");
              // This might be a different Google account, so deny to prevent confusion
              return `/auth/error?error=AccountNotLinked&provider=${account.provider}`;
            }

            // User exists but no account from this provider is linked yet
            // Link the OAuth account to the existing user
            console.log("🔗 Linking OAuth account to existing user");
            
            try {
              // The PrismaAdapter will try to create the user, but it already exists
              // We need to manually link the account
              const linkedAccount = await prisma.account.findFirst({
                where: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              });

              if (!linkedAccount) {
                // Create the account link
                await prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state as string | null,
                  },
                });
                console.log("✅ OAuth account linked successfully");
              }

              // Update the user object with the existing user's ID
              // This is crucial for the JWT callback to work correctly
              user.id = existingUser.id;
              
              return true;
            } catch (linkError) {
              console.error("❌ Error linking OAuth account:", linkError);
              // If there's a unique constraint error, the account might already be linked
              // Allow sign in anyway
              user.id = existingUser.id;
              return true;
            }
          }

          // New user, let PrismaAdapter create the user and account
          console.log("✅ New OAuth user, allowing account creation");
          return true;
        }

        console.log("❌ Unknown provider:", account?.provider);
        return true;
      } catch (error) {
        console.error("❌ SignIn callback error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug logging to help troubleshoot
  debug: true,
};

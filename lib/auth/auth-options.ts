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
      console.log("🔑 JWT callback triggered:", {
        hasUser: !!user,
        tokenEmail: token.email,
        userEmail: user?.email,
        provider: account?.provider,
      });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        console.log("📝 Setting token from user:", { id: user.id, email: user.email });
      }

      // Always fetch the latest user data to get onboarding status
      if (token.email) {
        try {
          console.log("🔍 Fetching user data for:", token.email);
          const userData = await prisma.user.findUnique({
            where: { email: token.email },
            include: {
              fitnessGoals: true,
            },
          });

          console.log("👤 User data found:", {
            exists: !!userData,
            onboardingCompleted: userData?.onboardingCompleted,
            fitnessGoalsCount: userData?.fitnessGoals?.length || 0,
          });

          if (userData) {
            token.role = userData.role;
            token.fitnessGoals = userData.fitnessGoals.map((fg) => fg.goalType);
            
            // For existing users, if onboardingCompleted is null and they have fitness goals,
            // consider them as having completed onboarding
            const hasCompletedOnboarding = userData.onboardingCompleted || 
              (userData.fitnessGoals && userData.fitnessGoals.length > 0);
            
            token.onboardingCompleted = hasCompletedOnboarding;
            token.hasCompletedOnboarding = hasCompletedOnboarding;
            
            console.log("🔄 Setting onboarding status:", {
              originalValue: userData.onboardingCompleted,
              hasFitnessGoals: userData.fitnessGoals.length > 0,
              finalValue: hasCompletedOnboarding
            });
          } else {
            console.log("⚠️ No user found in database for email:", token.email);
            // For users not in database yet (first OAuth login), let them sign in normally
            // The Prisma adapter will create the user record
            token.fitnessGoals = [];
            token.onboardingCompleted = true; // Allow normal access, they can set goals later
            token.hasCompletedOnboarding = true;
          }
        } catch (error) {
          console.error("❌ Error fetching user data for JWT:", error);
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
        session.user.fitnessGoals = token.fitnessGoals;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
        
        console.log("✅ Session updated with token data:", {
          userId: session.user.id,
          email: session.user.email,
          hasCompletedOnboarding: session.user.hasCompletedOnboarding,
          fitnessGoalsCount: session.user.fitnessGoals?.length || 0,
        });
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback triggered:", {
        provider: account?.provider,
        userId: user?.id,
        userEmail: user?.email,
        accountId: account?.providerAccountId,
        userName: user?.name,
      });

      try {
        // Allow sign in from both credentials and OAuth providers
        if (account?.provider === "google") {
          console.log("✅ Google sign-in attempt for:", user?.email);
          
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user?.email || "" }
          });
          
          console.log("👤 User exists in database:", !!existingUser);
          
          return true;
        }
        if (account?.provider === "credentials") {
          console.log("✅ Credentials sign-in attempt for:", user?.email);
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

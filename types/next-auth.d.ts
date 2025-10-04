import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    fitnessGoals?: string[];
    fitnessLevel?: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    hasCompletedOnboarding?: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      fitnessGoals?: string[];
      fitnessLevel?: string;
      spotifyAccessToken?: string;
      spotifyRefreshToken?: string;
      hasCompletedOnboarding?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fitnessGoals?: string[];
    fitnessLevel?: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    hasCompletedOnboarding?: boolean;
  }
}
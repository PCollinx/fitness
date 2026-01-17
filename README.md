# FitTrack - Modern Fitness Tracking App

![FitTrack App Screenshot](../fitness/public/fitness.png)

### 🏋️ Workout Management

- **Custom Workouts**: Create personalized workout routines with exercises from a comprehensive database
- **Muscle Targeting**: Build workouts targeting specific muscle groups (Chest, Back, Legs, Arms, Shoulders, Core, Cardio)
- **Workout Plans**: Design muscle-targeting plans with specified sets and reps
- **Workout History**: Track all completed workout sessions with detailed exercise logs
- **Recent Workouts**: Quick access to your most recent workout sessions
- **Exercise Library**: Browse and search through a wide variety of exercises with descriptions and instructions

### 📊 Progress Tracking

- **Body Measurements**: Track weight, body fat percentage, and body measurements (chest, waist, hips, arms, thighs)
- **Progress History**: View comprehensive history of your body measurements over time
- **Visual Analytics**: Charts and graphs to visualize your fitness journey
- **Progress Notes**: Add notes to each progress entry for context
- **Weight Sync**: Automatic synchronization between profile weight and progress entries

### � Streak & Motivation

- **Workout Streak**: Track consecutive days of workouts to stay motivated
- **Streak Statistics**: View current streak, longest streak, and total workouts completed
- **Streak Celebrations**: Celebrate milestone achievements with visual feedback
- **Workout Schedule**: Set up weekly workout schedules with customizable times
- **Reminders**: Get notified about upcoming scheduled workouts

### 🎵 Spotify Integration

- **Music Control**: Control your Spotify playback directly from the app during workouts
- **Workout Playlists**: Access your Spotify playlists while exercising
- **Seamless Integration**: Connect your Spotify account for enhanced workout experience

### 🔐 Authentication & Security

- **Multiple Sign-In Options**: Email/password or Google OAuth authentication
- **Secure Sessions**: JWT-based session management with NextAuth.js
- **Role-Based Access**: Admin panel for user management (admin users only)
- **Password Reset**: Secure password reset flow with email tokens
- **OAuth Account Linking**: Link multiple authentication methods to one account

### 👤 User Profile & Onboarding

- **Personalized Onboarding**: Set fitness goals during initial setup
- **Fitness Goals**: Choose from multiple goals (Weight Loss, Muscle Gain, Endurance, Flexibility, General Fitness)
- **Profile Customization**: Update bio, height, weight, and fitness level
- **Profile Image**: Upload custom profile pictures
- **Goal Tracking**: Monitor progress toward your fitness goals

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Authentication**: NextAuth.js v4 with JWT strategy
  - Credentials Provider (email/password with bcrypt)
  - Google OAuth Provider with automatic account linking
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context API, React Hooks
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**:
  - Spotify API for music integration
  - Pexel API for workout images
- **Icons**: React Icons (Font Awesome, Hero Icons)
- **Date Handling**: Native JavaScript Date API
- **Image Handling**: Next.js Image optimization
- **Deployment**: Vercel-ready with edge runtime support

## 📦 Mock Data

This repository includes a comprehensive mock data folder for development and testing:

- **Location**: `/mock` directory
- **Contents**: Sample users, exercises, workouts, sessions, progress tracking, and more
- **Format**: JSON files with realistic, relational data
- **Usage**: Import for development, testing, demos, or documentation
- **Documentation**: See [mock/README.md](./mock/README.md) for details
- **Download Instructions**: See [mock/DOWNLOAD.md](./mock/DOWNLOAD.md) for various download options

The mock data includes:
- 3 user profiles (beginner, intermediate, advanced)
- 6 exercise definitions with instructions
- 4 workout routines
- 3 completed workout sessions with detailed performance data
- 7 progress tracking entries
- 5 fitness goals
- 9 weekly workout schedules

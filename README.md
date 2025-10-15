# FitTrack - Modern Fitness Tracking App

![FitTrack App Screenshot](https://source.unsplash.com/random/1200x600/?fitness,app)

FitTrack is a co6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.ve fitness tracking application built with Next.js 14 and Tailwind CSS, designed to help users achieve their fitness goals through personalized workout plans, progress tracking with body measurements, streak monitoring, and Spotify music integration.

## Features

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
  - Unsplash API for workout images
- **Icons**: React Icons (Font Awesome, Hero Icons)
- **Date Handling**: Native JavaScript Date API
- **Image Handling**: Next.js Image optimization
- **Deployment**: Vercel-ready with edge runtime support

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/PCollinx/fitness.git
cd fitness
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following content (replace with your values):

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fitness?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Spotify API
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/spotify/callback"

# Pexels API (for workout images)
PEXELS_API_KEY="your-pexels-api-key"

# Admin Setup Secret (for creating first admin user)
ADMIN_SETUP_SECRET="setup-admin-2024"

# Email Configuration (for password reset)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@fittrack.com"
```

4. Set up the database and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. (Optional) Seed the database with exercise data:

```bash
# Start your dev server first, then visit:
# http://localhost:3000/api/exercises/seed
```

6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
fitness/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints (NextAuth, password reset)
│   │   ├── admin/            # Admin endpoints (user management)
│   │   ├── exercises/        # Exercise CRUD operations
│   │   ├── progress/         # Progress tracking endpoints
│   │   ├── workouts/         # Workout management
│   │   ├── workout-sessions/ # Workout session tracking
│   │   ├── user/             # User profile and preferences
│   │   ├── spotify/          # Spotify integration
│   │   └── images/           # Image service endpoints
│   ├── auth/                 # Authentication pages (signin, signup, forgot-password)
│   ├── components/           # Reusable React components
│   │   ├── Navbar.tsx        # Main navigation with admin link
│   │   ├── MobileNav.tsx     # Mobile bottom navigation
│   │   ├── Footer.tsx        # App footer
│   │   ├── WorkoutStreak.tsx # Streak display component
│   │   └── SpotifyMusic.tsx  # Spotify player component
│   ├── context/              # React Context providers
│   │   └── UserProfileContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useIsAdmin.ts     # Admin role checking
│   │   ├── useWorkoutStreak.ts
│   │   └── useWorkoutSchedule.ts
│   ├── providers/            # App-wide providers
│   │   └── AuthProvider.tsx  # NextAuth session provider
│   ├── utils/                # Utility functions
│   │   ├── workoutApiStorage.ts
│   │   ├── exerciseApi.ts
│   │   └── workoutSessionApi.ts
│   ├── admin/                # Admin dashboard pages
│   │   └── users/            # User management interface
│   ├── dashboard/            # User dashboard
│   ├── workouts/             # Workout-related pages
│   │   ├── new/              # Create workout
│   │   ├── [id]/             # Workout detail/edit
│   │   ├── muscle-targeting/ # Muscle group selection
│   │   ├── history/          # Workout history
│   │   └── start/            # Active workout session
│   ├── progress/             # Progress tracking pages
│   │   ├── new/              # Add progress entry
│   │   ├── [id]/             # View/edit entry
│   │   └── history/          # Progress history
│   ├── schedule/             # Workout schedule management
│   ├── streak/               # Streak statistics page
│   ├── music/                # Spotify music control
│   ├── profile/              # User profile page
│   └── onboarding/           # Fitness goals onboarding
├── lib/                      # Shared libraries and utilities
│   ├── auth/                 # Authentication configuration
│   │   ├── auth-options.ts   # NextAuth configuration
│   │   ├── api-auth.ts       # API authentication helpers
│   │   └── admin.ts          # Admin utilities
│   ├── email/                # Email service
│   ├── spotify/              # Spotify API service
│   ├── prisma.ts             # Prisma client instance
│   └── exerciseData.ts       # Exercise seed data
├── prisma/                   # Database
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding script
├── types/                    # TypeScript type definitions
│   └── next-auth.d.ts        # NextAuth type extensions
├── docs/                     # Documentation
│   ├── weight-sync-implementation.md
│   ├── admin-role-jwt-refresh.md
│   └── oauth-fix-summary.md
├── public/                   # Static files
└── middleware.ts             # Next.js middleware (auth, redirects)
```

## Key Features in Detail

### Workout Management

- **Create Custom Workouts**: Build workouts from scratch with exercises from the database
- **Muscle-Group Targeting**: Select specific muscles to work (8 categories)
- **Exercise Sets & Reps**: Define sets, reps, weight, and rest time for each exercise
- **Workout Images**: Auto-fetched from Unsplash based on workout type
- **Public/Private Workouts**: Share workouts or keep them private

### Progress Tracking with Weight Sync

- **Bidirectional Sync**: Weight automatically syncs between profile and progress entries
- **When you update your profile weight**: Progress entry is created/updated for today
- **When you log progress**: Profile weight is automatically updated
- **Transaction Safety**: All syncs use database transactions for data integrity
- **Comprehensive Measurements**: Track multiple body metrics beyond just weight

### Streak System

- **Daily Workout Tracking**: Records every workout session
- **Automatic Calculation**: Streak calculated from consecutive workout days
- **Milestone Celebrations**: Special animations for streak achievements
- **Statistics Dashboard**: View current streak, longest streak, and total workouts

### Admin Features

- **User Management**: View, search, and filter all users
- **Role Management**: Promote/demote users to admin (requires database access)
- **User Analytics**: See user registration dates, workout counts, and activity
- **Protected Routes**: Admin-only pages with role-based access control

### Authentication Flow

- **Smart Onboarding**: New users guided through fitness goals selection
- **OAuth Account Linking**: Automatically links Google OAuth with existing email/password accounts
- **Session Management**: JWT-based sessions with 30-day expiration
- **Middleware Protection**: Automatic redirects for unauthenticated users
- **Password Reset**: Secure email-based password reset with time-limited tokens

## UI Design

The app features a modern dark-themed UI with gradient accents, designed for optimal user experience on both mobile and desktop devices:

- **Dark Theme**: Sleek dark background (gray-900) for reduced eye strain
- **Gradient Accents**: Purple-to-pink gradients for CTAs and highlights
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Bottom Navigation**: Mobile nav bar with 5 quick-access icons
- **Glass-morphism Effects**: Frosted glass effects on cards and modals
- **Smooth Animations**: Transitions and hover effects for better UX

## Database Schema

### Core Models

**User**

- Authentication data (email, password, OAuth accounts)
- Profile info (name, bio, image, height, weight)
- Fitness data (goals, level, streak, workouts completed)
- Role-based access (user/admin)
- Spotify tokens for music integration

**Workout**

- Workout metadata (name, description, image)
- User-created or public workouts
- Related exercises with sets/reps/weight

**Progress**

- Date-stamped entries
- Body measurements (weight, body fat, various body parts)
- Notes for context
- Auto-synced with User.weight

**WorkoutSession**

- Completed workout tracking
- Start/end time and duration
- Linked to specific workout and exercises
- Set-by-set tracking with actual vs target reps/weight

**WorkoutSchedule**

- Weekly schedule (day of week + time)
- Notification settings
- Enable/disable toggles

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Email/password or OAuth sign in
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/check-admin` - Check if user is admin

### Workouts

- `GET /api/workouts` - List all workouts
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/[id]` - Get workout details
- `PUT /api/workouts/[id]` - Update workout
- `DELETE /api/workouts/[id]` - Delete workout
- `GET /api/workouts/recent` - Get recent workouts
- `GET /api/workouts/[id]/sessions` - Get workout session history

### Progress

- `GET /api/progress` - List progress entries with pagination
- `POST /api/progress` - Create progress entry (auto-syncs weight)
- `GET /api/progress/[id]` - Get specific entry
- `PUT /api/progress/[id]` - Update entry (auto-syncs weight)
- `DELETE /api/progress/[id]` - Delete entry
- `GET /api/progress/comprehensive` - Get all progress data

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile (auto-syncs weight to progress)
- `GET /api/user/streak` - Get workout streak stats
- `GET /api/user/workout-schedule` - Get weekly schedule
- `POST /api/user/workout-schedule` - Create schedule entry
- `PUT /api/user/workout-schedule` - Update schedule
- `DELETE /api/user/workout-schedule` - Remove schedule

### Admin

- `POST /api/admin/setup` - Promote user to admin (requires secret key)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user

### Exercises

- `GET /api/exercises` - Search/filter exercises
- `POST /api/exercises` - Create custom exercise
- `GET /api/exercises/seed` - Seed database with exercises

### Spotify

- `GET /api/spotify/auth` - Initiate Spotify OAuth
- `GET /api/spotify/callback` - OAuth callback
- `GET /api/spotify/playlists` - Get user playlists
- `POST /api/spotify/play` - Control playback

## Future Enhancements

- **Workout Analytics**: Advanced charts showing progress over time
- **Nutrition Tracking**: Add meal logging and calorie counting
- **Social Features**: Follow friends, share workouts, compete in challenges
- **Wearable Integration**: Sync with Fitbit, Apple Watch, Garmin
- **AI Workout Recommendations**: Machine learning-based workout suggestions
- **Video Exercise Guides**: Embedded video demonstrations for exercises
- **Rest Day Recommendations**: Smart suggestions based on workout intensity
- **Progressive Overload Tracking**: Automatically suggest weight increases
- **Workout Templates**: Pre-made workout plans for different goals
- **Export Data**: Download workout and progress history as CSV/PDF

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations

### Environment Variables

Make sure all required environment variables are set before running the app. See the `.env` example above for required values.

### First Admin User Setup

To create your first admin user:

1. Create an account normally through the signup page
2. Use the admin setup API with the secret key:
   ```bash
   curl -X POST http://localhost:3000/api/admin/setup \
     -H "Content-Type: application/json" \
     -d '{"adminEmail": "your-email@example.com", "secretKey": "setup-admin-2024"}'
   ```
3. Sign out and sign back in to load the admin role
4. Visit `/admin/users` to access the admin dashboard

## Deployment

This app is configured for easy deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPCollinx%2Ffitness)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern fitness applications
- UI components powered by Tailwind CSS
- Icons provided by React Icons
- Exercise database curated from fitness resources
- Spotify API for music integration
- Unsplash API for workout imagery
- NextAuth.js for authentication
- Prisma for type-safe database access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS

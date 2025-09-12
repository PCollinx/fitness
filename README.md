# MyTrainer - Modern Fitness Tracking App

![MyTrainer App Screenshot](https://source.unsplash.com/random/1200x600/?fitness,app)

MyTrainer is a comprehensive fitness tracking application built with Next.js and Tailwind CSS, designed to help users achieve their fitness goals through workout planning, meal prep, and progress tracking.

## Features

### 🏋️ Workout Tracking

- **Categorized Workouts**: Browse workouts by type (Strength, Cardio, Flexibility)
- **Custom Workouts**: Create personalized workout routines
- **Workout Timer**: Track your workout sessions with an integrated timer
- **Muscle Targeting**: Select specific muscle groups to focus your training
- **Time-Based Workouts**: Choose workouts based on available time (15, 30, 45, or 60 minutes)

### 🥗 Nutrition & Meal Planning

- **Meal Prep**: Access healthy recipes with detailed nutritional information
- **Meal Plans**: View and create weekly meal plans
- **Recipe Browser**: Search and filter recipes by category (Breakfast, Lunch, Dinner, Snack)
- **Nutritional Information**: Track calories, protein, carbs, and fat for each meal

### 📈 Progress Monitoring

- **Workout Streak**: Keep track of your consecutive workout days
- **Calorie Tracking**: Monitor calories burned during workouts
- **Weekly Analysis**: View your progress over time

### 🔐 User Authentication

- **Secure Sign Up/Sign In**: Create an account with email/password or Google OAuth
- **User Profiles**: Customize your fitness profile with goals and preferences
- **Data Protection**: Your fitness data is securely stored and accessible only to you
- **Social Features**: Connect with friends, share workouts, and track each other's progress

### 🎵 Workout Music

- **Music Integration**: Control your workout music directly from the app
- **Playlist Management**: Create and manage workout playlists

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Credentials and Google OAuth providers
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: React Icons
- **Deployment**: Vercel

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
DATABASE_URL="postgresql://username:password@localhost:5432/fitness?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database and run migrations:

```bash
npx prisma migrate dev --name init
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
fitness/
├── app/                  # Next.js App Router
│   ├── api/              # API routes including auth
│   │   └── auth/         # NextAuth routes
│   ├── auth/             # Authentication pages
│   ├── components/       # React components
│   ├── providers/        # Context providers
│   ├── workouts/         # Workout related pages
│   ├── nutrition/        # Nutrition related pages
│   ├── progress/         # Progress tracking pages
│   ├── dashboard/        # User dashboard
│   └── music/            # Music control pages
├── lib/                  # Utility functions and libraries
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── ...                   # Config files
```

## UI Design

The app features a modern dark-themed UI with yellow accent colors, designed for optimal user experience on both mobile and desktop devices:

- **Dark Theme**: Easy on the eyes, perfect for various lighting conditions
- **Yellow Accents**: Highlighting important actions and information
- **Responsive Design**: Seamlessly adapts to different screen sizes
- **Intuitive Navigation**: Simple and clear user flow

## Pages and Components

### Main Dashboard

- Overview of workout statistics
- Quick access to upcoming workouts
- Workout timer
- Workout category selection
- Meal plan highlights
- Muscle targeting interface
- Time selection for workouts

### Workouts

- Browse workout library
- Filter by category, duration, and intensity
- Detailed workout information
- Start workout option

### Meal Prep

- Recipe browser with images
- Nutritional information
- Meal planning interface
- Dietary preference filters

## Future Enhancements

- Integration with fitness wearables
- Advanced progress analytics
- Personalized workout recommendations based on history
- Group workouts and challenges
- AI-powered form detection and correction

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Deployment

This app is configured for easy deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPCollinx%2Ffitness)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern fitness applications
- UI components powered by Tailwind CSS
- Icons provided by React Icons

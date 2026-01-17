# Mock Data Folder

This folder contains sample/mock data for the FitTrack fitness application. These JSON files represent realistic data structures that can be used for testing, development, and demonstration purposes.

## 📁 Files Overview

### `users.json`
Sample user profiles with various fitness levels and goals.
- **Fields**: id, name, email, bio, height, weight, fitnessLevel, workoutsCompleted, streakDays, etc.
- **Use Cases**: Testing user authentication, profile displays, and user-specific features

### `exercises.json`
A collection of common fitness exercises with descriptions and instructions.
- **Fields**: id, name, description, muscleGroup, difficulty, instructions
- **Muscle Groups**: chest, back, legs, shoulders, core, full body
- **Difficulty Levels**: beginner, intermediate, advanced

### `workouts.json`
Pre-defined workout routines combining multiple exercises.
- **Fields**: id, name, description, userId, public, image, exercises array
- **Features**: Each workout contains multiple exercises with sets, reps, and weights

### `workout-sessions.json`
Completed workout session records with detailed performance data.
- **Fields**: id, workoutId, userId, startTime, endTime, duration, notes, exercises with sets
- **Details**: Tracks actual performance vs. target reps/weights for each set

### `progress.json`
Body measurement and progress tracking data over time.
- **Fields**: id, userId, date, weight, bodyFat, chest, waist, hips, arms, thighs, notes
- **Use Cases**: Progress visualization, trend analysis, goal tracking

### `fitness-goals.json`
User fitness goals and objectives.
- **Goal Types**: weight-loss, muscle-building, strength-training, endurance, mobility
- **Use Cases**: Goal-based workout recommendations, progress tracking

### `workout-schedules.json`
Weekly workout schedule configurations.
- **Fields**: id, userId, dayOfWeek (0-6), time, isEnabled, notificationsEnabled, reminderMinutes
- **Use Cases**: Workout reminders, schedule management, calendar integration

## 🚀 Usage

### For Development
Load these files when developing new features that require sample data:

```javascript
import mockUsers from './mock/users.json';
import mockExercises from './mock/exercises.json';
import mockWorkouts from './mock/workouts.json';
```

### For Testing
Use in unit tests or integration tests:

```javascript
describe('Workout Component', () => {
  it('should display workout details', () => {
    const testWorkout = mockWorkouts[0];
    // test implementation
  });
});
```

### For Database Seeding
Import mock data into your database for testing:

```bash
# Example using a custom script
npm run seed:mock
```

### For API Testing
Use with tools like Postman, Insomnia, or automated API tests:

```json
POST /api/workouts
Body: {mockWorkouts[0]}
```

## 📊 Data Relationships

The mock data includes proper relationships between entities:

- **Users** (3 mock users with different fitness profiles)
  - Has many: Workouts, Progress entries, Workout Sessions, Fitness Goals, Workout Schedules
  
- **Exercises** (6 common exercises)
  - Used in: Workouts, Workout Sessions
  
- **Workouts** (4 different workout routines)
  - Belongs to: User
  - Contains: Multiple Exercises with sets/reps configuration
  
- **Workout Sessions** (3 completed sessions)
  - Belongs to: User and Workout
  - Contains: Detailed performance data for each exercise and set

## 🔄 Data Consistency

All mock data uses consistent IDs with the format `mock-{entity}-{number}` to:
- Easily identify mock data vs. real data
- Maintain referential integrity across files
- Facilitate data cleanup in test environments

## 🎯 User Profiles

### Mock User 1 - John Doe (Intermediate Bodybuilder)
- **Level**: Intermediate
- **Goals**: Muscle building, strength training
- **Activity**: 45 workouts completed, 7-day streak
- **Focus**: Upper body and leg strength workouts

### Mock User 2 - Jane Smith (Advanced Endurance Athlete)
- **Level**: Advanced
- **Goals**: Endurance, mobility
- **Activity**: 120 workouts completed, 21-day streak
- **Focus**: Cardio and HIIT workouts

### Mock User 3 - Mike Johnson (Beginner Weight Loss)
- **Level**: Beginner
- **Goals**: Weight loss
- **Activity**: 12 workouts completed, 3-day streak
- **Focus**: Starting fitness journey

## 📝 Notes

- All dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Weights are in kilograms
- Body measurements are in centimeters
- Duration is in minutes
- Images use placeholder URLs from Pexels and Pravatar
- User emails follow the pattern: `{firstname}.{lastname}@example.com`

## 🔐 Security Note

⚠️ **Important**: These are mock/sample data files only. Never use this data structure to store real user passwords or sensitive information. The actual application should:
- Hash passwords using bcrypt or similar
- Store sensitive data securely in a database
- Follow GDPR and privacy best practices

## 🛠️ Maintenance

When updating the Prisma schema or adding new features:
1. Review and update the corresponding mock data files
2. Ensure all relationships remain valid
3. Add new fields with realistic sample values
4. Update this README with any structural changes

## 📦 Export Format

All files are in JSON format for easy:
- Import/export operations
- Version control tracking
- Language-agnostic usage
- API response mocking

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained by**: FitTrack Development Team

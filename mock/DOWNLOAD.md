# Mock Data Package Information

## 📥 Downloading Mock Data

The mock data is available in the `/mock` directory of this repository. You can access it in several ways:

### Option 1: Clone the Repository
```bash
git clone https://github.com/PCollinx/fitness.git
cd fitness/mock
```

### Option 2: Download Individual Files
You can download individual JSON files directly from GitHub:
- [users.json](./users.json)
- [exercises.json](./exercises.json)
- [workouts.json](./workouts.json)
- [workout-sessions.json](./workout-sessions.json)
- [progress.json](./progress.json)
- [fitness-goals.json](./fitness-goals.json)
- [workout-schedules.json](./workout-schedules.json)

### Option 3: Download as ZIP
You can download the entire mock folder as a ZIP file:

**Via GitHub Web Interface:**
1. Navigate to the [mock folder](https://github.com/PCollinx/fitness/tree/main/mock)
2. Click the "Download" button or use GitHub's download feature

**Via Command Line:**
```bash
# Using curl (download entire repo, then extract mock folder)
curl -L https://github.com/PCollinx/fitness/archive/refs/heads/main.zip -o fitness.zip
unzip fitness.zip
cd fitness-main/mock
```

**Using Git Sparse Checkout (download only mock folder):**
```bash
git clone --no-checkout https://github.com/PCollinx/fitness.git
cd fitness
git sparse-checkout init --cone
git sparse-checkout set mock
git checkout
```

### Option 4: Use in Your Project
If you're developing with this repository:

**In JavaScript/TypeScript:**
```javascript
// Import all mock data
import mockData from './mock';

// Or import specific data
import { users, workouts, exercises } from './mock';

// Or import individual files
import users from './mock/users.json';
```

**In Node.js:**
```javascript
const fs = require('fs');
const users = JSON.parse(fs.readFileSync('./mock/users.json', 'utf8'));
```

**In Python:**
```python
import json

with open('mock/users.json', 'r') as f:
    users = json.load(f)
```

## 📊 What's Included

The mock folder contains realistic sample data for:
- ✅ 3 user profiles (beginner, intermediate, advanced)
- ✅ 6 exercise definitions
- ✅ 4 workout routines
- ✅ 3 completed workout sessions with detailed sets/reps
- ✅ 7 progress tracking entries
- ✅ 5 fitness goals
- ✅ 9 weekly workout schedules

## 🎯 Use Cases

- **Development**: Use for local development without a database
- **Testing**: Import into test suites for consistent test data
- **Demos**: Populate demo environments with realistic data
- **Documentation**: Reference examples in API documentation
- **Prototyping**: Quick data for UI/UX prototypes

## 📝 Data Format

All files are in JSON format with:
- Consistent ID format: `mock-{entity}-{number}`
- ISO 8601 date format
- Proper relational structure matching Prisma schema
- Realistic values and relationships

## 🔗 Related Files

- [README.md](./README.md) - Comprehensive documentation
- [index.ts](./index.ts) - TypeScript helper functions for importing data

---

For more information, see the main [README.md](./README.md) file.

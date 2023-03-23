const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS middleware
const cors = require('cors');
app.use(cors());

// Add route for generating workout and nutrition plans
app.post('/generate-plan', async (req, res) => {
  try {
    // Extract data from form submission
    const { age, gender, height, weight, fitnessLevel, goal, workoutType, equipment, workoutDuration, workoutDays } = req.body;

    // Make API call to Wger API to retrieve exercise data
    const exerciseResponse = await axios.get('https://wger.de/api/v2/exercise/', {
      params: {
        language: 2,
        limit: 10,
        status: 2,
        category: 10,
        muscle: 2,
      },
    });

    // Retrieve exercise IDs from the exercise response
    const exerciseIds = exerciseResponse.data.results.map((exercise) => exercise.id);

    // Make API call to Wger API to retrieve exercise images based on exercise IDs
    const exerciseImageResponse = await axios.get('https://wger.de/api/v2/exerciseimage/', {
      params: {
        exercise: exerciseIds.join(','),
      },
    });

    // Generate workout plan based on user data and API responses
    const workoutPlan = {
      age,
      gender,
      height,
      weight,
      fitnessLevel,
      goal,
      workoutType,
      equipment,
      workoutDuration,
      workoutDays, // Add workoutDays to the response
      exercises: exerciseResponse.data.results,
      exerciseImages: exerciseImageResponse.data.results,
    };

    // Distribute exercises among the selected days
    const numExercisesPerDay = Math.ceil(workoutPlan.exercises.length / workoutDays.length);

    workoutDays.forEach((day, index) => {
      workoutPlan[day] = workoutPlan.exercises.slice(index * numExercisesPerDay, (index + 1) * numExercisesPerDay);
    });

    // Return workout plan as JSON response
    res.json({ workoutPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the workout plan' });
  }
});

// Start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});

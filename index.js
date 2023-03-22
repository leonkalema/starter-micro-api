const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate-plan', async (req, res) => {
  try {
    // Extract data from form submission
    const { age, gender, height, weight, fitnessLevel, goal, workoutType, equipment, workoutDuration } = req.body;

    // Make API call to Wger API to retrieve exercise data
    const exerciseResponse = await axios.get('https://wger.de/api/v2/exercise/', {
      params: {
        language: 2, // English language code
        limit: 10, // Limit to 10 results
        status: 2, // Only show exercises with a verified status
        category: 10, // Only show exercises in the Strength category (can modify based on user preferences)
        muscle: 2, // Only show exercises that target the Biceps (can modify based on user preferences)
      },
    });

    // Generate workout plan based on user data and API response
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
      exercises: exerciseResponse.data.results, // Include exercises from API response in workout plan
    };

    // Return workout plan as JSON response
    res.json(workoutPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the workout plan' });
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});

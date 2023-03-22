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

    // Make API call to nutrition API to retrieve nutrition information
    const nutritionResponse = await axios.get('https://api.edamam.com/api/nutrition-data', {
      params: {
        app_id: '<YOUR_APP_ID>', // Replace with your own app ID
        app_key: '<YOUR_APP_KEY>', // Replace with your own app key
        ingr: `1 ${goal === 'loseWeight' ? 'bowl' : 'plate'} of ${workoutType === 'cardio' ? 'oatmeal' : 'chicken breast'}`, // Example of a nutrition query based on user inputs
      },
    });

    // Generate workout and nutrition plans based on user data and API responses
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
    const nutritionPlan = {
      goal,
      nutrition: nutritionResponse.data, // Include nutrition information from API response in nutrition plan
    };

    // Return workout and nutrition plans as JSON response
    res.json({ workoutPlan, nutritionPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the workout and nutrition plans' });
  }
});

// Start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});

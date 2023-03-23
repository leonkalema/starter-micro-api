const express = require('express');
const axios = require('axios');
const generatePDF = require('./generate-pdf.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS middleware
const cors = require('cors');
app.use(cors());
app.options('*', cors());


app.post('/generate-pdf', async (req, res) => {
    const { workoutPlan, watermark } = req.body;
  
    try {
      const pdfBlob = await generatePDF(workoutPlan, watermark);
      const pdfBuffer = Buffer.from(pdfBlob);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=workout_plan.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while generating the PDF' });
    }
  });
  
  
// Add route for generating workout and nutrition plans
app.post('/generate-plan', async (req, res) => {
    try {
      // Extract data from form submission
      const { age, gender, height, weight, fitnessLevel, goal, workoutType, equipment, workoutDuration, workoutDays } = req.body;
  
      // Ensure workoutDays is an array
      const workoutDaysArray = Array.isArray(workoutDays) ? workoutDays : [];
  
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
        workoutDays: workoutDaysArray, // Add workoutDaysArray to the response
        exercises: exerciseResponse.data.results,
        exerciseImages: exerciseImageResponse.data.results,
      };

      // Add basic assumptions
const weightLossRate = 0.5; // kg per week
const muscleGainRate = 0.25; // kg per week
const weeksInAMonth = 4;

// Set a default target change in kg (gain or loss)
let targetChange = 5;

// Calculate the estimated duration to achieve the goal
let estimatedMonths;
if (goal === "lose_weight") {
  estimatedMonths = (targetChange / (weightLossRate * weeksInAMonth)).toFixed(1);
} else if (goal === "gain_muscle") {
  estimatedMonths = (targetChange / (muscleGainRate * weeksInAMonth)).toFixed(1);
} else {
  estimatedMonths = "N/A";
}

// Add estimated duration and potential gain or loss to the workout plan
workoutPlan.estimatedDuration = estimatedMonths;
workoutPlan.targetChange = targetChange;

  
      // Distribute exercises among the selected days
      const numExercisesPerDay = Math.ceil(workoutPlan.exercises.length / workoutDaysArray.length);
  
      workoutDaysArray.forEach((day, index) => {
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

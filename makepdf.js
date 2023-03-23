const pdfMake = require('pdfmake');

async function generatesPDF(workoutPlan, watermark) {
  // Create document definition using pdfmake syntax
  const docDefinition = {
    content: [
      { text: 'Workout Plan', style: 'header' },
      { text: `Age: ${workoutPlan.age}` },
      { text: `Gender: ${workoutPlan.gender}` },
      { text: `Height: ${workoutPlan.height}` },
      { text: `Weight: ${workoutPlan.weight}` },
      { text: `Fitness Level: ${workoutPlan.fitnessLevel}` },
      { text: `Goal: ${workoutPlan.goal}` },
      { text: `Workout Type: ${workoutPlan.workoutType}` },
      { text: `Equipment: ${workoutPlan.equipment}` },
      { text: `Workout Duration: ${workoutPlan.workoutDuration}` },
      { text: `Workout Days: ${workoutPlan.workoutDays.join(', ')}` },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
    watermark: {
      text: watermark,
      color: 'blue',
      opacity: 0.1,
      bold: true,
      italics: false,
    },
  };

  // Create PDF document using pdfmake
  const pdfDoc = pdfMake.createPdf(docDefinition);

  // Return PDF blob as a buffer
  return await new Promise((resolve, reject) => {
    pdfDoc.getBuffer((bufferErr, buffer) => {
      if (bufferErr) {
        reject(bufferErr);
      } else {
        resolve(buffer);
      }
    });
  });
}

module.exports = generatesPDF;

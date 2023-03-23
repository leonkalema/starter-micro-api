const jsPDF = require('jspdf').default;
const autoTable = require('jspdf-autotable');

async function generatePDF(workoutPlan = [], watermark) {
  const pdf = new jsPDF();
  pdf.setFontSize(10);

  // Check if the watermark parameter is a valid string
  if (typeof watermark === 'string' && watermark.length > 0) {
    pdf.text(watermark, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10);
  }

  const tableHeaders = ['Exercise', 'Reps', 'Sets', 'Rest'];
  const tableRows = [];

  // Format the workout plan data into rows
  workoutPlan.forEach((day) => {
    tableRows.push([day.day, '', '', '']);

    day.exercises.forEach((exercise) => {
      tableRows.push([exercise.name, exercise.reps, exercise.sets, exercise.rest]);
    });
  });

  pdf.autoTable({
    head: [tableHeaders],
    body: tableRows,
  });

  return pdf.output('blob');
}

module.exports = generatePDF;

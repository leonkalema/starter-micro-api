const jsPDF = require('jspdf');
require('jspdf-autotable');

async function generatePDF(htmlContent, watermark) {
  const pdf = new jsPDF();
  pdf.text(watermark, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10);
  pdf.autoTable({
    html: htmlContent,
  });

  return pdf.output('blob');
}

module.exports = generatePDF;


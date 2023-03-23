const jsPDF = require('jspdf');
const autoTable = require('jspdf-autotable');
const pdf = new jsPDF();


async function generatePDF(htmlContent, watermark) {
pdf.setFontSize(10);
  pdf.text(watermark, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10);
  pdf.autoTable({
    html: htmlContent,
  });

  return pdf.output('blob');
}

module.exports = generatePDF;


const jsPDF = require('jspdf');

async function generatePDF(htmlContent, watermark) {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add watermark to the document
  doc.setFontSize(12);
  doc.setTextColor(150);
  doc.text(watermark, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, null, null, 'right');

  // Add HTML content to the document
  const source = htmlContent;
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    width: 522,
  };
  doc.fromHTML(source, margins.left, margins.top, {
    width: margins.width,
  });

  // Generate the PDF buffer
  const pdfBuffer = doc.output('arraybuffer');

  return pdfBuffer;
}

module.exports = generatePDF;

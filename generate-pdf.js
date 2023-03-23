const puppeteer = require('puppeteer');

async function generatePDF(htmlContent, watermark) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  // Add watermark
  await page.evaluate((watermark) => {
    const watermarkDiv = document.createElement('div');
    watermarkDiv.innerHTML = watermark;
    watermarkDiv.style.position = 'fixed';
    watermarkDiv.style.bottom = '10px';
    watermarkDiv.style.right = '10px';
    watermarkDiv.style.opacity = '0.5';
    watermarkDiv.style.zIndex = '1000';
    document.body.appendChild(watermarkDiv);
  }, watermark);

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePDF;

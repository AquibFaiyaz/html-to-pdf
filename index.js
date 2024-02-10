const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();

app.use(express.json());

async function generatePDF(website_url) {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Website URL to export as pdf
  // const website_url = "https://abuiyaad.com/";

  // Open URL in current page
  await page.goto(website_url, { waitUntil: "networkidle2", timeout: 60000 });

  //To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  // Generate the PDF
  const pdf = await page.pdf({
    path: "./pdfs/result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  // Close the browser instance
  await browser.close();

  return pdf;
}

// API endpoint to generate and download PDF
app.post("/generate-pdf", async (req, res) => {
  try {
    const { url } = req.body;
    const pdf = await generatePDF(url);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=result.pdf");

    // Send the PDF as response
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

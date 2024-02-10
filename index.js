const express = require("express");
const puppeteer = require("puppeteer");
require("dotenv").config();

const app = express();

app.use(express.json());

async function generatePDF(website_url) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();

  await page.goto(website_url, { waitUntil: "networkidle2", timeout: 60000 });

  await page.emulateMediaType("screen");

  const pdf = await page.pdf({
    path: "./pdfs/result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  await browser.close();

  return pdf;
}

app.post("/generate-pdf", async (req, res) => {
  try {
    const { url } = req.body;
    const pdf = await generatePDF(url);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=result.pdf");

    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

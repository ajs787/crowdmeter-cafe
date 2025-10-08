import fs from "fs";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
const url = "https://www.google.com/maps/place/?q=place_id:ChIJITn3tVbGw4kRl0g8SzRNe_Y";
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

// simple delay function
await new Promise((resolve) => setTimeout(resolve, 5000));

const html = await page.content();
fs.writeFileSync("google_dump.html", html);
console.log("✅ saved page HTML to google_dump.html");

await browser.close();

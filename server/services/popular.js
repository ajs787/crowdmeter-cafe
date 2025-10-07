import puppeteer from "puppeteer";

export async function getLivePopularity(placeId) {
  const url = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox","--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    const html = await page.content();
    const match = html.match(/"current_popularity":(\d+)/);
    const val = match ? Number(match[1]) : null;
    await browser.close();
    return val;
  } catch (e) {
    console.error("scrape error:", e.message);
    await browser.close();
    return null;
  }
}

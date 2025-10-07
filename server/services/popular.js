import puppeteer from "puppeteer";

export async function getLivePopularityByPlaceUrl(placeUrl) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox","--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(placeUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // grab bootstrapped state (APP_INITIALIZATION_STATE or JSON in script tags)
    const state = await page.evaluate(() => {
      // try common globals
      const w = window;
      // @ts-ignore
      const init = w.APP_INITIALIZATION_STATE || w.APP_BOOTSTRAP_STATE || [];
      return JSON.stringify(init);
    });

    // very heuristic: look for `current_popularity` like numbers in the blob
    // safer approach: regex sniff for [...,"LIVE_BUSYNESS",<num>,...]
    const match = state.match(/current_popularity"?\s*:\s*(\d{1,3})/i);
    if (match) {
      let n = Number(match[1]);
      if (Number.isFinite(n)) {
        // clamp 0..100
        n = Math.max(0, Math.min(100, n));
        return n;
      }
    }
    // fallback: try another pattern commonly found
    const alt = state.match(/"live_percent":\s*(\d{1,3})/i);
    if (alt) {
      let n = Number(alt[1]);
      n = Math.max(0, Math.min(100, n));
      return n;
    }
    return null; // not available (Google often hides when closed or off-hours)
  } catch (e) {
    console.error("popularity scrape error:", e.message);
    return null;
  } finally {
    await browser.close();
  }
}

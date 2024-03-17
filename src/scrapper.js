const cheerio = require("cheerio");
const getBrowser = require("./browser");

const timeout = 60000;
async function scrapeSource(url) {
  let source;
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: timeout });
    await page.waitForSelector("#player", { timeout: timeout });
    await page.click("#player button", { timeout: timeout });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector("#player iframe");
      return iframe ? iframe.src : iframe;
    });
    console.log(iframeSrc);
    source = iframeSrc;
  } catch (error) {
    console.error(error);
    await page.close();
    scrape(url);
  } finally {
    await page.close();
    return source;
  }
}

async function scrapeLinks(keyword) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(`https://gomovies.pe/filter?keyword=${keyword}`, {
      timeout: timeout,
    })
    const $ = cheerio.load(await page.content());
    const links = $("div.melody").map((index, element) => {
      const href = $(element).find("a").attr("href");
      return {
        name: $(element).find("div.data a").text(),
        href: href,
        image: $(element).find("img").attr("src"),
        type: href.split('/')[1]
      };
    }).get();
    console.log(links);
  } catch (error) {
    console.error(error);
    await page.close();
    scrapeLinks(keyword);
  } finally {
    await page.close();
  }
}

module.exports = {
  scrapeSource,
  scrapeLinks
};

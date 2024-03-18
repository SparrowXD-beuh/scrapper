const axios = require("axios");
const cheerio = require("cheerio");
const getBrowser = require("./browser");

const timeout = 60000;
async function takeScreenshot(url) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url);
  await new Promise(resolve => setTimeout(resolve, 5000));
  const screenshot = await page.screenshot();
  await page.close();
  return screenshot;
}

async function getVideoSrc(videoid) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(`https://embtaku.pro/download?id=${videoid}`, { timeout: timeout });
  await page.waitForSelector('#content-download');
  const filename = await page.$eval('#title', span => span.innerText);
  const size = await page.$eval('#filesize', span => span.innerText);
  const duration = await page.$eval('#duration', span => span.innerText);
  const sources = await page.$$eval('a[download]', links =>
    links.map(link => ({
      quality: (link.innerText.trim().replace(/^DOWNLOAD\s*/, '')),
      src: link.getAttribute('href')
    }))
  );
  console.log(sources);
  await page.close();
  return {
    filename,
    size,
    duration,
    sources
  };
}

async function searchAnime(keyword) {
  const html = await axios.get(`https://ww3.gogoanimes.fi/filter.html?keyword=${keyword}&language%5B%5D=dub&sort=title_az`);
  const $ = cheerio.load(html.data);
  const animes = $('ul.items li').map((index, element) => {
    const name = $(element).find('p > a').text().trim().replace(/\s*\([^)]*\)/g, '');
    const href= $(element).find('p > a').attr('href').replace(/-dub$/, '');
    return {name, href}
  }).get();
  console.log(animes);
  return animes;
};

async function getVideoId(url, episode, dub) {
  const html = await axios.get(`https://ww3.gogoanimes.fi/${url.replace(/^\/category\//, '')}${dub == true ? "-dub" : ""}-episode-${episode}`);
  const $ = cheerio.load(html.data);
  const videoid = $('li.dowloads > a').attr('href').match(/id=([^&]*)/)[1];
  console.log(videoid);
  return videoid;
}

module.exports = {
  takeScreenshot,
  getVideoSrc,
  searchAnime,
  getVideoId
};

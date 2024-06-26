const axios = require("axios");
const cheerio = require("cheerio");
const getBrowser = require("./browser");
const { find, insert } = require("./database");

const config = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  }
};

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
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(`https://embtaku.pro/download?id=${videoid}`, { timeout: timeout });
    // await new Promise(resolve => setTimeout(resolve, 5000));
    await page.waitForSelector('a[download]');
    const filename = await page.$eval('#title', span => span.innerText);
    const size = await page.$eval('#filesize', span => span.innerText);
    const duration = await page.$eval('#duration', span => span.innerText);
    const sources = await page.$$eval('a[download]', links =>
      links.map(link => ({
        quality: (link.innerText.trim().replace(/^DOWNLOAD\s*/, '')),
        src: link.getAttribute('href')
      }))
    );
    // console.log(sources);
    await page.close();
    const doc = {
      _id: videoid,
      filename,
      size,
      duration,
      sources
    };
    return doc
  } catch (error) {
    console.error(error);
  }
}

async function searchAnime(keyword) {
  const html = await axios.get(`https://ww4.gogoanimes.fi/filter.html?keyword=${keyword}&language%5B%5D=dub&sort=title_az`);
  const $ = cheerio.load(html.data);
  const animes = await Promise.all(
    $('ul.items li').map(async (index, element) => {
      const name = $(element).find('p > a').text().trim().replace(/\s*\([^)]*\)/g, '');
      const href= $(element).find('p > a').attr('href').replace(/-dub$/, '');
      return {name, href};
    }).get()
  )
  // console.log(animes);
  return animes;
};

async function getVideoId(url, episode, dub) {
 try {
   const html = await axios.get(`https://ww4.gogoanimes.fi/${url?.replace(/^\/category\//, '')}${dub == "true" ? "-dub" : ""}-episode-${episode}`);
   const $ = cheerio.load(html.data);
   const videoid = $('li.dowloads > a').attr('href').match(/id=([^&]*)/)[1];
   // console.log(videoid);
   return videoid;
 } catch (error) {
    console.error('Error fetching videoid:', error);
    return "Invalid URL/Episode provided unable to fetch the videoid. URL:" + url;
 }
}

async function getBulkVideoIds(url, {episodeStart, episodeEnd}, dub) {
  const promises = [];
  for (let episode = episodeStart; episode <= episodeEnd; episode++) {
    promises.push(getVideoId(url, episode, dub));
  }
  const videoIds = await Promise.all(promises);
  console.log(videoIds);
  return videoIds;
}

async function preloadSources(url, {episodeStart, episodeEnd}, dub) {
  console.time("preloaded sources");
  const videoIds = await getBulkVideoIds(url, {episodeStart, episodeEnd}, dub);
  for (let videoId of videoIds) {
    await getVideoSrc(videoId);
  }
  console.timeEnd("preloaded sources");
}

async function getLastEpisode(url, dub) {
  try {
    const html = await axios.get(`https://ww4.gogoanimes.fi/${url}${dub == "true" ? "-dub" : ""}`);
    const $ = cheerio.load(html.data);
    const maxEpisode = parseInt($('a.active').attr("ep_end"))
    console.log(maxEpisode);
    return maxEpisode;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return "Invalid URL provided unable to fetch the last episode. URL:" + url;
  }
}

async function searchHentai(keyword) {
  try {
    const html = await axios.get(`https://hentaihaven.com/?s=${keyword?.replace(/^\/category\//, '')}`, config);
    const $ = cheerio.load(html.data);
    const list = await Promise.all($('div.item').map(async (i, element) => {
      return await getHentaiInfo($(element).find('a').attr('href').replace('https://hentaihaven.com/', ''));
    }).get());
    return list;
  } catch (error) {
     console.error('Error:', error);
     return "No results found for this keyword:" + keyword;
  }
}

async function getHentaiInfo(path) {
  try {
    const html = await axios.get(`https://hentaihaven.com/${path}`, config);
    const $ = cheerio.load(html.data);
    return {
      title: $('h1.htitle').text().trim(),
      description: $('div.vraven_text p').text(),
      poster: $('div.hentai_cover img').attr('src'),
      genres: $('div.list').eq(0).find('a').map((i, element) => {
        return $(element).text();
      }).get(),
      author: $('div.list').eq(1).find('a').map((i, element) => {
        return $(element).text();
      }).get(),
      released: parseInt($('div.list').eq(2).find('a').text()),
      episodes: $('div.hentai__episodes ul').children().length
    };
  } catch (error) {
     console.error('Error:', error);
     return "Error occured path invalid" + path;
  }
}

module.exports = {
  takeScreenshot,
  getVideoSrc,
  searchAnime,
  getVideoId,
  getBulkVideoIds,
  preloadSources,
  getLastEpisode,
  searchHentai,
  getHentaiInfo,
};

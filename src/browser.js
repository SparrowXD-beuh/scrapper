const puppeteer = require("puppeteer-extra");
const Chromium = require("chrome-aws-lambda");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

let browser;
(async () => {
    if (!browser) {
        puppeteer.use(StealthPlugin());
        browser = await puppeteer.launch({
            executablePath: await Chromium.executablePath,
            headless: true,
        });
    }
})();

module.exports = browser;
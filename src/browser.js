const chromium = require("chromium");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

let browser;
const getBrowser = async () => {
    if (!browser) {
        puppeteer.use(StealthPlugin());
        browser = await puppeteer.launch({
            executablePath: chromium.path,
            headless: true,
        });
    }
    return browser;
};

module.exports = getBrowser;
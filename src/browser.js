const chromium = require("chromium");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

let browser;
const getBrowser = async () => {
    if (!browser) {
        puppeteer.use(StealthPlugin());
        browser = await puppeteer.launch({
            executablePath: chromium.path || '/usr/bin/google-chrome-stable',
            headless: true,
            args: ['--no-sandbox']
        });
        console.log("browser launched")
    }
    return browser;
};

module.exports = getBrowser;
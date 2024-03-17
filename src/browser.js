const puppeteer = require("puppeteer-extra");
const Chromium = require("chrome-aws-lambda");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());
const browser = await puppeteer.launch({
    executablePath: (await Chromium.executablePath()),
    headless: true,
});

module.exports = browser;
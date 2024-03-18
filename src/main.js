const express = require("express");
const { scrapeLinks, takeScreenshot } = require("./scrapper");

const app = express();
app.listen(process.env.PORT || 8888, () => {
    console.log("app online")
})

app.get("/", (req, res) => {
    res.send("hello world");
})

app.get("/test", async (req, res) => {
    try {
        const results = await scrapeLinks(req.query.keyword);
        res.send({
            statusCode: res.statusCode,
            body: results
        })
    } catch (error) {
        console.error(error);
        res.send({
            statusCode: res.statusCode,
            body: "error occured :("
        })
    }
})

app.get("/screenshot", async (req, res) => {
    try {
        const screenshot = await takeScreenshot();
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})
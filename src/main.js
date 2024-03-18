const express = require("express");
const { takeScreenshot, getVideoSrc, searchAnime, getVideoId } = require("./scrapper");

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
        const screenshot = await takeScreenshot(req.query.url);
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})

app.get("/source", async (req, res) => {
    try {
        const results = await getVideoSrc(req.query.videoid);
        res.send({
            statusCode: res.statusCode,
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})

app.get("/search", async (req, res) => {
    try {
        const results = await searchAnime(req.query.keyword);
        res.send({
            statusCode: res.statusCode,
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})

app.get("/videoid", async (req, res) => {
    try {
        const results = await getVideoId(req.query.url, req.query.ep, req.query.dub);
        res.send({
            statusCode: res.statusCode,
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})

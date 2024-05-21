const path = require('path');
const express = require("express");
const getBrowser = require("./browser");
const { connectToDatabase } = require("./database");
const { takeScreenshot, getVideoSrc, searchAnime, getVideoId, getBulkVideoIds, preloadSources, getLastEpisode, searchHanime } = require("./scrapper");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 8888, async () => {
    await getBrowser();
    await connectToDatabase();
    console.log("app online")
})

app.get("/", (req, res) => {
    res.send("hello world");
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

app.get("/episodes", async (req, res) => {
    try {
        const results = await getLastEpisode(req.query.path, req.query.dub);
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
    console.time("Search time:");
    try {
        const results = await searchAnime(req.query.keyword);
        res.send({
            statusCode: res.statusCode,
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    } finally {
        console.timeEnd("Search time:");
    }
})

app.get("/videoid", async (req, res) => {
    try {
        const path = req.query.path;
        const episode = parseInt(req.query.ep);
        const dub = req.query.dub;
        const results = await getVideoId(path, episode, dub);
        res.send({
            statusCode: res.statusCode,
            status: res.statusCode == 200 ? "OK" : "Error",
            request: {
                path, 
                episode: episode,
                dub
            },
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    }
})

app.get("/stream", async (req, res) => {
    console.time();
    try {
        const data = await getVideoSrc(req.query.videoid);
        if (req.query.player == "default") {
            res.render('default.ejs', {data});
        } else {
            res.render('video.ejs', {data});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    } finally {
        console.timeEnd();
    }
})

app.get("hanime/search", async (req, res) => {
    console.time("Search time:");
    try {
        const results = await searchHanime(req.query.keyword);
        res.send({
            statusCode: res.statusCode,
            body: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred :(");
    } finally {
        console.timeEnd("Search time:");
    }
})
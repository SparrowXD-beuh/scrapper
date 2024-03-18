const { getVideoSrc, searchAnime, getVideoId } = require("./scrapper");

(async () => {
    await getVideoId("/category/jujutsu-kaisen-tv", 1, true);
})();
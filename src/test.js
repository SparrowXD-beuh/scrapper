// function printStringDifferences(str1, str2) {
//     let differences = [];

const { insert } = require("./database");
const { searchAnime, preloadSources, getLastEpisode, searchHanime, getHanimeInfo, searchHentai } = require("./scrapper");
const { getBulkVideoIds } = require("./scrapper")

    
//     // Iterate through each character of the strings
//     for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
//         // Check if characters at the same position are different
//         if (str1[i] !== str2[i]) {
//             differences.push({
//                 index: i,
//                 char1: str1[i] || '-',
//                 char2: str2[i] || '-'
//             });
//         }
//     }
    
//     // Print differences
//     console.log("Differences:");
//     differences.forEach(diff => {
//         console.log(`Index: ${diff.index}, String1: ${diff.char1}, String2: ${diff.char2}`);
//     });
// }

// const link1 = "https://gredirect.info/download.php?url=aHR0cHM6LyAawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert9AdrefsdsdfwerFrefdsfrersfdsrfer363435345bGhxaG1zYWhpLmFuZjU5OC5jb20vdXNlcjEzNDIvNjUwMDhlNjc3YzU3MjNiMWZhYjVkNmI3N2JmYzhkMmIvRVAuMjMudjAuMTcwNTAzOTIwNS4xMDgwcC5tcDQ/dG9rZW49VTBzNXl3VXlQci13Ni1qLVZ5dHVXQSZleHBpcmVzPTE3MTA5MzE5MzImaWQ9MjE4OTEz";
// const link2 = "https://gredirect.info/download.php?url=aHR0cHM6LyAdrefsdsdfwerFrefdsfrersfdsrfer363435349AawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert5bGhxaG1zYWhpLmFuZjU5OC5jb20vdXNlcjEzNDIvNjUwMDhlNjc3YzU3MjNiMWZhYjVkNmI3N2JmYzhkMmIvRVAuMjMudjAuMTcwNTAzOTIwNS4xMDgwcC5tcDQ/dG9rZW49bkl2SlJadGRMeHBNX2NCMGtUeWZEdyZleHBpcmVzPTE3MTA5MzkzOTMmaWQ9MjE4OTEz";

// printStringDifferences(link1,link2);

async function main() {
    console.time();
    const res = await searchHentai("persona");
    console.log(res);
    console.timeEnd();
}

main();
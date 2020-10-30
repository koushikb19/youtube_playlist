const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config()

var playlistItems = [];

const youtube = google.youtube({
    version: process.env.YOUTUBE_VERSION,
    auth: process.env.YOUTUBE_AUTH_TOKEN
});

const getPlaylistItems = async (id, token) => {

    const params = {
        "part": [
            "contentDetails, snippet"
        ],
        "maxResults": 50,
        "pageToken": token ? token : null,
        "playlistId": id ? id : 'PLFjydPMg4DaoFednqpyLSCwmFbE4mFliI',
    }

    // youtube.playlistItems.list(params)
    //     .then(result => {

    //         // nextPageToken:
    //         // console.log(result.data);
    //         // console.log(result.data);
    //         result.data.items.forEach(item => {
    //             playlistItems.push(item.contentDetails.videoId);
    //         })
    //         // playlistItems.push(result.data.items);
    //         if (result.data.nextPageToken) {
    //             getPlaylistItems(id, result.data.nextPageToken);
    //         }
    //         else {
    //             console.log(playlistItems.length);
    //             //const playlist = JSON.stringify(playlistItems);
    //             // fs.writeFile('playlist.json', playlist, (err) => {
    //             //     if (err) {
    //             //         throw err;
    //             //     }

    //             //     console.log("Data stored");
    //             // });
    //         }
    //     //     // console.log(result.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
    //     return playlistItems;
    try {
        const result = await youtube.playlistItems.list(params);
        // console.log(result.data.items[0]);
        result.data.items.forEach(item => {
            playlistItems.push({
                id: item.contentDetails.videoId,
                title: item.snippet.title
            });
        });
        if (result.data.nextPageToken) {
            await getPlaylistItems(id, result.data.nextPageToken);
        } else {
            console.log(playlistItems.length);
        }

    } catch (err) {
        console.error(err);
    }
    return playlistItems;
}

// getPlaylistItems();

module.exports = getPlaylistItems;
const playlists = require('./playlist_list');
const fs = require('fs');
const youtubedl = require('youtube-dl');




var playlist_dict = {};
const download_video = (item) => {
    return new Promise(async (fulfill, reject) => {
        try {
            const video = youtubedl(`http://www.youtube.com/watch?v=${item.id}`,
                // Optional arguments passed to youtube-dl.
                ['--format=18'],
                // Additional options can be given for calling `child_process.execFile()`.
                { cwd: __dirname });
            video.on('info', info => {
                filename = info._filename;
                console.log('Download Started');
                console.log('filename: ' + info._filename);
                console.log('size: ' + info.size);
                console.log();
            });
            // console.log(filename);
            playlist_dict[item.title] = `./Download/${item.title}.mp4`;
            video.pipe(fs.createWriteStream(`./Download/${item.title}.mp4`))
                .on('end', () => {
                    console.log("Video Downloaded");
                    fulfill();
                })
                .on('error', reject);
        } catch (err) {
            reject(err)
        }
    })
}

const download = async () => {
    const playlist_id = process.argv[2] ? process.argv[2] : 'PLFjydPMg4Daqh4D0WA0BVi9ufRVBcmYTs'
    if (!fs.existsSync('./'+playlist_id)) {
        console.log("File doesn't exsists");
        fs.mkdirSync('./'+playlist_id);
    }
    const items = await playlists(playlist_id);
    // console.log(items);
    // items.forEach(async (item) => {
    //     await download_video(item);
    //     console.log('IN FOR EACHHHHHHHHHHHHHHHHHHH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    // });
    for (var i = 0; i < items.length; i++) {
        // console.log("Before download start.");
        // await download_video(items[i]);
        const item = items[i];
        const video = youtubedl(`http://www.youtube.com/watch?v=${item.id}`,
            // Optional arguments passed to youtube-dl.
            ['--format=18'],
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname });
        video.on('info', info => {
            filename = info._filename;
            console.log('Download Started');
            console.log('filename: ' + info._filename);
            console.log('size: ' + info.size);
        });
        // console.log(filename);
        playlist_dict[item.title] = `./${playlist_id}/${item.title}.mp4`;
        video.pipe(fs.createWriteStream(`./${playlist_id}/${item.title}.mp4`))
        await new Promise((resolve, reject) => video.on("end", () => {
            console.log("Download finished");
            console.log();
            resolve();
        }).on('error', () => {
            console.log("Error");
            reject();
        }));
        // console.log('IN FOR LOOOOOOOOOOOOOOOOOOOOOOOOOOOP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
    // console.log(playlist_dict);
    const playlist_json = JSON.stringify(playlist_dict);
    fs.writeFile('Download.json', playlist_json, (err) => {
        if (err) {
            throw err;
        }

        console.log("Data stored");
    });
}

download();
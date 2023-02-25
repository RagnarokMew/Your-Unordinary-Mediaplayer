
let songs: IDBDatabase;

const initDB = async() => {
    const request = window.indexedDB.open('songs', 1);
    
    request.onblocked = () => {
        console.warn("Unable to access the database!")
    }

    request.onerror = () => {
        console.warn("Encountered an error while accessing the database!")
    }

    request.onupgradeneeded = () => {
        const db = request.result;
        if (request.result.version === 1) {
            const store = db.createObjectStore("songs", { autoIncrement: true });
            store.createIndex("artist", "artist", { unique: false })
            store.createIndex("name", "name", { unique: false })
        }
        else {
            console.warn(`Unknown database version: ${db.version}`);
        }
    }

    await new Promise((resolve, reject) => {
        request.onsuccess = () => {
            songs = request.result;
            songs.onversionchange = () => {
                console.log("Closing the database...")
                songs.close();
            }
            resolve(songs);
        };
    })
}


export const saveSong = async(audio: ArrayBuffer, songName: string, songArtist: string = "User") => {
    if (!songs) {
        await initDB();
    }

    const trans = songs.transaction(["songs"], "readwrite");
    const store = trans.objectStore("songs");
    const req = store.put({
        name: songName,
        artist: songArtist,
        audio
    });

    trans.onerror = () => console.warn(`Could not save the song ${songName} by ${songArtist}!`);
    req.onerror = () => console.warn(`Could not save the song ${songName} by ${songArtist}!`);
    trans.oncomplete = () => console.log("Saved the song successfully!");
}

export const getSong = async(name: string) => {
    if (!songs) {
        await initDB();
    }
    const trans = songs.transaction("songs", "readonly");
    const store = trans.objectStore("songs");
    const nameIndex = store.index("name");
    const request = nameIndex.get(name);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;
            resolve(result);
        }
    })
}

export const getAllSongs = async() => {
    if (!songs) {
        await initDB();
    }

    const trans = songs.transaction("songs", "readonly");
    const store = trans.objectStore("songs");
    const request = store.getAll()

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;
            resolve(result);
        }
    })
}

export const getAllSongsWithName = async(name: string) => {
    if (!songs) {
        await initDB();
    }

    const trans = songs.transaction("songs", "readonly");
    const store = trans.objectStore("songs");
    const nameIndex = store.index("name");
    const request = nameIndex.getAll(name);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;
            resolve(result);
        }
    })
}

export const getAllSongsFromArtist = async(name: string) => {
    if (!songs) {
        await initDB();
    }

    const trans = songs.transaction("songs", "readonly");
    const store = trans.objectStore("songs");
    const artistIndex = store.index("artist");
    const request = artistIndex.getAll(name);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;
            resolve(result);
        }
    })
}

import type { Song } from "./interfaces";

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
        audio,
        likes: 0,
        listens: 0,
        effects: {
            biquad: "allpass",
            compressor: false,
            panning: 0
        }
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

    const trans = songs.transaction(["songs"], "readonly");
    const store = trans.objectStore("songs");

    return new Promise(function(resolve, reject) {
        let songsList: Song[] = [];
        store.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor != undefined) {
                songsList.push({
                    id: cursor.key as number,
                    audio: cursor.value.audio as ArrayBuffer,
                    likes: cursor.value.likes as number,
                    listens: cursor.value.listens as number,
                    name: cursor.value.name as string,
                    effects: cursor.value.effects,
                    artist: cursor.value.artist as string,
                } satisfies Song);
                cursor.continue();
            }

            resolve(songsList);
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

export const saveSongData = async(song: Song) => {

    const trans = songs.transaction("songs", "readwrite");
    const store = trans.objectStore("songs");

    store.put({
        artist: song.artist,
        name: song.name,
        audio: song.audio,
        listens: song.listens ?? 0,
        likes: song.likes ?? 0,
        effects: song.effects ?? { biquad: "allpass", panning: 0, compressor: false },
    }, song.id)

    trans.onerror = () => console.warn(`Encountered an error while saving song data!`);
    trans.oncomplete = () => console.log("Saved the song data successfully!");
}

let songs: IDBDatabase;

const initDB = async() => {
    const request = window.indexedDB.open('songs', 15);
    
    request.onblocked = () => {
        console.warn("Unable to access the database!")
    }

    request.onerror = () => {
        console.warn("Encountered an error while accessing the database!")
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


export const saveSongBuffer = async(audio: ArrayBuffer, songName: string, songArtist: string = "User") => {
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

export const getSongBuffer = async(name: string) => {
    if (!songs) {
        await initDB();
    }
    const trans = songs.transaction("songs", "readonly");
    const store = trans.objectStore("songs");
    const request = store.get(name);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;
            resolve(result);
        }
    })
}

export const getAllSongBuffers = async() => {
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

import type { Playlist, Song, SongData } from "./interfaces";

let database: IDBDatabase;

const initDB = async() => {
    const databaseCreate = window.indexedDB.open("database", 1);

    databaseCreate.onblocked = () => {
        console.warn("Unable to access the songs database!")
    }

    databaseCreate.onerror = () => {
        console.warn("Encountered an error while accessing the songs database!")
    }

    databaseCreate.onupgradeneeded = () => {
        const db = databaseCreate.result;
        if (databaseCreate.result.version === 1) {
            const songsStore = db.createObjectStore("songs", { autoIncrement: true });
            songsStore.createIndex("artist", "artist", { unique: false })
            songsStore.createIndex("name", "name", { unique: false })

            const playlistsStore = db.createObjectStore("playlists", { autoIncrement: true });
            playlistsStore.createIndex("artist", "artist", { unique: false })
            playlistsStore.createIndex("name", "name", { unique: false })
            playlistsStore.add({
                name: "Default",
                songIds: [],
                id: 1,
                listenTime: 0,
            } satisfies Playlist);
        }
        else {
            console.warn(`Unknown songs database version: ${db.version}`);
        }
    }


    await new Promise((resolve, reject) => {
        databaseCreate.onsuccess = () => {
            database = databaseCreate.result;
            database.onversionchange = () => {
                console.log("Closing the songs database...")
                database.close();
            }
            resolve(database);
        };
    })
}


export const saveSong = async(audio: ArrayBuffer, songName: string, songArtist: string = "User"): Promise<IDBValidKey> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readwrite");
    const store = trans.objectStore("songs");
    const req = store.put({
        name: songName,
        artist: songArtist,
        audio,
        listenTime: 0,
        listens: 0,
        effects: {
            biquad: "allpass",
            panning: 0
        }
    });

    trans.onerror = () => console.warn(`Could not save the song ${songName} by ${songArtist}!`);
    req.onerror = () => console.warn(`Could not save the song ${songName} by ${songArtist}!`);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => { 
            console.log("Saved the song successfully!");
            resolve(req.result);
        }
    })
}

export const deleteSong = async (id: number) => {
    const trans = database.transaction(["songs"], "readwrite");
    const songsStore = trans.objectStore("songs");

    songsStore.delete(id);
    const playlists = await getAllPlaylists();

    for (let i = 0; i < playlists.length; i++) {
        for (let j = 0; j < playlists[i].songIds.length; j++) {
            if (id === playlists[i].songIds[j]) {
                console.log(`Removing song with id ${id} from ${playlists[i].name}`)
                playlists[i].songIds.splice(j, 1);
                savePlaylist(playlists[i]);
                break;
            }
        }
    }

    trans.onerror = () => console.warn(`Failed to delete the song with id: ${id}`);
}

export const getSong = async(id: number): Promise<Song> => {
    if (!database) {
        await initDB();
    }
    const trans = database.transaction(["songs"], "readonly");
    const store = trans.objectStore("songs");
    const request = store.get(id);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            const result = request.result;

            if (result === undefined) reject(`Song with id ${id} does not exist!`)

            resolve({
                audio: result.audio,
                effects: result.effects,
                id: id,
                listens: result.listens,
                listenTime: result.listenTime,
                name: result.name,
                artist: result.artist
            }satisfies Song);
        }
    })
}

export const getAllSongs = async(): Promise<Song[]> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readonly");
    const store = trans.objectStore("songs");

    return new Promise(function(resolve, reject) {
        let songsList: Song[] = [];
        store.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor != undefined) {
                songsList.push({
                    id: cursor.key as number,
                    audio: cursor.value.audio as ArrayBuffer,
                    listenTime: cursor.value.listenTime as number,
                    listens: cursor.value.listens as number,
                    name: cursor.value.name as string,
                    effects: cursor.value.effects,
                    artist: cursor.value.artist as string,
                } satisfies Song);
                cursor.continue();
            }

            resolve(songsList);
        }

        trans.onerror = () => {
            console.warn("Could not get all songs!");
            reject("Could not get all songs!");
        }
    })
}

export const getAllSongsWithName = async(name: string) => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readonly");
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
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readonly");
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
    const trans = database.transaction(["songs"], "readwrite");
    const store = trans.objectStore("songs");

    store.put({
        artist: song.artist,
        id: song.id,
        name: song.name,
        audio: song.audio,
        listens: song.listens ?? 0,
        listenTime: song.listenTime ?? 0,
        effects: song.effects ?? { biquad: "allpass", panning: 0 },
    }, song.id)

    trans.onerror = () => console.warn(`Encountered an error while saving song data!`);
    trans.oncomplete = () => console.log("Saved the song data successfully!");
}

export const getPlaylist = async(playlistName: string): Promise<Playlist> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["playlists"], "readonly");

    return new Promise(function(resolve, reject) {
        trans.objectStore("playlists").index("name").openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor) {
                if (cursor.value.name === playlistName)
                {
                    resolve({
                        id: cursor.key as number,
                        songIds: cursor.value.songIds,
                        name: cursor.value.name,
                        listenTime: cursor.value.listenTime
                    } satisfies Playlist)
                }
                cursor.continue();
            }
        }
    })
}

export const getPlaylistWithId = async(id: number): Promise<Playlist> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["playlists"], "readonly");
    const playlist: IDBRequest<Playlist> = trans.objectStore("playlists").get(id);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            resolve(playlist.result);
        }
    })
}

export const getAllPlaylists = async(): Promise<Playlist[]> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["playlists"], "readonly");
    const playlistsStore = trans.objectStore("playlists");


    let playlistArray: Playlist[] = [];
    return new Promise(function(resolve, reject)  {
        playlistsStore.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor) {
                playlistArray.push({
                    name: cursor.value.name,
                    songIds: cursor.value.songIds,
                    id: cursor.key as number,
                    listenTime: cursor.value.listenTime
                } satisfies Playlist);
                cursor.continue();
            }
        }

        trans.oncomplete = () => resolve(playlistArray);
    });
}

export const getSongsFromPlaylist = async(playlist: Playlist): Promise<Song[]> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readonly");
    const songsStore = trans.objectStore("songs");

    return new Promise(function(resolve, reject) {
        let songArray: Song[] = [];
        songsStore.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor) {
                let foundSong = false;
                for (let i = 0; i < playlist.songIds.length && !foundSong; i++) {
                    if (cursor.key === playlist.songIds[i]) {
                        foundSong = true;
                    }
                }

                if (foundSong) {
                    songArray.push({
                        id: cursor.key as number,
                        audio: cursor.value.audio,
                        listenTime: cursor.value.listenTime,
                        listens: cursor.value.listens,
                        name: cursor.value.name,
                        effects: cursor.value.effects,
                        artist: cursor.value.artist,
                    } satisfies Song);
                    cursor.continue();
                }
                else {
                    cursor.continue();
                }
            }
        }

        trans.oncomplete = () => resolve(songArray);
    })
}

export const getAllSongsData = async(): Promise<SongData[]> => {
    if (!database) {
        await initDB();
    }

    const trans = database.transaction(["songs"], "readonly");
    const store = trans.objectStore("songs");

    return new Promise(function(resolve, reject) {
        let songsList: SongData[] = [];
        store.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor != undefined) {
                songsList.push({
                    id: cursor.key as number,
                    listenTime: cursor.value.listenTime as number,
                    listens: cursor.value.listens as number,
                    name: cursor.value.name as string,
                    effects: cursor.value.effects,
                    artist: cursor.value.artist as string,
                } satisfies SongData);
                cursor.continue();
            }

            resolve(songsList);
        }

        trans.onerror = () => {
            console.warn("Could not get all songs!");
            reject("Could not get all songs!");
        }
    })
}

export const savePlaylist = async(playlist: Playlist) => {
    const trans = database.transaction(["playlists"], "readwrite");
    const store = trans.objectStore("playlists");

    store.put({
        name: playlist.name,
        songIds: playlist.songIds,
        id: playlist.id,
        listenTime: playlist.listenTime,
    }, playlist.id)

    trans.onerror = () => console.warn(`Encountered an error while saving playlist data!`);
    trans.oncomplete = () => console.log("Saved the playlist data successfully!");
}

export const createPlaylist = async(playlistName: string): Promise<number> => {
    const trans = database.transaction(["playlists"], "readwrite");
    const store = trans.objectStore("playlists");

    const key = store.add({
        name: playlistName,
        songIds: [],
        listenTime: 0,
    });

    return new Promise(function(resolve, reject){
        trans.oncomplete = (e: any) => {
            resolve(key.result as number);
        }
        trans.onerror = () => reject("Transaction failed!");
    })
    
}

export const deletePlaylist = async(id: number) => {
    const trans = database.transaction(["playlists"], "readwrite");
    const store = trans.objectStore("playlists");

    store.delete(id);
    trans.onerror = () => console.warn(`Failed to delete the playlist with id ${id}`);
}
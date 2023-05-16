
import type { Playlist, Song } from "./interfaces";

let songs: IDBDatabase;
let playlists: IDBDatabase;

const initDB = async() => {
    const songsCreate = window.indexedDB.open("songs", 1);
    const playlistsCreate = window.indexedDB.open("playlists", 1);

    songsCreate.onblocked = () => {
        console.warn("Unable to access the songs database!")
    }

    songsCreate.onerror = () => {
        console.warn("Encountered an error while accessing the songs database!")
    }

    songsCreate.onupgradeneeded = () => {
        const db = songsCreate.result;
        if (songsCreate.result.version === 1) {
            const store = db.createObjectStore("songs", { autoIncrement: true });
            store.createIndex("artist", "artist", { unique: false })
            store.createIndex("name", "name", { unique: false })
        }
        else {
            console.warn(`Unknown songs database version: ${db.version}`);
        }
    }

    playlistsCreate.onblocked = () => {
        console.warn("Unable to access the playlists database!")
    }

    playlistsCreate.onerror = () => {
        console.warn("Encountered an error while accessing the playlists database!")
    }

    playlistsCreate.onupgradeneeded = () => {
        const db = playlistsCreate.result;
        if (playlistsCreate.result.version === 1) {
            const store = db.createObjectStore("playlists", { autoIncrement: true });
            store.createIndex("artist", "artist", { unique: false })
            store.createIndex("name", "name", { unique: false })
            store.add({
                name: "Default",
                songIds: [],
                id: 1,
            } satisfies Playlist);
        }
        else {
            console.warn(`Unknown playlists database version: ${db.version}`);
        }
    }

    await new Promise((resolve, reject) => {
        songsCreate.onsuccess = () => {
            songs = songsCreate.result;
            songs.onversionchange = () => {
                console.log("Closing the songs database...")
                songs.close();
            }
            resolve(songs);
        };
    })

    await new Promise((resolve, reject) => {
        playlistsCreate.onsuccess = () => {
            playlists = playlistsCreate.result;
            playlists.onversionchange = () => {
                console.log("Closing the playlists database...")
                playlists.close();
            }
            resolve(playlists);
        };
    })
}


export const saveSong = async(audio: ArrayBuffer, songName: string, songArtist: string = "User"): Promise<IDBValidKey> => {
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

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => { 
            console.log("Saved the song successfully!");
            resolve(req.result);
        }
    })
}

export const deleteSong = async (id: number) => {
    const trans = songs.transaction(["songs"], "readwrite");
    const store = trans.objectStore("songs");

    store.delete(id);
    trans.onerror = () => console.warn(`Failed to delete the song with id: ${id}`);
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

export const getAllSongs = async(): Promise<Song[]> => {
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

        trans.onerror = () => {
            console.warn("Could not get all songs!");
            reject("Could not get all songs!");
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

export const getPlaylist = async(playlistName: string): Promise<Playlist> => {
    if (!playlists) {
        await initDB();
    }

    const trans = playlists.transaction(["playlists"], "readonly");

    return new Promise(function(resolve, reject) {
        trans.objectStore("playlists").index("name").openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor) {
                if (cursor.value.name === playlistName)
                {
                    resolve({
                        id: cursor.key as number,
                        songIds: cursor.value.songIds,
                        name: cursor.value.name
                    } satisfies Playlist)
                }
                cursor.continue();
            }
        }
    })
}

export const getPlaylistWithId = async(id: number): Promise<Playlist> => {
    if (!playlists) {
        await initDB();
    }

    const trans = playlists.transaction(["playlists"], "readonly");
    const playlist: IDBRequest<Playlist> = trans.objectStore("playlists").get(id);

    return new Promise(function(resolve, reject) {
        trans.oncomplete = () => {
            resolve(playlist.result);
        }
    })
}

export const getAllPlaylists = async(): Promise<Playlist[]> => {
    if (!playlists) {
        await initDB();
    }

    const trans = playlists.transaction(["playlists"], "readonly");
    const playlistsStore = trans.objectStore("playlists"); 

    return new Promise(function(resolve, reject)  {
        let playlistArray: Playlist[] = [];
        playlistsStore.openCursor().onsuccess = (e) => {
            const cursor = (e.target as any).result as IDBCursorWithValue;
            if (cursor) {
                playlistArray.push({
                    name: cursor.value.name,
                    songIds: cursor.value.songIds,
                    id: cursor.key as number
                } satisfies Playlist);
                cursor.continue();
            }
            
            resolve(playlistArray);
        }
    });
}

export const getSongsFromPlaylist = async(playlist: Playlist): Promise<Song[]> => {
    if (!playlists) {
        await initDB();
    }

    const trans = songs.transaction(["songs"], "readonly");
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
                        likes: cursor.value.likes,
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
            resolve(songArray);
        }
    })
}

export const savePlaylist = async(playlist: Playlist) => {
    const trans = playlists.transaction("playlists", "readwrite");
    const store = trans.objectStore("playlists");

    store.put({
        name: playlist.name,
        songIds: playlist.songIds,
        id: playlist.id,
    }, playlist.id)

    trans.onerror = () => console.warn(`Encountered an error while saving playlist data!`);
    trans.oncomplete = () => console.log("Saved the playlist data successfully!");
}

export const createPlaylist = async(playlistName: string): Promise<number> => {
    const trans = playlists.transaction(["playlists"], "readwrite");
    const store = trans.objectStore("playlists");

    const key = store.add({
        name: playlistName,
        songIds: [],
    });

    return new Promise(function(resolve, reject){
        trans.oncomplete = (e: any) => {
            resolve(key.result as number);
        }
        trans.onerror = () => reject("Transaction failed!");
    })
    
}

export const deletePlaylist = async(id: number) => {
    const trans = playlists.transaction(["playlists"], "readwrite");
    const store = trans.objectStore("playlists");

    store.delete(id);
    trans.onerror = () => console.warn(`Failed to delete the playlist with id ${id}`);
}
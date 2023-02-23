import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    let songs: IDBDatabase;
    const request = window.indexedDB.open("songs");

    request.onsuccess = (event: Event) => {
        songs = request.result;
        console.log("Songs loaded successfully!");
    }

    request.onerror = (event: Event) => {
        console.error("Could not load the songs!")
    }

    //TODO: get the songs/playlists from the DB

    return {
      post: {
        songs: []
      }
    };
  }) satisfies PageLoad;
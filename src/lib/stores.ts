import { writable } from "svelte/store";
import type { Playlist, Settings, Song } from "./interfaces";

const songs = writable<Song[]>(new Array<Song>());
const playlists = writable<Playlist[]>(new Array<Playlist>());
const settings = writable<Settings>({
    mainLightColour: "#fecdd3",
    secondaryLightColour: "#e5e7eb",
    accentLightColour: "#000000",
    mainDarkColour: "#000000",
    secondaryDarkColour: "#ffffff",
    accentDarkColour: "#000000",
    forwardTime: 15,
    backwardTime: 15,
});

export {songs, playlists, settings};
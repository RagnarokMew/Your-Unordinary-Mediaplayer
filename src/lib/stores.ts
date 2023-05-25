import { writable } from "svelte/store";
import type { Playlist, Settings, SongData } from "./interfaces";

const songsData = writable<SongData[]>(new Array<SongData>());
const playlists = writable<Playlist[]>(new Array<Playlist>());
const settings = writable<Settings>({
    primaryLightColour: "#ffffff",
    secondaryLightColour: "#efe6e6",
    secondary2LightColour: "#cac1ba",
    secondary3LightColour: "#93989f",
    accentLightColour: "#000000",
    fontLightColour: "#000000",
    rangeLightColour: "#cac1ba",
    itemsLightColour: "#ffffff",
    primaryDarkColour: "#111115",
    secondaryDarkColour: "#404055",
    secondary2DarkColour: "#2d2d3a",
    secondary3DarkColour: "#1d1d24",
    accentDarkColour: "#000000",
    fontDarkColour: "#ffffff",
    rangeDarkColour: "#c09967",
    itemsDarkColour: "#69697d",
    forwardTime: 15,
    backwardTime: 15,
});
const songsToPlay = writable<SongData[]>(new Array<SongData>());

export {songsData, playlists, settings, songsToPlay};
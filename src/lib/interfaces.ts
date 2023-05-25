export interface Question {
    user: string;
    question: string;
    details: string;
}

export interface Review {
    user: string;
    review: string;
    rating: number;
}

export interface SongData {
    artist?: string;
    name: string;
    listens: number;
    listenTime: number;
    id: number;
    effects: {
        biquad: BiquadFilterType;
        panning: number;
    }
}

export interface Song extends SongData {
    audio: ArrayBuffer;
}

export interface Playlist {
    songIds: number[];
    name: string;
    id: number;
    listenTime: number;
}

export interface Settings {
    primaryLightColour: string;
    secondaryLightColour: string;
    secondary2LightColour: string;
    secondary3LightColour: string;
    accentLightColour: string;
    fontLightColour: string;
    rangeLightColour: string;
    itemsLightColour: string;
    primaryDarkColour: string;
    secondaryDarkColour: string;
    secondary2DarkColour: string;
    secondary3DarkColour: string;
    accentDarkColour: string;
    fontDarkColour: string;
    rangeDarkColour: string;
    itemsDarkColour: string;
    forwardTime: number;
    backwardTime: number;
}
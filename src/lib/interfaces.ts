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

export interface Song {
    artist?: string;
    name: string;
    audio: ArrayBuffer;
    listens: number;
    listenTime: number;
    id: number;
    effects: {
        biquad: BiquadFilterType;
        panning: number;
    }
}

export interface Playlist {
    songIds: number[];
    name: string;
    id: number;
    listenTime: number;
}

export interface Settings {
    mainLightColour: string;
    secondaryLightColour: string;
    accentLightColour: string;
    mainDarkColour: string;
    secondaryDarkColour: string;
    accentDarkColour: string;
    forwardTime: number;
    backwardTime: number;
}
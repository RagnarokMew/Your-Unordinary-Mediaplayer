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
    likes: number;
    id: number;
    effects?: {
        biquad: BiquadFilterType;
        panning: number
        compressor: boolean
    }
}

export interface Playlist {
    songIds: number[];
    name: string;
    id: number;
}
import type { PageLoad } from './$types';
import { getAllPlaylists, getAllSongs } from '$lib/indexedDB';

export const load = (async ({ params }) => {
    
    const playlists = await getAllPlaylists();
    const songs = await getAllSongs();

    return {
        post: {
            songs: songs,
            playlists: playlists,
        }
    };
}) satisfies PageLoad;
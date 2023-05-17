import type { PageLoad } from './$types';
import { getAllPlaylists, getAllSongs } from '$lib/indexedDB';

export const load = (async ({ params }) => {
    
    let playlists = await getAllPlaylists();
    let songs = await getAllSongs();

    return {
        post: {
            songs,
            playlists,
        }
    };
}) satisfies PageLoad;
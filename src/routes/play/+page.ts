import type { PageLoad } from './$types';
import { getAllPlaylists, getSongsFromPlaylist } from '$lib/indexedDB';

export const load = (async ({ params }) => {

    const playlists = await getAllPlaylists();
    //TODO: replace with most recently-accessed playlist
    //? Possibly by storing the value in LocalStorage or smth
    const songs = await getSongsFromPlaylist(playlists[0]);

    return {
        post: {
            songs,
            playlists,
        }
    };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
import { getAllSongs } from '$lib/indexedDB';

export const load = (async ({ params }) => {
    const songs = await getAllSongs();

    return {
        post: {
            songs: songs,
        }
    };
}) satisfies PageLoad;
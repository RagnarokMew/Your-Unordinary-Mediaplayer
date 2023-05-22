import type { PageLoad } from './$types';
import { getAllPlaylists } from '$lib/indexedDB';

export const load = (async ({ params }) => {
    const playlists = await getAllPlaylists();

    return {
        post: {
            playlists,
        }
    };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
import type { Song } from '$lib/interfaces';
import { getAllSongs } from '$lib/indexedDB';

export const load = (async({ params }) => {

  const songs = await getAllSongs() as Song[];

  return {
    post: {
      songs
    }
  };
}) satisfies PageLoad;
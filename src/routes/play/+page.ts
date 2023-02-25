import type { PageLoad } from './$types';
import type { Song } from '$lib/interfaces';
import { getAllSongs } from '$lib/indexedDB';

export const load = (async({ params }) => {

  const songsData = await getAllSongs() as Song[];
  const songs: Song[] = songsData

  return {
    post: {
      songs
    }
  };
}) satisfies PageLoad;
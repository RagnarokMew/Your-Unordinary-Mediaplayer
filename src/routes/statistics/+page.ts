import type { PageLoad } from './$types';
import {  } from '$lib/indexedDB';

export const load = (async ({ params }) => {

    /*
    TODO: grab the necessary data from the database and
    TODO: send it to the page 
    */

    return {
        post: {
            null: null,
        }
    };
}) satisfies PageLoad;
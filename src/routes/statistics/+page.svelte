<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData;
    const mostListened = data.post.songs.sort((a, b) => b.listens - a.listens); //most listened songs
    const mostSongs = data.post.playlists.sort((a, b) => b.songIds.length - a.songIds.length); //playlists with most songs in them

</script>


<main>
    {#each mostSongs as playlist, index}
        <p>{playlist.name} is #{index + 1}</p>
    {/each}

    {#each mostListened as song, index}
        <p>{song.name} by {song.artist} is #{index + 1} with {song.listens}</p>
    {/each}
</main>
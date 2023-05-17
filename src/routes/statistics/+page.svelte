<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
    import { Chart } from "chart.js/auto"

    export let data: PageData;
    const mostListened = data.post.songs.sort((a, b) => b.listens - a.listens).slice(0, 5); //most listened songs
    const mostSongs = data.post.playlists.sort((a, b) => b.songIds.length - a.songIds.length) //playlists with most songs in them

    let songsCanvas: HTMLCanvasElement;
    let playlistsCanvas: HTMLCanvasElement;
    
    //loading the charts
    onMount(() => {
        new Chart(songsCanvas, {
            type: "bar",
            data: {
                labels: mostListened.map(song => song.name),
                datasets: [
                    {
                        label: "Listens",
                        data: mostListened.map(song => song.listens)
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Most listened 5 songs"
                    }
                }
            }
        })

        new Chart(playlistsCanvas, {
            type: "pie",
            data: {
                labels: mostSongs.map(song => song.name),
                datasets: [
                    {
                        label: "# of songs",
                        data: mostSongs.map(song => song.songIds.length)
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Song distribution among playlists"
                    }
                }
            }
        })
    })


</script>


<main>
    {#each mostSongs as playlist, index}
        <p>{playlist.name} is #{index + 1}</p>
    {/each}

    {#each mostListened as song, index}
        <p>{song.name} by {song.artist} is #{index + 1} with {song.listens}</p>
    {/each}
    <canvas bind:this={songsCanvas}></canvas>
    <canvas bind:this={playlistsCanvas}></canvas>
</main>
<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
    import { Chart } from "chart.js/auto"

    export let data: PageData;
    const songs = data.post.songs;
    const playlists = data.post.playlists.sort((a, b) => b.songIds.length - a.songIds.length)

    //peak inefficiency:
    songs.sort((a, b) => b.listens - a.listens);
    const mostListenedByAmount = songs.slice(0, 5);

    songs.sort((a, b) => b.listenTime - a.listenTime);
    const mostListenedByTime = songs.slice(0, 5);

    let songsCanvas: HTMLCanvasElement;
    let playlistsCanvas: HTMLCanvasElement;
    let playlistListenTimeCanvas: HTMLCanvasElement;
    let songListenTimeCanvas: HTMLCanvasElement;

    //loading the charts
    onMount(() => {
        new Chart(songsCanvas, {
            type: "bar",
            data: {
                labels: mostListenedByAmount.map(song => song.name),
                datasets: [
                    {
                        label: "Listens",
                        data: mostListenedByAmount.map(song => song.listens)
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
                labels: playlists.map(playlist => playlist.name),
                datasets: [
                    {
                        label: "# of songs",
                        data: playlists.map(playlist => playlist.songIds.length)
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

        new Chart(playlistListenTimeCanvas, {
            type: "pie",
            data: {
                labels: playlists.map(playlist => playlist.name),
                datasets: [
                    {
                        label: "Listen time of songs in hours",
                        data: playlists.map(playlist => playlist.listenTime / 3600)
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Song distribution among playlists"
                    },
                }
            }
        })

        new Chart(songListenTimeCanvas, {
            type: "pie",
            data: {
                labels: mostListenedByTime.map(song => song.name),
                datasets: [
                    {
                        label: "Listen time of songs in hours",
                        data: mostListenedByTime.map(song => song.listenTime / 3600)
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Time spent listening to songs"
                    },
                }
            }
        })
    })


</script>


<main>
    <strong><p>Playlists sorted by # of songs:</p></strong>
    {#each playlists as playlist, index}
        <p>{playlist.name} is #{index + 1} with {playlist.songIds.length} songs and {playlist.listenTime}s of playtime</p>
    {/each}
    <br>
    <strong><p>Songs sorted by listen count:</p></strong>
    {#each songs as song, index}
        <p>{song.name} by {song.artist} is #{index + 1} with {song.listens} and {song.listenTime}s of play time</p>
    {/each}
    <canvas bind:this={songsCanvas}></canvas>
    <canvas bind:this={playlistsCanvas}></canvas>
    <canvas bind:this={playlistListenTimeCanvas}></canvas>
    <canvas bind:this={songListenTimeCanvas}></canvas>
</main>
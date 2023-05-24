<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
    import { Chart } from "chart.js/auto"
	import { songsData } from "$lib/stores";

    export let data: PageData;
    const songs = $songsData;
    const playlists = data.post.playlists.sort((a, b) => b.songIds.length - a.songIds.length);

    //peak inefficiency:
    songs.sort((a, b) => b.listens - a.listens);
    const mostListenedSongsByAmount = songs.filter(song => song.listenTime > 0).slice(0, 10);

    songs.sort((a, b) => b.listenTime - a.listenTime);
    const mostListenedSongsByTime = songs.filter(song => song.listenTime > 0).slice(0, 10);

    playlists.sort((a, b) => b.listenTime - a.listenTime)
    const mostListenedPlaylists = playlists.filter(playlist => playlist.listenTime > 0).slice(0, 5);

    let songsCanvas: HTMLCanvasElement;
    let playlistsCanvas: HTMLCanvasElement;
    let playlistListenTimeCanvas: HTMLCanvasElement;
    let songListenTimeCanvas: HTMLCanvasElement;

    //loading the charts
    onMount(() => {
        if (mostListenedSongsByAmount.length > 0) {
            new Chart(songsCanvas, {
                type: "bar",
                data: {
                    labels: mostListenedSongsByAmount.map(song => song.name),
                    datasets: [
                        {
                            label: "Listens",
                            data: mostListenedSongsByAmount.map(song => song.listens)
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
        }

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
                        data: playlists.filter(playlist => playlist.listenTime > 0)
                                        .map(playlist => playlist.listenTime / 3600)
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Time spent listening to music by playlists"
                    },
                }
            }
        })

        if (mostListenedSongsByTime.length > 0) {
            new Chart(songListenTimeCanvas, {
                type: "pie",
                data: {
                    labels: mostListenedSongsByTime.map(song => song.name),
                    datasets: [
                        {
                            label: "Listen time of songs in hours",
                            data: mostListenedSongsByTime.map(song => song.listenTime / 3600)
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
        }
    })


</script>


<main>
    <strong><p>Playlists sorted by # of songs:</p></strong>
    {#each mostListenedPlaylists as playlist, index}
        <p>Playlist {playlist.name} is #{index + 1} with {playlist.listenTime / 3600}h total listen time!</p>
    {/each}
    <br>
    <strong><p>Songs sorted by listen count:</p></strong>
    {#each mostListenedSongsByAmount as song, index}
        <p>{song.name} by {song.artist} is #{index + 1} with {song.listens} listen and {song.listenTime}s of play time</p>
    {/each}

    <canvas bind:this={songsCanvas}></canvas>
    <canvas bind:this={playlistsCanvas}></canvas>
    <canvas bind:this={playlistListenTimeCanvas}></canvas>
    <canvas bind:this={songListenTimeCanvas}></canvas>
</main>
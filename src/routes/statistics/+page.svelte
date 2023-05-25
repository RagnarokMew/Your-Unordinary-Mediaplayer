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


<main class="flex flex-col p-5 overflow-y-scroll w-full h-full gap-4">

    <h1 class="text-3xl font-extrabold flex justify-center items-center">Data & Statistics</h1>

    <div class="flex flex-row w-full gap-4">
        <div class="flex justify-center items-center secondary2-bg rounded-2xl w-full h-[512px] p-8">
            <canvas bind:this={songListenTimeCanvas}></canvas>
        </div>
    </div>

    <div class="flex flex-row w-full gap-4">
        <div class="flex justify-center items-center secondary2-bg rounded-2xl w-full h-[512px] p-8">
            <canvas bind:this={playlistsCanvas}></canvas>
        </div>
        <div class="flex justify-center items-center secondary2-bg rounded-2xl w-full h-[512px] p-8">
            <canvas bind:this={playlistListenTimeCanvas}></canvas>
        </div>
    </div>

    <div class="flex flex-row w-full gap-4">
        <div class="flex justify-center items-center secondary2-bg rounded-2xl w-full h-[512px] p-8">
            <canvas bind:this={songsCanvas}></canvas>
        </div>
    </div>

    <div class="flex flex-row w-full gap-4">
        <div class="flex flex-col justify-center items-center secondary2-bg rounded-2xl w-1/2 p-8">
            <p class="font-bold text-xl">Playlists sorted by # of songs:</p>
            {#each mostListenedPlaylists as playlist, index}
                <p>Playlist {playlist.name} is #{index + 1} with {playlist.listenTime / 3600}h total listen time!</p>
            {/each}
        </div>
        <div class="flex flex-col justify-center items-center secondary2-bg rounded-2xl w-1/2 p-8">
            <p class="font-bold text-xl">Songs sorted by listen count:</p>
            {#each mostListenedSongsByAmount as song, index}
                <p>{song.name} by {song.artist} is #{index + 1} with {song.listens} listen and {song.listenTime}s of play time</p>
            {/each}
        </div>
    </div>

    <div class="flex flex-row w-full gap-4">
        <div class="flex justify-center items-center secondary2-bg rounded-2xl w-full p-8 font-bold text-2xl">
            So many memories are here and even more are to be made. Thank you for allowing us to be a part of them!
        </div>
    </div>
    
</main>
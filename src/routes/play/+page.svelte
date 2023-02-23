<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
    export const ssr = false;

    const songs = data.post.songs;
    let currentSong = 0;

    let audio: HTMLAudioElement;
    let time: number = 0;
    let volume: number = 0.5;

    $: audioLength = audio?.duration;

    const playSong = () => {
        if (audio.paused) {
            audio.play();
        }
        else {
            audio.pause();
        }
    }

    const seekSong = () => audio.currentTime = time;
    const updateRange = () => time = audio.currentTime;
    const updateVolume = () => audio.volume = volume;

    const nextSong = () => {
        currentSong++;
        currentSong = currentSong % songs.length;
    }

    const prevSong = () => {
        currentSong--;
        if (currentSong < 0) {
            currentSong = songs.length - 1;
        }
    }

    const likeSong = () => {
        //TBA
    }

    const addToPlaylist = () => {
        //TBA
    }
</script>


<main class="grid grid-cols-[1fr,5fr,1fr] grid-rows-[1fr,5fr,1fr] w-full h-screen">
    <h1 class="row-span-1 col-start-2 col-end-3 font-bold text-xl self-center justify-self-center text-center">
        Media player
    </h1>

    <!-- Central panel -->
    <div class="flex flex-col justify-between items-center row-start-2 row-end-3 col-start-2 col-end-3 m-4 gap-2">
        <img src="" alt="Placeholder" class="border w-[512px] h-[512px]">
        <audio on:seeked={updateRange} bind:this={audio} src={songs[currentSong] ?? ""}>Audio</audio>

        <p>Lorem ipsum - Dolor Sit Amet</p>

        <!-- Controls -->
        <div class="flex flex-row items-center justify-evenly bg-rose-200 w-2/3 h-1/6">
            <button on:click={prevSong}>Previous</button>
            <button on:click={playSong}>Play</button>
            <button on:click={nextSong}>Next</button>
            <button on:click={likeSong}>Like</button>
            <button on:click={addToPlaylist}>Save</button>
            <div class="flex flex-col">
                <label for="time">Time:</label>
                <input on:change={seekSong} bind:value={time} type="range" min="0" max={audioLength} name="time">
            </div>

            <div class="flex flex-col">
                <label for="volume">Volume:</label>
                <input on:change={updateVolume} bind:value={volume} type="range" min="0" max="1" step="0.1" name="volume">
            </div>
        </div>
    </div>

    <!-- Right panel -->
    <div class="row-start-2 row-end-3 col-start-3 col-end-4 bg-rose-200">
    </div>

    <!-- Bottom panel -->
    <div class="row-start-3 row-end-4 col-start-2 col-end-3 bg-rose-200 m-4 w-1/2 h-2/3 self-center justify-self-center">
    </div>

</main>
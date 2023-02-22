<script lang="ts">
    let audio: HTMLAudioElement;
    let time: number = 0;
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

    const nextSong = () => {
        //TBA
    }

    const prevSong = () => {
        //TBA
    }

    const likeSong = () => {
        //TBA
    }
</script>


<main class="grid grid-cols-[1fr,5fr,1fr] grid-rows-[1fr,5fr,1fr] w-full h-screen">
    <h1 class="row-span-1 col-start-2 col-end-3 font-bold text-xl self-center justify-self-center text-center">
        Media player
    </h1>

    <!-- Central panel -->
    <div class="flex flex-col justify-between items-center row-start-2 row-end-3 col-start-2 col-end-3 m-4">
        <img src="" alt="Placeholder" class="border w-[512px] h-[512px]">
        <audio on:seeked={updateRange} controls bind:this={audio}></audio>

        <!-- Controls -->
        <div class="flex flex-row items-center justify-evenly bg-rose-200 w-2/3 h-1/6">
            <button on:click={prevSong}>Previous</button>
            <button on:click={playSong}>Play</button>
            <button on:click={nextSong}>Next</button>
            <button on:click={likeSong}>Like</button>
            <input on:change={seekSong} bind:value={time} type="range" min="0" max={audioLength ? audioLength : 0}>
        </div>
    </div>

    <!-- Right panel -->
    <div class="row-start-2 row-end-3 col-start-3 col-end-4 bg-rose-200">
    </div>

    <!-- Bottom panel -->
    <div class="row-start-3 row-end-4 col-start-2 col-end-3 bg-rose-200 m-4 w-1/2 h-2/3 self-center justify-self-center">
    </div>

</main>
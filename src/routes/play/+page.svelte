<script lang="ts">
    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";

    export let data: PageData;

    const songs = data.post.songs;
    let currentSong = 0;

    if (songs.length === 0){
        alert("Please upload a song first!")
        goto("/upload");
    }

    const audioContext = new AudioContext();
    const panner = audioContext.createStereoPanner();
    panner.pan.value = 0;
    const biquad = audioContext.createBiquadFilter();
    const biquadFilters: BiquadFilterType[] = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
    let biquadIndex = 0;

    let track: MediaElementAudioSourceNode;

    let timeInput: HTMLInputElement;
    let audio: HTMLAudioElement;
    let time: number = 0;
    let volume: number = 0.5;
    let panning: number = 0;

    $: biquad.type = biquadFilters[biquadIndex];
    $: audioLength = audio?.duration;
    $: blob = new Blob([songs[currentSong]?.audio ?? ""], { type: "audio/mp3" });
    let url: string;

    $: {
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(blob);
    }

    const playSong = () => {
        if (!track) {
            track = audioContext.createMediaElementSource(audio);
            track.connect(panner).connect(biquad).connect(audioContext.destination);
        }

        if (audio.paused) {
            audio.play();
        }
        else {
            audio.pause();
        }
    }

    const seekSong = () =>  {
        audio.currentTime = time;
        //to avoid it remaining stuck on the element and bugging out
        (document.activeElement as HTMLElement)?.blur();
    }
    const updateRange = () => {
        //to avoid it not updating the time properly
        if (document.activeElement === timeInput) return;
        time = audio.currentTime;
    }
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

    const addToPlaylist = () => {
        //TBA
    }

    const updatePanning = () => {
        panner.pan.value = panning;
    }
</script>


<main class="grid grid-cols-[1fr,5fr,1fr] grid-rows-[1fr,5fr,1fr] w-full h-screen">
    <h1 class="row-span-1 col-start-2 col-end-3 font-bold text-xl self-center justify-self-center text-center">
        Media player
    </h1>

    <!-- Central panel -->
    <div class="flex flex-col justify-between items-center row-start-2 row-end-3 col-start-2 col-end-3 m-4 gap-2">
        <img src="" alt="Placeholder" class="border w-[512px] h-[512px]">
        <audio on:timeupdate={updateRange} bind:this={audio} src={url}>Audio</audio>

        <p>{songs[currentSong]?.name ?? "Nothing"} by {songs[currentSong]?.artist ?? "Nobody"}</p>

        <!-- Controls -->
        <div class="flex flex-row items-center justify-evenly bg-rose-200 w-2/3 h-1/6">
            <button on:click={prevSong}>Previous</button>
            <button on:click={playSong}>Play</button>
            <button on:click={nextSong}>Next</button>
            <button on:click={addToPlaylist}>Save</button>
            <div class="flex flex-col">
                <label for="time">Time:</label>
                <input bind:this={timeInput} on:change={seekSong} bind:value={time} type="range" min="0" max={audioLength} name="time">
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
    <div class="flex flex-row gap-5 row-start-3 row-end-4 col-start-2 col-end-3 bg-rose-200 m-4 w-1/2 h-2/3 self-center justify-self-center">
        <div class="flex flex-col">
            <label for="stereo">Panning:</label>
            <input on:change={updatePanning} bind:value={panning} type="range" min="-1" max="1" step="0.1" name="stereo">
        </div>

        <div class="flex flex-col">
            <label for="biquad">Biquad: {biquadFilters[biquadIndex]}</label>
            <input bind:value={biquadIndex} type="range" min="0" max={biquadFilters.length - 1} step="1" name="Biquad">
        </div>
    </div>

</main>
<script lang="ts">
    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { createPlaylist, deletePlaylist, getSongsFromPlaylist, savePlaylist, saveSongData } from "$lib/indexedDB";
	import Song from "./Song.svelte";
	import type { Playlist } from "$lib/interfaces";
	import { onDestroy } from "svelte";

    export let data: PageData;

    let playlists = data.post.playlists;
    let currentPlaylist = 0;
    let songs = data.post.songs;
    let currentSong = 0;

    let playStart: Date = new Date();
    let currentPlayTime = 0;
    let totalPlayTime = 0;
    let clickedPlay = false;

    setTimeout(() => {
        songs[0] = songs[0]; //to make the songs render (temporary fix, hopefully)
    }, 100);

    if (playlists[currentPlaylist].songIds?.length === 0 || !playlists[currentPlaylist].songIds){
        alert("Please upload a song!")
        goto("/upload");
    }

    //UI-related stuff
    let volumeRange : HTMLElement;
    let isPlaying : boolean = false;

    //Audio-related stuff

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
    let addingToPlaylist = false;
    let changingPlaylsit = false;
    let creatingNewPlaylist = false;
    let playlistNameInputValue: string;

    if (songs.length > 0) {
        biquadIndex = biquadFilters.indexOf(songs[currentSong].effects.biquad);
        panning = songs[currentSong].effects.panning;
        panner.pan.value = panning;
    }

    const playSong = () => {
        if (!track) {
            track = audioContext.createMediaElementSource(audio);
            track.connect(panner).connect(biquad).connect(audioContext.destination);
            audio.currentTime = time;
            playStart = new Date();
        }

        if (audio.paused) {
            audio.play();
            playStart = new Date();
            clickedPlay = true;

            isPlaying = true;
        }
        else {
            audio.pause();
            const playEnd = new Date();
            currentPlayTime += Math.floor( (playEnd.getTime() - (playStart?.getTime() ?? Date.now())) / 1000);

            isPlaying = false;
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

    let forwardTime = 15;
    let rewindTime = 15;

    // Make a forward button
    const forwardSeconds = () =>{ 
        audio.currentTime += forwardTime;
        time = audio.currentTime;
    }

    const rewindSeconds = () =>{
        audio.currentTime -= rewindTime;
        time = audio.currentTime;
    }

    const toggleVolume = () => volumeRange.classList.toggle("hidden");

    const updateVolume = () => audio.volume = volume;

    const nextSong = () => {
        updateSongData();
        saveSongData(songs[currentSong]);

        //until Autoplay is added
        isPlaying = false;

        playStart = new Date();
        currentSong++;
        currentPlayTime = 0;
        clickedPlay = false;
        currentSong = currentSong % songs.length;
        if (songs.length > 0) {
            biquadIndex = biquadFilters.indexOf(songs[currentSong].effects.biquad);
            panning = songs[currentSong].effects.panning;
            updatePanning();
        }
    }

    const prevSong = () => {
        updateSongData();
        saveSongData(songs[currentSong]);

        //until Autoplay is added
        isPlaying = false;

        playStart = new Date();
        currentSong--;
        currentPlayTime = 0;
        clickedPlay = false;
        if (currentSong < 0) {
            currentSong = songs.length - 1;
        }
        if (songs.length > 0)
        {
            biquadIndex = biquadFilters.indexOf(songs[currentSong].effects.biquad);
            panning = songs[currentSong].effects.panning;
            updatePanning();
        }
    }

    const updateSongData = () => {
        songs[currentSong].effects.biquad = biquadFilters[biquadIndex];
        songs[currentSong].effects.panning = panning;
        if (clickedPlay === true) songs[currentSong].listens++;
        songs[currentSong].listenTime += currentPlayTime;
        totalPlayTime += currentPlayTime;
    }

    const toggleAddToPlaylist = () => {
        addingToPlaylist = !addingToPlaylist;
        creatingNewPlaylist = false;
    }
    const toggleChangingPlaylist = () => changingPlaylsit = !changingPlaylsit;
    const toggleCreatingNewPlaylist = () => creatingNewPlaylist = !creatingNewPlaylist;

    const updatePanning = () => {
        panner.pan.value = panning;
    }

    const songChosen = (e: CustomEvent) => {
        const songIndex = e.detail.songIndex as number;
        updateSongData();
        saveSongData(songs[currentSong]);

        playStart = new Date();
        currentSong = songIndex;
        currentPlayTime = 0;
        clickedPlay = false;
        if (songs.length > 0)
        {
            biquadIndex = biquadFilters.indexOf(songs[currentSong].effects.biquad);
            panning = songs[currentSong].effects.panning;
            updatePanning();
        }
    }

    const addToPlaylist = (playlistIndex: number) => {
        let foundSong = false;
        for (let i = 0; i < playlists[playlistIndex].songIds.length; i++) {
            if (songs[currentSong].id === playlists[playlistIndex].songIds[i]) {
                foundSong = true;
                break;
            }
        }

        if (foundSong) { //remove the song from the playlist
            console.log(`Removed ${songs[currentSong].name} from ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds = playlists[playlistIndex].songIds.filter(songId => songId !== songs[currentSong].id);
            savePlaylist(playlists[playlistIndex]);
            songs = songs;
        }
        else { //save the song to the playlist
            console.log(`Added ${songs[currentSong].name} to ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds.push(songs[currentSong].id)
            savePlaylist(playlists[playlistIndex]);
            songs = songs;
        }

    }

    const createNewPlaylist = async() => {
        if (playlistNameInputValue.length === 0) {
            alert("Please insert a name for the playlist!");
            return;
        }
        const id = await createPlaylist(playlistNameInputValue);
        console.log("Created a new playlist!");
        playlists.push({
            id: id,
            name: playlistNameInputValue,
            songIds: [],
            listenTime: 0,
        } satisfies Playlist);
        playlists = playlists;
        creatingNewPlaylist = false;
    }

    const changePlaylist = async(playlistIndex: number) => {
        updateSongData();
        await saveSongData(songs[currentSong]);
        playlists[currentPlaylist].listenTime += totalPlayTime;
        savePlaylist(playlists[currentPlaylist]);
        songs = await getSongsFromPlaylist(playlists[playlistIndex]);
        currentPlaylist = playlistIndex;
        currentSong = 0;
    }

    const deletePlaylistFromDb = async (playlistIndex: number) => {
        await deletePlaylist(playlists[playlistIndex].id);
        playlists.splice(playlistIndex, 1);
        playlists = playlists;
    }

    onDestroy(async() => {
        if (songs.length === 0) return;
        updateSongData();
        await saveSongData(songs[currentSong]);
        playlists[currentPlaylist].listenTime += totalPlayTime;
        await savePlaylist(playlists[currentPlaylist]);
    })

</script>


<main class="grid grid-cols-[1fr,5fr,1fr] grid-rows-[1fr,5fr,1fr] w-full h-screen">
    <h1 class="row-span-1 col-start-2 col-end-3 font-bold text-xl self-center justify-self-center text-center">
        Media player
    </h1>

    {#if addingToPlaylist}
        <div class="absolute inset-y-52 inset-x-52 w-96 h-4">
            {#each playlists as playlist, index}
                <button on:click={() => addToPlaylist(index)} class="bg-red-500 p-2 m-2">{playlist.name}</button>
            {/each}
            <button on:click={toggleCreatingNewPlaylist} class="bg-red-500 p-2 m-2">Create new playlist</button>
        </div>
    {/if}

    {#if changingPlaylsit}
        <div class="absolute inset-y-52 inset-x-52 w-96 h-4">
            {#each playlists as playlist, index}
                <div class="flex flex-row">
                    <button on:click={() => deletePlaylistFromDb(index)}>X</button>
                    <button on:click={() => changePlaylist(index)} class="bg-green-500 p-2 m-2">{playlist.name}</button>
                </div>
            {/each}
        </div>
    {/if}

    {#if creatingNewPlaylist}
        <div class="absolute inset-y-64 inset-x-64 flex flex-col justify-center w-64 h-28 bg-blue-450 p-2">
            <label for="playlistName">Playlist name:</label>
            <input bind:value={playlistNameInputValue} name="playlistName" type="text">
            <button on:click={createNewPlaylist} type="submit">Create</button>
        </div>
    {/if}

    <!-- Central panel -->
    <div class="flex flex-col justify-between items-center row-start-2 row-end-3 col-start-2 col-end-3 m-4 gap-2">
        <img src="" alt="Placeholder" class="border w-[512px] h-[512px]">
        <audio on:timeupdate={updateRange} bind:this={audio} src={url}>Audio</audio>

        <p>{songs[currentSong]?.name ?? "Nothing"} by {songs[currentSong]?.artist ?? "Nobody"}</p>

        <div class="flex flex-col w-2/3">
            <label for="time">Time:</label>
            <input bind:this={timeInput} on:change={seekSong} bind:value={time} type="range" min="0" max={audioLength} name="time" id="time" 
            class="w-full h-3 appearance-none outline-none overflow-hidden drop-shadow-sm shadow-gray-700 dark:shadow-rose-200 dark:bg-gray-700 bg-rose-200 rounded-xl
            ">
        </div>

        <!-- Controls -->
        <div class="flex flex-row items-center justify-between bg-rose-200 dark:bg-gray-700 rounded-xl w-2/3 h-1/6 px-6">
            
            <div class="controls-left flex flex-row items-center justify-evenly gap-10">
                <button on:click={prevSong}>
                    <img src="Icons/previous.svg" alt="Previous" class="w-10 h-10">
                </button>
                <button on:click={rewindSeconds}>
                    <img src="Icons/play-back.svg" alt="Rewind" class="w-10 h-10">
                </button>
                <button on:click={playSong}>
                    {#if isPlaying}
                        <img src="Icons/pause.svg" alt="Play/Pause" class="w-10 h-10">
                    {:else}
                        <img src="Icons/play.svg" alt="Play/Pause" class="w-10 h-10">
                    {/if}
                </button>
                <button on:click={forwardSeconds}>
                    <img src="Icons/play-forward.svg" alt="Previous" class="w-10 h-10">
                </button>
                <button on:click={nextSong}>
                    <img src="Icons/next.svg" alt="Next" class="w-10 h-10">
                </button>
    
                <!-- Bandaid Fix-->
                <button on:click={toggleVolume} class="flex flex-col items-center justify-center -mr-5">
                    {#if volume > 0.65}
                        <img src="Icons/volume-high.svg" alt="Volume" class="w-10 h-10">
                    {:else if volume > 0.3}
                        <img src="Icons/volume-medium.svg" alt="Volume" class="w-10 h-10">
                    {:else if volume > 0}
                        <img src="Icons/volume-low.svg" alt="Volume" class="w-10 h-10">
                    {:else}
                        <img src="Icons/volume-off.svg" alt="Volume" class="w-10 h-10">
                    {/if}
                </button>
                <div bind:this={volumeRange} class="flex flex-col hidden overflow-hidden">
                    <input on:change={updateVolume} bind:value={volume} type="range" min="0" max="1" step="0.1" name="volume" class="h-10 w-20">
                </div>
            </div>

            <div class="controls-right flex flex-row items-center gap-10">
                <button on:click={toggleAddToPlaylist}>
                    <img src="Icons/add-playlist.svg" alt="Add to Playlist" class="w-10 h-10">
                </button>
                <button on:click={toggleChangingPlaylist}>
                    <img src="Icons/list.svg" alt="Playlists" class="w-10 h-10">
                </button>
            </div>

        </div>
    </div>

    <!-- Right panel -->
    <div class="row-start-2 row-end-3 col-start-3 col-end-4 bg-rose-200 dark:bg-gray-700">
        {#each songs as song, index}
            <Song on:playsong={songChosen} songArtist={song.artist ?? "Nobody"} songName={song.name} songIndex={index} songId={song.id} />
        {/each}
    </div>

    <!-- Bottom panel -->
    <div class="flex flex-row gap-5 row-start-3 row-end-4 col-start-2 col-end-3 bg-rose-200 dark:bg-gray-700 rounded-lg px-4 py-1 m-4 w-2/3 h-2/3 self-center justify-self-center justify-evenly">
        <div class="flex flex-col">
            <label for="stereo">Panning:</label>
            <input on:change={updatePanning} bind:value={panning} type="range" min="-1" max="1" step="0.1" name="stereo"
            class="h-3 appearance-none outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200">
        </div>

        <div class="flex flex-col">
            <label for="biquad">Biquad: {biquadFilters[biquadIndex]}</label>
            <input bind:value={biquadIndex} type="range" min="0" max={biquadFilters.length - 1} step="1" name="Biquad"
            class="h-3 appearance-none outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200">
        </div>
    </div>

</main>
<style>
    #time::-webkit-slider-thumb
    {
        outline: none;
        cursor: pointer;
        border: 0;
        height: 12px;
        width: 0px;

        box-shadow: -50vw 0 0 50vw var(--time-range-colour);
        background-color: var(--time-range-colour);
    }

    #time::-moz-range-thumb
    {
        outline: none;
        cursor: pointer;
        border: 0;
        height: 12px;
        width: 0px;

        box-shadow: -50vw 0 0 50vw var(--time-range-colour);
        background-color: var(--time-range-colour);
    }

    #time::-ms-thumb
    {
        outline: none;
        cursor: pointer;
        border: 0;
        height: 12px;
        width: 0px;

        box-shadow: -50vw 0 0 49vw var(--time-range-colour);
        background-color: var(--time-range-colour);
    }

    input[type="range"]::-webkit-slider-thumb
    {
        height: 16px;
        width: 16px;
        border: 0;

        box-shadow: -192px 0 0 180px var(--modifier-range-colour);
        background-color: #777777;
    }

    input[type="range"]::-moz-range-thumb
    {
        height: 16px;
        width: 16px;
        border: 0;

        box-shadow: -192px 0 0 180px var(--modifier-range-colour);
        background-color: #777777;
    }

    input[type="range"]::-ms-thumb
    {
        height: 16px;
        width: 16px;
        border: 0;

        box-shadow: -192px 0 0 180px var(--modifier-range-colour);
        background-color: #777777;
    }
</style>
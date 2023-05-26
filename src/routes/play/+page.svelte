<script lang="ts">

	import "../../app.css";
    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { createPlaylist, deletePlaylist, getSong, savePlaylist, saveSongData } from "$lib/indexedDB";
	import type { Playlist, Song as Song_T } from "$lib/interfaces";
	import { onDestroy, onMount } from "svelte";
	import { songsData, songsToPlay } from "$lib/stores";
    import Song from "./Song.svelte";
    import { createAvatar } from "@dicebear/core"
    import * as shapes from "@dicebear/shapes"
	import { blur } from "svelte/transition"
	import { settings } from "$lib/stores";

	export let data: PageData;

    let playlists = data.post.playlists;
    let currentPlaylist = 0;
    let currentSongIndex = 0;
    let currentSong: Song_T;

    let playStart: Date = new Date();
    let currentPlayTime = 0;
    let totalPlayTime = 0;
    let clickedPlay = false;
    let img: string = "";

	if (playlists[currentPlaylist].songIds?.length === 0 || !playlists[currentPlaylist].songIds) {
		alert('Please upload a song!');
		goto('/upload');
	}

    onMount(async () => {
        if (playlists[currentPlaylist].songIds?.length === 0 || !playlists[currentPlaylist].songIds) return;
        currentSong = await getSong(playlists[currentPlaylist].songIds[0]);
        $songsToPlay = [];
        for (const data of $songsData) {
            for (const id of playlists[currentPlaylist].songIds) {
                if (data.id === id) {
                    $songsToPlay.push(data);
                    break;
                }
            }
        }
        $songsToPlay = $songsToPlay;

		biquadIndex = biquadFilters.indexOf(currentSong.effects.biquad);
		panning = currentSong.effects.panning;
		updatePanning();

        generateImage();
    })

	//UI-related stuff
	let volumeRange: HTMLElement;
	let isPlaying: boolean = false;

	//Audio-related stuff

	const audioContext = new AudioContext();
	const panner = audioContext.createStereoPanner();
	panner.pan.value = 0;
	const biquad = audioContext.createBiquadFilter();
	const biquadFilters: BiquadFilterType[] = [
		'lowpass',
		'highpass',
		'bandpass',
		'lowshelf',
		'highshelf',
		'peaking',
		'notch',
		'allpass'
	];
	let biquadIndex = 0;

	let track: MediaElementAudioSourceNode;

	let timeInput: HTMLInputElement;
	let audio: HTMLAudioElement;
	let time: number = 0;
	let volume: number = 0.5;
	let panning: number = 0;

    $: biquad.type = biquadFilters[biquadIndex];
    $: audioLength = audio?.duration;
    $: blob = new Blob([currentSong?.audio ?? ""], { type: "audio/mp3" });
    let url: string;

	$: {
		URL.revokeObjectURL(url);
		url = URL.createObjectURL(blob);
	}
	let addingToPlaylist = false;
	let changingPlaylsit = false;
	let creatingNewPlaylist = false;
	let playlistNameInputValue: string;

    if ($songsToPlay.length > 0) {
        biquadIndex = biquadFilters.indexOf($songsToPlay[currentSongIndex].effects.biquad);
        panning = $songsToPlay[currentSongIndex].effects.panning;
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
		} else {
			audio.pause();
			const playEnd = new Date();
			currentPlayTime += Math.floor(
				(playEnd.getTime() - (playStart?.getTime() ?? Date.now())) / 1000
			);

			isPlaying = false;
		}
	};

	const seekSong = () => {
		audio.currentTime = time;
		//to avoid it remaining stuck on the element and bugging out
		(document.activeElement as HTMLElement)?.blur();
	};
	const updateRange = () => {
		//to avoid it not updating the time properly
		if (document.activeElement === timeInput) return;
		time = audio.currentTime;
	};

	let forwardTime =  $settings.forwardTime ?? 15;
	let rewindTime = $settings.backwardTime ?? 15;

	// Make a forward button
	const forwardSeconds = () => {
		audio.currentTime += forwardTime;
		time = audio.currentTime;
	};

	const rewindSeconds = () => {
		audio.currentTime -= rewindTime;
		time = audio.currentTime;
	};

	const toggleVolume = () => volumeRange.classList.toggle('hidden');

	const updateVolume = () => (audio.volume = volume);

	const nextSong = async() => {
		updateSongData();
		saveSongData(currentSong);

		//until Autoplay is added
		isPlaying = false;

        playStart = new Date();
        currentSongIndex++;
        currentPlayTime = 0;
        clickedPlay = false;
        currentSongIndex = currentSongIndex % $songsToPlay.length;
        currentSong = await getSong($songsToPlay[currentSongIndex].id);
        if ($songsToPlay.length > 0) {
            biquadIndex = biquadFilters.indexOf($songsToPlay[currentSongIndex].effects.biquad);
            panning = $songsToPlay[currentSongIndex].effects.panning;
            updatePanning();
        }

        generateImage();
    }

	const prevSong = async() => {
		updateSongData();
		saveSongData(currentSong);

		//until Autoplay is added
		isPlaying = false;

        playStart = new Date();
        currentSongIndex--;
        currentPlayTime = 0;
        clickedPlay = false;
        currentSong = await getSong($songsToPlay[currentSongIndex].id);
        if (currentSongIndex < 0) {
            currentSongIndex = $songsToPlay.length - 1;
        }
        if ($songsToPlay.length > 0)
        {
            biquadIndex = biquadFilters.indexOf($songsToPlay[currentSongIndex].effects.biquad);
            panning = $songsToPlay[currentSongIndex].effects.panning;
            updatePanning();
        }

        generateImage();
    }

    const updateSongData = () => {
        //Updating the data in the songsData store
        $songsToPlay[currentSongIndex].effects.biquad = biquadFilters[biquadIndex];
        $songsToPlay[currentSongIndex].effects.panning = panning;
        if (clickedPlay === true) {
            $songsToPlay[currentSongIndex].listens++;
            currentSong.listens++;
        }
        $songsToPlay[currentSongIndex].listenTime += currentPlayTime;
        totalPlayTime += currentPlayTime;

        //Updating the data on the currentSong itself
        currentSong.effects.biquad = biquadFilters[biquadIndex];
        currentSong.effects.panning = panning;
        currentSong.listenTime += currentPlayTime;
    }

	const toggleAddToPlaylist = () => {
		addingToPlaylist = !addingToPlaylist;
		creatingNewPlaylist = false;
	};
	const toggleChangingPlaylist = () => (changingPlaylsit = !changingPlaylsit);
	const toggleCreatingNewPlaylist = () => (creatingNewPlaylist = !creatingNewPlaylist);

	const closeForm = () => {
		addingToPlaylist = false;
		creatingNewPlaylist = false;
		changingPlaylsit = false;
	};

	const updatePanning = () => {
		panner.pan.value = panning;
	};

    const songChosen = async(e: CustomEvent) => {
        const songIndex = e.detail.songIndex as number;
        updateSongData();
        saveSongData(currentSong);

		isPlaying = false;

        playStart = new Date();
        currentSongIndex = songIndex;
        currentPlayTime = 0;
        clickedPlay = false;
        currentSong = await getSong($songsToPlay[currentSongIndex].id);
        if ($songsToPlay.length > 0)
        {
            biquadIndex = biquadFilters.indexOf($songsToPlay[currentSongIndex].effects.biquad);
            panning = $songsToPlay[currentSongIndex].effects.panning;
            updatePanning();
        }

        generateImage();
    }

    const addToPlaylist = (playlistIndex: number) => {
        let foundSong = false;
        for (let i = 0; i < playlists[playlistIndex].songIds.length; i++) {
            if ($songsToPlay[currentSongIndex].id === playlists[playlistIndex].songIds[i]) {
                foundSong = true;
                break;
            }
        }
        if (foundSong) { //remove the song from the playlist
            console.log(`Removed ${$songsToPlay[currentSongIndex].name} from ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds = playlists[playlistIndex].songIds.filter(songId => songId !== $songsToPlay[currentSongIndex].id);
            savePlaylist(playlists[playlistIndex]);
            $songsToPlay = $songsToPlay;
        }
        else { //save the song to the playlist
            console.log(`Added ${$songsToPlay[currentSongIndex].name} to ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds.push($songsToPlay[currentSongIndex].id)
            savePlaylist(playlists[playlistIndex]);
            $songsToPlay = $songsToPlay;
        }
	}

	const createNewPlaylist = async () => {
		if (playlistNameInputValue.length === 0) {
			alert('Please insert a name for the playlist!');
			return;
		}
		const id = await createPlaylist(playlistNameInputValue);
		console.log('Created a new playlist!');
		playlists.push({
			id: id,
			name: playlistNameInputValue,
			songIds: [],
			listenTime: 0
		} satisfies Playlist);
		playlists = playlists;
		creatingNewPlaylist = false;
	};

    const changePlaylist = async(playlistIndex: number) => {
        updateSongData();
        await saveSongData(currentSong);
        playlists[currentPlaylist].listenTime += totalPlayTime;
        savePlaylist(playlists[currentPlaylist]);
        currentPlaylist = playlistIndex;
        currentSongIndex = 0;

		isPlaying = false;

		if (playlists[currentPlaylist].songIds.length === 0) {
			alert("Please add songs to that playlist first!");
			await changePlaylist(0);
		}

        currentSong = await getSong(playlists[currentPlaylist].songIds[0]);

        $songsToPlay = [];
        for (const data of $songsData) {
            for (const id of playlists[currentPlaylist].songIds) {
                if (data.id === id) {
                    $songsToPlay.push(data);
                    break;
                }
            }
        }
        $songsToPlay = $songsToPlay;

        generateImage();
    }

    const deletePlaylistFromDb = async (playlistIndex: number) => {
        await deletePlaylist(playlists[playlistIndex].id);
        playlists.splice(playlistIndex, 1);
        playlists = playlists;
    }

    const generateImage = () => {
        const shape = createAvatar(shapes, {
            seed: Math.random().toString(),
            backgroundType: ["gradientLinear"],
            radius: 15,
        });
        img = shape.toDataUriSync();
    }

    onDestroy(async() => {
        if ($songsToPlay.length === 0) return;
        updateSongData();
        await saveSongData(currentSong);
        playlists[currentPlaylist].listenTime += totalPlayTime;
        await savePlaylist(playlists[currentPlaylist]);
    })
</script>

<main class="grid grid-cols-[5fr,1fr] grid-rows-[1fr,5fr,1fr] w-full h-screen relative">
	<h1
		class="row-span-1 col-start-1 col-end-2 font-bold text-3xl py-3 self-center justify-self-center text-center"
	>
		Media player
	</h1>

	{#if addingToPlaylist || changingPlaylsit}
		<div class="secondary2-bg h-3/4 w-1/2 rounded-2xl flex flex-col p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {#if creatingNewPlaylist}
		        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-center items-center w-70 h-35 border-2 secondary2-bg p-2 rounded-2xl">
			        <label for="playlistName">Playlist name:</label>
			        <input bind:value={playlistNameInputValue} name="playlistName" type="text" class="p-1 rounded-md items-bg outline-none"/>
			        <button on:click={createNewPlaylist} type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-2 rounded-md ml-2 text-white font-semibold">Create</button>
		        </div>
	        {/if}
			<div class="flex flex-row justify-between items-center mb-5 w-full">
				<button on:click={closeForm}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>
				</button>
				{#if addingToPlaylist}
					<button on:click={toggleCreatingNewPlaylist} class="flex flex-grow-0 flex-row items-center justify-start px-4 py-1 gap-2 mr-5 items-bg rounded-lg font-bold">
                        Create new playlist
                    </button>
				{/if}
			</div>

			<div class="w-full h-[70vh] grid grid-cols-4 overflow-y-scroll gap-3 p-2 border-2 rounded-md border-white dark:border-gray-600">
				{#if addingToPlaylist}
					{#each playlists as playlist, index}
						<button on:click={() => addToPlaylist(index)}
							    class="flex items-center justify-start px-4 py-1 gap-2 items-bg rounded-lg font-bold bob">
                            <p class="break-all w-full items-bg">
                                {playlist.name}
                            </p>
                        </button>
					{/each}
				{/if}
                {#if changingPlaylsit}
					{#each playlists as playlist, index}
						<div class="flex flex-grow-0 flex-row divide-x-2 items-center justify-start px-4 py-1 gap-2 items-bg rounded-lg">
							{#if index != 0}
								<button on:click={() => deletePlaylistFromDb(index)}>
                                	<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-7 w-7" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>
                            	</button>
							{/if}
							<button on:click={() => changePlaylist(index)} class="p-2 m-2 font-bold break-all w-10/12 h-full">
                                {playlist.name}
                            </button>
						</div>
					{/each}
			    {/if}
			</div>
		</div>
	{/if}

	<!-- Central panel -->
	<div
		class="flex flex-col justify-between items-center row-start-2 row-end-3 col-start-1 col-end-2 m-4 gap-2"
	>
		<img src={img} alt="Image" class="border-0 w-[400px] h-[400px]" />
		<audio on:timeupdate={updateRange} bind:this={audio} src={url}>Audio</audio>

		<div class="flex flex-col justify-center items-center">
			{#if $songsToPlay[currentSongIndex]?.name !== undefined}
				{#key $songsToPlay[currentSongIndex]}
					<p in:blur class="font-bold text-2xl">
						{$songsToPlay[currentSongIndex]?.name}
					</p>
					<p in:blur class="text-lg">
						by <span class="font-semibold">{$songsToPlay[currentSongIndex]?.artist ?? 'Unknown artist'}</span>
					</p>
				{/key}
			{:else}
				<p class="font-bold text-2xl">No song selected</p>
			{/if}
		</div>

		<div class="flex flex-col w-2/3">
			<label for="time">Time:</label>
			<input
				bind:this={timeInput}
				on:change={seekSong}
				bind:value={time}
				type="range"
				min="0"
				max={audioLength}
				name="time"
				id="time"
				class="w-full h-3 appearance-none outline-none overflow-hidden drop-shadow-sm shadow-gray-700 dark:shadow-rose-200 secondary3-bg rounded-xl
            "
			/>
		</div>

		<!-- Controls -->
		<div
			class="flex flex-row items-center justify-between secondary3-bg rounded-xl w-2/3 h-1/6 px-6"
		>
			<div class="controls-left flex flex-row items-center justify-evenly gap-10">
				<button on:click={prevSong}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M112 64a16 16 0 0116 16v136.43L360.77 77.11a35.13 35.13 0 0135.77-.44c12 6.8 19.46 20 19.46 34.33v290c0 14.37-7.46 27.53-19.46 34.33a35.14 35.14 0 01-35.77-.45L128 295.57V432a16 16 0 01-32 0V80a16 16 0 0116-16z"/></svg>
				</button>
				<button on:click={rewindSeconds}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M30.71 229.47l188.87-113a30.54 30.54 0 0131.09-.39 33.74 33.74 0 0116.76 29.47v79.05l180.72-108.16a30.54 30.54 0 0131.09-.39A33.74 33.74 0 01496 145.52v221A33.73 33.73 0 01479.24 396a30.54 30.54 0 01-31.09-.39L267.43 287.4v79.08A33.73 33.73 0 01250.67 396a30.54 30.54 0 01-31.09-.39l-188.87-113a31.27 31.27 0 010-53z"/></svg>
				</button>
				<button on:click={playSong}>
					{#if isPlaying}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M208 432h-48a16 16 0 01-16-16V96a16 16 0 0116-16h48a16 16 0 0116 16v320a16 16 0 01-16 16zM352 432h-48a16 16 0 01-16-16V96a16 16 0 0116-16h48a16 16 0 0116 16v320a16 16 0 01-16 16z"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><title>Play</title><path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z"/></svg>
					{/if}
				</button>
				<button on:click={forwardSeconds}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M481.29 229.47l-188.87-113a30.54 30.54 0 00-31.09-.39 33.74 33.74 0 00-16.76 29.47v79.05L63.85 116.44a30.54 30.54 0 00-31.09-.39A33.74 33.74 0 0016 145.52v221A33.74 33.74 0 0032.76 396a30.54 30.54 0 0031.09-.39L244.57 287.4v79.08A33.74 33.74 0 00261.33 396a30.54 30.54 0 0031.09-.39l188.87-113a31.27 31.27 0 000-53z"/></svg>
				</button>
				<button on:click={nextSong}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M400 64a16 16 0 00-16 16v136.43L151.23 77.11a35.13 35.13 0 00-35.77-.44C103.46 83.47 96 96.63 96 111v290c0 14.37 7.46 27.53 19.46 34.33a35.14 35.14 0 0035.77-.45L384 295.57V432a16 16 0 0032 0V80a16 16 0 00-16-16z"/></svg>
				</button>

				<!-- Bandaid Fix-->
				<button on:click={toggleVolume} class="flex flex-col items-center justify-center -mr-5">
					{#if volume > 0.65}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z"/><path d="M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z"/><path d="M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z"/></svg>
					{:else if volume > 0.3}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M264 416.19a23.92 23.92 0 01-14.21-4.69l-.66-.51-91.46-75H88a24 24 0 01-24-24V200a24 24 0 0124-24h69.65l91.46-75 .66-.51A24 24 0 01288 119.83v272.34a24 24 0 01-24 24zM352 336a16 16 0 01-14.29-23.18c9.49-18.9 14.3-38 14.3-56.82 0-19.36-4.66-37.92-14.25-56.73a16 16 0 0128.5-14.54C378.2 208.16 384 231.47 384 256c0 23.83-6 47.78-17.7 71.18A16 16 0 01352 336z"/><path d="M400 384a16 16 0 01-13.87-24C405 327.05 416 299.45 416 256c0-44.12-10.94-71.52-29.83-103.95A16 16 0 01413.83 136C434.92 172.16 448 204.88 448 256c0 50.36-13.06 83.24-34.12 120a16 16 0 01-13.88 8z"/></svg>
					{:else if volume > 0}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M296 416.19a23.92 23.92 0 01-14.21-4.69l-.66-.51-91.46-75H120a24 24 0 01-24-24V200a24 24 0 0124-24h69.65l91.46-75 .66-.51A24 24 0 01320 119.83v272.34a24 24 0 01-24 24zM384 336a16 16 0 01-14.29-23.18c9.49-18.9 14.3-38 14.3-56.82 0-19.36-4.66-37.92-14.25-56.73a16 16 0 0128.5-14.54C410.2 208.16 416 231.47 416 256c0 23.83-6 47.78-17.7 71.18A16 16 0 01384 336z"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M344 416a23.92 23.92 0 01-14.21-4.69c-.23-.16-.44-.33-.66-.51l-91.46-74.9H168a24 24 0 01-24-24V200.07a24 24 0 0124-24h69.65l91.46-74.9c.22-.18.43-.35.66-.51A24 24 0 01368 120v272a24 24 0 01-24 24z"/></svg>
					{/if}
				</button>
				<div bind:this={volumeRange} class="flex flex-col hidden overflow-hidden">
					<input
						bind:value={volume}
						on:input={updateVolume}
						type="range"
						min="0"
						max="1"
						step="0.1"
						name="volume"
						id="volume"
						class="h-2 w-20 rounded-xl items-bg"
					/>
				</div>
			</div>

			<div class="controls-right flex flex-row items-center gap-10">
				<button on:click={toggleAddToPlaylist}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path d="M408 112H184a72 72 0 00-72 72v224a72 72 0 0072 72h224a72 72 0 0072-72V184a72 72 0 00-72-72zm-32.45 200H312v63.55c0 8.61-6.62 16-15.23 16.43A16 16 0 01280 376v-64h-63.55c-8.61 0-16-6.62-16.43-15.23A16 16 0 01216 280h64v-63.55c0-8.61 6.62-16 15.23-16.43A16 16 0 01312 216v64h64a16 16 0 0116 16.77c-.42 8.61-7.84 15.23-16.45 15.23z"/><path d="M395.88 80A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z"/></svg>
				</button>
				<button on:click={toggleChangingPlaylist}>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-10 w-10" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M160 144h288M160 256h288M160 368h288"/><circle cx="80" cy="144" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="80" cy="256" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="80" cy="368" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Right panel -->
	<div
		class="row-start-2 row-end-3 col-start-2 col-end-3 secondary2-bg py-4 px-2 rounded-tl-3xl rounded-bl-3xl"
	>
		<div class="flex justify-center items-center p-2 text-xl font-semibold break-all">
			{playlists[currentPlaylist]?.name ?? 'No Playlist'}
		</div>
		<div class="overflow-y-scroll h-[70vh]">
			{#each $songsToPlay as song, index}
				<Song
					on:playsong={songChosen}
					songArtist={song.artist ?? 'Nobody'}
					songName={song.name}
					songIndex={index}
					songId={song.id}
				/>
			{/each}
		</div>
	</div>

	<!-- Bottom panel -->
	<div
		class="flex flex-row gap-5 row-start-3 row-end-4 col-start-1 col-end-2 secondary3-bg rounded-lg px-4 py-1 m-4 w-2/3 h-2/3 self-center justify-self-center justify-evenly"
	>
		<div class="flex flex-col">
			<label for="stereo">Panning:</label>
			<input
				bind:value={panning}
				on:input={updatePanning}
				type="range"
				min="-1"
				max="1"
				step="0.1"
				name="stereo"
				class="h-3 appearance-none items-bg outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200"
			/>
		</div>

		<div class="flex flex-col">
			<label for="biquad">Biquad: {biquadFilters[biquadIndex]}</label>
			<input
				bind:value={biquadIndex}
				type="range"
				min="0"
				max={biquadFilters.length - 1}
				step="1"
				name="Biquad"
				class="h-3 appearance-none items-bg outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200"
			/>
		</div>
	</div>
</main>

<style>
	#time::-webkit-slider-thumb {
		outline-color: transparent;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 50vw var(--time-range-colour);
		background-color: var(--secondary3-colour);
	}

	#time::-moz-range-thumb {
		outline-color: transparent;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 50vw var(--time-range-colour);
		background-color: var(--secondary3-colour);
	}

	#time::-ms-thumb {
		outline-color: transparent;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 49vw var(--time-range-colour);
		background-color: var(--secondary3-colour);
	}

	input[type='range']::-webkit-slider-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--time-range-colour);
		background-color: var(--secondary-colour);
	}

	input[type='range']::-moz-range-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--time-range-colour);
		background-color: var(--secondary-colour);
	}

	input[type='range']::-ms-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--time-range-colour);
		background-color: var(--secondary-colour);
	}
</style>

<script lang="ts">
    import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { createPlaylist, deletePlaylist, getSong, getSongsFromPlaylist, savePlaylist, saveSongData } from "$lib/indexedDB";
	import type { Playlist, Song as Song_T } from "$lib/interfaces";
	import { onDestroy, onMount } from "svelte";
	import { songsData, songsToPlay } from "$lib/stores";
    import Song from "./Song.svelte";
    import { createAvatar } from "@dicebear/core"
    import * as shapes from "@dicebear/shapes"

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

    if ($songsData.length > 0) {
        biquadIndex = biquadFilters.indexOf($songsData[currentSongIndex].effects.biquad);
        panning = $songsData[currentSongIndex].effects.panning;
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

	let forwardTime = 15;
	let rewindTime = 15;

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
        currentSongIndex = currentSongIndex % $songsData.length;
        currentSong = await getSong($songsData[currentSongIndex].id);
        if ($songsData.length > 0) {
            biquadIndex = biquadFilters.indexOf($songsData[currentSongIndex].effects.biquad);
            panning = $songsData[currentSongIndex].effects.panning;
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
        currentSong = await getSong($songsData[currentSongIndex].id);
        if (currentSongIndex < 0) {
            currentSongIndex = $songsData.length - 1;
        }
        if ($songsData.length > 0)
        {
            biquadIndex = biquadFilters.indexOf($songsData[currentSongIndex].effects.biquad);
            panning = $songsData[currentSongIndex].effects.panning;
            updatePanning();
        }

        generateImage();
    }

    const updateSongData = () => {
        $songsData[currentSongIndex].effects.biquad = biquadFilters[biquadIndex];
        $songsData[currentSongIndex].effects.panning = panning;
        if (clickedPlay === true) $songsData[currentSongIndex].listens++;
        $songsData[currentSongIndex].listenTime += currentPlayTime;
        totalPlayTime += currentPlayTime;
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

        playStart = new Date();
        currentSongIndex = songIndex;
        currentPlayTime = 0;
        clickedPlay = false;
        currentSong = await getSong($songsData[currentSongIndex].id);
        if ($songsData.length > 0)
        {
            biquadIndex = biquadFilters.indexOf($songsData[currentSongIndex].effects.biquad);
            panning = $songsData[currentSongIndex].effects.panning;
            updatePanning();
        }

        generateImage();
    }

    const addToPlaylist = (playlistIndex: number) => {
        let foundSong = false;
        for (let i = 0; i < playlists[playlistIndex].songIds.length; i++) {
            if ($songsData[currentSongIndex].id === playlists[playlistIndex].songIds[i]) {
                foundSong = true;
                break;
            }
        }

        if (foundSong) { //remove the song from the playlist
            console.log(`Removed ${$songsData[currentSongIndex].name} from ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds = playlists[playlistIndex].songIds.filter(songId => songId !== $songsData[currentSongIndex].id);
            savePlaylist(playlists[playlistIndex]);
            $songsData = $songsData;
        }
        else { //save the song to the playlist
            console.log(`Added ${$songsData[currentSongIndex].name} to ${playlists[playlistIndex].name}`)
            playlists[playlistIndex].songIds.push($songsData[currentSongIndex].id)
            savePlaylist(playlists[playlistIndex]);
            $songsData = $songsData;
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
        $songsData = await getSongsFromPlaylist(playlists[playlistIndex]);
        currentPlaylist = playlistIndex;
        currentSongIndex = 0;
        currentSong = await getSong($songsData[currentSongIndex].id);

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
        if ($songsData.length === 0) return;
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
		<div class="bg-rose-200 dark:bg-gray-700 h-3/4 w-1/2 rounded-2xl flex flex-col p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {#if creatingNewPlaylist}
		        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-center items-center w-70 h-35 border-2 border-gray-500 bg-rose-200 p-2 rounded-2xl">
			        <label for="playlistName">Playlist name:</label>
			        <input bind:value={playlistNameInputValue} name="playlistName" type="text" class="p-1 rounded-md dark:bg-gray-600 dark:text-gray-200 outline-none"/>
			        <button on:click={createNewPlaylist} type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-2 rounded-md ml-2 text-white font-semibold">Create</button>
		        </div>
	        {/if}
			<div class="flex flex-row justify-between items-center mb-5 w-full">
				<button on:click={closeForm}>
					<img src="Icons/close-circle.svg" alt=" X " class="w-10 h-10" />
				</button>
				{#if addingToPlaylist}
					<button on:click={toggleCreatingNewPlaylist} class="flex flex-grow-0 flex-row items-center justify-start px-4 py-1 gap-2 mr-5 bg-white dark:bg-gray-600 dark:text-gray-200 rounded-lg font-bold">
                        Create new playlist
                    </button>
				{/if}
			</div>

			<div class="w-full h-[70vh] grid grid-cols-4 overflow-y-scroll gap-3 p-2 border-2 rounded-md border-white dark:border-gray-600">
				{#if addingToPlaylist}
					{#each playlists as playlist, index}
						<button on:click={() => addToPlaylist(index)}
							    class="flex items-center justify-start px-4 py-1 gap-2 bg-white dark:bg-gray-600 dark:text-gray-200 rounded-lg font-bold">
                            <p class="break-all w-full">
                                {playlist.name}
                            </p>
                        </button>
					{/each}
				{/if}
                {#if changingPlaylsit}
					{#each playlists as playlist, index}
						<div class="flex flex-grow-0 flex-row divide-x-2 items-center justify-start px-4 py-1 gap-2 bg-white dark:bg-gray-600 dark:text-gray-200 rounded-lg">
							<button on:click={() => deletePlaylistFromDb(index)}>
                                <img src="Icons/close-circle.svg" alt=" X " class="w-7 h-7">
                            </button>
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
		<img src={img} alt="Placeholder" class="border-0 w-[400px] h-[400px]" />
		<audio on:timeupdate={updateRange} bind:this={audio} src={url}>Audio</audio>

		<div class="flex flex-col justify-center items-center">
			{#if songsData[currentSongIndex]?.name !== undefined}
				<p class="font-bold text-2xl">
					{$songsData[currentSongIndex]?.name}
				</p>
				<p class="text-lg">
					by <span class="font-semibold">{$songsData[currentSongIndex]?.artist ?? 'Unknown artist'}</span>
				</p>
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
				class="w-full h-3 appearance-none outline-none overflow-hidden drop-shadow-sm shadow-gray-700 dark:shadow-rose-200 dark:bg-gray-700 bg-rose-200 rounded-xl
            "
			/>
		</div>

		<!-- Controls -->
		<div
			class="flex flex-row items-center justify-between bg-rose-200 dark:bg-gray-700 rounded-xl w-2/3 h-1/6 px-6"
		>
			<div class="controls-left flex flex-row items-center justify-evenly gap-10">
				<button on:click={prevSong}>
					<img src="Icons/previous.svg" alt="Previous" class="w-10 h-10" />
				</button>
				<button on:click={rewindSeconds}>
					<img src="Icons/play-back.svg" alt="Rewind" class="w-10 h-10" />
				</button>
				<button on:click={playSong}>
					{#if isPlaying}
						<img src="Icons/pause.svg" alt="Play/Pause" class="w-10 h-10" />
					{:else}
						<img src="Icons/play.svg" alt="Play/Pause" class="w-10 h-10" />
					{/if}
				</button>
				<button on:click={forwardSeconds}>
					<img src="Icons/play-forward.svg" alt="Previous" class="w-10 h-10" />
				</button>
				<button on:click={nextSong}>
					<img src="Icons/next.svg" alt="Next" class="w-10 h-10" />
				</button>

				<!-- Bandaid Fix-->
				<button on:click={toggleVolume} class="flex flex-col items-center justify-center -mr-5">
					{#if volume > 0.65}
						<img src="Icons/volume-high.svg" alt="Volume" class="w-10 h-10" />
					{:else if volume > 0.3}
						<img src="Icons/volume-medium.svg" alt="Volume" class="w-10 h-10" />
					{:else if volume > 0}
						<img src="Icons/volume-low.svg" alt="Volume" class="w-10 h-10" />
					{:else}
						<img src="Icons/volume-off.svg" alt="Volume" class="w-10 h-10" />
					{/if}
				</button>
				<div bind:this={volumeRange} class="flex flex-col hidden overflow-hidden">
					<input
						on:change={updateVolume}
						bind:value={volume}
						type="range"
						min="0"
						max="1"
						step="0.1"
						name="volume"
						id="volume"
						class="h-2 w-20 rounded-xl"
					/>
				</div>
			</div>

			<div class="controls-right flex flex-row items-center gap-10">
				<button on:click={toggleAddToPlaylist}>
					<img src="Icons/add-playlist.svg" alt="Add to Playlist" class="w-10 h-10" />
				</button>
				<button on:click={toggleChangingPlaylist}>
					<img src="Icons/list.svg" alt="Playlists" class="w-10 h-10" />
				</button>
			</div>
		</div>
	</div>

	<!-- Right panel -->
	<div
		class="row-start-2 row-end-3 col-start-2 col-end-3 bg-rose-200 dark:bg-gray-700 py-4 px-2 rounded-tl-3xl rounded-bl-3xl"
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
		class="flex flex-row gap-5 row-start-3 row-end-4 col-start-1 col-end-2 bg-rose-200 dark:bg-gray-700 rounded-lg px-4 py-1 m-4 w-2/3 h-2/3 self-center justify-self-center justify-evenly"
	>
		<div class="flex flex-col">
			<label for="stereo">Panning:</label>
			<input
				on:change={updatePanning}
				bind:value={panning}
				type="range"
				min="-1"
				max="1"
				step="0.1"
				name="stereo"
				class="h-3 appearance-none outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200"
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
				class="h-3 appearance-none outline-none overflow-hidden rounded-xl drop-shadow-sm shadow-gray-700 dark:shadow-rose-200"
			/>
		</div>
	</div>
</main>

<style>
	#time::-webkit-slider-thumb {
		outline: none;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 50vw var(--time-range-colour);
		background-color: var(--time-range-colour);
	}

	#time::-moz-range-thumb {
		outline: none;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 50vw var(--time-range-colour);
		background-color: var(--time-range-colour);
	}

	#time::-ms-thumb {
		outline: none;
		cursor: pointer;
		border: 0;
		height: 12px;
		width: 0px;

		box-shadow: -50vw 0 0 49vw var(--time-range-colour);
		background-color: var(--time-range-colour);
	}

	input[type='range']::-webkit-slider-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--modifier-range-colour);
		background-color: #777777;
	}

	input[type='range']::-moz-range-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--modifier-range-colour);
		background-color: #777777;
	}

	input[type='range']::-ms-thumb {
		height: 16px;
		width: 16px;
		border: 0;

		box-shadow: -192px 0 0 180px var(--modifier-range-colour);
		background-color: #777777;
	}
</style>

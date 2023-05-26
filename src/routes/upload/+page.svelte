<script lang="ts">
    import { deleteSong, getPlaylistWithId, savePlaylist, saveSong } from "$lib/indexedDB";
	import { songsData } from "$lib/stores";
	import { fade } from "svelte/transition";

    let artistName: string;
    let songName: string;
    let fileInput: HTMLInputElement;
    
    const uploadFile = () => {
        if (!fileInput.files) return;
        if (!songName) return;

        for (const file of fileInput.files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            
            reader.onloadend = async() => {
                const buffer = reader.result as ArrayBuffer;
                const songId = await saveSong(buffer, songName, artistName);
                const defaultPlaylist = await getPlaylistWithId(1);
                defaultPlaylist.songIds.push(songId as number);
                await savePlaylist(defaultPlaylist);
                $songsData.push({
                    id: songId as number,
                    listenTime: 0,
                    listens: 0,
                    name: songName,
                    artist: artistName,
                    effects: {
                        biquad: "allpass",
                        panning: 0,
                    }
                })
                $songsData = $songsData;
            }
        }
        
    }

    const removeSong = async (id: number, songIndex: number) => {
        await deleteSong(id);
        $songsData.splice(songIndex, 1);
        $songsData = $songsData;
        console.log("Removed the song successfully!");
        //TODO: wrap in a try-catch block
    }

</script>


<main class="grid grid-cols-3 place-items-center h-full min-h-screen w-full overflow-scroll">
    
    <div class="col-span-1 w-1/2 flex flex-col items-center justify-evenly gap-5 p-5 rounded-lg secondary2-bg">
        <h1 class="p-4 font-extrabold text-xl">Add a song</h1>
        <div class="flex flex-col">
            <label for="audio" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-4 rounded-md text-white text-xl flex flex-row gap-4 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon h-8 w-8" viewBox="0 0 512 512" fill="#ffffff"><path d="M473.66 210c-14-10.38-31.2-18-49.36-22.11a16.11 16.11 0 01-12.19-12.22c-7.8-34.75-24.59-64.55-49.27-87.13C334.15 62.25 296.21 47.79 256 47.79c-35.35 0-68 11.08-94.37 32.05a150.07 150.07 0 00-42.06 53 16 16 0 01-11.31 8.87c-26.75 5.4-50.9 16.87-69.34 33.12C13.46 197.33 0 227.24 0 261.39c0 34.52 14.49 66 40.79 88.76 25.12 21.69 58.94 33.64 95.21 33.64h104V230.42l-36.69 36.69a16 16 0 01-23.16-.56c-5.8-6.37-5.24-16.3.85-22.39l63.69-63.68a16 16 0 0122.62 0L331 244.14c6.28 6.29 6.64 16.6.39 22.91a16 16 0 01-22.68.06L272 230.42v153.37h124c31.34 0 59.91-8.8 80.45-24.77 23.26-18.1 35.55-44 35.55-74.83 0-29.94-13.26-55.61-38.34-74.19zM240 448.21a16 16 0 1032 0v-64.42h-32z"/></svg>
                <span class="font-bold">Upload Audio</span>
            </label>
            <input bind:this={fileInput} type="file" accept="audio/*" name="audio" id="audio" class="hidden">
        </div>
        <div class="flex flex-col">
            <label for="artist">Artist name:</label>
            <input bind:value={artistName} type="text" name="artist" class="p-1 rounded-md items-bg mb-3 outline-none">
        </div>
        
        <div class="flex flex-col">
            <label for="name">Song name:</label>
            <input bind:value={songName} type="text" name="name" class="p-1 rounded-md items-bg mb-3 outline-none">
        </div>
        <button on:click={uploadFile} type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-4 rounded-md ml-2 text-white font-semibold">Submit</button>
    </div>

    <div class="col-span-2 w-1/2 h-2/3 flex flex-col justify-center items-center secondary2-bg  rounded-lg p-5">
        <p class="font-extrabold text-xl col-span-3 flex justify-center items-center mb-2">Your Library</p>
        <div class="w-full h-[70vh] grid grid-cols-3 overflow-y-auto gap-3 p-2 border-2 rounded-md border-white dark:border-gray-600">
            {#each $songsData as song, songIndex}
                <div transition:fade|local class="flex flex-grow-0 flex-row items-center justify-start px-4 py-1 gap-2 items-bg rounded-lg">
                    <button on:click={() => removeSong(song.id, songIndex)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill w-5 h-5" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>
                    </button>
                
                    <p class="break-before-auto break-words w-10/12">
                        <span class="font-bold"> {song.name} </span> by <span class="font-semibold italic"> {song.artist} </span>
                    </p>
                </div>
            {/each}
        </div>
        
    </div>
</main>
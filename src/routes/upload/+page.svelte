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


<main class="grid grid-cols-3 place-items-center h-screen w-full">
    
    <div class="col-span-1 w-1/2 flex flex-col items-center justify-evenly gap-5 p-5 rounded-lg dark:bg-gray-800 bg-rose-100 dark:text-gray-100">
        <h1 class="p-4 font-extrabold text-xl">Add a song</h1>
        <div class="flex flex-col">
            <label for="audio" class="bg-sky-400 hover:bg-sky-500 active:bg-sky-600 p-4 rounded-md text-white text-xl flex flex-row gap-4 items-center">
                <img src="Icons/cloud-upload.svg" alt="" class="w-8 h-8">
                <span class="font-bold">Upload Audio</span>
            </label>
            <input bind:this={fileInput} type="file" name="audio" id="audio" class="hidden">
        </div>
        <div class="flex flex-col">
            <label for="artist">Artist name:</label>
            <input bind:value={artistName} type="text" name="artist" class="p-1 rounded-md dark:bg-gray-600 dark:text-gray-200 mb-3 outline-none">
        </div>
        
        <div class="flex flex-col">
            <label for="name">Song name:</label>
            <input bind:value={songName} type="text" name="name" class="p-1 rounded-md dark:bg-gray-600 dark:text-gray-200 mb-3 outline-none">
        </div>
        <button on:click={uploadFile} type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-4 rounded-md ml-2 text-white font-semibold">Submit</button>
    </div>

    <div class="col-span-2 w-1/2 h-2/3 flex flex-col justify-center items-center dark:bg-gray-800 bg-rose-100 dark:text-gray-100 rounded-lg p-5">
        <p class="font-extrabold text-xl col-span-3 flex justify-center items-center mb-2">Your Library</p>
        <div class="w-full h-[70vh] grid grid-cols-3 overflow-y-scroll gap-3 p-2 border-2 rounded-md border-white dark:border-gray-600">
            {#each $songsData as song, songIndex}
                <div transition:fade|local class="flex flex-grow-0 flex-row items-center justify-start px-4 py-1 gap-2 bg-white dark:bg-gray-600 dark:text-gray-200 rounded-lg">
                    <button on:click={() => removeSong(song.id, songIndex)}>
                        <img src="Icons/close-circle.svg" alt=" X " class="w-5 h-5">
                    </button>
                
                    <p class="break-all w-10/12">
                        <span class="font-bold"> {song.name} </span> by <span class="font-semibold italic"> {song.artist} </span>
                    </p>
                </div>
            {/each}
        </div>
        
    </div>
</main>
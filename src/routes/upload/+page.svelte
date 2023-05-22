<script lang="ts">
    import { deleteSong, getPlaylistWithId, savePlaylist, saveSong } from "$lib/indexedDB";
	import { songsData } from "$lib/stores";

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


<main class="grid grid-cols-2 w-full h-[100vh]">
    
    <div class="col-span-1 flex flex-col items-center justify-evenly h-64 p-5">
        <h1 class="p-4">Song uploading</h1>
        <div>
            <label for="audio">audio file:</label>
            <input bind:this={fileInput} type="file" name="audio">
        </div>
        <div>
            <label for="artist">artist name:</label>
            <input bind:value={artistName} type="text" name="artist" class="bg-rose-200">
        </div>
        
        <div>
            <label for="name">song name:</label>
            <input bind:value={songName} type="text" name="name" class="bg-rose-200">
        </div>
        <button on:click={uploadFile} type="submit">Submit</button>
    </div>

    <div class="col-start-2 col-end-3 flex flex-col items-center justify-start m-5">
        {#each $songsData as song, songIndex}
            <div class="flex flex-row p-1">
                <button on:click={() => removeSong(song.id, songIndex)}>X</button>
                <p>{song.name} by {song.artist}</p>
            </div>
        {/each}
    </div>
</main>
<script lang="ts">
    import type { PageData } from "./$types";
    import { deleteSong, getPlaylistWithId, savePlaylist, saveSong } from "$lib/indexedDB";

    export let data: PageData;
    let songs = data.post.songs;

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
                songs.push({
                    audio: buffer,
                    id: songId as number,
                    likes: 0,
                    listens: 0,
                    name: songName,
                    artist: artistName,
                    effects: {
                        biquad: "allpass",
                        compressor: false,
                        panning: 0,
                    }
                })
                songs = songs;
            }
        }
        
    }

    const removeSong = async (id: number, songIndex: number) => {
        await deleteSong(id);
        songs.splice(songIndex, 1);
        songs = songs;
        console.log("Removed the song successfully!");
        //TODO: wrap in a try-catch block
    }

</script>


<main class="flex flex-col justify-evenly h-64 p-5">
    <h1>helo upload here pls</h1>

    <div>
        <label for="audio">audio file:</label>
        <input bind:this={fileInput} on:change={uploadFile} type="file" name="audio">
    </div>

    <div>
        <label for="artist">artist name:</label>
        <input bind:value={artistName} type="text" name="artist" class="bg-rose-200">
    </div>
    
    <div>
        <label for="name">song name:</label>
        <input bind:value={songName} type="text" name="name" class="bg-rose-200">
    </div>

    <div class="flex flex-col justify-between m-5">
        {#each songs as song, songIndex}
            <div class="flex flex-row">
                <button on:click={() => removeSong(song.id, songIndex)}>X</button>
                <p>{song.name} by {song.artist}</p>
            </div>
        {/each}
    </div>
</main>
<script lang="ts">
    import { saveSongBuffer } from "$lib/indexedDB";

    let artistName: string;
    let songName: string;
    let fileInput: HTMLInputElement;
    
    const uploadFile = () => {
        if (!fileInput.files) return;
        if (!songName) return;

        for (const file of fileInput.files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            
            reader.onloadend = () => {
                const buffer = reader.result as ArrayBuffer;
                saveSongBuffer(buffer, songName, artistName);
            }
        }
        
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
</main>
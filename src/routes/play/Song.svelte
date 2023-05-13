<script lang="ts">
	import { createEventDispatcher } from "svelte";

    export let songName: string;
    export let songArtist: string;
    export let songId: number;
    export let songIndex: number;

    const dispatch = createEventDispatcher();

    const onClick = () => {
        dispatch("playsong", {
            songId, songIndex
        });
    }
</script>

<main class="flex flex-col bg-slate-400 m-2 p-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <button on:click={onClick} >{songName} by {songArtist}</button>
</main>
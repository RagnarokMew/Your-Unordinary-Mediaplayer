<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

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

<main in:fade class="flex flex-col items-bg m-2 p-1 rounded-lg">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <button on:click={onClick} class="break-all">
        <span class="font-bold"> {songName} </span> by <span class="font-semibold italic"> {songArtist} </span>
    </button>
</main>
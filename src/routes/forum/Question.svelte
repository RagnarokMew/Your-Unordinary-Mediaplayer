<script lang="ts">

    /**
        * TODO: Replace <img> with svg
    */

    export let question = "Lorem ipsum dolor sit amet.";
    export let details = "Lorem ipsum dolor sit amet consectetur adipisicing elit. \
                          Dolores dicta eius tempore odit facilis facere eaque molestias enim,\
                          laboriosam excepturi culpa reiciendis, incidunt officiis, ut eveniet.\
                          Ratione odit recusandae minus!"
    let detailsVisible = false;

    const onClick = () => {
        detailsVisible = !detailsVisible;
    }

</script>

<main class="flex flex-col flex-wrap border-2 rounded-md shadow-md w-4/5 m-3 border-stone-400 dark:border-stone-500 secondary-bg">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="border-black flex h-20">
        <button on:click={onClick} class="w-20 p-2 border-r-2 border-stone-400 dark:border-stone-500 flex justify-center items-center">
            {#if detailsVisible}
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-12 w-12" viewBox="0 0 512 512"><title>Close</title><path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"/></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon fill h-12 2-12" viewBox="0 0 512 512"><title>Open</title><path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"/></svg>
            {/if}
        </button>
        <div class="flex-grow p-0 ml-2 mr-2 self-center text-2xl font-semibold">
            <span class="font-extrabold text-3xl italic">Q:</span> {question}
        </div>
    </div>
    {#if detailsVisible && details != ''}
        <p class="text-clip border-t-2 border-stone-400 dark:border-stone-500 p-5 font-medium italic text-base">{details}</p>
    {/if}
</main>

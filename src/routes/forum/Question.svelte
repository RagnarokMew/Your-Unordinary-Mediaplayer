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

<main class="flex flex-col flex-wrap border-2 rounded-md shadow-md w-4/5 m-3 border-stone-400 dark:border-stone-500 bg-gray-200 dark:bg-gray-600">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="border-black flex h-20">
        <button on:click={onClick} class="w-20 p-2 border-r-2 border-stone-400 dark:border-stone-500 flex justify-center items-center">
            {#if detailsVisible}
                <img src="/Icons/caret-up.svg" alt="Show Less" class="w-12 h-12">
            {:else}
                <img src="/Icons/caret-down.svg" alt="Show More" class="w-12 h-12">
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

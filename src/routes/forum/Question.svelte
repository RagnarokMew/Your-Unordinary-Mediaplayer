<script lang="ts">
    
    //TODO: the styling

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

<main class="flex flex-col flex-wrap border-2 w-96 m-3 border-black">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="w-96 border-black">
        <button on:click={onClick} class="p-2 border-r-2 border-black">
            V
        </button>
        <div class="inline-block p-0 ml-2 mr-2 self-center">
            Q: {question}
        </div>
    </div>
    {#if detailsVisible}
        <p class="text-clip border-t-2 border-black">{details}</p>
    {/if}
</main>

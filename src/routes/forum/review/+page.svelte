<script lang="ts">
    let ratingValue = 10;

    /**
     * TODO: Replace Input type range with custom component
    */
</script>

<main class="flex flex-col justify-evenly items-center w-full h-screen bg-stone-100 dark:bg-gray-800/80 px-12">
    <h1 class="font-bold text-4xl mb-7">Leave a review</h1>
    <div class="card w-3/5 h-2/3 p-10 rounded-3xl flex flex-col bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-800/50 shadow shadow-gray-600/50">
        <h1 class="font-bold text-2xl self-center">Submit Question Form</h1>
        <form method="POST" action="/forum?/review" class="flex flex-col self-center w-4/5">
            <div class="flex flex-col m-10">
                <label for="rating" class="text-xl font-semibold mb-4">Rating: {ratingValue}</label>
                <!--Replace range with custom component-->
                <input name="rating" id="rating" type="range" min="1" max="10" bind:value={ratingValue} class="max-w-xs mb-8"/>
                <label for="review" class="text-xl font-semibold mb-4">Review:</label>
                <textarea name="review" id="review" rows="10" class="rounded-lg px-2 py-1 max-w-3xl shadow-sm border-2 border-gray-400/50 dark:bg-gray-600 dark:border-gray-600/50 dark:shadow-none dark:text-gray-200 outline-none"></textarea>
            </div>
            <button type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 rounded-md ml-2 text-lg px-5 py-3 text-white font-semibold self-center">Submit</button>
        </form>
    </div>
    <a href="/forum" class="text-2xl font-extrabold">Back</a>
</main>
<!--
<main class="flex flex-col justify-between p-10 w-full h-full">
    <h1 class="font-bold text-xl self-center">Leave some feedback!</h1>
    <form method="POST" action="/forum?/review" class="flex flex-col">
        <div class="flex flex-col">
            <label for="review">Review:</label>
            <input name="review" type="text" class="max-w-3xl"/>
        </div>
        <div class="flex flex-col">
            <label for="rating" class="">Rating: {ratingValue}</label>
            <input name="rating" type="range" min="1" max="10" bind:value={ratingValue} class="max-w-xs"/>
        </div>
        <button type="submit" class="font-bold self-center">Submit</button>
    </form>
    <a href="/forum">Back</a>
</main>-->
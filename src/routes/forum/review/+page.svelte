<script lang="ts">
    let ratingValue = 10;
</script>

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
</main>
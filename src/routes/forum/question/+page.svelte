<script lang="ts">

</script>

<main class="flex flex-col justify-between p-10 w-full h-full">
    <h1 class="font-bold text-xl self-center">Ask any questions you have!</h1>
    <form method="POST" action="/forum?/question" class="flex flex-col">
        <div class="flex flex-col">
            <label for="question">Question:</label>
            <input name="question" type="text" class="max-w-3xl"/>
        <div class="flex flex-col">
        <button type="submit" class="font-bold self-center">Submit</button>
    </form>
    <a href="/forum">Back</a>
</main>
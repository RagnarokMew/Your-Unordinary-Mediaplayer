<script lang="ts">

</script>

<main class="flex flex-col justify-evenly items-center w-full h-screen bg-stone-100 dark:bg-gray-800/80 px-12">
    <h1 class="font-bold text-4xl mb-7">Ask any questions you have!</h1>
    <div class="card w-3/5 h-2/3 p-10 rounded-3xl flex flex-col bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-800/50 shadow shadow-gray-600/50">
        <h1 class="font-bold text-2xl self-center">Submit Question Form</h1>
        <form method="POST" action="/forum?/question" class="flex flex-col self-center w-4/5">
            <div class="flex flex-col m-10">
                <label for="question" class="text-xl font-semibold mb-4">Question:</label>
                <input name="question" type="text" class="rounded-lg px-2 py-1 mb-8 max-w-3xl shadow-sm border-2 border-gray-400/50 dark:bg-gray-600 dark:border-gray-600/50  dark:text-gray-200 outline-none"/>
                <label for="details" class="text-xl font-semibold mb-4">Details:</label>
                <textarea name="details" id="details" rows="10" class="rounded-lg px-2 py-1 max-w-3xl shadow-sm border-2 border-gray-400/50 dark:bg-gray-600 dark:border-gray-600/50 dark:shadow-none dark:text-gray-200 outline-none"></textarea>
            </div>
            <button type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 rounded-md ml-2 text-lg px-5 py-3 text-white font-semibold self-center">Submit</button>
        </form>
    </div>
    <a href="/forum" class="text-2xl font-extrabold">Back</a>
</main>
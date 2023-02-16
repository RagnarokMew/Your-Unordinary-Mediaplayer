<script>
    import "../app.css";

    //Form code go here
</script>

<footer class="dark:bg-gray-800 bg-rose-100 dark:text-gray-100 text-black flex gap-28 justify-around items-center px-10 py-3 w-full">
    <div class="flex flex-col gap-3">
        <a href="https://github.com/RagnarokMew/Your-Unordinary-Mediaplayer" target="_blank" rel="noreferrer" class="text-2xl font-extrabold">Your Unordinary Repository</a>
        <div class="flex gap-2">
            <h2 class="text-xl font-bold">Made by:</h2>
            <div class="flex flex-col gap-1 text-xl dark:text-cyan-200 text-stone-900 font-semibold">
                RagnarokMew
                <span class="text-sm w-10 h-10">
                    <a href="https://github.com/RagnarokMew" target="_blank" rel="noreferrer">
                        <img src="src/Components/github_logo.svg" alt="[GitHub]">
                    </a>
                </span>
                Ropler6
                <span class="text-sm w-10 h-10">
                    <a href="https://github.com/Ropler6" target="_blank" rel="noreferrer">
                        <img src="src/Components/github_logo.svg" alt="[GitHub]">
                    </a>
                </span>
            </div>
        </div>
    </div>
    <p class="text-2xl font-semibold">Copyright Statement</p>
    <div class="flex flex-col gap-1 text-lg">
        <div class="font-bold">
            Made with: [Icons]
        </div>
        <p class="font-bold">Contact us: [email]</p>
        <div>
           <p class="font-extrabold">Sign up for our newsletter:</p>
            <form class="mt-2">
                <input type="email" class="p-1 rounded-md dark:bg-gray-600 dark:text-gray-200 mb-3 outline-none">
                <input type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-2 rounded-md ml-2 text-white font-semibold">
            </form>
        </div>
    </div>
</footer>

<style>
    p
    {
        display: flex;
        align-items: center;
    }
</style>
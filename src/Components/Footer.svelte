<script>
    import "../app.css";

    //Form code go here
</script>

<footer class="dark:bg-gray-800 bg-rose-100 dark:text-gray-100 text-black flex gap-28 justify-center align-middle p-5">
    <div class="flex flex-col gap-3">
        <a href="#" class="text-2xl">Your Unordinary Repository</a>
        <div class="flex gap-2">
            <h2 class="text-xl">Made by:</h2>
            <div class="flex flex-col gap-1 text-xl dark:text-cyan-200 text-stone-900">
                <a href="https://github.com/RagnarokMew" target="_blank">[icon] RagnarokMew</a>
                <a href="https://github.com/Ropler6" target="_blank">[icon] Ropley6</a>
            </div>
        </div>
    </div>
    <p class="text-2xl">Copyright Statement</p>
    <div class="flex flex-col gap-1 text-lg">
        <div>
            Made with: [Icons]
        </div>
        <p>Contact us: [email]</p>
        <div>
            Sign up for our newsletter:
            <form class="mt-2">
                <input type="email" class="p-1 rounded dark:bg-gray-600 dark:text-gray-200 mb-3 outline-none">
                <input type="submit" class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 py-1 px-2 rounded ml-2 text-white">
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
    footer
    {
        width: 100%;
    }
</style>
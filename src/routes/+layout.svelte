<script>
	import { onMount } from "svelte";
    import "../app.css";

    onMount(async ()=>{

        //Primitive Theme Toggler
        const toggleTheme = await document.querySelector(".toggle-dark");
        toggleTheme.addEventListener('click',()=>{
            document.documentElement.classList.toggle('dark');
        });
    });

</script>

<main class="dark:bg-black dark:text-white">
    <nav class="dark:bg-gray-900 bg-rose-200 shadow-sm shadow-rose-200/50 dark:shadow-gray-900/50 sticky top-0 left-0 h-screen p-7 font-extrabold gap-2">
        <button> <img src="/Icons/menu.svg" class="w-10 h-10" alt="Expand"> </button>
        <button class="toggle-dark">Theme</button>
        <a href="/" class="w-10 h-10"> <img src="/Icons/home.svg" class="" alt="Home"> </a>
        <a href="#"> <img src="/Icons/play.svg" class="w-10 h-10" alt="Play"> </a>
        <a href="#"> <img src="/Icons/musical-notes.svg" class="w-10 h-10" alt="Music"> </a>
        <a href="#"> <img src="/Icons/pie-chart.svg" class="w-10 h-10" alt="Statistics"> </a>
        <a href="/forum"> <img src="/Icons/people.svg" class="w-10 h-10" alt="Forum"> </a>
        <a href="#"> <img src="/Icons/home.svg" class="w-10 h-10" alt="Account"> </a>
        <a href="#"> <img src="/Icons/settings.svg" class="w-10 h-10" alt="Settings"> </a>
    </nav>

    <slot />
</main>

<style>
    main
    {
        min-height: 100vh;
        min-width: 100vh;
        display: flex;
        flex-direction: row;
    }
    nav
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
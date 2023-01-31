<script>
	import { onMount } from "svelte";
    import "../app.css";
	//import ColourExample from "../Examples/ColourExample.svelte";

    onMount(async ()=>{

        //Primitive Theme Toggler
        const toggleTheme = await document.querySelector(".toggle-dark");
        toggleTheme.addEventListener('click',()=>{
            document.documentElement.classList.toggle('dark');
        });
    });

</script>

<main>
    <nav>
        <button>Expand</button>
        <button class="toggle-dark">Theme Toggle</button>
        <a href="#">Home</a>
        <a href="#">Play</a>
        <a href="#">Music</a>
        <a href="#">Statistics</a>
        <a href="/forum">Forum</a>
        <a href="#">Account</a>
        <a href="#">Settings</a>
    </nav>

    <slot />

    <br>
    <!--<ColourExample/>-->

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
        border: 5px solid black;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: #ffffff 0px 5px 5px 0px;
    }
</style>

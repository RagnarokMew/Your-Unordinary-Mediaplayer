<script>
    import "../app.css";
    import { onMount } from "svelte";

    let dark_colour= "#000000";
    let light_colour= "#ffffff";

    $:console.log(`dark:`,dark_colour);
    $:console.log(`light:`,light_colour);

    onMount(async ()=>{
        //Button for Colour Switch
        let button = document.querySelector(".test-button");
        button?.addEventListener('click',()=>{
            let temp;
            temp = dark_colour;
            dark_colour = light_colour;
            light_colour = temp;
        });
    });
    
</script>

<main>
    <!--
        <p style = "background-color: #colour"></p>
            v=
        <p class = "bg-[#colour]"></p>

        Basically the classes of Tailwind are functions and you can pass the parameter you want in them (eg: strings that have a colour hex code)
    -->
    <p class="bg-slate-400 text-white">I am a paragraph that has a predefined colour</p>
    <p class="bg-[{dark_colour}] text-[{light_colour}]">I am a light coloured paragraph (font)</p>
    <p class="text-[{dark_colour}] bg-[{light_colour}]">I am a dark coloured paragraph (font)</p>

    <!-- IMPORTANT NOTE
        dark: (aka dark mode) seems to not really work when switching colours in real time (seems to preserve original colours of the darkmode, despite changing in DOM)
        [If you can look into it cuz am just bf-ed]
        In an actual real life scenario this shouldn't really be an issue, but should be mentioned
        -RagnarokMew
    -->

    <p class="bg-[{light_colour}] text-[{dark_colour}] dark:text-[{light_colour}] dark:bg-[{dark_colour}]">I am a paragraph that changes colour based on theme</p>
    <button class="test-button">Click to switch colours</button>
</main>
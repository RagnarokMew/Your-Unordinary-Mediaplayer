<script lang="ts">
	import type { Settings } from "$lib/interfaces";
    import { settings } from "$lib/stores";
    
    const localStorage = window.localStorage;
    const savedSettings = localStorage.getItem("settings");

    const saveSettings = () =>{
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            let id = input.id;
            ($settings as any)[id] = input.value;
        });

        localStorage.setItem("settings", JSON.stringify($settings));
        updateTheme();
    }

    const resetSettings = () =>{
        localStorage.setItem("settings", JSON.stringify({
            primaryLightColour: "#ffffff",
            secondaryLightColour: "#e5dfdc",
            secondary2LightColour: "#cac1ba",
            secondary3LightColour: "#93989f",
            accentLightColour: "#000000",
            fontLightColour: "#000000",
            rangeLightColour: "#cac1ba",
            itemsLightColour: "#ffffff",
            primaryDarkColour: "#111115",
            secondaryDarkColour: "#404055",
            secondary2DarkColour: "#2d2d3a",
            secondary3DarkColour: "#1d1d24",
            accentDarkColour: "#000000",
            fontDarkColour: "#ffffff",
            rangeDarkColour: "#c09967",
            itemsDarkColour: "#69697d",
            forwardTime: 15,
            backwardTime: 15,
        } satisfies Settings ));

        $settings = {
            primaryLightColour: "#ffffff",
            secondaryLightColour: "#e5dfdc",
            secondary2LightColour: "#cac1ba",
            secondary3LightColour: "#93989f",
            accentLightColour: "#000000",
            fontLightColour: "#000000",
            rangeLightColour: "#cac1ba",
            itemsLightColour: "#ffffff",
            primaryDarkColour: "#111115",
            secondaryDarkColour: "#404055",
            secondary2DarkColour: "#2d2d3a",
            secondary3DarkColour: "#1d1d24",
            accentDarkColour: "#000000",
            fontDarkColour: "#ffffff",
            rangeDarkColour: "#c09967",
            itemsDarkColour: "#69697d",
            forwardTime: 15,
            backwardTime: 15,
        }
    }

    const changeTheme = (primary : string, secondary : string, secondary2 : string, secondary3 : string, accent : string, font : string, time : string, items : string) => {
        const root : HTMLElement | any = document.querySelector(":root");

        root.style.setProperty('--primary-colour', primary);
        root.style.setProperty('--secondary-colour', secondary);
        root.style.setProperty('--secondary2-colour', secondary2);
        root.style.setProperty('--secondary3-colour', secondary3);
        root.style.setProperty('--accent-colour', accent);
        root.style.setProperty('--text-colour',font);
        root.style.setProperty('--time-range-colour',time);
        root.style.setProperty('--items-colour', items);
    }

    const updateTheme = () =>{
        if(document.querySelector("html")?.classList.contains("dark"))
            changeTheme($settings.primaryDarkColour, $settings.secondaryDarkColour,$settings.secondary2DarkColour, $settings.secondary3DarkColour, $settings.accentDarkColour, $settings.fontDarkColour, $settings.rangeDarkColour, $settings.itemsDarkColour);
        else
            changeTheme($settings.primaryLightColour, $settings.secondaryLightColour,$settings.secondary2LightColour, $settings.secondary3LightColour, $settings.accentLightColour, $settings.fontLightColour, $settings.rangeLightColour, $settings.itemsLightColour);
    }

    if (!savedSettings)
        resetSettings();
    else {
        const parsedSavedSettings = JSON.parse(savedSettings);
        $settings = {
            primaryLightColour: parsedSavedSettings.primaryLightColour,
            secondaryLightColour: parsedSavedSettings.secondaryLightColour,
            secondary2LightColour: parsedSavedSettings.secondary2LightColour,
            secondary3LightColour: parsedSavedSettings.secondary3LightColour,
            accentLightColour: parsedSavedSettings.accentLightColor,
            fontLightColour: parsedSavedSettings.fontLightColour,
            rangeLightColour: parsedSavedSettings.rangeLightColour,
            itemsLightColour: parsedSavedSettings.itemsLightColour,
            primaryDarkColour: parsedSavedSettings.primaryDarkColour,
            secondaryDarkColour: parsedSavedSettings.secondaryDarkColour,
            secondary2DarkColour: parsedSavedSettings.secondary2DarkColour,
            secondary3DarkColour: parsedSavedSettings.secondary3DarkColour,
            accentDarkColour: parsedSavedSettings.accentDarkColour,
            fontDarkColour: parsedSavedSettings.fontDarkColour,
            rangeDarkColour: parsedSavedSettings.rangeDarkColour,
            itemsDarkColour: parsedSavedSettings.itemsDarkColour,
            forwardTime: parseInt(parsedSavedSettings.forwardTime),
            backwardTime: parseInt(parsedSavedSettings.backwardTime),
        }
    }

    let primaryLightColour= $settings.primaryLightColour;
    let secondaryLightColour= $settings.secondaryLightColour;
    let secondary2LightColour= $settings.secondary2LightColour;
    let secondary3LightColour= $settings.secondary3LightColour;
    let accentLightColour= $settings.accentLightColour;
    let fontLightColour= $settings.fontLightColour;
    let rangeLightColour= $settings.rangeLightColour;
    let itemsLightColour= $settings.itemsLightColour;
    let primaryDarkColour= $settings.primaryDarkColour;
    let secondaryDarkColour= $settings.secondaryDarkColour;
    let secondary2DarkColour= $settings.secondary2DarkColour;
    let secondary3DarkColour= $settings.secondary3DarkColour;
    let accentDarkColour= $settings.accentDarkColour;
    let fontDarkColour= $settings.fontDarkColour;
    let rangeDarkColour= $settings.rangeDarkColour;
    let itemsDarkColour= $settings.itemsDarkColour;
    let forwardTime= $settings.forwardTime;
    let backwardTime= $settings.backwardTime;

    

</script>


<main class="flex flex-col divide-y-4 w-1/2 p-4">
    <div class="flex gap-10 p-2">
        <div class="font-bold text-4xl">
            Settings
        </div>
        <button on:click={saveSettings} class="bg-blue-400 hover:bg-blue-450 active:bg-blue-600 p-1 px-4 rounded-md ml-2 text-xl text-white font-semibold">Save</button>
        <button on:click={resetSettings} class="bg-[#ef6657] hover:bg-[#ee5544] active:bg-[#ec4432] p-1 px-4 rounded-md ml-2 text-xl text-white font-semibold">Reset</button>
    </div>
    

    <div class="flex flex-col gap-1 p-4 divide-y-4">
        <div class="flex gap-5">
            <div class="font-bold text-3xl">
                Themes
            </div>
        </div>
        

        <!--Light Colours-->
        <div class="flex flex-col gap-2 p-4">
            <div class="font-bold text-2xl">
                Light Mode
            </div>

            <label for="primaryLightColour">Primary Colour</label>
            <input id="primaryLightColour" type="color" bind:value={primaryLightColour}>
            <label for="secondaryLightColour">Secondary Colour 1</label>
            <input id="secondaryLightColour" type="color" bind:value={secondaryLightColour}>
            <label for="secondary2LightColour">Secondary Colour 2</label>
            <input id="secondary2LightColour" type="color" bind:value={secondary2LightColour}>
            <label for="secondary3LightColour">Secondary Colour 3</label>
            <input id="secondary3LightColour" type="color" bind:value={secondary3LightColour}>
            <label for="accentLightColour">Accent Colour</label>
            <input id="accentLightColour" type="color" bind:value={accentLightColour}>
            <label for="fontLightColour">Text / Icons Colour</label>
            <input id="fontLightColour" type="color" bind:value={fontLightColour}>
            <label for="rangeLightColour">Progress Bar Colour</label>
            <input id="rangeLightColour" type="color" bind:value={rangeLightColour}>
            <label for="itemsLightColour">Song Bubble Colour</label>
            <input id="itemsLightColour" type="color" bind:value={itemsLightColour}>
        </div>

        <!--Dark Colours-->
        <div class="flex flex-col gap-2 p-4">
            <div class="font-bold text-2xl">
                Dark Mode
            </div>
    
            <label for="primaryDarkColour">Primary Colour</label>
            <input id="primaryDarkColour" type="color" bind:value={$settings.primaryDarkColour}>
            <label for="secondaryDarkColour">Secondary Colour 1</label>
            <input id="secondaryDarkColour" type="color" bind:value={$settings.secondaryDarkColour}>
            <label for="secondary2DarkColour">Secondary Colour 2</label>
            <input id="secondary2DarkColour" type="color" bind:value={$settings.secondary2DarkColour}>
            <label for="secondary3DarkColour">Secondary Colour 3</label>
            <input id="secondary3DarkColour" type="color" bind:value={$settings.secondary3DarkColour}>
            <label for="accentDarkColour">Accent Colour</label>
            <input id="accentDarkColour" type="color" bind:value={$settings.accentDarkColour}>
            <label for="fontDarkColour">Text / Icons Colour</label>
            <input id="fontDarkColour" type="color" bind:value={$settings.fontDarkColour}>
            <label for="rangeDarkColour">Progress Bar Colour</label>
            <input id="rangeDarkColour" type="color" bind:value={$settings.rangeDarkColour}>
            <label for="itemsDarkColour">Song Bubble Colour</label>
            <input id="itemsDarkColour" type="color" bind:value={$settings.itemsDarkColour}>
        </div>
        
        <div class="flex flex-col gap-2 my-2 py-2">
            <label for="forwardTime">Forward time:</label>
            <input value="15" id="forwardTime" type="number">
            <label for="backwardTime">Backward time:</label>
            <input value="15" id="backwardTime" type="number">
        </div>
        
    </div>

</main>

<style>
    label
    {
        font-weight: 600;
    }
    input[type="number"]
    {
        background-color: var(--secondary-colour);
        border-radius: 5px;
        padding: 2px 10px;
        -moz-appearance: textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button 
    {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="color"]
    {
        padding: 0;
        border: 0;
        border-radius: 10px;
        background: none;
    }
</style>
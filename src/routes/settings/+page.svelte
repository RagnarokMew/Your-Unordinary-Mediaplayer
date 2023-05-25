<script lang="ts">
	import type { Settings } from "$lib/interfaces";
    import { settings } from "$lib/stores";
	import { onDestroy } from "svelte";
    
    const localStorage = window.localStorage;
    const savedSettings = localStorage.getItem("settings");
    if (!savedSettings) {
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

    const updateSettings = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const id = input.id;
        ($settings as any)[id] = input.value;
    }

    onDestroy(() => {
        localStorage.setItem("settings", JSON.stringify($settings));
    })

</script>


<main class="flex flex-col divide-y-4 w-1/2 p-4">
    <div class="font-bold text-4xl p-2">
        Settings
    </div>
    

    <div class="flex flex-col gap-1 p-4 divide-y-4">
        <div class="font-bold text-3xl">
            Themes
        </div>

        <!--Light Colours-->
        <div class="flex flex-col gap-2 p-4">
            <div class="font-bold text-2xl">
                Light Mode
            </div>

            <label for="primaryLightColour">Primary Colour</label>
            <input on:change={updateSettings} id="primaryLightColour" type="color">
            <label for="secondaryLightColour">Secondary Colour 1</label>
            <input on:change={updateSettings} id="secondaryLightColour" type="color">
            <label for="secondary2LightColour">Secondary Colour 2</label>
            <input on:change={updateSettings} id="secondary2LightColour" type="color">
            <label for="secondary3LightColour">Secondary Colour 3</label>
            <input on:change={updateSettings} id="secondary3LightColour" type="color">
            <label for="accentLightColour">Accent Colour</label>
            <input on:change={updateSettings} id="accentLightColour" type="color">
            <label for="fontLightColour">Text / Icons Colour</label>
            <input on:change={updateSettings} id="fontLightColour" type="color">
            <label for="rangeLightColour">Progress Bar Colour</label>
            <input on:change={updateSettings} id="rangeLightColour" type="color">
            <label for="itemsLightColour">Song Bubble Colour</label>
            <input on:change={updateSettings} id="itemsLightColour" type="color">
        </div>

        <!--Dark Colours-->
        <div class="flex flex-col gap-2 p-4">
            <div class="font-bold text-2xl">
                Dark Mode
            </div>
    
            <label for="primaryDarkColour">Primary Colour</label>
            <input on:change={updateSettings} id="primaryDarkColour" type="color">
            <label for="secondaryDarkColour">Secondary Colour 1</label>
            <input on:change={updateSettings} id="secondaryDarkColour" type="color">
            <label for="secondary2LightColour">Secondary Colour 2</label>
            <input on:change={updateSettings} id="secondary2LightColour" type="color">
            <label for="secondary3LightColour">Secondary Colour 3</label>
            <input on:change={updateSettings} id="secondary3LightColour" type="color">
            <label for="accentDarkColour">Accent Colour</label>
            <input on:change={updateSettings} id="accentDarkColour" type="color">
            <label for="fontDarkColour">Text / Icons Colour</label>
            <input on:change={updateSettings} id="fontDarkColour" type="color">
            <label for="rangeDarkColour">Progress Bar Colour</label>
            <input on:change={updateSettings} id="rangeDarkColour" type="color">
            <label for="itemsDarkColour">Song Bubble Colour</label>
            <input on:change={updateSettings} id="itemsDarkColour" type="color">
        </div>
        
        <div class="flex flex-col gap-2 my-2 py-2">
            <label for="forwardTime">Forward time:</label>
            <input value="15" on:change={updateSettings} id="forwardTime" type="number" class="">
            <label for="backwardTime">Backward time:</label>
            <input value="15" on:change={updateSettings} id="backwardTime" type="number" class="">
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
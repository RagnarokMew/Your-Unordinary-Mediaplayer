<script lang="ts">
	import type { Settings } from "$lib/interfaces";
    import { settings } from "$lib/stores";
	import { onDestroy } from "svelte";

    const localStorage = window.localStorage;
    const savedSettings = localStorage.getItem("settings");
    if (!savedSettings) {
        localStorage.setItem("settings", JSON.stringify({
            mainLightColour: "#fecdd3",
            secondaryLightColour: "#e5e7eb",
            accentLightColour: "#000000",
            mainDarkColour: "#000000",
            secondaryDarkColour: "#ffffff",
            accentDarkColour: "#000000",
            forwardTime: 15,
            backwardTime: 15,
        } satisfies Settings ));

        $settings = {
            mainLightColour: "#fecdd3",
            secondaryLightColour: "#e5e7eb",
            accentLightColour: "#000000",
            mainDarkColour: "#000000",
            secondaryDarkColour: "#ffffff",
            accentDarkColour: "#000000",
            forwardTime: 15,
            backwardTime: 15,
        }
    }
    else {
        const parsedSavedSettings = JSON.parse(savedSettings);
        $settings = {
            mainLightColour: parsedSavedSettings.mainLightColour,
            secondaryLightColour: parsedSavedSettings.secondaryLightColour,
            accentLightColour: parsedSavedSettings.accentLightColour,
            mainDarkColour: parsedSavedSettings.mainDarkColour,
            secondaryDarkColour: parsedSavedSettings.secondaryDarkColour,
            accentDarkColour: parsedSavedSettings.accentDarkColour,
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


<main class="flex flex-col">
    <label for="mainLightColour">Main light mode color:</label>
    <input on:change={updateSettings} id="mainLightColour" type="color">
    <label for="secondaryLightColor">Secondary light mode color:</label>
    <input on:change={updateSettings} id="secondaryLightColour" type="color">
    <label for="accentLightColor">Accent light mode color:</label>
    <input on:change={updateSettings} id="accentLightColour" type="color">

    <label for="mainDarkColor">Main dark mode color:</label>
    <input on:change={updateSettings} id="mainDarkColour" type="color">
    <label for="secondaryDarkColor">Secondary dark mode color:</label>
    <input on:change={updateSettings} id="secondaryDarkColour" type="color">
    <label for="accentDarkColor">Accent dark mode color:</label>
    <input on:change={updateSettings} id="accentDarkColour" type="color">

    <label for="forwardTime">Forward time:</label>
    <input value="15" on:change={updateSettings} id="forwardTime" type="number">
    <label for="backwardTime">Backward time:</label>
    <input value="15" on:change={updateSettings} id="backwardTime" type="number">
</main>
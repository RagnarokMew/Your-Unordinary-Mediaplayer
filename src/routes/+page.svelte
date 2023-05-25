<script>
    import "../app.css";
    import Footer from "../Components/Footer.svelte";
    import Review from "./Review.svelte";
    import { songsData } from "$lib/stores";
	import { getAllSongsData } from "$lib/indexedDB";
	import { onMount } from "svelte";
    

    onMount(async () => {
        if ($songsData.length === 0) {
            $songsData = await getAllSongsData();
        }
    })


</script>

<main class="min-h-screen w-full flex flex-col">
    <div class="title secondary-bg">
        <h1 class="flex justify-center items-center text-5xl font-extrabold my-5">Your Unordinary MediaPlayer</h1>
        <h3 class="flex justify-center items-center text-3xl font-bold my-5">A novel way to listen to media, right in your browser</h3>
    </div>
    <div class="section1 flex items-center justify-around px-40 py-20 flex-grow">
        <p class="w-80 self-start text-start flex items-center h-full text-lg gap-2">
            Looking for a change in the way you listen to your favourite music? <br>
            Look no further than your Romanian locally sourced media player that wishes to revolutionise your music experience.
        </p>
        <img src="Image1.png" alt="Amazing Image" class="w-[450px] h-[300px] object-cover rounded-lg">
    </div>
    <div class="section2 py-5 secondary-bg flex-grow flex flex-col justify-center items-center"> <!--Colours not done since am not feeling them-->
        <h2 class="flex justify-center items-center text-2xl italic font-bold">What we offer...</h2>
        <div class="flex px-4 py-5 justify-around items-center w-full">
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon stroke" viewBox="0 0 512 512"><path d="M192 218v-6c0-14.84 10-27 24.24-30.59l174.59-46.68A20 20 0 01416 154v22" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M416 295.94v80c0 13.91-8.93 25.59-22 30l-22 8c-25.9 8.72-52-10.42-52-38h0a33.37 33.37 0 0123-32l51-18.15c13.07-4.4 22-15.94 22-29.85V58a10 10 0 00-12.6-9.61L204 102a16.48 16.48 0 00-12 16v226c0 13.91-8.93 25.6-22 30l-52 18c-13.88 4.68-22 17.22-22 32h0c0 27.58 26.52 46.55 52 38l22-8c13.07-4.4 22-16.08 22-30v-80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </div>
                <p>
                    A user friendly experience, that requires no setup for starting out / continuing your music listening journey.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon stroke" viewBox="0 0 512 512"><path d="M277.42 247a24.68 24.68 0 00-4.08-5.47L255 223.44a21.63 21.63 0 00-6.56-4.57 20.93 20.93 0 00-23.28 4.27c-6.36 6.26-18 17.68-39 38.43C146 301.3 71.43 367.89 37.71 396.29a16 16 0 00-1.09 23.54l39 39.43a16.13 16.13 0 0023.67-.89c29.24-34.37 96.3-109 136-148.23 20.39-20.06 31.82-31.58 38.29-37.94a21.76 21.76 0 003.84-25.2zM478.43 201l-34.31-34a5.44 5.44 0 00-4-1.59 5.59 5.59 0 00-4 1.59h0a11.41 11.41 0 01-9.55 3.27c-4.48-.49-9.25-1.88-12.33-4.86-7-6.86 1.09-20.36-5.07-29a242.88 242.88 0 00-23.08-26.72c-7.06-7-34.81-33.47-81.55-52.53a123.79 123.79 0 00-47-9.24c-26.35 0-46.61 11.76-54 18.51-5.88 5.32-12 13.77-12 13.77a91.29 91.29 0 0110.81-3.2 79.53 79.53 0 0123.28-1.49C241.19 76.8 259.94 84.1 270 92c16.21 13 23.18 30.39 24.27 52.83.8 16.69-15.23 37.76-30.44 54.94a7.85 7.85 0 00.4 10.83l21.24 21.23a8 8 0 0011.14.1c13.93-13.51 31.09-28.47 40.82-34.46s17.58-7.68 21.35-8.09a35.71 35.71 0 0121.3 4.62 13.65 13.65 0 013.08 2.38c6.46 6.56 6.07 17.28-.5 23.74l-2 1.89a5.5 5.5 0 000 7.84l34.31 34a5.5 5.5 0 004 1.58 5.65 5.65 0 004-1.58L478.43 209a5.82 5.82 0 000-8z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </div>
                <p>
                    Customisability, an important part of YUM and we believe you deserve the ability to make the music experience your own.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon stroke" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 249.38L256 170l80 79.38M256 181.03V342"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
                </div>
                <p>
                    Your music listening experience, your music. Upload your own music to listen to, for a truly unique feel of what we have to offer.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon stroke" viewBox="0 0 512 512"><path d="M32 32v432a16 16 0 0016 16h432" fill="none"  stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="96" y="224" width="80" height="192" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="240" y="176" width="80" height="240" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="383.64" y="112" width="80" height="304" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </div>
                <p>
                    Data and statistics of your listening habits in order to truly get a feel for your music taste.
                </p>
            </div>
        </div>
    </div>
    <div class="flex flex-grow justify-center items-center">
        <div class="reviews flex items-start justify-around my-7">
            <Review score={9} reviewer={"RagnarokMew"} header={"A truly amazing experience"} body={"Recommended for any average music enjoyer and above. You can trust me I was involved in making this."}/>
            <Review score={10} reviewer={"CapybaraFan42"} header={"Phenomenal!"} body={"I have absolutely had the time of my life using this site and jamming to songs. The UI is flawless, the features are thrilling and the performance is blazingly fast! Thank you!"}/>
            <Review score={9} reviewer={"Ropler6"} header={"Great"} body={"It is definitely one of the best sites I have ever used. It could use a few visual improvements here and there."}/>
            <Review score={9} reviewer={"Chris Everest"} header={"Amazing Concept"} body={"Just right for any mood. It is not perfect but it does show great potential. Thank you for this addition to the world of music!"}/>
        </div>
    </div>
    <Footer/>
</main>

<style>

</style>

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
    <div class="title bg-gray-200 dark:bg-gray-700">
        <h1 class="flex justify-center items-center text-5xl font-extrabold my-5">Your Unordinary MediaPlayer</h1>
        <h3 class="flex justify-center items-center text-3xl font-bold my-5">A novel way to listen to media, right in your browser</h3>
    </div>
    <div class="section1 flex items-center justify-around px-40 py-20 flex-grow">
        <p class="w-80 self-start text-start flex items-center h-full text-lg gap-2">
            Looking for a change in the way you listen to your favourite music? <br>
            Look no further than your Romanian locally sourced media player that wishes to revolutionise your music experience.
        </p>
        <div class="pld w-96 h-60 border-solid border-black dark:border-white border-4"></div>
    </div>
    <div class="section2 py-5 bg-gray-200 dark:bg-gray-700 flex-grow flex flex-col justify-center items-center"> <!--Colours not done since am not feeling them-->
        <h2 class="flex justify-center items-center text-2xl italic font-bold">What we offer...</h2>
        <div class="flex px-4 py-5 justify-around items-center w-full">
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>
                    A user friendly experience, that requires no setup for starting out / continuing your music listening journey.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>
                    Customisability, an important part of YUM and we believe you deserve the ability to make the music experience your own.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>
                    Your music listening experience, your music. Upload your own music to listen to, for a truly unique feel of what we have to offer.
                </p>
            </div>
            <div class="flex flex-col justify-start items-center gap-2 font-medium w-1/5">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
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

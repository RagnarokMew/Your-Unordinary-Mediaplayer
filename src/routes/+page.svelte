<script>
    import "../app.css";
    import Footer from "../Components/Footer.svelte";
    import Review from "./Review.svelte";
</script>

<main class="min-h-screen w-full flex flex-col">
    <div class="title bg-gray-200 dark:bg-gray-700">
        <h1 class="flex justify-center items-center text-5xl font-extrabold my-5">Your Unordinary MediaPlayer</h1>
        <h3 class="flex justify-center items-center text-3xl font-bold my-5">A novel way to listen to media, right in your browser</h3>
    </div>
    <div class="section1 flex items-center justify-around px-40 py-20 flex-grow">
        <p class="w-80 self-start text-start flex items-center h-full text-lg gap-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, perferendis debitis mollitia sunt, ex odit voluptatum non minima blanditiis a laboriosam vero, iste suscipit! Molestias, ab distinctio! Deserunt, exercitationem ut!
        </p>
        <div class="pld w-96 h-60 border-solid border-black dark:border-white border-4"></div>
    </div>
    <div class="section2 py-5 bg-gray-200 dark:bg-gray-700 flex-grow flex flex-col justify-center items-center"> <!--Colours not done since am not feeling them-->
        <h2 class="flex justify-center items-center text-2xl italic font-bold">What we offer...</h2>
        <div class="flex px-4 py-5 justify-around items-center w-full">
            <div class="flex flex-col justify-center items-center gap-2 font-medium">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 font-medium">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 font-medium">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 font-medium">
                <div class="pld w-40 h-40 border-4 border-black dark:border-white"></div>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
        </div>
    </div>
    <div class="flex flex-grow justify-center items-center">
        <button class="h-full px-7"> &lt; </button>
        <div class="reviews flex items-center justify-around my-7">
            <Review/>
            <Review/>
            <Review/>
            <Review/>
        </div>
        <button class="h-full px-7"> &gt; </button>
    </div>
    <Footer/>
</main>

<style>

</style>

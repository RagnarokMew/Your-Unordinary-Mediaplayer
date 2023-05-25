<script>
    /**
    * ! For display purposes only
    * * Styling and looks are not final
    */
    import "../app.css";

    export let score = 10;
    export let reviewer = "User";
    export let header = "Amazing";
    export let body = "My wife wanted to leave me, but after using YUM, we got back together. Truly a miracle. Thank you YUM";
</script>

<main class="flex flex-col w-1/5 secondary2-bg p-3 rounded-md">
    <p class="">{reviewer} - {score/2}*</p>
    <h3 class="text-xl font-bold">{header} ...</h3>
    <p class="font-semibold">{body}</p>
</main>

<style>

</style>
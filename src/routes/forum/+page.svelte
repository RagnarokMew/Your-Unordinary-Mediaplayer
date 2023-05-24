<script lang="ts">
	import type { PageData } from './$types';
    import Question from './Question.svelte';
    import type { Question as _Question } from "$lib/interfaces"
	import Footer from '../../Components/Footer.svelte';

    export let data: PageData;
    const questions: _Question[] = data.questions;

</script>

<main class="w-full h-screen flex flex-col">
	<div class="flex flex-col items-center justify-center mb-3 secondary-bg">
		<h2 class="flex justify-center items-center text-5xl font-extrabold my-5">Your Unordinary Mediaplayer - FAQ</h2>
	</div>
	<!-- Question container -->
	<div class="flex flex-col flex-grow items-center justify-center gap-2 py-7">
        {#each questions as {question, details}}
            <Question question={question} details={details}/>
        {/each}
	</div>
	<Footer/>
</main>

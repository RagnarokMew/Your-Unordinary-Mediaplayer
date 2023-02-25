<script lang="ts">
	import type { PageData } from './$types';
    import Question from './Question.svelte';
    import type { Question as _Question } from "$lib/interfaces"
	import Footer from '../../Components/Footer.svelte';

    export let data: PageData;
    const questions: _Question[] = data.questions;

</script>

<main class="w-full h-screen flex flex-col">
	<div class="flex flex-col items-center justify-center mb-3 dark:bg-gray-800 bg-rose-100">
		<h2 class="flex justify-center items-center text-5xl font-extrabold my-5">Your Unordinary Mediaplayer - Forum</h2>
		<div class="flex divide-x-2 divide-gray-800 dark:divide-rose-100 mb-3">
			<a href="/forum/question" class="text-3xl font-extrabold p-2">Ask a question</a>
			<a href="/forum/review" class="text-3xl font-extrabold p-2">Leave a review</a>
		</div>
	</div>
	<!-- Question container -->
	<div class="flex flex-col flex-grow items-center justify-center gap-2 py-7">
        {#each questions as {question, details}}
            <Question question={question} details={details}/>
        {/each}
	</div>
	<Footer/>
</main>

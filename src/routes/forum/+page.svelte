<script lang="ts">
	import type { PageData } from './$types';
    import Question from './Question.svelte';
    import type { Question as _Question } from "$lib/interfaces"

    export let data: PageData;
    const questions: _Question[] = data.questions;

</script>

<main class="w-full h-full grid grid-cols-3 grid-rows-[1fr,9fr]">
	<div class="flex flex-col items-center justify-center row-span-1 col-start-1 col-end-4 m-3">
		<h2>Your Unordinary Mediaplayer</h2>
		<a href="/forum/question">Ask a question</a>
		<a href="/forum/review">Leave a review</a>
	</div>
	<!-- Question container -->
	<div class="col-start-2 col-end-4 row-start-2 row-end-auto">
        {#each questions as {question}}
            <Question question={question} details=""/>
        {/each}
	</div>
</main>

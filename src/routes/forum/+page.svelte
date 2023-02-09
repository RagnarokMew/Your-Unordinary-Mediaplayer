<script lang="ts">
	import type { ActionData, PageData } from './$types';
    import Question from './Question.svelte';
    import type { Question as _Question, Review } from "$lib/interfaces"

    export let data: PageData;
    // export let form: ActionData;

    const questions: _Question[] = data.questions;

	let addingQuestion = false;
	let addingReview = false;

	const toggleAddingQuestion = () => {
		addingQuestion = !addingQuestion;
		addingReview = false;
	};
	const toggleAddingReview = () => {
		addingReview = !addingReview;
		addingQuestion = false;
	};

</script>

<main class="w-full h-full grid grid-cols-3 grid-rows-[1fr,9fr]">
	<div class="flex flex-col items-center justify-center row-span-1 col-start-1 col-end-4">
		<h2>Your Unordinary Mediaplayer</h2>
		<div class="flex flex-row">
			<button on:click={toggleAddingQuestion} type="button">Ask a question</button>
			<button on:click={toggleAddingReview} type="button">Leave a review</button>
		</div>

		{#if addingQuestion}
			<form method="POST" action="?/question">
				<label for="question">Question:</label>
				<input type="text" name="question" id="question"/>
			</form>
		{/if}

		{#if addingReview}
			<form method="POST" action="?/review">
				<label for="review">Review:</label>
				<input type="text" name="question" id="question" />
			</form>
		{/if}
	</div>
	<!-- Question container -->
	<div class="col-start-2 col-end-4 row-start-2 row-end-auto">
        {#each questions as {question}}
            <Question question={question} details=""/>
        {/each}
	</div>
</main>

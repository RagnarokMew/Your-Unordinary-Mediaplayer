import type { PageServerLoad, Actions } from "./$types";
import type { Question, Review } from "$lib/interfaces"
import { writeFile } from "node:fs"

//? Mock data
let questions: Question[] = [
    {
        user: "Bob",
        question: "Test",
        details: "",
    }
];

let reviews: Review[] = [
    {
        user: "James",
        review: "Amazing!!!",
        rating: 10,
    }
]

export const load = () => {
    return {
        questions: questions
    }
}

export const actions = {
    question: async({cookies, request}) => {
        //TODO: get the user asking the question
        //TODO: add the question to the database

        const data = await request.formData();
        const userQuestion = data.get("question");

        questions.push(
            {
                user: "Bob", 
                question: (userQuestion?.toString() ?? ""), 
                details: "",
            }
        )

        return { success: true };
    },

    review: async({cookies, request}) => {
        //TODO: add a review to the database
        const data = await request.formData();
        const userReview = data.get("review");
        const userRating = data.get("rating");

        reviews.push(
            {
                user: "James",
                review: (userReview?.toString() ?? ""),
                rating: (parseInt(userRating?.toString() ?? "10"))
            }
        )

        return { success: true };
    }

} satisfies Actions;
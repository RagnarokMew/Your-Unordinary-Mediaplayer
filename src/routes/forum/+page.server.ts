import type { PageServerLoad, Actions } from "./$types";
import type { Question, Review } from "$lib/interfaces"
import { writeFile } from "node:fs"
import { isDepsOptimizerEnabled } from "vite";

//? Mock data
let questions: Question[] = [
    {
        user: "Bob",
        question: "Test",
        details: "",
    },
    {
        user: "Billy",
        question: "How do use?",
        details: "",
    },
    {
        user: "User123",
        question: "Hello, I think Internet is broken?",
        details: "I try use YUM, but YUM no load and it say internet needed or smth. U SUCK. Get internet, make work. goodbye.",
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
        const userDetails = data.get("details")

        questions.push(
            {
                user: "Bob", 
                question: (userQuestion?.toString() ?? ""), 
                details: (userDetails?.toString() ?? ""),
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
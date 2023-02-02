import type { PageServerLoad, Actions } from "./$types";
import type { Question, Review } from "./interfaces"

//? Mock data
let questions: Question[] = [
    {
        user: "Bob",
        question: "Test",
        details: "",
    }
];

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

    review: async(event) => {
        //TODO: add a review to the database
    }

} satisfies Actions;
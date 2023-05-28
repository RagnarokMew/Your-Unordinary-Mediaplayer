import type { Question } from "$lib/interfaces"

//? FAQ
let questions: Question[] = [
    {
        user: "Cosmina",
        question: "How to play music?",
        details: "In order to play music, you must first upload a song. If you have already done that go directly to the play page, by navigating through the sidebar and select the song you want to listen to. If you haven't navigate to the upload page, by clicking the musical notes in the sidebar. There complete the upload form to upload a song and you are ready to go.",
    },
    {
        user: "Cosmina",
        question: "Can I play songs that are not previously downloaded on my device?",
        details: "No. Due to the scope of YUM, you can play only uploaded songs from your device.",
    },
    {
        user: "Cosmina",
        question: "Does the site require a certain format for the files I upload?",
        details: "Yes, files you upload must be of an audio format such as .mp3 or .ogg. Not to worry though, the upload page allows only valid file formats. If you cannot see your audio file when trying to upload, try to convert it to .mp3 or .ogg.",
    },
    {
        user: "Cosmina",
        question: "Why does the music stop when changing pages (on the site)?",
        details: "Due to the design architecture of YUM, the song that is playing at any given time will stop when changing pages (leaving the page designated for playing music). At the moment there are no plans to change this.",
    },
    {
        user: "Chris",
        question: "How to make playlists?",
        details: "Creating a playlist is possible only in the Play page (mediaplayer page). This is achieved by clicking the second last button on the control bar (the plus with a square around it). That will display the menu of all existing playlists. Click the create playlist button in order to create a playlist.",
    },
    {
        user: "Chris",
        question: "How to delete playlists?",
        details: "Deleting created playlist is only possible in the Play page (mediaplayer page). This is achieved by clicking the last button on the control bar (the icon with 3 dots and lines). That will display all the existing playlists. To delete a playlist click the delete button (the x with a circle around it) next to the name of the playlist you wish to delete. Please note that the 'Default' playlist cannot be deleted, due to the architecture of YUM. It is also unadvised to force it's deletion through the console as it may cause unexpected behaviour and/or break the app.",
    },
    {
        user: "Chris",
        question: "How to rename playlists/songs?",
        details: "Though such a capability is technically possible, we do not encourage any attempts to do so, nor will provide instructions on how to do it. At the moment this feature is not available to users, but we will keep in mind your suggestion and might implement it in the future. Currently the only way to simulate a similar effect is to delete said song/playlist and to then reupload it, though this will cause the loss of all data related to the affected items.",
    },
    {
        user: "Cosmina",
        question: "Can I reset/ delete all the progress made on the site?",
        details: "Yes, you can. The easiest and recommended way to do this, is by clearing the cookies & site data of YUM in your browser. This is done in the settings of your browser.",
    },
];

export const load = () => {
    return {
        questions: questions
    }
}
import { callAPIArtist } from "./home-api.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const artist = $('.artist')

function start() {
    callAPIArtist(1, 10)
}
start()

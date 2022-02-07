import { callAPIArtist } from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const pagination = $('.pagination')
function start() {
    callAPIArtist(1, 10, pagination)
}
start()

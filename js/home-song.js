import { callAPISong } from "./home-main.js"
import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const urlSong = urlAPI + "api/songs/"
const pagination = $('.pagination')
const songListElement = $('.bxh')
function start() {
    callAPISong(1, 10, urlSong, songListElement, pagination)
}
start()
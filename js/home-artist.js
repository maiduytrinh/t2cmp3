import { callAPIArtist } from "./home-main.js"
import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const urlArtist = urlAPI + "api/artist/"
const pagination = $('.pagination')
function start() {
    callAPIArtist(1, 10, urlArtist, pagination)
}
start()

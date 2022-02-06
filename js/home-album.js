import { callAPIAlbum } from "./home-api.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const album = $('.album')

function start(){
    callAPIAlbum(1, 10)
}
start()

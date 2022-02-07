import { callAPIAlbum } from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const pagination = $('.pagination')

function start(){
    callAPIAlbum(1, 10, pagination)
}
start()

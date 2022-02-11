import { callAPIAlbum } from "./home-main.js"
import { urlAPI } from "./config.js"


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const pagination = $('.pagination')
const urlAlbum = urlAPI + "api/albums/"

function start(){
    callAPIAlbum(1, 10, urlAlbum, pagination)
}
start()

import { apiGetPlaylist, renderListPlaylist } from "./home-main.js"
import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const listElement = $('.bxh')
let idUser = localStorage.getItem('id')
let url = urlAPI + 'api/playlist/all/' + idUser
function start() {
    apiGetPlaylist(1, 20, url, renderListPlaylist, listElement)
}
start()
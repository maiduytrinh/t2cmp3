import { callAPIBXH } from "./home-api.js";

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const bxh = $('.bxh')

function start() {
    callAPIBXH(30);
}
start()
import { callAPIBXH } from "./home-main.js";
import { handleClickBtnPlayAll } from "./home-player.js";

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const bxh = $('.bxh')

function start() {
    callAPIBXH(30, bxh);
}
start()
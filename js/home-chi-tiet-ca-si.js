import { urlAPI } from "./config.js"
import { handlePlaySong, handleListSong, handleClickBtnPlayAll, handleEventClickBXH } from "./home-player.js"
import { renderListSong, handleEventListSong} from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const imgSong = $('.flex-shrink-6 .rounded')
const nameSong = $('.name-album .name')
const birthday = $('.name-album .birthday')
const totalSong = $('.name-album .total')
const active = $('.name-album .active')
const songList = $('.bxh')
let params = (new URL(document.location)).searchParams
let id = params.get("id")

function start(){
    setData()
}
start()

function setData(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    let url =  urlAPI + 'api/artist/' + id

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(function(result){
            imgSong.src = result.image
            nameSong.innerHTML = result.fullName
            birthday.innerHTML = 'Ngày sinh: ' + result.birthDay
            active.innerHTML = 'Hoạt động: ' + result.countryActive
            totalSong.innerHTML = `${result.artistSongs.length} bài hát`
            //set list song
            let listSong = result.artistSongs.map(artistSong => artistSong.songs)
            renderListSong(listSong, songList)
            handleEventListSong(listSong,  1, 100, url, songList)
            let listSongNew = handleListSong(listSong)
            handlePlaySong(listSongNew)
            handleEventClickBXH(listSongNew)
            handleClickBtnPlayAll(listSongNew)
        })
        .catch(error => console.log('error', error));
}
import { urlAPI } from "./config.js"
import { handlePlaySong, handleListSong, handleClickBtnPlayAll, handleEventClickSongAlbum } from "./home-player.js"
import { renderListSong, handleEventListSong} from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const imgAlbum = $('.flex-shrink-6 .rounded')
const nameAlbum = $('.name-album .name')
const artistAlbum = $('.name-album .art')
const totalSong = $('.name-album .total')
const songAlbum = $('.album-playlist')
let id


function start(){
    let params = (new URL(document.location)).searchParams
    id = params.get("id");
    setData()
    // console.log(totalSong)
}
start()

function setData(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      let url = urlAPI + "api/albums/" + id
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(function(result){
            //get thông tin album
            imgAlbum.src = result.image
            nameAlbum.innerHTML = result.albumName
            totalSong.innerHTML = `${result.albumSongs.length} bài hát`
            //get list artist
            let listArtistsAlbum = result.artistAlbums.map(function(artist){
                return artist.artists.fullName
            })
            let artistsAlbum = listArtistsAlbum.join(", ")
            artistAlbum.innerHTML = `Nghệ sĩ: ${artistsAlbum}`

            //get thong tin bai hat album 
            let listSong = result.albumSongs.map(albumSong => albumSong.songs)
            renderListSong(listSong, songAlbum)
            handleEventListSong(listSong,  1, 100, url, songAlbum)
            let listSongNew = handleListSong(listSong)
            handlePlaySong(listSongNew)
            handleEventClickSongAlbum(listSongNew)
            handleClickBtnPlayAll(listSongNew)
        })
        .catch(error => console.log('error', error));
}




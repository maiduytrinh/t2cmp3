import { urlAPI } from "./config.js"
import { handlePlaySong } from "./home-player.js"
import { handleListSong } from "./home-player.js"
import { handleEventClickSongAlbum } from "./home-player.js"
import { handleClickBtnPlayAll } from "./home-player.js"

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
      
      fetch(urlAPI + "api/albums/" + id, requestOptions)
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
            let htmls = listSong.map(function(song, index){
                //get name artist
                let listArtists = song.artistSongs.map(function(artist){
                    return artist.artists.fullName
                })
                let artists = listArtists.join(", ")
                // console.log(song.artistSongs[0].artists.fullName)
                return `
                <div class="d-flex bd-highlight mb-2 album-item" data-index="${index}">
                    <p class="bd-highlight album-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                    <div class="info-album p-2 bd-highlight ms-3">
                        <span class="ava-player">
                            <img src="${song.image}" style="height: 50px; width: 50px; border-radius: 5px;" alt="">
                        </span>
                        <div class="name-song">
                            <p class="name">${song.title}</p>
                            <p class="art">${artists}</p>
                        </div>
                    </div>
                    <button class="ms-auto bd-highlight btn-add-to-playlist" type="button" onclick="changeStyle()">
                        ...
                    </button>
                    <ul class="more_option open-option ">
                        <li><a href="#"><i class="far fa-heart me-2"></i>Add To
                                Favourites</a></li>
                        <li><a href="#"> <i class="fas fa-plus-circle me-2"></i>Add To Queue</a>
                        </li>
                        <li><a
                                href="${song.mediaUrl}"><span
                                    class="opt_icon"><i class="fas fa-arrow-circle-down me-2"></i>Download Now</a>
                        </li>
                        <li><a href="#"><i class="fas fa-folder-plus me-2"></i>Add To
                                Playlist</a></li>
                    </ul>
                </div>`
            })
            songAlbum.innerHTML = htmls.join('')
            let listSongNew = handleListSong(listSong)
            handlePlaySong(listSongNew)
            handleEventClickSongAlbum(listSongNew)
            handleClickBtnPlayAll(listSongNew)
        })
        .catch(error => console.log('error', error));
}


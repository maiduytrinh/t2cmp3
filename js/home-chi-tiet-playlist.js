import { urlAPI } from "./config.js"
import { handlePlaySong, handleListSong, handleClickBtnPlayAll, handleEventClickBXH } from "./home-player.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const namePlaylist = $('.name-album .name')
const totalPlaylist = $('.name-album .total')
const songPlaylist = $('.album-playlist')
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
    let url = urlAPI + 'api/playlist/' + id
      
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(function(result){
            namePlaylist.innerHTML = result.playlistName
            totalPlaylist.innerHTML = `${result.songs.length} bài hát`
            //set list song
            let listSong = result.songs.map(song => song.songs)
            console.log(listSong)
            
            let html = listSong.map(function(song, index){
                let listArtists = song.artistSongs.map(function(artist){
                    return artist.artists.fullName
                })
                let artists = listArtists.join(", ")

                return `<div class="d-flex bd-highlight mb-2 bxh-item" data-index="${index}">
                    <p class="bd-highlight bxh-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                    <div class="info-bxh p-2 bd-highlight ms-3">
                        <span class="ava-player">
                            <img src="${song.image}"
                                style="height: 50px; width: 50px; border-radius: 5px;" alt="">
                        </span>
                        <div class="name-song">
                            <p class="name">${song.title}</p>
                            <p class="art">${artists}</p>
                        </div>
                    </div>
                    <div class="ms-auto add-to-playlist-wrap" style="display: block;">
                        <button class="bd-highlight btn-add-to-playlist" id="btnmore">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="more_option" id="moreoption">
                            <li>
                                <a href="${song.mediaUrl}" class="opt_icon">
                                    <i class="fas fa-arrow-circle-down me-1"></i>
                                    Download Now
                                </a>
                            </li>
                            <li><a href="#"><i class="far fa-trash-alt me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </div>`
            })
            songPlaylist.innerHTML = html.join("")
        })
        .catch(error => console.log('error', error));
}


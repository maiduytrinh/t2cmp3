import { urlAPI } from "./config.js"
import { handlePlaySong } from "./home-player.js"
import { handleListSong } from "./home-player.js"
import { handleEventClickBXH } from "./home-player.js"
import { handleClickBtnPlayAll } from "./home-player.js"
import { handleHideElement } from "./home-user.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const album = $('.album')
const bxh = $('.bxh')
const artistElement = $('.artist')
const genres = $('.container-the-loai')
let isActive = false

function start() {
    handleHideElement();
    callAPIAlbum(1, 5);
    callAPIBXH(10);
    callAPIArtist(1, 5);
    callAPIGenres();
}

start()

function handleClickGenres(){
    genres.onclick = function(e){
        const isActive = $('.panel.active')
        const genresNode = e.target.closest('.panel:not(.active)')
        if(genresNode) {
            if(isActive){
                isActive.classList.remove("active")
            }
            genresNode.classList.add("active")
        }
    }
}

export function callAPIAlbum(page, size){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/albums/", requestOptions)
    .then(function(response){
        // var headers =response.headers.get('Access-Control-Allow-Methods')
        // console.log(headers)
      return response.json() 
    })

    .then(
        function(results){
            let htmls = results.albums.map(function(album){
                return `
                <a href="./chi-tiet-album.html?id=${album.id}" class="album-item">
                    <div>
                        <img src="${album.image}" alt="">
                        <h2>${album.albumName}</h2>
                        <p>Lượt nghe: <span>${album.totalListen}</span></p>
                    </div>
                </a>
                `
            })
            //get list album
            let html = htmls.join("");
            album.innerHTML = html;
    })
    .catch(error => console.log('error', error));
}

export function callAPIBXH(size){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(urlAPI + "api/songs/top"+size, requestOptions)
        .then(response => response.json())
        .then(function(results){
            let html = results.map(function(song, index){
                //get name artist
                let listArtists = song.artistSongs.map(function(artist){
                    return artist.artists.fullName
                })
                let artists = listArtists.join(", ")
                // console.log(song.artistSongs[0].artists.fullName)
                return `
                    <div class="d-flex bd-highlight mb-2 bxh-item" data-index="${index}">
                        <p class="bd-highlight bxh-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                        <div class="info-bxh p-2 bd-highlight ms-3">
                            <span class="ava-player">
                                <img src="${song.image}" style="height: 50px; width: 50px; border-radius: 5px;"
                                    alt="">
                            </span>
                            <div class="name-song">
                                <p class="name">${song.title}</p>
                                <p class="art">${artists}</p>
                            </div>
                        </div>
                        <div class ="ms-auto add-to-playlist-wrap">
                            <button class="bd-highlight btn-add-to-playlist" id="btnmore">
                                <i class="fas fa-ellipsis-h"></i>
                            </button>
                            <ul class="more_option" id="moreoption">
                                <li>
                                    <a href="${song.mediaUrl}" class="opt_icon">
                                        <i class="fas fa-arrow-circle-down me-2"></i>
                                        Download Now
                                    </a>
                                </li>
                                <li><a href="#"><i class="fas fa-folder-plus me-2"></i>Add To
                                        Playlist</a></li>
                            </ul>
                        </div>
                    </div>`
            })
            //get bxh
            bxh.innerHTML = html.join("")
            let listSong = handleListSong(results)
            handlePlaySong(listSong)
            handleEventClickBXH(listSong)
            if(size == 30){
                handleClickBtnPlayAll(listSong)
            }
        })
        .catch(error => console.log('error', error));
}

export function callAPIArtist(page, size){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/artist/", requestOptions)
    .then(response => response.json())
    .then(
        function(results){
            let htmls = results.artists.map(function(artist){
                return `
                    <a href="#" class="artist-item" data-index="${artist.id}">
                            <div>
                                <img src="${artist.image}" alt="">
                                <h2>${artist.fullName}</h2>
                            </div>
                    </a>
                ` 
            })
            let html = htmls.join("");
            artistElement.innerHTML = html
        })
        
    .catch(error => console.log('error', error));
    
}

function callAPIGenres(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "page": 1,
    "size": 10,
    "order": ""
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/genres/", requestOptions)
    .then(response => response.json())
    .then(function(results){
        let htmls = results.genres.map(function(genre, index){
                return `<div class="panel" style="background-image: url(${genre.image})">
                            <a href="./chi-tiet-the-loai.html?id=${genre.id}">${genre.genresName}</a>
                        </div>`
            })
        genres.innerHTML = htmls.join('')
        handleClickGenres()
    })
    .catch(error => console.log('error', error));
}



import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const album = $('.album')

function start(){
    callGetAPI(1, 10)
}
start()

function callGetAPI(page, size, search){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": "",
    "search": search
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/albums/", requestOptions)
    .then(response => response.json())
    .then(function(result){
        let html = result.albums.map(function(album){
            let artists, songs
            if(album.artistAlbums){
                let listArtists = album.artistAlbums.map(function(artist){
                    return artist.artists.fullName
                })
                artists = listArtists.join(", ")
            }
            if(album.albumSongs){
                let listSongs = album.albumSongs.map(function(song){
                    return song.songs.title
                })
                songs = listSongs.join(`, `)
            }
            return `
                <a href="./chi-tiet-album.html?id=${album.id}" class="album-item" data-index="${album.id}">
                    <div>
                        <img src="${album.image}" alt="">
                        <h2>${album.albumName}</h2>
                        <p>Lượt nghe: <span>${album.totalListen}</span></p>
                    </div>
                </a>`
        })
        album.innerHTML = html.join('')
    })
    .catch(error => console.log('error', error));
}
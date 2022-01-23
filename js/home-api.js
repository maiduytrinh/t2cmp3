const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const album = $('.album')
const bxh = $('.bxh')
const artistElement = $('.artist')
const playerWrapper = $('.main-player-wrapper')
const genres = $('.container-the-loai')
const playlist = $('.list-ul')
// const cd = $('.flex-shrink-0')
const heading = $('.name-song-player')
const img = $('.flex-shrink-0')
const artist = $('.art')
const audio = $('#player2')
const btnplay = $('.btn-toggle-play')
// const range = $('#progress')
const btnnext = $('.fa-step-forward')
const btnprev = $('.fa-step-backward')
const btnRandom = $('.fa-random')
const btnRepeat = $('.fa-redo')
let isPlaying = false
let isRandom = false
let isRepeat = false

function start() {
    callAPIAlbum();
    callAPIBXH();
    callAPIArtist();
    callAPIGenres();
}

start()

function handlePlaySong(listSong){
    let currentIndex = 0
    
    let songsPlayed = []
    rendePlayList(listSong)
    loadCurrentSong(listSong, currentIndex)
    handleEvent()
     
}

function rendePlayList(listSong) {
    let htmls = listSong.map(function(song, index){
        return `
            <li class="jp-playlist-current" data-index="${index}">
                <div>
                    <a href="" class="jp-playlist-item jp-playlist-current">
                        <span class="ava-player" style="background-image: url(${song.image});">
                        </span>
                        <div class="name-song">
                            <p class="name">${song.name}</p>
                            <p class="art">${song.singer}</p>
                        </div>
                        <i class="fas fa-times btn-delete"></i>
                    </a>
                </div>
            </li>
        `
    })
    playlist.innerHTML = htmls.join('')
}

//xu ly su kien
function handleEvent(){

    btnplay.onclick = function(){
        console.log("click")
        if(isPlaying){
          audio.pause()
        }else{
          audio.play()
        }
      }
      audio.onplay = function () {
        isPlaying = true
        playerWrapper.classList.add('playing')
        // play.classList.add('playing')
        // cdThumb.play()
      }
      audio.onpause = function () {
        isPlaying = false
        playerWrapper.classList.remove('playing')
        // play.classList.remove('playing')
        // cdThumb.pause()
      }
}

function loadCurrentSong(listSong, currentIndex){
    heading.textContent = listSong[currentIndex].name
    img.style.backgroundImage = `url(${listSong[currentIndex].image})`
    artist.textContent = listSong[currentIndex].singer
    audio.src = listSong[currentIndex].path
    //load playlist
    const isActive = $('.jp-playlist-current.active')
    if (isActive) {
      isActive.classList.remove('active')
    }
    const listElement = $$('.jp-playlist-current')
    listElement[currentIndex].classList.add('active')
}

function handleListSong(success){
    let data = success.map(function(song){
        //get name artist
        let listArtists = song.artistSongs.map(function(artist){
            return artist.artists.fullName
        })
        let artists = listArtists.join(", ")
        return {
            name: song.title,
            singer: artists,
            path: song.mediaUrl,
            image: song.image

        }
    })
    console.log(data)
    handlePlaySong(data)
    
}


function callAPIAlbum(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": 1,
    "size": 5,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://14.228.23.16:8080/api/albums/", requestOptions)
    .then(response => response.json())
    .then(
        function(results){
            let htmls = results.albums.map(function(album){
                return `
                <a href="#" class="album-item" data-index="${album.id}">
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

function callAPIBXH(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://14.228.23.16:8080/api/songs/top10", requestOptions)
        .then(response => response.json())
        .then(function(results){
                
                let htmls = results.map(function(song, index){
                    //get name artist
                    let listArtists = song.artistSongs.map(function(artist){
                        return artist.artists.fullName
                    })
                    let artists = listArtists.join(", ")
                    // console.log(song.artistSongs[0].artists.fullName)
                    return `
                        <div class="d-flex bd-highlight mb-2 bxh-item" data-index="${index}">
                        <p class="bd-highlight bxh-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                        <div class="info-player p-2 bd-highlight ms-3">
                            <span class="ava-player">
                                <img src="${song.image}" style="height: 50px; width: 50px; border-radius: 5px;"
                                    alt="">
                            </span>
                            <div class="name-song">
                                <p class="name">${song.title}</p>
                                <p class="art">${artists}</p>
                            </div>
                        </div>
                        <button class="ms-auto p-2 bd-highlight btn-add-to-playlist">
                            <i class="fas fa-plus-circle "></i>
                        </button>
                        </div>
                    `
                })
                //get bxh
                let html = htmls.join("");
                bxh.innerHTML = html;
                handleListSong(results);
        })
        .catch(error => console.log('error', error));
}

function callAPIArtist(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": 1,
    "size": 5,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://14.228.23.16:8080/api/artist/", requestOptions)
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
    "size": 5,
    "order": ""
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://14.228.23.16:8080/api/genres/", requestOptions)
    .then(response => response.json())
    .then(function(results){
        let htmls = results.genres.map(genre =>
            `<div class="panel active"
                                style="background-image: url(${genre.image})">
                                <h3>${genre.genresName}</h3>
            </div>`
        )
        genres.innerHTML = htmls.join('')

    })
    .catch(error => console.log('error', error));
}



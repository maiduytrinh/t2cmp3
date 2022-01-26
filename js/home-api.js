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
const range = $('#progress')
const btnnext = $('.fa-step-forward')
const btnprev = $('.fa-step-backward')
const btnRandom = $('.fa-random')
const btnRepeat = $('.fa-redo')
const btnPlayList = $('.que-text')
const btnClosePlayList = $('.btn-closee')
let isPlaying = false
let isRandom = false
let isRepeat = false
let currentIndex = 0
let songsPlayed = []

function start() {
    callAPIAlbum();
    callAPIBXH();
    callAPIArtist();
    callAPIGenres();
}

start()

function handlePlaySong(listSong){
    rendePlayList(listSong)
    loadCurrentSong(listSong, currentIndex)
    handleEvent(listSong)
     
}

function rendePlayList(listSong) {
    let htmls = listSong.map(function(song, index){
        return `
        <li class="jp-playlist-current" data-index="${index}">
            <div class="d-flex align-items-center ">
                <div class="flex-shrink-0">
                    <img class="img-fluid rounded" src="${song.image}">
                </div>
                <div class="flex-grow-1 ms-3 name-song">
                    <p class="name">${song.name}</p>
                    <p class="art">${song.singer}</p>
                </div>
            </div>
        </li>
        `
    })
    playlist.innerHTML = htmls.join('')
}

//xu ly su kien
function handleEvent(listSong){

    btnplay.onclick = function(){
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
    cdThumb.play()
    }
    audio.onpause = function () {
    isPlaying = false
    playerWrapper.classList.remove('playing')
    // play.classList.remove('playing')
    cdThumb.pause()
    }

    //xu ly thanh chay
    audio.ontimeupdate = function() {
    if(audio.duration) {
        const rangeTime = Math.floor(audio.currentTime / audio.duration * 100)
        $(".start-time").innerHTML = covertTime(audio.currentTime)
        range.value = rangeTime
    }
    }
    //xu ly tua
    range.oninput = function () {
    audio.currentTime = Math.floor(this.value * audio.duration / 100)
    }
    range.onmousedown = function(){
        audio.pause()
    }
    range.onmouseup = function(){
    audio.play()
    }

    audio.addEventListener('timeupdate',function (){

        var duration = audio.duration;
        if(audio.duration){
            $(".end-time").innerHTML = covertTime(duration)
        }
    });
      
    //click playlist
    playlist.onclick = function(e) {
        const songNode = e.target.closest('li.jp-playlist-current:not(.active)')
        if(songNode && !e.target.closest('.option')) {
            if(songNode) {
                currentIndex = songNode.dataset.index
                loadCurrentSong(listSong, currentIndex)
                audio.play()
            }
        }
    }

    //click btn playlist
    btnPlayList.onclick = function(){
        $('.queue-expand').style.display = 'block'
    }
    //close
    btnClosePlayList.onclick = function(){
        $('.queue-expand').style.display = 'none'
    }

    //anh quay
    const cdThumb = img.animate({
        transform: 'rotate(360deg)'
      },{
        duration: 10000,
        iterations: Infinity,
      })
      cdThumb.pause()

    //xu ly next
    btnnext.onclick = function() {
        if(isRandom) {
          loadRandomSong(listSong)
        }else {
          nextSong(listSong)
        }
        audio.play()
        scrollActiveSong()
    }

    //xu ly prev
    btnprev.onclick = function() {
        if(isRandom) {
          loadRandomSong(listSong)
        }else {
          prevSong(listSong)
        }
        audio.play()
        scrollActiveSong()
    }

    //xu ly random
    btnRandom.onclick = function() {
        isRandom = !isRandom
        if(isRandom) {
          this.classList.add("active")
        }else {
          this.classList.remove("active")
          songsPlayed = []
        }
    }

    //xu ly repeat
    btnRepeat.onclick = function() {
        isRepeat = !isRepeat
        if(isRepeat) {
            this.classList.add("active")
        }else {
            this.classList.remove("active")
        }

    }

    //xu ly ended
    audio.onended = function() {
        if (isRepeat) {
          audio.play()
        }else {
          btnnext.click()
        }
    }
}

function covertTime(time){
    var sec= new Number();
    var min= new Number();
     sec = Math.floor( time );    
     min = Math.floor( sec / 60 );
    min = min >= 10 ? min : '0' + min;    
    sec = Math.floor( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;
    return min+":"+sec
}

function scrollActiveSong(){
    setTimeout(() => {
      if (currentIndex <= 3) {
        $('li.jp-playlist-current.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }else {
        $('li.jp-playlist-current.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
      
    }, 300)
  }

function nextSong(listSong){
    currentIndex++
    if(currentIndex >= listSong.length) {
        currentIndex = 0
    }
    loadCurrentSong(listSong)
}

function prevSong(listSong){
    currentIndex--
    if(currentIndex < 0) {
        currentIndex = listSong.length - 1
    }
    loadCurrentSong(listSong)
}

function loadRandomSong(listSong) {
    let newIndex 
    const lenghtList = listSong.length
    const newLength = songsPlayed.push(currentIndex)
    if (newLength == lenghtList) {
      songsPlayed = []
    }
    do {
      newIndex = Math.floor(Math.random() * lenghtList)
    }while(songsPlayed.includes(newIndex))
    currentIndex = newIndex
    loadCurrentSong(listSong)
}

function loadCurrentSong(listSong){
    heading.textContent = listSong[currentIndex].name
    img.style.backgroundImage = `url(${listSong[currentIndex].image})`
    artist.textContent = listSong[currentIndex].singer
    audio.src = listSong[currentIndex].path
    //load playlist
    const isActive = $('li.jp-playlist-current.active')
    if (isActive) {
      isActive.classList.remove('active')
    }
    const listElement = $$('li.jp-playlist-current')
    listElement[currentIndex].classList.add('active')
}

function handleEventClickBXH(listSong){
    bxh.onclick = function(e){
        const songNode = e.target.closest('.info-bxh')
        if(songNode){
            playerWrapper.style.display = 'flex'
            currentIndex = songNode.parentElement.dataset.index
            loadCurrentSong(listSong, currentIndex)
            audio.play()
            scrollActiveSong()
        }
    }
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
    return data
}

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
                        <button class="ms-auto p-2 bd-highlight btn-add-to-playlist">
                            <i class="fas fa-plus-circle "></i>
                        </button>
                        </div>
                    `
                })
                //get bxh
                let html = htmls.join("")
                bxh.innerHTML = html
                let listSong = handleListSong(results)
                handlePlaySong(listSong)
                handleEventClickBXH(listSong)
        })
        .catch(error => console.log('error', error));
}

function changeStyle(){
    var element = document.querySelector(".more-option");
    element.style.opacity = "1";
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
        let htmls = results.genres.map(function(genre, index){
                return `<div class="panel" style="background-image: url(${genre.image})">
                            <h3>${genre.genresName}</h3>
                        </div>`
            })
        genres.innerHTML = htmls.join('')
        handleClickGenres()
    })
    .catch(error => console.log('error', error));
}



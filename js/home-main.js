import { handlePlaySong, handleListSong, handleEventClickBXH} from "./home-player.js"
import { handleHideElement, isLogin} from "./home-user.js"


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const inputSearch = $('.main-top-left .form-control')
const album = $('.album')
const artistElement = $('.artist')
const song = $('.bxh')

function start(){
    handleHideElement()
    searchEvent()
}
start()

function searchEvent(){
    inputSearch.onkeyup = function(e){
        if(e.keyCode == 13){
            window.location.href = '../tim-kiem.html?p='+this.value
        }
    }
}

export function callAPIAlbum(page, size, url, paginationAlbum, search){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": "",
    "search": search

    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(url, requestOptions)
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
            if(paginationAlbum){
                let htmlPage = ''
                for(let i = 1; i <= results.totalPages; i++){
                    htmlPage += `<li class="pagination__item"><a href="#" class="pagination__link"  data-index="${i}">${i}</a></li>`
                }
                paginationAlbum.innerHTML = htmlPage
                loadCurrentPage(paginationAlbum, page)
                handleClickPage(page, size, url, paginationAlbum, search, callAPIAlbum)
            }
    })
    .catch(error => console.log('error', error));
}

export function callAPIArtist(page, size, url, paginationArtist, search){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": "",
    "search": search
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(url, requestOptions)
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
            if(paginationArtist){
                let htmlPage = ''
                for(let i = 1; i <= results.totalPages; i++){
                    htmlPage += `<li class="pagination__item"><a href="#" class="pagination__link"  data-index="${i}">${i}</a></li>`
                }
                paginationArtist.innerHTML = htmlPage
                loadCurrentPage(paginationArtist, page)
                handleClickPage(page, size, url, paginationArtist, search, callAPIArtist)
            }
        })
        
    .catch(error => console.log('error', error));
    
}

export function callAPISong(page, size, url, songListElement, paginationSong, search){
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

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(function(result){
        let listSong = result.songs
        let html = listSong.map(function(song, index){
            let listArtists = song.artistSongs.map(function(artist){
                return artist.artists.fullName
            })
            let artists = listArtists.join(", ")
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
        songListElement.innerHTML = html.join("")
        const addPlaylist = $$('.add-to-playlist-wrap')
        if(isLogin){
            for(let i=0; i<addPlaylist.length; i++){
                addPlaylist[i].style.display = "block"
            }
        }
        if(paginationSong){
            let htmlPage = ''
            for(let i = 1; i <= result.totalPages; i++){
                htmlPage += `<li class="pagination__item"><a href="#" class="pagination__link"  data-index="${i}">${i}</a></li>`
            }
            paginationSong.innerHTML = htmlPage
            loadCurrentPage(paginationSong, page)
            paginationSong.onclick = function(e){
                let pageNode = e.target.closest('.pagination__link:not(.is_active)')
                if(pageNode) {
                    page = pageNode.dataset.index
                    callAPISong(page, size, url, songListElement, paginationSong, search)
                }
            }
        }
        let listSongNew = handleListSong(listSong)
        handlePlaySong(listSongNew)
        handleEventClickBXH(listSongNew)
      })
      .catch(error => console.log('error', error));
}

function handleClickPage(page, size, url, pagination, search, callAPI){
    pagination.onclick = function(e){
        let pageNode = e.target.closest('.pagination__link:not(.is_active)')
        if(pageNode) {
            page = pageNode.dataset.index
            callAPI(page, size, url, pagination, search)
        }
    }
}

function loadCurrentPage(pagination, page){
    const isActive = pagination.querySelector(".pagination__link.is_active")
    if (isActive) {
      isActive.classList.remove('is_active')
    }
    const listElement = pagination.querySelectorAll(".pagination__link")
    listElement[page - 1].classList.add('is_active')
}



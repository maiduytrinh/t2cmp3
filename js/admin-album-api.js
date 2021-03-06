import { urlAPI } from "./config.js"
import {logoutAdmin, handleModal} from "./home-user.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableAlbum = $('.table-striped tbody')
const pagination = $('.pagination')
const inputSearch = $('.input-search')
let page = 1
let size = 10
let search =''


function start() {
    callGetAPI(page, size);
    handleSearch()
    logoutAdmin()
    handleModal()
}
start()

function loadCurrentPage(pagination, page){
    const isActive = pagination.querySelector(".pagination__link.is_active")
    if (isActive) {
      isActive.classList.remove('is_active')
    }
    const listElement = pagination.querySelectorAll(".pagination__link")
    listElement[page - 1].classList.add('is_active')
}

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

    fetch( urlAPI +"api/albums/", requestOptions)
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
            return `<tr>
                <td><img src="${album.image}" style="width: 50px; border-radius: 5px;" alt=""></td>
                <td>${album.id}</td>
                <td>${album.albumName}</td>
                <td>${artists}</td>
                <td>${songs}</td>
                    <td class="text-end" data-index="${album.id}">
                    <a href="./admin-update-album.html?id=${album.id}" class="btn btn-active-light-primary">
                        <i class="far fa-edit"></i>
                    </a>
                    <button class="btn btn-del" style="color: red;">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`
        })
        tableAlbum.innerHTML = html.join('')
        let htmlPage = ''
        for(let i = 1; i <= result.totalPages; i++){
            htmlPage += `<li class="pagination__item"><a href="#" class="pagination__link"  data-index="${i}">${i}</a></li>`
        }
        pagination.innerHTML = htmlPage
        loadCurrentPage(pagination, page)
        pagination.onclick = function(e){
            let pageNode = e.target.closest('.pagination__link:not(.is_active)')
            if(pageNode) {
                page = pageNode.dataset.index
                callGetAPI(page, size, search)
            }
        }
        callDelAPI()
    })
    .catch(error => console.log('error', error));
}

function callDelAPI(){
    const btnDels = $$('.btn-del')
    for(let i=0; i<btnDels.length; i++){
        btnDels[i].onclick = function(){
            if(confirm("B???n ch???c ch???n mu???n x??a album") == true){
                let id = btnDels[i].parentElement.dataset.index
                var requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                  };
                  
                  fetch(urlAPI + "api/albums/" + id, requestOptions)
                    .then(response => response.text())
                    .then(function(result){
                        if(result)
                            alert('X??a kh??ng th??nh c??ng')
                        else{
                            alert('X??a th??nh c??ng')
                            callGetAPI(page, size)
                        }
                    })
                    .catch(error => console.log('error', error));
            }
        }
    }
}

function handleSearch(){
    inputSearch.onchange = function(){
        search = inputSearch.value
        callGetAPI(page, size, search)
    }
}

function handleClickEdit(){}
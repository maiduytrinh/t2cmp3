import { urlAPI } from "./config.js"
const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableSong = $('.table-striped tbody')
const numPage = $('.number-page')
const numSong = $('.number-song')
const formSelect = $('.form-select')
const btnNext = $('.next-page')
const btnPrev = $('.prev-page')
const inputSearch = $('.input-search')
let page = 1
let size = 10
let search =''

function start() {
    callGetAPI(page, size)
    handleSearch()
}
start()

function handlePagination(totalPages){
    formSelect.onchange = function(){
        page = 1
        callGetAPI(page, formSelect.value, search)

    }

    numPage.onclick = function(e){
        let pageNode = e.target.closest('.page-item:not(.active)')
        if(pageNode) {
            page = pageNode.dataset.index
            callGetAPI(page, size)
        }
    }

    btnNext.onclick = function(){
        if(page < totalPages){
            page++
            callGetAPI(page, size)
        }
    }

    btnPrev.onclick = function(){
        if(page > 1){
            page--
            callGetAPI(page, size)
        }
    }

}

function loadCurrentPage(){
    const isActive = $('.number-page .page-item.active')
    if (isActive) {
      isActive.classList.remove('active')
    }
    const listElement = $$('.number-page .page-item')
    listElement[page - 1].classList.add('active')
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

    fetch(urlAPI + "api/songs/", requestOptions)
    .then(response => response.json())
    .then(function(result){
        let html = result.songs.map(function(song){
            let listArtists = song.artistSongs.map(function(artist){
                return artist.artists.fullName
            })
            let artists = listArtists.join(", ")
            return `<tr>
                        <td><input class="form-check-input" type="checkbox" value=""
                        id="flexCheckDefault"></td>
                        <td>image</td>
                        <td>${song.id}</td>
                        <td>${song.title}</td>
                        <td>${song.timePlay}</td>
                        <td>${song.countListen}</td>
                        <td>${artists}</td>
                        <td class="text-end" data-index="${song.id}">
                                <a href="./admin-update-song.html?id=${song.id}" class="btn btn-active-light-primary">
                                    <i class="far fa-edit"></i>
                                </a>
                                <button class="btn btn-del" style="color: red;">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                        </td>
                    </tr>`
        })
        tableSong.innerHTML = html.join('')
        numSong.innerHTML = `Tổng ${result.totalElements} bài hát`
        let htmlPage = ''
        for(let i = 1; i <= result.totalPages; i++){
            htmlPage += `<li class="page-item" data-index="${i}"><a class="page-link" href="#">${i}</a></li>`
        }
        numPage.innerHTML = htmlPage
        handlePagination(result.totalPages)
        loadCurrentPage()
        callDelAPI()
    })
    .catch(error => console.log('error', error));
}

function callDelAPI(){
    const btnDels = $$('.btn-del')
    for(let i=0; i<btnDels.length; i++){
        btnDels[i].onclick = function(){
            if(confirm("Bạn chắc chắn muốn xóa bài hát") == true){
                let id = btnDels[i].parentElement.dataset.index
                var requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                  };
                  
                  fetch(urlAPI + "api/songs/" + id, requestOptions)
                    .then(response => response.text())
                    .then(function(result){
                        if(result)
                            alert('Xóa không thành công')
                        else{
                            alert('Xóa thành công')
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


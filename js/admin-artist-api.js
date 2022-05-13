import { urlAPI } from "./config.js"
import {logoutAdmin, handleModal} from "./home-user.js"
// import { handlePagination, loadCurrentPage } from "./admin-album-api.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableArtist = $('.table-striped tbody')
const pagination = $('.pagination')
const inputSearch = $('.input-search')
let page = 1
let size = 10
let search =''

function start() {
    callGetAPI(page, size)
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

    fetch(urlAPI + "api/artist/", requestOptions)
    .then(response => response.json())
    .then(function(result){
        let html = result.artists.map(function(artist,index){
                return`<tr>
                    <td><img src="${artist.image}" style="width: 50px; border-radius: 5px;" alt="">
                    <td>${artist.id}</td>
                    <td>${artist.fullName}</td>
                    <td>${artist.birthDay}</td>
                    <td>${artist.countryActive}</td>
                    <td class="text-end" data-index="${artist.id}">
                                <a href="./admin-update-artist.html?id=${artist.id}" class="btn btn-active-light-primary">
                                    <i class="far fa-edit"></i>
                                </a>
                                <button class="btn btn-del" style="color: red;">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                    </td>
                </tr>`
        })
        tableArtist.innerHTML = html.join('')
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
    // console.log(btnDels.length)
    for(let i=0; i<btnDels.length; i++){
        btnDels[i].onclick = function(){
            if(confirm("Bạn chắc chắn muốn xóa ca sĩ") == true){
            let id = btnDels[i].parentElement.dataset.index
            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
              };
              
              fetch(urlAPI + "api/artist/" + id, requestOptions)
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

function handleClickEdit(){
    
}
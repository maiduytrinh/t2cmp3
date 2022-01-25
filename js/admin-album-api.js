const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableAlbum = $('.table-striped tbody')
const numPage = $('.number-page')
const numAlbum = $('.number-album')
const formSelect = $('.form-select')
const btnNext = $('.next-page')
const btnPrev = $('.prev-page')
let page = 1
let size = 10


function start() {
    callGetAPI(page, size);
}
start()

function handlePagination(totalPages){
    formSelect.onchange = function(){
        page = 1
        callGetAPI(page, formSelect.value)
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

function callGetAPI(page, size){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "page": page,
    "size": size,
    "order": ""
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://14.228.23.16:8080/api/albums/", requestOptions)
    .then(response => response.json())
    .then(function(result){
        let html = result.albums.map(album =>
            `<tr>
                <td><input class="form-check-input" type="checkbox" value=""
                        id="flexCheckDefault"></td>
                <td>Image</td>
                <td>${album.id}</td>
                <td>${album.albumName}</td>
                <td>${album.totalListen}</td>
                <td class="text-end">
                    <a href="#" class="btn btn-active-light-primary">
                        <i class="far fa-edit"></i>
                    </a>
                    <button type="submit" class="btn" style="color: red;">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`
        )
        tableAlbum.innerHTML = html.join('')
        numAlbum.innerHTML = `Tổng ${result.totalElements} album`
        let htmlPage = ''
        for(let i = 1; i <= result.totalPages; i++){ 
            htmlPage += `<li class="page-item" data-index="${i}"><a class="page-link" href="#">${i}</a></li>`
        }
        numPage.innerHTML = htmlPage
        handlePagination(result.totalPages)
        loadCurrentPage()
    })
    .catch(error => console.log('error', error));
}
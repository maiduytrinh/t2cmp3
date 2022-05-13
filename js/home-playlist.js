import { apiGetPlaylist} from "./home-main.js"
import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const listElement = $('.bxh')
const btnOpenAdd = $('.btn-primary')
const modal = document.getElementById("myModal1")
const inputName = $('#name-playlist')
const btnAdd = $('#submitButton1')
const modalEdit = $('#modal-edit-playlist')
const inputNameEdit = $('#modal-edit-playlist #name-playlist')
const btnSaveEdit = $('#modal-edit-playlist #submitButton')
let idUser = localStorage.getItem('id')
let email = localStorage.getItem('email')
let url = urlAPI + 'api/playlist/all/' + idUser
function start() {
    apiGetPlaylist(1, 20, url, renderListPlaylist, listElement)
}
start()

function renderListPlaylist(result, listElement){
    let html = result.map((playlist,index) => 
            `<div class="d-flex bd-highlight mb-2 bxh-item" data-index="${playlist.id}">
                <p class="bd-highlight bxh-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                <div class="info-bxh p-2 bd-highlight ms-3">
                    <div class="name-song">
                        <a href="./chi-tiet-playlist.html?id=${playlist.id}" class="name-playlist">${playlist.playlistName}</a>
                    </div>
                </div>
                <div class="ms-auto add-to-playlist-wrap" style="display: block;">
                    <button class="bd-highlight btn-add-to-playlist" id="btnmore">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <ul class="more_option" style="width: 100px;" id="moreoption" data-index="${playlist.id}">
                        <li class="opt_icon edit-playlist">
                            <a href="#" >
                                <i class="far fa-edit me-1"></i>
                                Edit
                            </a>
                        </li>
                        <li class="del-playlist"><a href="#" ><i class="far fa-trash-alt me-2"></i>Delete</a></li>
                    </ul>
                </div>
            </div>`
        )
        listElement.innerHTML = html.join('')
        const btnDels = $$('.del-playlist')
        const btnEdits = $$('.edit-playlist')
        //xu lu xoa
        for(let i = 0; i<btnDels.length; i++)
            btnDels[i].onclick = function(){
                if(confirm("Bạn chắc chắn muốn xóa playlist") == true){
                    let idPlaylist = this.parentElement.dataset.index
                    let requestOptions = {
                        method: 'DELETE',
                        redirect: 'follow'
                      };
                      
                      fetch(urlAPI + "api/playlist/" + idPlaylist, requestOptions)
                        .then(response => response.text())
                        .then(function(result){
                            if(result)
                                alert('Xóa không thành công')
                            else{
                                alert('Xóa thành công')
                                apiGetPlaylist(1, 20, url, renderListPlaylist, listElement)
                        }
                        })
                        .catch(error => console.log('error', error));
                }
        }
        //xu ly sua
        let idPlaylist
        for(let i = 0; i<btnEdits.length; i++){
            btnEdits[i].onclick = function(){
                idPlaylist = this.parentElement.dataset.index
                modalEdit.style.display = "block"
                inputNameEdit.value = ''
            }
        }
        btnSaveEdit.onclick = function(){
            let namePlaylist = inputNameEdit.value
            if(namePlaylist){
                let playlist = {}
                playlist.playlistName = namePlaylist
                let formdata = new FormData();
                formdata.append("playlist", JSON.stringify(playlist));

                let requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
                };

                fetch(urlAPI + "api/playlist/update/" + idPlaylist, requestOptions)
                .then(response => response.json())
                .then(function(result){
                        if(result.id){
                            alert('Đã sửa thành công')
                            apiGetPlaylist(1, 20, url, renderListPlaylist, listElement)
                        }else{
                            alert('Sửa thất bại')
                        }
                    })
                .catch(error => console.log('error', error));
            }
        }
}

btnOpenAdd.onclick = function() {
    modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal || event.target == modalEdit) {
      modal.style.display = "none";
      modalEdit.style.display = "none";
    }
}

btnAdd.onclick = function(){
    let namePlaylist = inputName.value
    if(namePlaylist){
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(urlAPI + "api/users/" + email, requestOptions)
            .then(response => response.json())
            .then(function(result){
                let playlist = {}
                playlist.users = result
                playlist.playlistName = namePlaylist
                let formdata = new FormData();
                formdata.append("playlist", JSON.stringify(playlist));

                var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
                };

                fetch(urlAPI + "api/playlist/save", requestOptions)
                .then(response => response.json())
                .then(function(result){
                    if(result.id){
                        alert('Đã thêm thành công')
                        apiGetPlaylist(1, 20, url, renderListPlaylist, listElement)
                    }else{
                        alert('Thêm thất bại')
                    }
                })
                .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
    }
}


import { urlAPI } from "./config.js"
import {} from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const listSongElement = $(".table-responsive tbody")
const addInputGenres = $('.add-song .input-genres')
const addInputName = $('.add-song .input-name')
const addInputLyric = $('.add-song .input-lyric') 
const addInputFile = $('.add-song #files')
const addBtnSave = $('.add-song .btn-save')
let idArtist = localStorage.getItem('idArtist')
let listSong
let listGenres
let page = 1
let size = 10
let search =''

function start(){
    callGetAPI()
}
start()

function callGetAPI(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(urlAPI + "api/artist/" + idArtist, requestOptions)
        .then(response => response.json())
        .then(function(result){
            listSong = result.artistSongs.map(artistSong => artistSong.songs)
            let html = listSong.map((song) => 
                `<tr>
                <td><img src="${song.image}" style="width: 50px; border-radius: 5px;" alt="">

                </td><td>${song.id}</td>
                <td>${song.title}</td>
                <td>${song.countListen}</td>
                <td class="text-end">
                    <details>
                        <summary>

                            <div class="buttonn-edit">

                                <i class="far fa-edit"></i>
                            </div>

                            <div class="details-modal-overlay"></div>
                        </summary>

                        <div class="details-modal edit-song" style="color: #14182a;">
                            <div class="details-modal-close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="black"></path>
                                </svg>
                            </div>
                            <div class="details-modal-title ">
                                <h1>Sửa bài hát</h1>
                            </div>
                            <div class="details-modal-content">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label for="inputEmail4" class="form-label">Tên bài hát</label>
                                        <input type="text" class="form-control input-name" value="${song.title}">
                                    </div>
                                    <div class="col-12">
                                        <label for="inputEmail4" class="form-label">Lyrics</label>
                                        <textarea type="text" class="form-control input-lyric" value="${song.lyrics}"></textarea>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="inputState" class="form-label" >Thể loại</label>
                                        <select id="inputState" class="form-select input-genres">
                                            
                                        </select>
                                    </div>
                                    <div class="col-12 text-center">
                                        <input type="file" class="btn btn-primary" style="line-height: 1;" id="files" name="files" accept="image/png, image/jpeg, audio/mp3" multiple="">
                                    </div>
                                    <div class="col-12 text-center">
                                        <button class="btn btn-primary btn-save" style="line-height: 1;"  data-index="${song.id}">Lưu</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </details>

                    <div class="buttonn-del" style="color: red;" data-index="${song.id}">
                        <i class="far fa-trash-alt"></i>
                    </div>
                </td>
            </tr>`)
            listSongElement.innerHTML = html.join('')
            const editInputGenres = $$('.edit-song .input-genres')
            const editInputName = $$('.edit-song .input-name')
            const editInputLyric = $$('.edit-song .input-lyric') 
            const editInputFile = $$('.edit-song #files')
            const editBtnSave = $$('.edit-song .btn-save')
            for(let i=0; i<listSong.length; i++){
                callGetAPIGenres(result, editInputGenres[i], i, editBtnSave[i], editInputName[i], editInputLyric[i], editInputFile[i])
            }
            callGetAPIGenres(result, addInputGenres)
            callDelAPI()

            
        })
        .catch(error => console.log('error', error));
}

function callGetAPIGenres(artist, inputGenres, i, editBtnSave, editInputName, editInputLyric, editInputFile){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": 1,
    "size": 100,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/genres/", requestOptions)
    .then(response => response.json())
    .then(function(results){
        listGenres = results.genres
        let html = results.genres.map(function(genre, index){
                return `<option value="${index}">${genre.genresName}</option>`
            })
        if(typeof(i) !== "undefined"){
            inputGenres.innerHTML = html.join('')
            inputGenres.value = listSong[i].genres.id - 1
            editBtnSave.onclick = function(){
                let id = this.dataset.index
                let data = {}
                data.title = editInputName.value
                data.lyrics = editInputLyric.value
                data.genres = listGenres[Number(inputGenres.value)]
                
                data.artistSongs = []
                let artistArray = {}
                artistArray.artists = artist
                data.artistSongs[0] = artistArray

                let formdata = new FormData();
                formdata.append("song", JSON.stringify(data))
                if(editInputFile.files[0]){
                    formdata.append("files", editInputFile.files[0])
                }
                if(editInputFile.files[1]){
                    formdata.append("files", editInputFile.files[1])
                }
                let requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };
                
                fetch(urlAPI + "api/songs/update-song/" + id, requestOptions)
                    .then(response => response.json())
                    .then(function(result){
                        console.log(result)
                        if(result.id){
                            alert('Đã lưu thành công')
                            location.reload()
                        }else{
                            alert('Lưu thất bại')
                        }
                    })
                    .catch(error => console.log('error', error));
            }

        }else{
            inputGenres.innerHTML = html.join('')
            //save
            addBtnSave.onclick = function(){
                let data = {}
                data.title = addInputName.value
                data.lyrics = addInputLyric.value
                data.genres = listGenres[Number(addInputGenres.value)]
                data.artistSongs = []
                let artistArray = {}
                artistArray.artists = artist
                data.artistSongs[0] = artistArray
        
                let formdata = new FormData();
                formdata.append("song", JSON.stringify(data))
                formdata.append("files", addInputFile.files[0])
                formdata.append("files", addInputFile.files[1])
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                  };
                  
                  fetch(urlAPI + "api/songs/save", requestOptions)
                    .then(response => response.json())
                    .then(function(result){
                        if(result.id){
                            alert('Đã lưu thành công')
                            location.reload()
                        }else{
                            alert('Lưu thất bại')
                        }
                    })
                    .catch(error => console.log('error', error));
        }
        }
    })
    .catch(error => console.log('error', error));
}

function callDelAPI(){
    const btnDels = $$('.buttonn-del')
    for(let i=0; i<btnDels.length; i++){
        btnDels[i].onclick = function(){
            if(confirm("Bạn chắc chắn muốn xóa bài hát") == true){
                let id = btnDels[i].dataset.index
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
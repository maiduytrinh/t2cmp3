import { urlAPI } from "./config.js"
import {logoutAdmin, handleModal} from "./home-user.js"


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnSave = $('.btn-save')
const inputName = $('.input-name')
const inputLyric = $('.input-lyric') 
const inputArtist = $('.input-artist')
const inputGenres = $('.input-genres')
const inputFile = $('#files')
let listArtists = []
let listGenres = []
let data = {}
let id

function start(){
    let params = (new URL(document.location)).searchParams
    id = params.get("id");
    getData()
    updateData()
    logoutAdmin()
    handleModal()
}
start()

function getData(){
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

    fetch(urlAPI + "api/artist/", requestOptions)
    .then(response => response.json())
    .then(
        function(result){
            let html = result.artists.map(function(artist, index){
                return `
                    <option value="${index}">${artist.fullName}</option>
                ` 
            })
            inputArtist.innerHTML = html.join('')
            listArtists = result.artists
            callGetAPIGenres()
        })
    .catch(error => console.log('error', error));
}

function callGetAPIGenres(){
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
        let html = results.genres.map(function(genre, index){
                return `<option value="${index}">${genre.genresName}</option>`
            })
        inputGenres.innerHTML = html.join('')
        listGenres = results.genres
        setData()
    })
    .catch(error => console.log('error', error));
}

function setData(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch(urlAPI + "api/songs/" + id, requestOptions)
    .then(response => response.json())
    .then(function(result){
        inputName.value = result.title
        inputLyric.value = result.lyrics
        inputGenres.value = result.genres.id-1
        updateData()
    })
    .catch(error => console.log('error', error));
}

function updateData(){
    btnSave.onclick = function(){
        let artistSelected = [...inputArtist.options].filter(option => option.selected)
                                .map(function(option){
                                    return listArtists[Number(option.value)]
                                })
        data.title = inputName.value
        data.lyrics = inputLyric.value
        data.genres = listGenres[Number(inputGenres.value)]
        data.artistSongs = [];
        for(let i = 0; i < artistSelected.length; i++){
            let artistArray = {}
            artistArray.artists = artistSelected[i]
            data.artistSongs[i] = artistArray
        }

        let formdata = new FormData();
        formdata.append("song", JSON.stringify(data))
        if(inputFile.files[0]){
            formdata.append("files", inputFile.files[0])
        }
        if(inputFile.files[1]){
            formdata.append("files", inputFile.files[1])
        }
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };
          
          fetch(urlAPI + "api/songs/update-song/" + id, requestOptions)
            .then(response => response.json())
            .then(function(result){
                console.log(result)
                if(result.id){
                    alert('???? l??u th??nh c??ng')
                    location.reload()
                }else{
                    alert('L??u th???t b???i')
                }
            })
            .catch(error => console.log('error', error));
    }
}
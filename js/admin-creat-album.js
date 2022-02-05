import { urlAPI } from "./config.js"
const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnSave = $('.btn-save')
const inputName = $('.input-name')
const inputArtist = $('.input-artist')
const inputGenres = $('.input-genres')
const inputSong = $('.input-song')
const inputFile = $('#file')
let listArtists = []
let listGenres = []
let listSong = []
let data = {}

function start(){
    getData()
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
        callGetAPISong()
    })
    .catch(error => console.log('error', error));
}

function callGetAPISong(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "page": 1,
    "size": 100,
    "order": ""
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
        let html = result.songs.map(function(song, index){
            return `<option value="${index}">${song.title}</option>`
        })
        inputSong.innerHTML = html.join('')
        listSong = result.songs
        handleSave()
    })
}

function handleSave(){
    btnSave.onclick = function(){
        let artistSelected = [...inputArtist.options].filter(option => option.selected)
                                .map(function(option){
                                    return listArtists[Number(option.value)]})
        let songSelected = [...inputSong.options].filter(option => option.selected)
                                .map(function(option){
                                    return listSong[Number(option.value)]
                                })
        data.albumName = inputName.value
        data.genres = listGenres[Number(inputGenres.value)]
        data.artistAlbums = []
        for(let i = 0; i < artistSelected.length; i++){
            let artistArray = {}
            artistArray.artists = artistSelected[i]
            data.artistAlbums[i] = artistArray
        }
        data.albumSongs = []
        for(let i = 0; i < songSelected.length; i++){
            let songArray = {}
            songArray.songs = songSelected[i]
            data.albumSongs[i] = songArray
        }
        // console.log(data)        
        
        let formdata = new FormData();
        formdata.append("album", JSON.stringify(data))
        formdata.append("file", inputFile.files[0])
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };
          
          fetch(urlAPI + "api/albums/save", requestOptions)
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
}

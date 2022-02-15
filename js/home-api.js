import { urlAPI } from "./config.js"
import { callAPIAlbum, callAPIArtist, callAPIBXH} from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const songListElement = $('.bxh')
const genres = $('.container-the-loai')
const urlAlbum = urlAPI + "api/albums/"
const urlArtist = urlAPI + "api/artist/"

function start() {
    callAPIAlbum(1, 5, urlAlbum);
    callAPIBXH(10, songListElement);
    callAPIArtist(1, 5, urlArtist);
    callAPIGenres();
}

start()

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

function callAPIGenres(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "page": 1,
    "size": 10,
    "order": ""
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(urlAPI + "api/genres/", requestOptions)
    .then(response => response.json())
    .then(function(results){
        let htmls = results.genres.map(function(genre, index){
                return `<div class="panel" style="background-image: url(${genre.image})">
                            <a href="./chi-tiet-the-loai.html?id=${genre.id}">${genre.genresName}</a>
                        </div>`
            })
        genres.innerHTML = htmls.join('')
        handleClickGenres()
    })
    .catch(error => console.log('error', error));
}

// Popup Thay đổi mật khẩu

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}




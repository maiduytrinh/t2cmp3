import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const artist = $('.artist')

function start() {
    callAPIArtist(1, 10)
}
start()

function callAPIArtist(page, size, search){
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

    fetch(urlAPI + "api/artist/", requestOptions)
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
            artist.innerHTML = htmls.join('')
        })
    .catch(error => console.log('error', error));
    
}
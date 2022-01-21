const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const album = $('.album')
const bxh = $('.bxh')
const artistElement = $('.artist')
let data = [];
function start() {
    callAPIAlbum();
    callAPIBXH();
    callAPIArtist();

}

console.log(data)

function getListSong(success){
    data.push(success.albums);
}

function callAPIAlbum(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": 1,
    "size": 5,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://14.228.23.16:8080/api/albums/", requestOptions)
    .then(response => response.json())
    .then(
        function(results){
            let htmls = results.albums.map(function(album){
                return `
                <a href="#" class="album-item" data-index="${album.id}">
                    <div>
                        <img src="${album.image}" alt="">
                        <h2>${album.albumName}</h2>
                        <p>Lượt nghe: <span>${album.totalListen}</span></p>
                    </div>
                </a>
                `
            })
            //get list album
            let html = htmls.join("");
            album.innerHTML = html;
            getListSong(results)
        })
    .catch(error => console.log('error', error));
}

function callAPIBXH(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("https://14.228.23.16:8080/api/songs/top10", requestOptions)
        .then(response => response.json())
        .then(function(results){
                
                let htmls = results.map(function(song, index){
                    //get name artist
                    let listArtists = song.artistSongs.map(function(artist){
                        return artist.artists.fullName
                    })
                    let artists = listArtists.join(", ")
                    // console.log(song.artistSongs[0].artists.fullName)
                    return `
                        <div class="d-flex bd-highlight mb-2 bxh-item" data-index="${song.id}">
                        <p class="bd-highlight bxh-ranking p-2">${String("0" + (index + 1)).slice(-2)}</p>
                        <div class="info-player p-2 bd-highlight ms-3">
                            <span class="ava-player">
                                <img src="${song.image}" style="height: 50px; width: 50px; border-radius: 5px;"
                                    alt="">
                            </span>
                            <div class="name-song">
                                <p class="name">${song.title}</p>
                                <p class="art">${artists}</p>
                            </div>
                        </div>
                        <button class="ms-auto p-2 bd-highlight btn-add-to-playlist">
                            <i class="fas fa-plus-circle "></i>
                        </button>
                        </div>
                    `
                })
                //get bxh
                let html = htmls.join("");
                bxh.innerHTML = html;
        })
        .catch(error => console.log('error', error));
}

function callAPIArtist(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "page": 1,
    "size": 5,
    "order": ""
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://14.228.23.16:8080/api/artist/", requestOptions)
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
            let html = htmls.join("");
            artistElement.innerHTML = html
        })
        
    .catch(error => console.log('error', error));
    
}

start()

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableSong = $('.table-striped tbody')
const numPage = $('.number-page')
const numSong = $('.number-song')

function start() {
    callGetAPI();
}
start()

function callGetAPI(){
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

    fetch("http://14.228.23.16:8080/api/songs/", requestOptions)
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
                        <td class="text-end">
                                <a href="#" class="btn btn-active-light-primary">
                                    <i class="far fa-edit"></i>
                                </a>
                                <button type="submit" class="btn" style="color: red;">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                        </td>
                    </tr>`
        })
        tableSong.innerHTML = html.join('')
        numSong.innerHTML = `Tổng ${result.totalElements} bài hát`
        let htmlPage = ''
        for(let i = 1; i <= result.totalPages; i++){
            htmlPage += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
        }
        numPage.innerHTML = htmlPage
    })
    .catch(error => console.log('error', error));
}


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tableArtist = $('.table-striped tbody')
const numPage = $('.number-page')
const numArtist = $('.number-artist')

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

    fetch("http://14.228.23.16:8080/api/artist/", requestOptions)
    .then(response => response.json())
    .then(function(result){
        let html = result.artists.map(artist =>
                `<tr>
                    <td><input class="form-check-input" type="checkbox" value=""
                        id="flexCheckDefault"></td>
                    <td>image</td>
                    <td>${artist.id}</td>
                    <td>${artist.fullName}</td>
                    <td>${artist.birthDay}</td>
                    <td>${artist.countryActive}</td>
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
        tableArtist.innerHTML = html.join('')
        numArtist.innerHTML = `Tổng ${result.totalElements}`
        let htmlPage = ''
        for(let i = 1; i <= result.totalPages; i++){
            htmlPage += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
        }
        numPage.innerHTML = htmlPage
    })
    .catch(error => console.log('error', error));
}
function start() {
    var responsePagination;
    callAPI();
}

function callAPI () {
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

    fetch("http://14.228.23.16:8080/api/albums/", requestOptions)
    .then(response => response.json())
    .then(function(results) {
        responsePagination = results;
        var albums = responsePagination.albums;
        var htmls = albums.map(function(album){
            return `
                    <tr>
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
                </tr>`;
        })
        //get list album
        var html = htmls.join("");
        document.getElementById('list-albums-admin').innerHTML = html;
        //get tong album
        html = `Tổng ${responsePagination.totalElements} Album`
        document.getElementById('total-albums-admin').innerHTML = html;
        html = ''
        //get pagination
        for (let i=1; i <= responsePagination.totalPages; i++){
            html = html + `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
        }
        document.getElementById('pagination-albums-admin').innerHTML = html;

    })
    .catch(error => console.log('error', error));
}

start();

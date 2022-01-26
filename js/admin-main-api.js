export function callGetAPIArtist(page, size, renderGetAPIArtist, search){
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

    fetch("http://14.228.23.16:8080/api/artist/", requestOptions)
    .then(response => response.json())
    .then(renderGetAPIArtist())
    .catch(error => console.log('error', error));
}
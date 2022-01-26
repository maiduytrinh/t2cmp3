const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnSave = $('.btn-save')
const inputName = $('#inputName')
const inputSex = $('.input-sex')
const inputBirthday = $('.input-birthday')
const inputCountry = $('.input-country')
const inputDec = $('.input-dec')
const inputImage = $('#image')

let data = {}
function start() {
    getFileCountry()
    saveData()
}
start()

function saveData(){
    btnSave.onclick = function(){
        data.fullName = inputName.value
        data.gender = Number(inputSex.value)
        data.birthDay = inputBirthday.value
        data.countryActive = inputCountry.value
        data.description = inputDec.value
        // console.log(data)
        // console.log(inputImage.files[0])
        var formdata = new FormData();
        formdata.append("file", inputImage.files[0]);
        formdata.append("artist", JSON.stringify(data))

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://14.228.23.16:8080/api/artist/save", requestOptions)
        .then(response => response.json())
        .then(function(result){
            if(result.id){
                alert('Đã lưu thành công')
            }
        })
        .catch(error => console.log('error', error));
        location.reload()
    }
}

function getFileCountry(){
    fetch('../assets/json/country.json')
    .then(response => response.json())
    .then(data => {
        let html = data.map(country => 
            `<option value="${country.name}">${country.name}</option>`
        )
        inputCountry.innerHTML = html.join('')
    });
}
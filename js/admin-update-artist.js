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
let id
function start() {
    let params = (new URL(document.location)).searchParams
    id = params.get("id");
    getFileCountry()
    setData()
    updateData()    
}
start()

function setData(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://14.228.23.16:8080/api/artist/" + id, requestOptions)
        .then(response => response.json())
        .then(function(result){
            inputName.value = result.fullName
            inputSex.value = Number(result.gender)
            inputBirthday.value = result.birthDay
            inputDec.value = result.description
            inputCountry.value = result.countryActive
        })
        .catch(error => console.log('error', error));
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

function updateData(){
    btnSave.onclick = function(){
        data.fullName = inputName.value
        data.gender = Number(inputSex.value)
        data.birthDay = inputBirthday.value
        data.countryActive = inputCountry.value
        data.description = inputDec.value

        let formdata = new FormData();
        if(inputImage.files[0]){
            formdata.append("file", inputImage.files[0]);
        }
        formdata.append("artist", JSON.stringify(data))

        let requestOptions = {
            method: 'PUT',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://14.228.23.16:8080/api/artist/update-artist/" + id, requestOptions)
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

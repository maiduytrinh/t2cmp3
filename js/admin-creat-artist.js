import { urlAPI } from "./config.js"
import {logoutAdmin, handleModal} from "./home-user.js"


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnSave = $('.btn-save')
const inputName = $('#inputName')
const inputSex = $('.input-sex')
const inputBirthday = $('.input-birthday')
const inputCountry = $('.input-country')
const inputDec = $('.input-dec')
const inputImage = $('#image')
const inputEmail = $('.input-email')

let data = {}
function start() {
    getFileCountry()
    saveData()
    logoutAdmin()
    handleModal()
}
start()

function saveData(){
    btnSave.onclick = function(){
        if(inputName.value && inputBirthday.value && inputCountry.value && inputDec.value){
            data.fullName = inputName.value
            data.gender = Number(inputSex.value)
            data.birthDay = inputBirthday.value
            data.countryActive = inputCountry.value
            data.description = inputDec.value
            console.log(data)
            // console.log(inputImage.files[0])
            let formdata = new FormData();
            formdata.append("file", inputImage.files[0]);
            formdata.append("artist", JSON.stringify(data))
    
            let requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
    
            fetch(urlAPI + "api/artist/save", requestOptions)
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
            //tao tk ca si
            let email = inputEmail.value
            let password = creatPass()
            if(email){
                let accArtist = {}
                accArtist.password = password
                accArtist.fullName = inputName.value
                accArtist.email = email
                let formdata = new FormData();
                formdata.append("user", JSON.stringify(accArtist));

                let requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
                };

                fetch( urlAPI+"api/users/register-artist", requestOptions)
                .then(response => response.json())
                .then(function(result){
                    if(result.id){
                        alert('Tạo tài khoản ca sĩ thành công')
                        let requestOptions = {
                            method: 'POST',
                            redirect: 'follow'
                          };
                          fetch(`${urlAPI}api/mail/send?to=${email}&password=${password}\"`, requestOptions)
                            .then(response => response.text())
                            .then(result => console.log("Đã gửi mật khẩu đến Gmail"))
                            .catch(error => console.log('error', error))
                    }else{
                        alert('Tạo tài khoản thất bại! Email đã tồn tại')
                    }
                })
                .catch(error => console.log('error', error));
            }
        }else{
            alert("Vui lòng nhập đủ thông tin")
        }
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

function creatPass(){
    let pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let pwdLen = 8;
    let randPassword = Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return randPassword

}
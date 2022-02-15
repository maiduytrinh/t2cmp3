import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const emailLogin = $(".card-front input[name='logemail']")
const passLogin = $(".card-front input[name='logpass']")
const btnLogin = $(".card-front .btn-submit")
const nameSign = $("#logname")
const emailSign = $(".card-back input[name='logemail']")
const passSign = $(".card-back input[name='logpass']")
const btnSign = $(".card-back .btn-submit")
let role;
let data = {}

function start(){
        APILogin()
        APISignUp()
}
start()

function APILogin(){
    btnLogin.onclick = function(){
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
        "username": emailLogin.value,
        "password": passLogin.value
        });

        let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(urlAPI + "auth", requestOptions)
        .then(function(response){
            const token = response.headers.get('Authorization')
            role = response.headers.get('roll')
            localStorage.setItem('Authorization', token)
            localStorage.setItem('role', role)
            return response.text()
        })
        .then(function(result){
            if(result){
                alert("Tài khoản mật khẩu không chính xác")
            }else{
                if(role == "ROLE_USER"){
                    loadUser(emailLogin.value)
                }
                else if(role == "ROLE_ADMIN")
                    window.location.pathname = '../admin-album.html'
            }
        })
        .catch(error => console.log('error', error));
    }
}

function APISignUp(){
    btnSign.onclick = function(){
        if(passSign.value && nameSign.value && emailSign.value){
            data.password = passSign.value
            data.fullName = nameSign.value
            data.email = emailSign.value

            var formdata = new FormData();
            formdata.append("user", JSON.stringify(data));

            var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
            };

            fetch( urlAPI+"api/users/register", requestOptions)
            .then(response => response.json())
            .then(function(result){
                if(result.id){
                    alert('Đăng ký thành công')
                    emailLogin.value = data.email
                    passLogin.value = data.password
                    
                }else{
                    alert('Đăng ký thất bại! Email đã tồn tại')
                }
            })
            .catch(error => console.log('error', error));
        }else{
            alert("Vui lòng nhập đủ thông tin")
        }
    }
}

function loadUser(email){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(urlAPI + "api/users/" + email, requestOptions)
        .then(response => response.json())
        .then(function(result){
            localStorage.setItem('id', result.id)
            localStorage.setItem('fullname', result.fullName)
            localStorage.setItem('email', email)
            window.location.pathname = '../trang-chu.html'
        })
        .catch(error => console.log('error', error));
}
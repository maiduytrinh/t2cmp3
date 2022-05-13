import { urlAPI } from "./config.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnReg = $(".reg_btn")
const btnLog = $(".login_btn")
const btnProfile = $(".dropdown")
const useName = $('.dropdown__text')
const logout = $('.fa-right-from-bracket')
const rePass = $('.fa-key')
const upLoad = $('.fa-cloud-arrow-up')
const btnPlaylist = $$(".main-nav-wrapper ul li")[5]
const btnUpSong = $$(".dropdown__items li")[1]
const inputPass = $("#password")
const inputConfirmPass = $("#confirmPassword")
const btnRePass = $("#submitButton")



let fullName = localStorage.getItem('fullname')
let authorization = localStorage.getItem('Authorization')
let id = localStorage.getItem('id')
let role = localStorage.getItem('role')
export let isLogin = checkUser()

export function handleHideElement(){
        if(isLogin){
            btnReg.style.display = 'none'
            btnLog.style.display = 'none'
            btnProfile.style.display = 'inline-block'
            btnPlaylist.style.display = 'block'
            useName.innerHTML = fullName
            if(role == "ROLE_ARTIST")
                btnUpSong.style.display = 'block'
            else
                btnUpSong.style.display = 'none'
            logoutEvent()
            handleModal()
        }else{
        btnReg.style.display = 'inline-block'
        btnLog.style.display = 'inline-block'
        btnProfile.style.display = 'none'
        btnPlaylist.style.display = 'none'
        btnUpSong.style.display = 'none'
    }
}

export function checkUser(){
    if(fullName && authorization && id && role == "ROLE_USER" ||role == "ROLE_ARTIST" )
        return true
    else
        return false
}

function logoutEvent(){
    logout.onclick = function(){
        window.location = 'http://127.0.0.1:5500/trang-chu.html'
        window.localStorage.clear()
    }
}

export function logoutAdmin(){
    logout.onclick = function(){
        window.location = 'http://127.0.0.1:5500/login.html'
        window.localStorage.clear()
    }
}

export function handleModal() {
    // Get the modal
    const modal = $("#myModal")
    const btnOpen = $("#myBtn")
    const btnClose = $(".close-modal")
    btnOpen.onclick = function() {
        modal.style.display = "block";
    }
    
    btnClose.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    btnRePass.onclick = function(){
        console.log(inputPass.value)
        if(inputPass.value == inputConfirmPass.value){
          let email = localStorage.getItem('email')
          let pass = inputPass.value
          let requestOptions = {
            method: 'POST',
            redirect: 'follow'
          };
          
          fetch(urlAPI + `api/users/re-password?email=${email}&pass=${pass}`, requestOptions)
            .then(response => response.text())
            .then(function(results){ 
              alert("Đổi mật khẩu thành công")
              window.location = 'http://127.0.0.1:5500/login.html'
          
          })
            .catch(error => console.log('error', error));
        }else {
          alert("Mật khẩu không trùng nhau")
        }
    }
}







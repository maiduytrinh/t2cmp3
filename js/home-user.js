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
            logoutEvent()
        }else{
        btnReg.style.display = 'inline-block'
        btnLog.style.display = 'inline-block'
        btnProfile.style.display = 'none'
        btnPlaylist.style.display = 'none'
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
        location.reload()
        window.localStorage.clear()
    }
}



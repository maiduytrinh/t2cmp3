const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const btnReg = $(".reg_btn")
const btnLog = $(".login_btn")
const btnProfile = $(".btn-profile")
let fullName = localStorage.getItem('fullname')
let authorization = localStorage.getItem('Authorization')
let id = localStorage.getItem('id')
let role = localStorage.getItem('role')
let isLogin = checkUser()

export function handleHideElement(){
    if(isLogin){
        btnReg.style.display = 'none'
        btnLog.style.display = 'none'
        btnProfile.style.display = 'inline-block'
    }else{
        btnReg.style.display = 'inline-block'
        btnLog.style.display = 'inline-block'
        btnProfile.style.display = 'none'
    }
}

export function checkUser(){
    if(fullName && authorization && id && role)
        return true
    else
        return false
}

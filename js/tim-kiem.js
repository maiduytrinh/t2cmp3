import { handleHideElement, isLogin} from "./home-user.js"
import { urlAPI } from "./config.js"
import { callAPIAlbum, callAPIArtist, callAPISong } from "./home-main.js"

const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tabContent = $$('.tab-content')
const tabLink = $$('.nav-link')
const paginationSong = $('#tab-song .pagination')
const paginationAlbum = $('#tab-album .pagination')
const paginationArtist = $('#tab-artist .pagination')
let numTab = 0;
let params = (new URL(document.location)).searchParams
let search = params.get("p");
let size = 5
const urlAlbum = urlAPI + "api/albums/"
const urlSong = urlAPI + "api/songs/"
const urlArtist = urlAPI + "api/artist/"
const songListElement = $('.bxh')

function start(){
  loadCurrentTab(numTab)
  loadEventTab()
  callAPIAlbum(1, size, urlAlbum, paginationAlbum, search)
  callAPIArtist(1, size, urlArtist, paginationArtist, search)
  callAPISong(1, size, urlSong, songListElement, paginationSong, search)
}
start()

function loadEventTab(){
  for(let i=0; i<tabLink.length; i++){
    tabLink[i].onclick = function(e){
      const tabNode = e.target.closest('.nav-link:not(.active)')
      if(tabNode){
        numTab = tabNode.dataset.index
        loadCurrentTab(numTab)
      }
    }
  }
}

function loadCurrentTab(numTab){
  const isActive = $('.nav-link.active')
  if(isActive){
    isActive.classList.remove("active")
  }
  for(let j=0; j<tabContent.length; j++){
    tabContent[j].style.display = 'none'
  }
  tabLink[numTab].classList.add("active")
  tabContent[numTab].style.display = "block"
}


const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const tabContent = $$('.tab-content')
const tabLink = $$('.nav-link')
let numTab = 0;
function start(){
  loadCurrentTab(numTab)
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
start()

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


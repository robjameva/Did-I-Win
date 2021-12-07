//const giphyApiRootUrl = "https://developers.giphy.com/";
//const giphyApiKey = "XWbi585lJ6vdGLmmibPxsX3flhBKdwN5";


const launchBtn = document.getElementById("launchmodal");
launchBtn.addEventListener("click",function(){
    launchGif()
})
function launchGif(){
    myModal.show()
}
var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
  })



  //for Api call launchGif

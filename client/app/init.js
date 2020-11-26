import renderAllAlbums from './view.js'
import actions from './actions.js'

// Tabs
let tabHeader = document.getElementsByClassName("tab-header")[0];
let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
let tabBody = document.getElementsByClassName("tab-body")[0];
let tabsPane = tabHeader.children;
for(let i=0;i<tabsPane.length;i++){
  [...tabsPane][i].addEventListener("click",function(){
    [...tabHeader.children].forEach(i=>i.classList.remove("active"));
    tabsPane[i].classList.add("active");
    [...tabBody.children].forEach(i=>i.classList.remove("active"));
    tabBody.children[i].classList.add("active");
    
    tabIndicator.style.left = `calc(calc(100% / 6) * ${i})`;
  });
}
///////////////

// init the albums
export const albumsInit = async () => {
  try{
    const res = await fetch('/api/albums');
    const data = await res.json();
    renderAllAlbums(data, document.querySelector('#getAllalbums'));
    actions.selectArtist(data);
  }catch{
    err => console.error(err)
  }
  
};

// search for Album or Artist
    document.querySelector('#search').addEventListener('submit', (e)=>{
      e.preventDefault();
      fetch('/api/albums')
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(data => {
          const albums = data;
          let input = document.getElementById('lname');
          let filter = input.value.toUpperCase();
          const result = data.filter(album=> {
            if(album.Artist.toUpperCase() === filter || album.Album.toUpperCase() === filter){
              return album;
            }
          })
          document.querySelector('.albums-list').innerHTML = '';
          input.value = '';
          return renderAllAlbums(result, document.querySelector('.albums-list'))
        }).catch(err => {
          console.log(err)
   
        })
    });



// save Album
    document.getElementById('create').addEventListener('submit', (e)=>{
      e.preventDefault();
      const artist = document.querySelector('#artist');
      const albumName = document.querySelector('#name');
      if (artist.value.length === 0 || albumName.value.length === 0){
      document.querySelector('.error').style.display= 'inline-block';
      } else {
      document.querySelector('.error').style.display= 'none';
      const albumToSave = {
        Name: albumName.value,
        ArtistID: artist.value
      }
      if(document.querySelector('.save-btn').value === "Edit"){
        actions.editCurrentAlbum(albumToSave);
      }else{
        actions.saveAlbum(albumToSave);
      }
        artist.value = '0';
        albumName.value = '';
      }
    });







 



import renderAllAlbums from './view.js'
 
const actions = {
    saveAlbum: (album)=>{
        fetch('/api/albums', {
            method: 'POST',
            body: JSON.stringify(album),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then(res => {
              if (!res.ok) {
                throw res;
              }
              return res.json();
            })
            .then(albumData => {
              console.log(albumData);
              document.querySelector('.save').style.display= 'inline-block';
              setTimeout(function(){ document.querySelector('.save').style.display= 'none'; }, 3000);
              return fetch('api/albums');
            })
            .then(response => response.json())
            .then(data => {
                renderAllAlbums(data, document.querySelector('#getAllalbums'));
                renderAllAlbums(data, document.querySelector('.albums-list'));
            })
            .catch(err => {
              alert('unable to save your changes');
              console.error(err);
            });
        console.log(album);
    },

    searchMatch: ()=>{
        const value = document.querySelector('#searchMatch').value;
        let input = document.getElementById('searchMatch');
        let filter = input.value.toUpperCase();
        let ul = document.getElementById('newList');
        let li = ul.children;
        for (let i = 0; i < li.length; i++) {
            let txtValue = li[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            } else {
            li[i].style.display = "none";
            }
         }
    },

    editAlbum: (album)=>{
        const idToEdit = album[1][0].AlbumId;
        actions.id = idToEdit;
        document.querySelector('.btn').innerHTML = "Edit Album";
        document.querySelector('.save-btn').value = "Edit";
        document.querySelector('#album-form').open = true;
        document.querySelector('#artist').value = album[1][0].ArtistId;
        document.querySelector('#name').value = album[1][0].Album;
        window.scrollTo({top: 80, behavior: 'smooth'});
    },    
    editCurrentAlbum: (album)=> {
        const id = actions.id;
        document.querySelector('.btn').innerHTML = "Create New Album";
        document.querySelector('.save-btn').value = "Save";
        const data = {
            Name: album.Name ,
            ArtistID: album.ArtistID
        }
        console.log(data);
        fetch(`/api/albums/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then(res => {
              if (!res.ok) {
                throw res;
              }
              return res.json();
            })
            .then(albumData => {
              document.querySelector('.save').style.display= 'inline-block';
              setTimeout(function(){ document.querySelector('.save').style.display= 'none'; }, 3000);
              return fetch('api/albums');
            })
            .then(response => response.json())
            .then(data => {
                renderAllAlbums(data, document.querySelector('#getAllalbums'));
                renderAllAlbums(data, document.querySelector('.albums-list'));
            })
            .catch(err => {
              alert('unable to save your changes');
              console.error(err);
            });
        console.log(album);
    },
    deleteAlbum: async (album)=>{
        const id = album[1][0].AlbumId;
        const result = await fetch(`/api/albums/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
        if (!result.ok) {
            alert(`Something went wrong:`);
            console.log("Error from put: ", result);
        } else {
            const resNew = await fetch("/api/albums");
            const dataNew = await resNew.json();
            renderAllAlbums(dataNew, document.querySelector('.albums-list'));
            renderAllAlbums(dataNew, document.querySelector('#getAllalbums'));
    }
    },

// Dropdown select Artist list
    selectArtist: (data)=> {
        const artistList = data.map(album=>{
        return [album.Artist,album.ArtistId]});
        const uniqArtist = Array.from(new Set(artistList.map(JSON.stringify)), JSON.parse)
        .forEach(item=> {
        const selection = document.querySelector('#artist');
        const artist = document.createElement('option');
        artist.innerHTML = item[0];
        artist.value = item[1];
        selection.appendChild(artist);
        })
    }
  
}
 

export default actions;
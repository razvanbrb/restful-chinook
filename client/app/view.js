import actions from './actions.js'

const renderAllAlbums = async (data, parentElement) => {
    function groupArrayOfObjects(list, key) {
              return list.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
              }, {});
            };
    const groupedAlbums= await groupArrayOfObjects(data,"Album");
    
    const albums = Object.entries(groupedAlbums);
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'newList')
    const list = albums.forEach(i=>{
        const li = document.createElement('li');
        li.innerHTML = `${i[0]}, ${i[1][0].Artist}`;
        li.className ="tracks-list";
        li.setAttribute('id', `${i[1][0].AlbumId}`)
        const details =  document.createElement('details');
        const summary = document.createElement('summary');
        summary.className = 'summary-tracks';
        summary.innerHTML = `Tracks <i class="fas fa-arrow-circle-right"></i>`;
        const summaryUl = document.createElement('ul'); 
        summaryUl.className = 'tracks'
        const listOfTracks = i[1];
        listOfTracks.forEach(i=>{
        const trackLi = document.createElement('li');
        trackLi.innerHTML = i.Tracks;
        summaryUl.appendChild(trackLi);
        });
        const wrapper = document.createElement('div');
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        deleteBtn.className = 'deleteBtn';
        deleteBtn.onclick = () => actions.deleteAlbum(i);
        const editBtn = document.createElement('button');
        editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
        editBtn.className = 'editBtn';
        editBtn.onclick = () => actions.editAlbum(i);
        details.appendChild(summaryUl);
        details.appendChild(summary);
        li.appendChild(details);
        wrapper.appendChild(deleteBtn);
        wrapper.appendChild(editBtn);
        li.appendChild(wrapper);
        ul.appendChild(li);
    });
    parentElement.innerHTML='';
    parentElement.appendChild(ul);
    document.querySelector('#searchMatch').addEventListener('keyup', actions.searchMatch);
}

export default renderAllAlbums;
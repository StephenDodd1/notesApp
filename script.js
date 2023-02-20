const globalActions = document.getElementsByTagName('body')
const noteSearchBox = document.getElementById('note-search-box')
const notesContainer = document.getElementById('notes-array')
const foldersContainer = document.getElementById('folders-array')
const tabsContainer = document.getElementById('tabs-container')
const tabsRow = document.getElementById('tabs-row')
let addNoteBtn = document.getElementById('add-note-btn')
let addFolderBtn = document.getElementById('add-folder-btn')
let tempNoteValue = ''
let tempFolderValue = ''
let currentTab = -1

let msgSeen = 0

var currentNoteElement = (tempNoteValues,id) => `
<div id='note-container-${id}'>
  <div id='note-text' class=''>${tempNoteValue}</div>
  <button id='note-edit-btn' class=''>edit</button>
  <div>
    <button id='note-cancel-btn' class='hidden'>cancel</button>
  </div>
  <div>
    <textarea id='note-field' class='hidden' rows=5 placeholder='Update note here.'>${tempNoteValue}</textarea>
  </div>
  <div>
    <button id='note-save-btn' class='hidden'>save</button>
  </div>
</div>`

const setTabs = (id, item) => {
  const tabElements = fetch('http://localhost:3000/tabs', {
    method: 'POST',
    body: JSON.stringify({
      "note_id": id, 
      "title": item.title
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res=> res.json()).then(tabs=> {
    const elements = tabs.map(tab => {
      console.log('tabs', tab.note_id === id)

      return (`
        <div id="tabs-${tab.note_id}" class=${tab.note_id === id ? 'selected' : 'default-tab'}>${tab.title}</div>
      `)}).join('')
    return elements
  })
  console.log('tabElements', tabElements)
  return tabElements
}

const openNote = async (item, button, openButtons, deleteButtons, addNoteBtn) => {
  addNoteBtn.classList.add('hidden')
  tempNoteValue = item.content
  console.log('button: ',button)
  const noteContainer = document.getElementById('note-container')
  noteContainer.classList.remove('hidden')
  console.log('currentNote', item.content)
  tabsRow.classList.remove('hidden')
  const tabs = await setTabs(button.id.split('-')[1], item)
  console.log('tabs', tabs)
  tabsContainer.innerHTML = tabs
  for(let i = 0; i < openButtons.length;  i++){
    if(openButtons[i].id === button.id) {
      noteContainer.innerHTML = currentNoteElement(tempNoteValue, button.id)
      console.log(noteContainer.innerHTML)
      const editButton = document.getElementById('note-edit-btn')
      editButton.addEventListener('click', (e) => {
        e.preventDefault()
        toggleNotesBody()
      })

      const cancelButton = document.getElementById('note-cancel-btn')
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        toggleNotesBody()
        tempNoteValue = currentNoteValue
      })
      const saveButton = document.getElementById('note-save-btn')
      saveButton.addEventListener('click', (e) => {
        e.preventDefault()
        toggleNotesBody()
        console.log('PUT request to update note: ', tempNoteValue)
      })
      const editNoteUpdate = document.getElementById('note-field')
      editNoteUpdate.addEventListener('input', (e) => {
        e.preventDefault();
        tempNoteValue = e.target.value
      })
    }
  }
}

const getOpenButtons = (data) => {
  console.log('openButtons',data)
  const openButtons = document.getElementsByClassName('open-btn')
  const deleteButtons = document.getElementsByClassName('delete-btn') 
  addNoteBtn = document.getElementById('add-note-btn')

  console.log('notesArr',openButtons)
  for(let i = 0; i < openButtons.length;  i++){
    (function(idx){
      console.log('openButtons[i]: ',openButtons[idx])
      openButtons[idx].addEventListener('click',function(event) {
        event.preventDefault();
        console.log('data[i]',data[i])
        openNote(data[i],openButtons[i], openButtons, deleteButtons, addNoteBtn)
      })

      deleteButtons[i].addEventListener('click', function(event){
        event.preventDefault();
        const remainingElements = noteElements.filter((element, idx) => i !== idx)
        noteElements = [...remainingElements]
        console.log('noteElements', noteElements)
        notesContainer.innerHTML = noteElements.join('')
      })
      }
    )(i)
  }
}

const getNotes = (id) => {
  fetch(`http://localhost:3000/notes/${id}`)
  .then(res => res.json())
  .then(data => {
    notesContainer.innerHTML = noteElements(data)
    getOpenButtons(data)
  })
}

fetch('http://localhost:3000/folders')
  .then((res) => res.json())
  .then((data) => {
    console.log('sent')
    folders = [...data]
    let folderElements = data.map((folder,i)=>{
      return(
        `<div>
          <div id='${folder.id}' class='folder'>${folder.name}</div>
        </div>`
      )
    })
    foldersContainer.innerHTML = folderElements.join('') + '<div id="add-folder-container"><button id="add-folder-btn">+</button></div>'
    const folderItems = document.getElementsByClassName('folder')
    for(let i = 0; i < folderItems.length; i++){
      folderItems[i].addEventListener('click', () => {
        notesContainer.classList.remove('hidden')
        getNotes(folderItems[i].id)
      })
    }
    addFolderBtn = document.getElementById('add-folder-btn')
    addFolderBtn.addEventListener('click', (e)=> {
      const addFolderContainer = document.getElementById('add-folder-container')
      addFolderContainer.innerHTML = `<div><input id='add-folder-input' value=''>${tempFolderValue}</input><button id='folder-save-btn'>Save</button></div>`
      const addFolderInput = document.getElementById('add-folder-input')
      const folderSaveBtn = document.getElementById('folder-save-btn')
      console.log(addFolderInput, folderSaveBtn)
      addFolderInput.addEventListener('input', (e) => {
        tempFolderValue = e.target.value;
      })
      folderSaveBtn.addEventListener('click', (e) => {
        const body = {"folderName": tempFolderValue}
        fetch('http://localhost:3000/folders',{
          method: 'POST',
          body: JSON.stringify(body),
          mode: 'cors',
          headers: {
            "Content-Type": "application/json"
          }
        }).then((res) => res.json())
        .then(data=> {
          [...data]
          let folderElements = data.map((folder,i)=>{
            return(
              `<div>
                <div id='${folder.id}' class='folder'>${folder.name}</div>
              </div>`
            )
          })
          foldersContainer.innerHTML = folderElements.join('') + '<div id="add-folder-container"><button id="add-folder-btn">+</button></div>'
        })
      })
    })
  })

globalActions[0].addEventListener('click',() => {
  let msg = ''
  try{
    msg = document.getElementById('success-msg')
  } catch(err){
    console.log(err)
  }
  try {
    if(msg && !msgSeen) {
      msgSeen = 1
    } else if(!msg && msgSeen === 1){
      console.log('msg ', msgSeen, msg)
      msgSeen = 0
    } else {
      document.getElementById('success-msg').parentElement.removeChild(msg)
      msg = ''
    }
  } catch(err){
    console.log(err)
  }
})

let noteElements = (data) => {
  let elements = data.map((item,i) => {
    return(`<div id=${'note-' + item.id} class='note-container'>
      <span>
        <button id=${'open-'+item.id} class='open-btn'>${item.title}</button>
        <button id=${'del-' + item.id} class='delete-btn'>-</button>
      </span>
    </div>`)
}).join('')
elements += '<div><button id="add-note-btn">+</button></div>'

return (`<div>${elements}</div>`)
}





const toggleNotesBody = () => {
  document.getElementById('note-text').classList.toggle('hidden')
  document.getElementById('note-edit-btn').classList.toggle('hidden')
  document.getElementById('note-cancel-btn').classList.toggle('hidden')
  document.getElementById('note-field').classList.toggle('hidden')
  document.getElementById('note-save-btn').classList.toggle('hidden')
}

addNoteBtn?.addEventListener('click', (e) => {
  const addNoteTitle = document.getElementById('add-note-title')
  addNoteBtn.classList.add('hidden')
  addNoteTitle.classList.remove('hidden')
  notesContainer.classList.add('hidden')
  noteSearchBox.classList.add('hidden')
  const addNoteContainer = document.getElementById('add-note-container')
  addNoteContainer.innerHTML = currentNoteElement()
  toggleNotesBody()
  const editNoteUpdate = document.getElementById('note-field')
  editNoteUpdate.addEventListener('input', (e) => {
    e.preventDefault();
    tempNoteValue = e.target.value
  })
  const saveButton = document.getElementById('note-save-btn')
  saveButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('POST request to update note: ', tempNoteValue)
    Promise.resolve('success').then((status) => {
      addNoteContainer.innerHTML = `<div id='success-msg'>{add note - ${status}}</div>`
    })
    addNoteBtn.classList.remove('hidden')
    addNoteTitle.classList.add('hidden')
    notesContainer.classList.remove('hidden')
    noteSearchBox.classList.remove('hidden')
  })
  const cancelButton = document.getElementById('note-cancel-btn')
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault()
    addNoteContainer.innerHTML = ''
    addNoteBtn.classList.remove('hidden')
    addNoteTitle.classList.add('hidden')
    notesContainer.classList.remove('hidden')
    noteSearchBox.classList.remove('hidden')
  })
})

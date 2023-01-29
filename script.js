const globalActions = document.getElementsByTagName('body')
const noteSearchBox = document.getElementById('note-search-box')
const arrContainer = document.getElementById('notes-array')
const addNoteBtn = document.getElementById('add-note-btn')
let msgSeen = 0
globalActions[0].addEventListener('click',() => {
  let msg = ''
  try{
    msg = document.getElementById('success-msg')
  } catch(err){
    console.log(err)
  }
  if(msg && !msgSeen) {
    msgSeen = 1
  } else if(!msg && msgSeen === 1){
    console.log('msg ', msgSeen, msg)
    msgSeen = 0
  } else {
    document.getElementById('success-msg').parentElement.removeChild(msg)
    msg = ''
  }
})

let noteElements = Array.from([1,2,3],(_,i) =>{
  return(`<div id=${'note-' + i} class='note-container'>
    <span>
      Array Methods ${i+1}
      <button id=${'del-' + i} class='delete-btn'>-</button>
      <button id=${'open-' + i} class='open-btn'>&and;</button>
      <button id=${'close-' + i} class='close-btn hidden'>&or;</button>
    </span>
    <div id=${'note-details-' + i}></div>
  </div>`)}
)

arrContainer.innerHTML = noteElements.join('')

const openButtons = document.getElementsByClassName('open-btn')
const closeButtons = document.getElementsByClassName('close-btn')
const deleteButtons = document.getElementsByClassName('delete-btn')

const currentNoteValue = 'TEST A NOTE BODY.'
let tempNoteValue = currentNoteValue

var currentNoteElement = `
<div id='note-container'>
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
const toggleNotesBody = () => {
  document.getElementById('note-text').classList.toggle('hidden')
  document.getElementById('note-edit-btn').classList.toggle('hidden')
  document.getElementById('note-cancel-btn').classList.toggle('hidden')
  document.getElementById('note-field').classList.toggle('hidden')
  document.getElementById('note-save-btn').classList.toggle('hidden')
}

const openNote = (id) => {
  addNoteBtn.classList.add('hidden')
  console.log('id is: ',id)
  for(let i = 0; i < openButtons.length;  i++){
    const currentNote = document.getElementById('note-details-'+i)
    if(i === id) {
      console.log('ran1', closeButtons[id].classList)
      closeButtons[id].classList.remove('hidden')
      openButtons[id].classList.add('hidden')
      console.log('ran2', closeButtons[id].classList)
      currentNote.innerHTML = currentNoteElement
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
    } else {
      openButtons[i].classList.remove('hidden')
      closeButtons[i].classList.add('hidden')
      currentNote.innerHTML = ''
    }
  }
}

for(let i = 0; i < openButtons.length;  i++){
  (function(idx){
    openButtons[idx].addEventListener('click',function(event) {
      event.preventDefault();
      openNote(i)
    })
    closeButtons[idx].addEventListener('click',function(event) {
      event.preventDefault();
      openButtons[idx].classList.toggle('hidden')
      closeButtons[idx].classList.toggle('hidden')
      const currentNote = document.getElementById('note-details-'+i)
      currentNote.innerHTML = ''
      addNoteBtn.classList.remove('hidden')
    })
    deleteButtons[i].addEventListener('click', function(event){
      event.preventDefault();
      const remainingElements = noteElements.filter((element, idx) => i !== idx)
      noteElements = [...remainingElements]
      console.log('noteElements', noteElements)
      arrContainer.innerHTML = noteElements.join('')
    })
    }
  )(i)
}

addNoteBtn.addEventListener('click', (e) => {
  const addNoteTitle = document.getElementById('add-note-title')
  console.log(e)
  addNoteBtn.classList.add('hidden')
  addNoteTitle.classList.remove('hidden')
  arrContainer.classList.add('hidden')
  noteSearchBox.classList.add('hidden')
  const addNoteContainer = document.getElementById('add-note-container')
  addNoteContainer.innerHTML = currentNoteElement
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
    arrContainer.classList.remove('hidden')
    noteSearchBox.classList.remove('hidden')
  })
  const cancelButton = document.getElementById('note-cancel-btn')
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault()
    addNoteContainer.innerHTML = ''
    addNoteBtn.classList.remove('hidden')
    addNoteTitle.classList.add('hidden')
    arrContainer.classList.remove('hidden')
    noteSearchBox.classList.remove('hidden')
  })
})
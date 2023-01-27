const arrContainer = document.getElementById('notes-array')

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
const openButtons = document.querySelectorAll('.open-btn')
const closeButtons = document.querySelectorAll('.close-btn')
const deleteButtons = document.querySelectorAll('.delete-btn')
const currentNoteValue = 'TEST A NOTE BODY.'
var currentNoteElement = `
<div>
  <div>${currentNoteValue}</div>
  <button>edit</button>
  <textarea rows=5 placeholder='${currentNoteValue}'></textarea>
</div>`
for(let i = 0; i < openButtons.length;  i++){
  (function(idx){
    openButtons[idx].addEventListener('click',function(event) {
      event.preventDefault();
      closeButtons[idx].classList.remove('hidden')
      const currentNote = document.getElementById('note-details-'+i)
      currentNote.innerHTML = currentNoteElement
      console.log('click', openButtons[idx])
    })
    closeButtons[idx].addEventListener('click',function(event) {
      event.preventDefault();
      openButtons[idx].classList.add('hidden')
      const currentNote = document.getElementById('note-details-'+i)
      console.log(currentNote.innterHTML)
      currentNote.innerHTML = ''
      console.log('click', closeButtons[idx])
    })
    }
  )(i)
}

for(let i = 0; i < deleteButtons.length; i++){
  deleteButtons[i].addEventListener('click', function(event){
    event.preventDefault();
    const remainingElements = noteElements.filter((element, idx) => i !== idx)
    noteElements = [...remainingElements]
    console.log('noteElements', noteElements)
    arrContainer.innerHTML = noteElements.join('')
  })
}
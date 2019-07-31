const showNotes = (id) => {
    document.getElementById(`notes_${id}`).style.display = 'block'
}

const hideNotes = (id) => {
    document.getElementById(`notes_${id}`).style.display = 'none'
}

export {
    showNotes,
    hideNotes
}
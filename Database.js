;(function () {
    "use strict"

    const notes = []

    const api = {}

    loadLocal()

    api.getNotes = function getNotes() {
        return getCopy(notes)
    }

    api.setNote = function setNote  (noteId, content) {
        const note = notes.find(x => x.id === noteId)
        note.content = content

        if (content.length) {
            const [title] = content.trim().split('\n')
            note.title = title.substr(0, 20)
        }

        saveLocal()
    }

    api.createNote = function createNote () {
        const note = {
            id: notes.length + 1,
            title: 'New note',//prompt('Title', 'New note'),
            content: ''
        }

        notes.unshift(note)
        saveLocal()
        return note.id
    }

    api.update = function update () {
        for (const note of notes) {
            if (note.content.length) {
                continue
            }
            const index = notes.indexOf(note)
            notes.splice(index, 1)
        }

        for (let i = 0; i < notes.length; i++) {
             notes[i].id = i + 1
        }
        saveLocal()
    }

    api.reinit = function reinit () {  
        notes.splice(0, notes.length)

        for (let note of [
            {
            id: 1,
            title: "Список полезных дел",
            content: "Список полезных дел"
            },
            {
                id: 2,
                title: "Интенсивы constcode.ru",
                content: "Интенсивы constcode.ru"
            },
            {
                id: 3,
                title: "Лучшее за неделю",
                content: "Интенсивы constcode.ru"
            },
            {
                id: 4,
                title: "Фильмы на прокат",
                content: "Интенсивы constcode.ru"
            }
        ]) {
            notes.push(note)
        }

        saveLocal()
    }

    window.database = api

    function getCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    function saveLocal () {
        localStorage.setItem("__NOTEBOOK__", JSON.stringify(notes))
    }
    function loadLocal () {
        const str = localStorage.getItem("__NOTEBOOK__")
        const array = JSON.parse(str)

        if(array) {

            notes.splice(0, notes.length)
            notes.push(...array)
        }
    }
})();
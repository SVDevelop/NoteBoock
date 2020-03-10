class Application {
    constructor() {
        this.noteId = null

        // this.options = {
        //     listSpace: '',
        //     tabsCount: '    '//4
        // }

        this.notes = database.getNotes()
        this.buttons = document.querySelector('[data-buttons]')
        this.textarea = document.querySelector('textarea')
        this.addNote = document.querySelector('[data-addnote]')

        this.updateButtons()

        this.textarea.addEventListener('keyup', (event) => {
            database.setNote(this.noteId, this.textarea.value)
            this.notes = database.getNotes()
            this.addNote.removeAttribute('disabled')// на случай если кнопка была отключена
            this.updateButtons()
        })
        this.textarea.addEventListener('keydown', function (event) {
            if(event.key === 'Tab') {
                //  console.log(event.target === this)
                event.preventDefault()
                //const [title] = content.split('\n')

                // console.log(this.value.substring(0, this.selectionStart).split('\n').length)
                let value = ''
                let nextSelectionStart = this.selectionStart + 4

                value += this.value.substring(0, this.selectionStart)
                value += '    '
                value += this.value.substring(this.selectionEnd)

                this.value = value
                this.selectionStart = nextSelectionStart
                this.selectionEnd = nextSelectionStart
            }
            if(event.key === 'Enter') {
                let content = this.value.substring(0, this.selectionStart).split('\n')//array str
                const lastStr = content[content.length - 1]

// проверяем последнюю строку на наличие цифры
//проверяем есть ли перед цифрой символы в строке

                if ( parseInt(lastStr.trim().split(' ')) ) {
                    // console.log(parseInt(lastStr.trim().split(' ')))
                    event.preventDefault()
                    let number = parseInt(lastStr.trim().split(' '))
                    let spaceCount = ''

                    for (let i = 0; i < (lastStr.length - lastStr.trim().length); i++) {

                        spaceCount+= ' '

                    }

                    let value = ''
                    let nextSelectionStart = this.selectionStart + spaceCount.length + String(number).length

                    value += this.value.substring(0, this.selectionStart)
                    value += '\n'
                    value += spaceCount + String(number + 1) + this.value.substring(this.selectionEnd)

                    this.value = value

                    this.selectionStart = nextSelectionStart + 1
                    this.selectionEnd = nextSelectionStart + 1
                }



            }
        })

        // console.log(this.buttons.children)
        this.buttons.addEventListener('click', function (e) {
            // console.log(e.target.getAttribute('note-id'))
        })

        this.addNote.addEventListener('click', () => {
                this.updateButtons()
                this.noteId = database.createNote()
                this.activeNote(true)
                this.textarea.focus()
                // console.log(this.addNote)
                this.addNote.setAttribute('disabled', '') //деактевируем кнопку, что бы не плoдить пустых элементов
                // console.log(this.addNote)

            })
        document
            .querySelector('[data-app]')
            .addEventListener('contextmenu', function (event) {
                event.preventDefault()
                // console.log(event.target)
                if (event.target.getAttribute('note-id')) {
                    //button menu
                    const buttonMenu = document.createElement('div')
                    buttonMenu.classList.add('context-menu')
                    console.log(buttonMenu)
                }
                if (!event.target.getAttribute('note-id')) {
                    //button textarea
                }
            })
    }

    updateButtons () {
        this.buttons.innerHTML = ''

        for (const note of this.notes) {
            const buttonElement = document.createElement('button')
            buttonElement.className = "list-group-item list-group-item-action"
            buttonElement.textContent = note.title
            buttonElement.setAttribute("note-id", note.id)

            if (note.id === this.noteId) {
                buttonElement.classList.add("active")
                this.addNote.removeAttribute('disabled')// на случай если кнопка была отключена
            }

            this.buttons.append(buttonElement)

            buttonElement.addEventListener(['click'], (event) => {
                // console.log(event)
                this.noteId  = parseInt(buttonElement.getAttribute('note-id'))
                this.activeNote()
            })
        }
    }

    activeNote (isNew) {
        if (!isNew) {
            database.update()
        }
        this.notes = database.getNotes()
        this.updateButtons()

        const note = this.notes.find(x => x.id === this.noteId)
        this.textarea.value = note.content
        this.textarea.disabled = false
    }

}
let db = require('./db.js')
import _ from 'lodash'

var mixins = {
  created: function () {
  },
  methods: {
    log (text) {
      this.$store.commit('log', text)
    },
    mixinTest: () => {
      return 'yes, this is mixinTest'
    },
    focusSearch () {
      let sidebarSearch = document.getElementById('sidebarSearch')
      sidebarSearch.focus()
      sidebarSearch.select()
    },
    makeNotesListUnselected () {
      let selectedElm = document.querySelector('.mdl-list--notes .mdl-list__item--selected')
      if (selectedElm) {
        console.log('makeNotesListUnselected')
        selectedElm.classList.remove('mdl-list__item--selected')
      }
    },
    // Add new note to db
    addNewNote (title) {
      console.log('addNewNote()')
      let newNote = {
        name: title,
        text: '',
        dateModified: Date.now()
      }

      // Check if note with same title exists
      // Get all notes beginning with same title, then loop until unique found
      console.log('addNote: check for existing note with same name')
      db.notes.where('name').startsWith(newNote.name).toArray().then((notesWithSameBeginning) => {
        // while name not unique keep testing
        let loop = 0
        let newNameSuggestion = newNote.name
        let foundSameName = true

        while (foundSameName) {
          foundSameName = notesWithSameBeginning.find((note) => {
            return note.name === newNameSuggestion
          })

          if (foundSameName) {
            loop++
            newNameSuggestion = `${newNote.name} ${loop}`
          }
        }

        newNote.name = newNameSuggestion

        return
      }).then(() => {
        console.log(`addNote: done checking for same name, got name "${newNote.name}"`)
        db.notes.put(newNote).then((newNoteID) => {
          // Add new note to notes list
          console.log('addNote: db.notes.put done', newNote)

          this.$store.state.notes.unshift(newNote)

          // Edit and focus new note
          console.log('addNote: emit noteSelected')
          this.$root.$emit('NoteSelectedInNotesListGoEdit', newNote.id)

          return
        })
      }).then(() => {
        console.log('addNote: showSnackMsg')
        this.showSnackMessage('New new added')
      })
    },
    /**
     * Close drawer/sidebar if it is opneed
     */
    closeDrawerIfOpened () {
      let layout = document.querySelector('.mdl-layout')
      let drawer = document.querySelector('.mdl-layout__drawer')

      if (layout.classList.contains('is-small-screen') && drawer.classList.contains('is-visible')) {
        layout.MaterialLayout.toggleDrawer()
      }
    },
    /**
     * Open drawer/sidebar if it is closed
     */
    openDrawerIfClosed () {
      let layout = document.querySelector('.mdl-layout')
      let drawer = document.querySelector('.mdl-layout__drawer')

      if (layout.classList.contains('is-small-screen') && !drawer.classList.contains('is-visible')) {
        layout.MaterialLayout.toggleDrawer()
      }
    },
    deleteNote () {
      if (!window.confirm(`Delete note "${this.$store.state.currentNote.name}"?`)) {
        return
      }

      // console.log('deleteNote with id', this.$store.state.currentNote.id)

      db.notes.delete(this.$store.state.currentNote.id).then(() => {
        // console.log('note deleted')

        let noteIndex = _.findIndex(this.$store.state.notes, (val) => {
          return val.id === this.$store.state.currentNote.id
        })

        this.$store.state.notes.splice(noteIndex, 1)

        // Remove current note from state

        // Redirect to home, with message
        this.$router.push({
          name: 'home',
          params: {
            fromDeleted: true
          }
        })

        // console.log('deleted note index in current state', noteIndex)
      })

      this.showSnackMessage('Note deleted')
    },
    editNoteTitle () {
      /*
      let newNoteName = window.prompt('Enter new name of note', this.$store.state.currentNote.name)

      if (newNoteName === null) {
        return
      }
      */

      // new name here we go
      // console.log('set new name to', newNoteName)
    },
    showSnackMessage (message, timeout = 3000) {
      let data = {
        message,
        timeout: timeout
      }

      let messageToastElm = document.getElementById('messageToast')
      messageToastElm.MaterialSnackbar.showSnackbar(data)
    },
    focusEditTextArea () {
      document.getElementById('editText').focus()
    }
  }, // methods
  filters: {
    trim: function (value) {
      if (!value) return ''
      return value.substr(0, 75)
    }
  }
}

module.exports = mixins

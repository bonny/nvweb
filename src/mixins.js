let db = require('./db.js')
import _ from 'lodash'

var mixins = {
  created: function () {
  },
  methods: {
    mixinTest: () => {
      return 'yes, this is mixinTest'
    },
    focusSearch () {
      let sidebarSearch = document.getElementById('sidebarSearch')
      sidebarSearch.focus()
      sidebarSearch.select()
    },
    // Add new note to db
    addNewNote (title) {
      let newNote = {
        name: title,
        text: '',
        dateModified: Date.now()
      }

      // Check if note with same title exists
      // Get all notes beginning with same title, then loop until unique found
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
        db.notes.put(newNote).then((newNoteID) => {
          // Add new note to notes list
          console.log('note added', newNote)

          this.$store.state.notes.unshift(newNote)

          // Edit and focus new note
          this.$root.$emit('NoteSelectedInNotesListGoEdit', newNote.id)

          return
        })
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
    }
  } // methods
}

module.exports = mixins

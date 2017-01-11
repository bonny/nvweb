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
      /*
      db.notes.where('name').equals(title).toArray().then((notesWithSameName) => {
        // console.log('vals', vals)
        return notesWithSameName
      }).catch((err) => {
      */

      db.notes.put(newNote).then((newNoteID) => {
        // Add new note to notes list
        console.log('note added', newNote)

        this.$store.state.notes.unshift(newNote)

        // Edit and focus new note
        this.$root.$emit('NoteSelectedInNotesListGoEdit', newNote.id)

        return
      })
    }
  }
}

module.exports = mixins

<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>Debug</h1>

      <h4>Options</h4>
      <pre>{{ JSON.stringify(options, null, '  ') }}</pre>

    </div>

  </div>

</template>

<script>

import DropboxStorage from '../dropboxstorage.js'
import db from '../db.js'
import NotesList from '../components/NotesList.vue'
import Mixins from '../mixins.js'
import _ from 'lodash'

export default {
  name: 'Debug',
  mixins: [Mixins],
  computed: {
    options () {
      return this.$store.state.options
    },
    notes () {
      return this.$store.state.notes
    }
  },
  components: {
    NotesList
  },
  methods: {
    getNotes() {
      console.log('getNotes')
    }
  },
  mounted () {
    console.log('debug mounted')
    this.$store.state.appBootPromise.then(() => {
      console.log('debug mounted, nvwebBootDone')
      
      // tmp removed to test virtual scroll
      // return;

      this.showSnackMessage('Getting list of all notes...')
      let x = DropboxStorage.getNotesList(this.$store.state.options.dropboxNotesFolderPath)
      x.then(notes => {
        console.log('notes from dropbox', notes)
        this.showSnackMessage(`Done! Got ${notes.entries.length} notes.`)
        this.dropboxFolderNotes = notes.entries

        // add notes 
        //  - not available locally
        //  - available locally but with different rev
        console.log('length', this.dropboxFolderNotes.length)
        for (let i = this.dropboxFolderNotes.length-1; i >= 0; i--) {
          
          // this.dropboxFolderNotes.forEach(dropboxNote => {
          // console.log('note', dropboxNote)
          let dropboxNote = this.dropboxFolderNotes[i];

          // Find local note version, if any, of dropdox note
          let noteIndex = _.findIndex(this.$store.state.notes, localNote => {
            return dropboxNote.id === localNote.dropboxId
          })

          if (noteIndex >= 0) {
            // note found, update
            console.log("note found")

          } else {
            // note not found, add to local state
            let newNote = {
              name: dropboxNote.name,
              dropboxId: dropboxNote.id,
              dropboxServerModified: dropboxNote.server_modified,
              dropboxRev: dropboxNote.rev,
              dropboxPathLower: dropboxNote.path_lower,
              text: null,
              dateModified: new Date(dropboxNote.server_modified).getTime()
            }

            this.$store.state.notes.unshift(newNote)

          }
          // console.log('noteIndex', noteIndex)

        }

        console.log('after foreach')

      })
    })
  }, // mounted
  data () {
    return {
      dropboxFolderNotes: []
    }
  }
}

</script>

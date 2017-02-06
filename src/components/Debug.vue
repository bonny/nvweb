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
    },
    /**
     * Find local note version, if any, of dropdox note
     * find by dropboxId, an ID that does not change
     * @return int index, -1 if not found
     */
    getNoteIndex(dropboxFileMetadata) {
      let noteIndex = _.findIndex(this.$store.state.notes, localNote => {
        if (!localNote.dropboxMeta || !localNote.dropboxMeta.dropboxId) {
          return false;
        }

        return dropboxFileMetadata.id === localNote.dropboxMeta.dropboxId
      })

      return noteIndex
    },
    addOrUpdateNote(dropboxFileMetadata) {
      let noteIndex = this.getNoteIndex(dropboxFileMetadata)

      if (noteIndex >= 0) {
        // note found, update
        // console.log("note found")
      } else {
        // note not found, add to local state
        // console.log('add note')
        let newNote = {
          name: dropboxFileMetadata.name,
          dropboxMeta: dropboxFileMetadata,
          text: null,
          dateModified: new Date(dropboxFileMetadata.server_modified).getTime()
        }

        this.$store.state.notes.unshift(newNote)
      }
    }
  },
  mounted () {
    console.log('debug mounted')
    this.$store.state.appBootPromise.then(() => {
      console.log('debug mounted, nvwebBootDone')
      
      // tmp removed to test virtual scroll
      // return;

      this.showSnackMessage('Getting list of all notes...')
      
      DropboxStorage.getNotesList(this.$store.state.options.dropboxNotesFolderPath)
      .then(notes => {
        console.log('notes from dropbox', notes)
        this.showSnackMessage(`Done! Got ${notes.entries.length} notes.`)
        this.dropboxFolderNotes = notes.entries

        // add notes 
        //  - not available locally
        //  - available locally but with different rev
        console.log('length', this.dropboxFolderNotes.length)
        for (let i = this.dropboxFolderNotes.length-1; i >= 0; i--) {
          
          let dropboxFileMetadata = this.dropboxFolderNotes[i]

          this.addOrUpdateNote(dropboxFileMetadata)

        } // for each note

      }) // then

    }) // boot then
  }, // mounted
  data () {
    return {
      dropboxFolderNotes: []
    }
  }
}

</script>

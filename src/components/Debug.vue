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

        if (!localNote.dropboxMeta || !localNote.dropboxMeta.id) {
          return false;
        }

        return dropboxFileMetadata.id === localNote.dropboxMeta.id
      })

      return noteIndex
    },
    /**
     * Work queue of dropbox files meta data
     * Add each note to local state + db
     * or if note is exising then update note
     */
    addOrUpdateNote(dropboxFileMetadata) {
      let noteIndex = this.getNoteIndex(dropboxFileMetadata)

      // console.log('noteIndex', noteIndex)

      if (noteIndex >= 0) {
        // note found, update
        // console.log("note found")
        //console.log('note found')
        //failmucho()
      } else {
        // note not found, add to local state
        // console.log('note not found')
        // failmucho()
        this.addNewNoteFromDropbox(dropboxFileMetadata);
      }
    },
    addNewNoteFromDropbox(dropboxFileMetadata) {
      console.log('addNewNoteFromDropbox')

        // Add to local state
        let newNote = {
          name: dropboxFileMetadata.name,
          text: null,
          dateModified: new Date(dropboxFileMetadata.server_modified).getTime(),
          dropboxMeta: dropboxFileMetadata
        }

        this.$store.state.notes.unshift(newNote)

        // Add to db
        db.notes.put(newNote).then((newNoteID) => {
          console.log('note added to db from dropbox')
        })
    }
  },
  mounted () {
    console.log('debug mounted')
    this.$store.state.appBootPromise.then(() => {
      console.log('debug mounted, nvwebBootDone')

      // tmp removed to test virtual scroll
      // return;
      if (!this.$store.state.options.dropboxAuthToken || !this.$store.state.options.dropboxNotesFolderPath) {
        this.showSnackMessage('Dropbox setup not complete')
        return
      }

      this.showSnackMessage('Getting list of all notes...')

      DropboxStorage.getNotesList(this.$store.state.options.dropboxNotesFolderPath)
      .then(notes => {
        //console.log('notes from dropbox', notes)
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

      })
      .catch(e => {
        console.log('getNotesList catch', e)
        this.showSnackMessage(`Got error from Dropbox API: ${e.status}: ${e.error}`, 5000)
      }) // getNotesList

    }) // boot then
  }, // mounted
  data () {
    return {
      dropboxFolderNotes: []
    }
  }
}

</script>

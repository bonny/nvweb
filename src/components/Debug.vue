<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>Debug</h1>

      <button v-mdl class="mdl-button mdl-button--raised mdl-js-button" v-on:click="showNotesToBeUpdated()">Get list of notes to be updated</button>
      <ul class="mdl-list">
        <li v-for="note in notesToBeUpdated">{{note.name}}</li>
      </ul>

      <h4>Debug log</h4>
      <textarea v-mdl v-model="this.$store.state.debug" class="mdl-textfield__input" rows="8"></textarea>

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
    showNotesToBeUpdated() {
      this.notesToBeUpdated = _.filter(this.$store.state.notes, { 'updateFromDropboxNeeded': true })
      console.log('this.notesToBeUpdated', this.notesToBeUpdated)
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
    getNoteByIndex(noteIndex) {
      let note = this.$store.state.notes[noteIndex];
      return note
    },

    /**
     * Work queue of dropbox files meta data
     * Add each note to local state + db
     * or if note is exising then update note
     */
    addOrUpdateNote(dropboxFileMetadata) {

      let noteIndex = this.getNoteIndex(dropboxFileMetadata)

      if (noteIndex >= 0) {

        // Note exists in local db already, check if it's updated
        let localNote = this.getNoteByIndex(noteIndex)

        // Compare note REV to detect if note is changed
        // If .rev is different then a modified version of the note is on dropbox
        if (dropboxFileMetadata.rev !== localNote.dropboxMeta.rev) {
          this.markNoteToBeUpdatedFromDropbox(localNote, dropboxFileMetadata)
        }

      } else {
        // Note not found in local db, so add as new note
        this.addNewNoteFromDropbox(dropboxFileMetadata);
      }

    },

    /**
     * Set an existing note as in need to be updated from Dropbbox
     * for example when note exists in result from FileListContinue
     *
     * @param localNote existing local note
     * @param dropboxFileMetadata new metadata from Dropbox
     */
    markNoteToBeUpdatedFromDropbox(localNote, dropboxFileMetadata) {

      this.log('Mark note as updated "' + dropboxFileMetadata.name + '" » "' + localNote.dropboxMeta.name + '"')

      // Modify local note
      console.log('localNote', localNote)
      localNote.name = dropboxFileMetadata.name
      localNote.dateModified = new Date(dropboxFileMetadata.server_modified).getTime()
      localNote.dropboxMeta = dropboxFileMetadata
      localNote.updateFromDropboxNeeded = true

      // Update in db
      db.notes.update(localNote.id, {
        name: localNote.name,
        dateModified: localNote.dateModified,
        dropboxMeta: localNote.dropboxMeta,
        updateFromDropboxNeeded: localNote.updateFromDropboxNeeded
      }).then((numRowsUpdated) => {
        // note was updated
        this.log('note updated')
      })

    },

    /**
     * Add a new note that is found on Dropbox
     * to local state + db
     *
     * @param dropboxFileMetadata
     */
    addNewNoteFromDropbox(dropboxFileMetadata) {

      this.log(`New note found: "${dropboxFileMetadata.name}`)

      // Add note to local state
      let newNote = {
        name: dropboxFileMetadata.name,
        text: null,
        dateModified: new Date(dropboxFileMetadata.server_modified).getTime(),
        dropboxMeta: dropboxFileMetadata,
        updateFromDropboxNeeded: true
      }

      this.$store.state.notes.unshift(newNote)

      // Add to db
      db.notes.put(newNote).then((newNoteID) => {
        // note added
      })

    } // addNewNoteFromDropbox

  },
  mounted () {
    this.$store.state.appBootPromise.then(() => {

      this.log('debug mounted, nvwebBootDone')

      if (!this.$store.state.options.dropboxAuthToken || !this.$store.state.options.dropboxNotesFolderPath) {
        this.showSnackMessage('Dropbox setup not complete')
        this.log('Dropbox setup not complete')
        return
      }

      this.showSnackMessage('Getting list of all notes...')
      this.log('Getting list of all notes...')

      // Get a list of all or new/updated/deleted notes
      DropboxStorage.getNotesList(this.$store.state.options.dropboxNotesFolderPath, this.$store.state.options.dropboxCursor)
      .then(notes => {

        this.showSnackMessage(`Got ${notes.entries.length} notes.`)
        this.log(`Got ${notes.entries.length} new or updated notes from Dropbox.`)

        // Check all notes and check if they should be updated or added as new
        for (let i = notes.entries.length-1; i >= 0; i--) {
          let dropboxFileMetadata = notes.entries[i]
          this.addOrUpdateNote(dropboxFileMetadata)
        }

        // @TODO: only store the cursor after we have successfully stored new/updated notes
        this.$store.commit('setOption', { key: 'dropboxCursor', value: notes.cursor })

      })
      .catch(e => {
        this.log('getNotesList catch error' + JSON.stringify(e))
        this.showSnackMessage(`Got error from Dropbox API: ${e.status}: ${e.error}`, 5000)
      }) // getNotesList

    }) // boot then
  }, // mounted
  data () {
    return {
      notesToBeUpdated: []
    }
  }
}

</script>

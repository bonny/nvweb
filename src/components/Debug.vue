<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>Debug</h1>

      <h4>Options</h4>
      <pre>{{ JSON.stringify(options, null, '  ') }}</pre>

      <h4>Notes</h4>

      <p>{{notes.length}} notes in db</p>

    </div>

  </div>

</template>

<script>

import DropboxStorage from '../dropboxstorage.js'
import db from '../db.js'
import NotesList from '../components/NotesList.vue'
import Mixins from '../mixins.js'

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
    /*DropboxStorage.load().then(() => {
      console.log('debug mounted, on dropbox loaded')
    })*/
    /*window.nvwebBootDone.then(() => {
      console.log('debug mounted, nvwebBootDone')
    })*/
    this.$store.state.appBootPromise.then(() => {
      console.log('debug mounted, nvwebBootDone')
    })
  }
}

</script>

<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>Debug</h1>

      <h4>Options</h4>
      <pre>{{ JSON.stringify(options, null, '  ') }}</pre>

      <h4>Mixins test</h4>
      <p>{{mixinTest()}}</p>

      <h4>Notes</h4>

      <p>{{notes.length}} notes</p>

      <NotesList></NotesList>

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
  }
}

</script>

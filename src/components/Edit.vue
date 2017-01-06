<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <p>Editing note with id <code>{{this.$store.state.currentNote.id}}</code></p>
      <p>Note name: {{this.$store.state.currentNote.name}}</p>
      <p>Preview text: <code>{{this.$store.state.currentNote.previewText}}</code></p>

      <div v-mdl class="mdl-textfield mdl-js-textfield">
        <textarea v-mdl class="mdl-textfield__input" type="text" rows="10" id="editText" v-model="this.$store.state.currentNote.text"></textarea>
        <label v-if="!this.$store.state.currentNote.text" v-mdl class="mdl-textfield__label" for="editText">Edit text...</label>
      </div>

    </div>

  </div>

</template>

<script>
export default {
  name: 'edit',
  mounted () {
    // console.log('edit mounted', this.$route.params.noteID)
    this.editNote(this.$route.params.noteID)
  },
  /*
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    console.log('edit beforeRouteEnter', to, from, next)

    next()
  },
  */
  data: function () {
    return {
      // noteID: null
    }
  },
  computed: {
    /*noteID: function() {
      return this.$route.params.noteID
    }*/
  },
  methods: {
    // load note from db
    editNote (noteID) {
      // this.noteID = noteID
      console.log('edit note', noteID)
      this.$store.dispatch({
        type: 'setCurrentNote',
        noteID: noteID
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      // console.log('route changed', to, from)
      this.editNote(this.$route.params.noteID)
    }
  }
}
</script>

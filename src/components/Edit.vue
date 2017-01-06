<style scoped>
  .editText {
    width: 95%;
    background: #f0f0f0;
    font-family: inherit;
    font-size: 1.25rem;
    padding: .75rem;
    border: none;
  }
  .editText:focus {
    outline: none;
  }
</style>

<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <!-- <p>Editing note with id <code>{{this.$store.state.currentNote.id}}</code></p> -->
      <!-- <p>Note name: {{this.$store.state.currentNote.name}}</p> -->
      <!-- <p>Preview text: <code>{{this.$store.state.currentNote.previewText}}</code></p> -->

      <!-- <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--editText">
      <textarea v-mdl class="mdl-textfield__input" type="text" rows="10" id="editText" v-model="noteText" @input="update"></textarea>
      <label v-if="!noteText" v-mdl class="mdl-textfield__label" for="editText">Edit text...</label>
      </div> -->

      <textarea class="editText" rows="10" id="editText" v-model="noteText" @input="update"></textarea>

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
  data () {
    return {
      // noteID: null
      //
    }
  },
  computed: {
    /*noteID: function() {
      return this.$route.params.noteID
    }*/
    noteText () {
      console.log('computed noteText', this.$store.state.currentNote.text)
      return this.$store.state.currentNote.text
    }
  },
  methods: {
    // load note from db
    editNote (noteID) {
      // this.noteID = noteID
      // console.log('edit note', noteID)
      this.$store.dispatch({
        type: 'setCurrentNote',
        noteID: noteID
      }).then(() => {
        // console.log('set curret note done', this.$store.state.currentNote.id)

        // set focus after note set
        // @TODO: use nextTick or something here? timeout feels very dirty
        setTimeout(function() {
          var el = document.getElementById('editText')
          el.setSelectionRange(0,0)
          el.focus()
        }, 1)

      })
    },
    // called when text is updated
    update (e) {
      let text = e.target.value
      //console.log('on update', e.target.value, this.$store.state.currentNote.text)
      this.$store.state.currentNote.text = text

    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      // console.log('route changed', to, from)
      this.editNote(this.$route.params.noteID)
    },
    noteText: function(newNoteText) {
      // console.log('noteText changed', newNoteText)
    }
  },
  updated (e) {

    /*
    var el = document.getElementById('editText')
    el.focus()
    el.setSelectionRange(1,10)
    */

  }
}
</script>

<style scoped>
  .editText {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    font-family: inherit;
    font-size: 1.25rem;
    padding: 2rem;
    border: none;
    box-sizing: border-box;
  }
  .editText:focus {
    outline: none;
  }
  .mdl-grid {
    /*height: calc(100vh - 80px);*/
    height: 100vh;
  },
  .mdl-grid,
  .mdl-cell {
    padding: 0;
    margin: 0;
  }
  .mdl-cell--12-col {
    width: 100%;
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

import _ from 'lodash'
import db from '../db.js'

export default {
  name: 'edit',
  mounted () {
    console.log('edit mounted', this.$route.params.noteID)
    this.editNote(this.$route.params.noteID)
  },
  /*created () {
    console.log('edit created', this.$route.params.noteID)
    this.editNote(this.$route.params.noteID)
  },*/
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
      // console.log('computed noteText', this.$store.state.currentNote.text)
      return this.$store.state.currentNote.text
    }
  },
  methods: {
    // load note from db
    editNote (noteID) {
      // noteID must be integer
      noteID = parseInt(noteID)

      // console.log('edit note, send store dispatch setCurrentNote', noteID)
      return this.$store.dispatch({
        type: 'setCurrentNote',
        noteID: noteID
      }).then(() => {
        // console.log('set curret note done', this.$store.state.currentNote.id)

        // set focus after note set
        // @TODO: use nextTick or something here? timeout feels very dirty
        if (this.$route.params.focusText) {
          setTimeout(function() {
            var el = document.getElementById('editText')
            el.setSelectionRange(0,0)
            el.focus()
          }, 1)
        }

      })
    },
    // called when text is updated
    // update note in db
    update: _.debounce(function (e) {
      // console.log('update in db', this.$store.state.currentNote.id)

      //this.$store.state.currentNote.text = text
      //this.$store.state.currentNote.previewText = text

      let noteText = e.target.value
      let noteID = this.$store.state.currentNote.id

      db.notes.update(noteID, {
        text: noteText,
        dateModified: Date.now()
      }).then((numRowsUpdated) => {
        // console.log('note updated, result was', numRowsUpdated)
        // update note in store
        this.$store.commit({
          type: 'setSingleNote',
          note: {
            text: noteText,
            id: noteID
          }
        })
      })

      //console.log('on update', e.target.value, this.$store.state.currentNote.text)

    }, 500)
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      console.log('route changed', to, from)
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

  },
  /*
  beforeRouteEnter (to, from, next) {
    if (from.path == "/" && !from.name) {
      // We are coming from a fresh reload, need to wait for db and notes to be loaded
      console.log('edit beforeRouteEnter', to, from)
      setTimeout(() => {
        console.log('go on after timeout')
        next((vm) => {
          console.log('go on inside next', vm)
        })
      }, 0)
    } else {
      next(true)
    }
    // next(false)
  }
  */
}
</script>

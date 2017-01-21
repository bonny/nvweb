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

  @media screen and (max-width: 1024px) {
    .mdl-grid {
      /* 64px height in desktop, 56px height in mobile */
      height: calc(100vh - 59px);
    }
  }
  @media screen and (min-width: 1024px) {
    .mdl-grid {
      /* 64px height in desktop, 56px height in mobile */
      height: calc(100vh - 67px);
    }
  }

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

      <textarea :placeholder="noteText ? '' : 'Enter text...'" class="editText" rows="10" id="editText" v-model="noteText" @input="update" tabindex="3"></textarea>

    </div>

  </div>

</template>

<script>

import _ from 'lodash'
import db from '../db.js'
import Mixins from '../mixins.js'

export default {
  name: 'edit',
  mixins: [Mixins],
  mounted () {
    // console.log('edit mounted', this.$route.params.noteID)
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
    // edit note = load note from db, update textarea
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
            // console.log('set focus')
            var el = document.getElementById('editText')
            el.setSelectionRange(0,0)
            el.focus()
          }, 1)
        }

      })
    },
    // called when text is updated
    // update note in db
    update: _.debounce (function (e) {
      // console.log('update in db', this.$store.state.currentNote.id)

      let noteID = this.$store.state.currentNote.id
      let noteText = e.target.value
      let noteDateModified = Date.now()

      db.notes.update(noteID, {
        text: noteText,
        dateModified: noteDateModified
      }).then((numRowsUpdated) => {
        // console.log('note updated, result was', numRowsUpdated)
        // update note in store
        this.$store.commit({
          type: 'setSingleNote',
          note: {
            text: noteText,
            id: noteID,
            dateModified: noteDateModified
          }
        })
      })

      // console.log('on update', e.target.value, this.$store.state.currentNote.text)

    }, 250)
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
  }
}
</script>

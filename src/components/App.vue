<style scoped>
  .mdl-textfield--titleWrap {
    width: calc(100% - 50px);
  }

  .mdl-layout-title {
    max-width: 85%;
    width: 85%;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .mdl-textfield--titleWrap .mdl-textfield__input {
    max-width: none;
    width: 100%;
    border-bottom-color: rgba(255,255,255,.35);
  }

  .mdl-textfield__label {
    color: rgba(255,255,255,.26);
  }

  .mdl-textfield--titleWrap .mdl-textfield__label:after {
    background-color: rgba(255,255,255,.75);
  }

</style>

<style>
  /* Global styles */

  /* For virtual scroller */
  .virtual-scroller:not(.page-mode) {
    overflow-y: auto;
  }

  .item-container {
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
  }

  .items {
    width: 100%;
  }

  .resize-observer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    pointer-events: none;
    display: block;
    overflow: hidden;
  }

  .test h1 {
    color: #40b883;
  }
</style>

<template>

  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
              mdl-layout--fixed-header"
              >

  <!-- The drawer is always open in large screens. The header is always shown,
    even in small screens. -->
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">

        <span
          v-if="!this.$store.state.currentNote.id"
          class="mdl-layout-title"></span>

         <div v-mdl
              v-if="this.$store.state.currentNote.id"
              class="mdl-textfield mdl-js-textfield mdl-textfield--titleWrap"
              >
           <input
            v-mdl
            type="text"
            class="mdl-textfield__input mdl-layout-title"
            v-model="currentNoteName"
            v-on:keyup.enter="moveFocusToEdit"
            xv-model="this.$store.state.currentNote.name"
            @input="noteNameUpdated"
            tabindex="2"
            >
            <label class="mdl-textfield__label">Enter note name</label>
        </div>

        <div class="mdl-layout-spacer"></div>

        <button id="demo-menu-lower-right"
                class="mdl-button mdl-js-button mdl-button--icon">
          <i class="material-icons">more_vert</i>
        </button>

        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
            for="demo-menu-lower-right">
          <li class="mdl-menu__item" v-on:click="addNewNote('New note')">Add note</li>
          <li v-bind:disabled="deleteDisabled" class="mdl-menu__item mdl-menu__item--full-bleed-divider" v-on:click="deleteNote()">Delete note</li>
          <router-link tag="li" class="mdl-menu__item" to="/">Start</router-link>
          <router-link tag="li" class="mdl-menu__item" :to="{ name: 'debug' }">Debug</router-link>
          <router-link tag="li" class="mdl-menu__item" :to="{ name: 'settings' }">Settings</router-link>
        </ul>

      </div>
    </header>

    <sidebar :title="sidebarTitle"></sidebar>

    <main class="mdl-layout__content">
      <div class="page-content">

        <!-- Your content goes here -->

        <!-- route outlet -->
        <!-- component matched by the route will render here -->
        <router-view></router-view>

      </div>
    </main>

    <div v-mdl id="messageToast" class="mdl-js-snackbar mdl-snackbar">
      <div v-mdl class="mdl-snackbar__text"></div>
      <button v-mdl class="mdl-snackbar__action" type="button"></button>
    </div>

  </div>

</template>

<script>

import _ from 'lodash'
import db from '../db.js'
import DropboxStorage from '../dropboxstorage.js'
import Sidebar from '../components/Sidebar.vue'
import Mixins from '../mixins.js'

export default {
  name: 'app_vue',
  mixins: [Mixins],
  beforeMount () {
    this.boot()
  },
  mounted () {
    this.addListeners()
  },
  data () {
    return {
      // appTitle: this.$store.state.appTitle
    }
  },
  computed: {
    appTitle () {
      return this.$store.state.currentNote.name ? this.$store.state.currentNote.name : this.$store.state.appTitle
    },
    currentNoteName () {
      return this.$store.state.currentNote.name
    },
    sidebarTitle () {
      return 'Notes'
    },
    deleteDisabled () {
      return ! this.$store.state.currentNote.id
    }
  },
  components: {
    Sidebar
  },
  methods: {
    // when app is mounted we boot by loading options and notes from db
    // @TODO: return promise so we can call boot()->then(...)
    boot () {
      let bootPromise = this.$store.dispatch({
        type: 'loadOptionsFromDB'
      }).then(() => {
        // load notes
        return this.$store.dispatch({
          type: 'loadNotesFromDB'
        })
      }).then(() => {
        // load dropbox
        return DropboxStorage.load()
      }).then(() => {
        console.log('boot done')
      })

      this.$store.state.appBootPromise = bootPromise
    }, // boot
    addListeners () {
      // can't use v-on:keydown.esc="focusSearch" because only catches key presses inside form elements
      window.addEventListener('keydown', this.onKeydown, false)
    },
    onKeydown (event) {
      // console.log(event)
      // If down arrow was pressed or CMD + L = focus search input
      if (event.key == 'Escape' || (event.metaKey && event.key === 'l')) {
        this.focusSearch()
        this.openDrawerIfClosed()
        event.preventDefault()
      }

      // If CMD + delete = delete note
      if (event.key == 'Backspace' && event.metaKey) {
        this.deleteNote()
        event.preventDefault()
      }

      // If CMD + C (not CMD + N because browser intercepts that combo) = new note
      /*
      if (event.key == 'C' && event.metaKey) {
        this.addNewNote('New note from keyboard')
        event.preventDefault()
      }
      */

      // If CMD + j/k = maybe move next/prev note
      if (event.metaKey && (event.key == 'j' || event.key == 'k')) {
        this.$root.$emit('NotelistMaybeKeyboardNavNotes', event)
      }
    },
    noteNameUpdated: _.debounce (function(e) {

      let noteID = this.$store.state.currentNote.id
      let noteName = e.target.value
      let noteDateModified = Date.now()

      this.$store.state.currentNote.name = noteName

      // console.log('noteNameUpdated', noteName, noteID)

      db.notes.update(noteID, {
        name: noteName,
        dateModified: noteDateModified
      }).then((numRowsUpdated) => {
        // console.log('note updated, result was', numRowsUpdated)
        // update note in store
        return this.$store.commit({
          type: 'setSingleNote',
          note: {
            name: noteName,
            id: noteID,
            dateModified: noteDateModified
          }
        })
      }).then(() => {
        // console.log('name updated')
      })

    }, 250),// note name updated
    moveFocusToEdit () {
      this.focusEditTextArea();
    }
  } // methods
}

</script>

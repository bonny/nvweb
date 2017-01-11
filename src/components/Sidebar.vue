<style>
  .mdl-layout__drawer {
    width: 340px;
    transform: translateX(-350px)
  }
  .mdl-layout--fixed-drawer>.mdl-layout__content {
    margin-left: 340px;
  }
  .mdl-layout--fixed-drawer.is-upgraded:not(.is-small-screen)>.mdl-layout__header {
      margin-left: 340px;
      width: calc(100% - 340px);
  }

  .mdl-textfield--sidebarSearch {
    width: 100%;
  }

  .sidebarSearchWrap {
    padding: 0 10px;
  }

  .sidebarSearch__infotext {
    top: -14px;
    margin-right: 10px;
    display: block;
    position: relative;
    text-align: right;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    color: rgba(0,0,0,.54);
  }

  @media screen and (max-width: 1024px) {
    .mdl-layout--fixed-drawer>.mdl-layout__content {
      margin-left: 0;
    }
  }
</style>
<template>

  <div class="mdl-layout__drawer" v-on:keydown="navNotesWithKeyboard">

    <!-- <span class="mdl-layout-title">{{title}}</span> -->
    <div class="sidebarSearchWrap">

        <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--sidebarSearch">
          <input v-mdl class="mdl-textfield__input" type="text" id="sidebarSearch"
                 v-on:keyup.enter="editNote"
                 v-on:keyup="searchNotes"
          >
          <label v-mdl class="mdl-textfield__label" for="sidebarSearch">Search or Create</label>
        </div>

        <span v-if="searchText && !this.$store.state.currentNote.id" class="sidebarSearch__infotext">
          <code>&lt;Enter&gt;</code> to create new note
        </span>
        <span v-else class="sidebarSearch__infotext">
          {{this.$store.state.notes.length}} notes
        </span>

    </div>

    <NotesList v-bind:searchText="searchText"></NotesList>

  </div>

</template>

<script>

import _ from 'lodash'
import db from '../db.js'
import NotesList from '../components/NotesList.vue'
import Mixins from '../mixins.js'

export default {
  props: ["title"],
  mixins: [Mixins],
  components: {
    NotesList
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    navNotesWithKeyboard (e) {

      // Only act on arrow down/up
      if (e.code == 'ArrowDown' || e.code == 'ArrowUp') {
        this.$root.$emit('NotelistMaybeKeyboardNavNotes', e)
      }

    },
    // edit currenly selected note
    // or create new if no note in edit
    editNote (e) {
      // console.log('emit NoteSelectedInNotesListGoEdit', e)

      let selectedElm = document.querySelectorAll('.mdl-list__item--selected')
      let searchText = this.searchText.trim()

      if (selectedElm.length) {
        // note selected, go edit it
        this.$root.$emit('NoteSelectedInNotesListGoEdit', selectedElm[0].dataset.noteid)
        return
      } else if (searchText) {
        // note note selected, create a new
        // @TODO: move this to own function so we can call same thing from menu
        console.log('create new note')

        this.addNewNote(searchText)

      }

    },
    searchNotes: _.debounce (function(e) {

      let searchText = e.target.value
      // console.log('maybe search notes for', searchText, this)
      this.searchText = searchText

    }, 250)
  }
}

</script>

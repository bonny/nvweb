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
    /*width: auto;*/
  }

  .sidebarSearchWrap {
    padding: 0 10px;
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

    </div>

    <NotesList v-bind:searchText="searchText"></NotesList>

  </div>

</template>

<script>

import _ from 'lodash'
import NotesList from '../components/NotesList.vue'

export default {
  props: ["title"],
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
    editNote (e) {
      // console.log('emit NoteSelectedInNotesListGoEdit', e)

      let selectedElm = document.querySelectorAll('.mdl-list__item--selected')

      if (!selectedElm.length) {
        return
      }

      this.$root.$emit('NoteSelectedInNotesListGoEdit', selectedElm[0], selectedElm[0].dataset.noteid)
    },
    searchNotes: _.debounce (function(e) {

      let searchText = e.target.value
      // console.log('maybe search notes for', searchText, this)
      this.searchText = searchText

    }, 100)
  }
}

</script>

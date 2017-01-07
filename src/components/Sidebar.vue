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

  <div class="mdl-layout__drawer" v-on:keyup="navNotesWithKeyboard">

    <!-- <span class="mdl-layout-title">{{title}}</span> -->
    <div class="sidebarSearchWrap">

        <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--sidebarSearch">
          <input v-mdl class="mdl-textfield__input" type="text" id="sidebarSearch">
          <label v-mdl class="mdl-textfield__label" for="sidebarSearch">Search or Create</label>
        </div>

    </div>

    <NotesList></NotesList>

  </div>

</template>

<script>

import NotesList from '../components/NotesList.vue'

export default {
  props: ["title"],
  components: {
    NotesList
  },
  methods: {
    navNotesWithKeyboard (e) {
      let activeElm = document.activeElement
      let lis = document.querySelectorAll('.mdl-list__item')

      // if current element is not an li then first li/note should be focused
      if (activeElm.tagName !== 'LI') {
        lis[0].focus()
        return;
      }

      // find current index of active elm
      let activeElmIndex;
      for (let i = 0; i < lis.length; i++) {
        if (lis[i] == activeElm) {
          activeElmIndex = i;
          break;
        }
      }

      if (e.code == 'ArrowDown' && activeElmIndex < lis.length) {
        lis[activeElmIndex+1].focus()
      } else if (e.code == 'ArrowUp' && activeElmIndex > 0) {
        lis[activeElmIndex-1].focus()
      }

      e.preventDefault()

    }
  }
}

</script>

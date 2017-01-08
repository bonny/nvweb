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
          >
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

      // Only act on arrow down/up
      if (e.code != 'ArrowDown' && e.code != 'ArrowUp') {
        return
      }

      let activeElm = document.querySelector('.mdl-list--notes .mdl-list__item--selected')
      let lis = document.querySelectorAll('.mdl-list--notes .mdl-list__item')
      let elmIndexToSelect;

      // if current element is not an li then first li/note should be focused
      if (!activeElm || activeElm.tagName !== 'LI') {
        elmIndexToSelect = 0
      } else if (activeElm && activeElm.tagName === 'LI') {
        // find current index of active elm
        let activeElmIndex;
        for (let i = 0; i < lis.length; i++) {
          if (lis[i] == activeElm) {
            activeElmIndex = i;
            break;
          }
        }

        if (e.code == 'ArrowDown' && activeElmIndex < lis.length) {
          elmIndexToSelect = activeElmIndex+1
        } else if (e.code == 'ArrowUp' && activeElmIndex > 0) {
          elmIndexToSelect = activeElmIndex-1
        }

      }

      console.log('elmIndexToSelect', elmIndexToSelect)

      if (elmIndexToSelect !== undefined && elmIndexToSelect in lis) {
        document.querySelectorAll('.mdl-list--notes .mdl-list__item--selected').forEach((el) => {
          el.classList.remove('mdl-list__item--selected')
        })

        lis[elmIndexToSelect].classList.add('mdl-list__item--selected')

        /*lis[elmIndexToSelect].scrollIntoView({
          behavior: 'smooth',
          block: 'top'
        })
        */
      }

      if (elmIndexToSelect !== undefined && elmIndexToSelect in lis) {
        let noteID = parseInt(lis[elmIndexToSelect].dataset.noteid);

        // get note id from data attr and pass
        this.$root.$emit('NoteSelectedInNotesList', lis[elmIndexToSelect], noteID)
      }

      e.preventDefault()

    },
    // edit currenly selected note
    editNote (e) {
      console.log('emit NoteSelectedInNotesListGoEdit', e)

      let selectedElm = document.querySelectorAll('.mdl-list__item--selected')

      if (!selectedElm.length) {
        return
      }

      this.$root.$emit('NoteSelectedInNotesListGoEdit', selectedElm[0], selectedElm[0].dataset.noteid)
    }
  }
}

</script>

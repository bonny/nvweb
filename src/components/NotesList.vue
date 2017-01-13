<style scoped>

  .NoteList-noteName {
    font-size: 1rem;
    letter-spacing: normal;
    color: black;
  }

  /* keep preview text on one line */
  .mdl-list__item-sub-title,
  .NoteList-noteName {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    /*background: lightyellow;*/
    max-width: 290px;
    text-overflow: ellipsis;
  }

  .mdl-list__item--two-line .mdl-list__item-primary-content {
    /* always give space to date */
    /*max-width: calc(100% - 4em);*/
  }

  .mdl-list__item {
    position: relative;
    cursor: pointer;
  }

  .mdl-list__item:hover {
    background-color: #f5f5f5;
  }

  .mdl-list__item:focus {
    background: #eee;
  }

  .mdl-list__item--selected {
    background: #ddd;
  }

  .mdl-list__item--selected.mdl-list__item--selected {
    background: #ddd;
  }

  .mdl-list__item--two-line {
    height: 78px;
    padding: 16px;
    padding: 22px 16px 10px 16px;
  }

  .mdl-list__item-secondary-content {
    position: absolute;
    /*top: 18px;
    right: 16px;
    padding: 4px;*/
    /*background: rgba(255, 255, 255, 1);*/
    position: absolute;
    top: 14px;
    left: 0px;
    padding: 0;
  }

  .mdl-list__item-secondary-info {
    /*white-space: nowrap;*/
  }

</style>

<template>

  <div>

    <ul class="mdl-list mdl-list--notes">

      <li v-for="note in notes" class="mdl-list__item mdl-list__item--two-line"
          v-bind:class="{ 'mdl-list__item--selected': note.id === $store.state.currentNote.id }"
          v-on:click="editNote(note.id)"
          v-on:keyup.enter="editNote(note.id)"
          :data-noteID="note.id"
          >

        <span class="mdl-list__item-primary-content">

          <span class="NoteList-noteName">
            {{note.name}}
          </span>

          <span class="mdl-list__item-sub-title">
            {{note.text | trim}}
          </span>

        </span>

        <span class="mdl-list__item-secondary-content">
          <span class="mdl-list__item-secondary-info">{{ note.dateModified | moment('from') }}</span>
        </span>

      </li>

    </ul>

  </div>

</template>

<script>

var Fuse = require('fuse.js')
import Mixins from '../mixins.js'

export default {
  name: "NotesList",
  mixins: [Mixins],
  props: ['searchText'],
  computed: {
    notes () {
      let notes = this.$store.state.notes
      // console.log('searchText', this.searchText)

      if (this.searchText) {

        // set no note as current note
        if (this.searchText !== this.prevSearchText) {
          this.$store.commit({
            type: 'setCurrentNote',
            note: {}
          })
        }

        let options = {
          // include: ['score', 'matches'],
          keys: ['name', 'text'],
          shouldSort: true,
          tokenize: true,
          matchAllTokens: true,
          findAllMatches: false,
          threshold: 0.3, // default 0.6, but gave to many hits in my opinion
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1
        }

        var fuse = new Fuse(notes, options)

        notes = fuse.search(this.searchText.trim())
        // console.log('notes searched', notes)
        this.prevSearchText = this.searchText.trim()
      }

      return notes
    }
  },
  filters: {
     trim: function (value) {
       if (!value) return ''
       return value.substr(0, 75)
     }
  },
  data: function () {
    return {
      prevSearchText: null
    }
  },
  mounted () {
    this.$root.$on('NoteSelectedInNotesList', (noteID) => {
      this.viewNote(noteID)
    })

    this.$root.$on('NoteSelectedInNotesListGoEdit', (noteID) => {
      this.editNote(noteID)
    })

    this.$root.$on('NotelistMaybeKeyboardNavNotes', (event) => {
      this.navNotesWithKeyboard(event)
    })

  },
  methods: {
    editNote (noteID) {
      // close drawer on small screens
      this.closeDrawerIfOpened()

      this.$router.push({
        name: 'edit',
        params: {
          noteID: noteID,
          focusText: true
        }
      })
    },
    viewNote (noteID) {

      this.$router.push({
        name: 'edit',
        params: {
          noteID: noteID,
          focusText: false
        }
      })

      this.focusSearch()

    },
    humanDate(note) {
      return note.dateModified
    },
    navNotesWithKeyboard (e) {

      // console.log('navNotesWithKeyboard', e)

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

        if ((e.code == 'ArrowDown' || (e.metaKey && e.key == 'j')) && activeElmIndex < lis.length) {
          elmIndexToSelect = activeElmIndex+1
        } else if ((e.code == 'ArrowUp' || (e.metaKey && e.key == 'k')) && activeElmIndex > 0) {
          elmIndexToSelect = activeElmIndex-1
        }

      }

      // console.log('elmIndexToSelect', elmIndexToSelect)

      if (elmIndexToSelect !== undefined && elmIndexToSelect in lis) {
        document.querySelectorAll('.mdl-list--notes .mdl-list__item--selected').forEach((el) => {
          el.classList.remove('mdl-list__item--selected')
        })

        lis[elmIndexToSelect].classList.add('mdl-list__item--selected')

      }

      if (elmIndexToSelect !== undefined && elmIndexToSelect in lis) {
        let noteID = parseInt(lis[elmIndexToSelect].dataset.noteid);

        // get note id from data attr and pass
        this.$root.$emit('NoteSelectedInNotesList', noteID)
      }

      e.preventDefault()

    }
  },

}

</script>

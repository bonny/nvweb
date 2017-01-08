<style scoped>

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

  .mdl-list__item:focus,
  .mdl-list__item:hover {
    background: #eee;
  }

  .mdl-list__item--selected {
    background: #ddd;
  }

  .mdl-list__item--selected.mdl-list__item--selected {
    background: #ddd;
  }

  .mdl-list__item-secondary-content {
    position: absolute;
    /*top: 18px;
    right: 16px;
    padding: 4px;*/
    /*background: rgba(255, 255, 255, 1);*/
    position: absolute;
    top: 4px;
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

export default {
  name: "NotesList",
  props: ['searchText'],
  computed: {
    notes () {
      let notes = this.$store.state.notes
      console.log('searchText', this.searchText)
      if (this.searchText) {
        let options = {
          // include: ['score', 'matches'],
          keys: ['name', 'text'],
          shouldSort: true,
          tokenize: true,
          matchAllTokens: true,
          findAllMatches: true,
          threshold: 0.3, // default 0.6, but gave to many hits in my opinion
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1
        }

        var fuse = new Fuse(notes, options)

        notes = fuse.search(this.searchText)
        // console.log('notes searched', notes)
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
      apa: 'gorilla'
    }
  },
  mounted () {
    this.$root.$on('NoteSelectedInNotesList', (elm, noteID) => {
      this.viewNote(noteID)
    })

    this.$root.$on('NoteSelectedInNotesListGoEdit', (elm, noteID) => {
      this.editNote(noteID)
    })
  },
  methods: {
    editNote (noteID) {

      // close drawer on small screens
      let d = document.querySelector('.mdl-layout')
      if (d.classList.contains("is-small-screen")) {
        d.MaterialLayout.toggleDrawer()
      }

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

    },
    humanDate(note) {
      return note.dateModified
    }
  },

}

</script>

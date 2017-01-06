<style scoped>

  /* keep preview text on one line */
  .mdl-list__item-sub-title,
  .NoteList-noteName {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    /*background: lightyellow;*/
    max-width: 290px;
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

  .mdl-list__item--selected.mdl-list__item--selected {
    background: #ddd;
  }

  .mdl-list__item-secondary-content {
    position: absolute;
    top: 18px;
    right: 16px;
    padding: 4px;
    background: rgba(255, 255, 255, 1);
  }

  .mdl-list__item-secondary-info {
    /*white-space: nowrap;*/
  }

</style>

<template>

  <ul class="mdl-list">

    <li v-for="note in notes" class="mdl-list__item mdl-list__item--two-line"
        v-bind:class="{ 'mdl-list__item--selected': note.id === $store.state.currentNote.id }"
        v-on:click="editNote(note)"
        v-on:keyup.enter="editNote(note)"
        tabindex="0">

      <span class="mdl-list__item-primary-content">

        <span class="NoteList-noteName">
          {{note.name}}
        </span>

        <span class="mdl-list__item-sub-title">
          {{note.previewText}}
        </span>

      </span>

      <span class="mdl-list__item-secondary-content">
        <span class="mdl-list__item-secondary-info">{{ note.dateModified | moment('from') }}</span>
      </span>

    </li>

  </ul>

</template>

<script>

export default {
  name: "NotesList",
  computed: {
    notes () {
      return this.$store.state.notes
    },
    testar () {
      return 123;
    }
    /*
      console.log(this.$store.currentNote)
      return this.$store.currentNote
      return this.$store.currentNote ? this.$store.currentNote.id : null
    }
    */
  },
  data: function () {
    return {
      apa: 'gorilla'
    }
  },
  methods: {
    editNote (note) {
      // console.log('edit note', note.id)

      // close drawer on small screens
      let d = document.querySelector('.mdl-layout')
      if (d.classList.contains("is-small-screen")) {
        d.MaterialLayout.toggleDrawer()
      }

      this.$router.push({
        name: 'edit',
        params: { noteID: note.id }
      })
    },
    humanDate(note) {
      return note.dateModified
    }
  },

}

</script>

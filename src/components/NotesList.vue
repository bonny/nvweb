<style scoped>

  /* keep preview text on one line */
  .mdl-list__item-sub-title {
    overflow: hidden;
    white-space: nowrap;
  }

  .mdl-list__item--two-line .mdl-list__item-primary-content {
    /* always give space to date */
    max-width: calc(100% - 4em);
  }

</style>

<template>

  <ul class="mdl-list">

    <li v-for="note in notes" class="mdl-list__item mdl-list__item--two-line" v-on:click="editNote(note)">

      <span class="mdl-list__item-primary-content">
        <span>{{note.name}}</span>
        <span class="mdl-list__item-sub-title">
          hejsan {{note.previewText}}
        </span>
      </span>

      <span class="mdl-list__item-secondary-content">
        <span class="mdl-list__item-secondary-info">{{note.humanDate}}</span>
      </span>

    </li>

  </ul>

</template>

<script>

export default {
  name: "NotesList",
  computed: {
    options () {
      return this.$store.state.options
    },
    notes () {
      return this.$store.state.notes
    }
  },
  methods: {
    editNote (note) {
      console.log('edit note', note)
    }
  },

}

</script>

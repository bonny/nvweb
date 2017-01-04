<template>

  <div class="mdl-layout__drawer">

    <span class="mdl-layout-title">{{title}}</span>

    <div v-mdl class="mdl-textfield mdl-js-textfield">
      <input v-mdl class="mdl-textfield__input" type="text" id="sample1">
      <label v-mdl class="mdl-textfield__label" for="sample1">Search</label>
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
  }
}

</script>

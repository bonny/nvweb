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

  @media screen and (max-width: 1024px) {
    .mdl-layout--fixed-drawer>.mdl-layout__content {
      margin-left: 0;
    }
  }
  </style>
<template>

  <div class="mdl-layout__drawer">

    <!-- <span class="mdl-layout-title">{{title}}</span> -->

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

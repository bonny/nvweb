<style>
  .mdl-layout-title {
    text-overflow: ellipsis;
    max-width: 85%;
    white-space: nowrap;
    display: block;
    overflow: hidden;
  }
</style>

<template>

  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
              mdl-layout--fixed-header">

  <!-- The drawer is always open in large screens. The header is always shown,
    even in small screens. -->
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{appTitle}}</span>
        <div class="mdl-layout-spacer"></div>

        <!-- search icon -->
        <!-- <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                    mdl-textfield--floating-label mdl-textfield--align-right">

          <<label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">
            <i class="material-icons">search</i>
          </label>

          <div class="mdl-textfield__expandable-holder">
            <input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp">
          </div>

        </div>-->
        <!-- // search -->

        <router-link tag="button" class="mdl-button mdl-js-button mdl-button--icon" :to="{ name: 'settings' }">
          <i class="material-icons">settings</i>
        </router-link>

        <div class="mdl-layout-icon"></div>

      </div>
    </header>

    <sidebar :title="sidebarTitle"></sidebar>

    <main class="mdl-layout__content">
      <div class="page-content">

        <!-- Your content goes here -->

        <!-- route outlet -->
        <!-- component matched by the route will render here -->
        <router-view></router-view>

      </div>
    </main>

  </div>

</template>

<script>

// import config from '../config.js'
import Sidebar from '../components/Sidebar.vue'

export default {
  name: 'app_vue',
  mounted () {
    this.boot()
  },
  data () {
    return {
      //appTitle: this.$store.state.appTitle
    }
  },
  computed: {

    appTitle() {
      return this.$store.state.currentNote.name ? this.$store.state.currentNote.name : this.$store.state.appTitle
    },
    sidebarTitle() {
      return 'Notes'
    }

  },
  components: {
    Sidebar
  },
  methods: {
    // when app is mounted we boot by loading options and notes from db
    boot () {
      this.$store.dispatch({
        type: 'loadOptionsFromDB'
      }).then(() => {
        // load notes
        this.$store.dispatch({
          type: 'loadNotesFromDB'
        })

        // if db is empty then add some default data
        /*
        //if (!this.$store.state.notes.length) {
          console.log('add default notes')
          for (let i = 0; i < 100; i++) {
            this.$store.dispatch({
              type: 'addDefaultNotes'
            })
          }
        //}
        //*/

      })

    }
  }
}

</script>

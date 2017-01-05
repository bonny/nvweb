
import Vue from 'vue'
import appView from './components/App.vue'
import store from './store.js'
let router = require('./router.js')
let vueMoment = require('vue-moment')

// https://github.com/brockpetrie/vue-moment
Vue.use(vueMoment)

// Make elements work with Material Design Lite
Vue.directive('mdl', {
  bind: function (el) {
    window.componentHandler.upgradeElement(el)
  }
})

// Create and mount the root instance.
window.app = new Vue({
  router,
  store,
  el: '#app',
  render: function (createElement) {
    return createElement(appView)
  },
  methods: {
  },
  mounted () {
    // when app is mounted we load the options from the db
    this.$store.dispatch({
      type: 'loadOptionsFromDB'
    }).then(() => {
      // load notes
      this.$store.dispatch({
        type: 'loadNotesFromDB'
      })

      // if db is empty then add some default data
      /*
      if (!this.$store.state.notes.length) {
        console.log('add default notes')
        this.$store.dispatch({
          type: 'addDefaultNotes'
        })
      }
      */

    })
  }
})

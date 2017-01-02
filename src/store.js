import Vue from 'vue'
import Vuex from 'vuex'
import db from './db.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appTitle: 'web nv',
    options: {
      dropboxAuthToken: null,
      dropboxNotesFolderPath: null
    },
    dropbox: {
      appKey: 'wytvhdqaazystov',
      // authToken: null,
      authUrl: null,
      user: null,
      isAuthed: false,
      // notesFolderPath: null,
      folders: null
    }
  },
  mutations: {
    // payload values as array, can contain many options
    setOptions (state, payload) {
      payload.options.map((val) => {
        state.options[val.key] = val.value
      })
    }
  },
  actions: {
    loadOptionsFromDB (context) {
      db.options.toArray().then((vals) => {
        context.commit({
          type: 'setOptions',
          options: vals
        })
      })
    }
    // ...
  }
})

module.exports = store

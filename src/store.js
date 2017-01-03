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
    notes: [{
      name: 'example 1',
      previewText: 'Lorem ipsum dolor sit amet',
      humanDate: 'Idag 09:10'
    }, {
      name: 'stupid hackaton',
      previewText: '- streama sin chrome/browser-historik - stream clipboard - chatroulette - fast för clipboard',
      humanDate: 'Måndag 16:43'
    }],
    dropbox: {
      appKey: 'wytvhdqaazystov',
      authUrl: null,
      user: null,
      isAuthed: false,
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

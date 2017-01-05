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
    notes: [],
    /*
      id: 'note1',
      name: 'example 1',
      previewText: 'Lorem ipsum dolor sit amet',
      humanDate: 'Idag 09:10'
    }, {
      id: 'note2',
      name: 'stupid hackaton',
      previewText: '- streama sin chrome/browser-historik - stream clipboard - chatroulette - fast för clipboard',
      humanDate: 'Måndag 16:43'
    }],
    */
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
    },
    setNotes (state, payload) {
      payload.options.map((val) => {
        state.notes.push(val)
      })
    },
    appendNotes (state, payload) {
      payload.options.map((val) => {
        state.notes.push(val)
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
    },
    // Load all notes from db
    loadNotesFromDB (context) {
      db.notes.toArray().then((notes) => {
        console.log('notes loaded from db', notes)
        context.commit({
          type: 'setNotes',
          options: notes
        })
      })
    },
    addDefaultNotes (context) {
      let notes = [
        {
          name: 'Note name ' + Math.round(Math.random() * 999),
          dateModified: Date.now(),
          previewText: 'Lorem ipsum dolor sit amet'
        },
        {
          name: 'Note name ' + Math.round(Math.random() * 999),
          dateModified: Date.now(),
          previewText: 'Look, just because I don\'t be givin\' no man a foot massage don\'t make it right',
          dropboxData: {
            hej: 'hopp',
            yolo: 'hashtag'
          }
        }
      ]

      db.notes.bulkPut(notes).then(() => {
        console.log('added notes done')
        context.commit({
          type: 'appendNotes',
          options: notes
        })
      })
    }
    // ...
  }
})

module.exports = store

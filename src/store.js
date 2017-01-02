import Vue from 'vue'
import Vuex from 'vuex'
import db from './db.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appTitle: 'web nv',
    options: {
      dropboxAuthToken: null,
      dropboxNotesFolder: null
    },
    dropbox: {
      appKey: 'wytvhdqaazystov',
      authToken: null,
      authUrl: null,
      user: null,
      isAuthed: false,
      notesFolderPath: null,
      folders: null
    }
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    },
    dropboxAuthToken (state, payload) {
      state.dropbox.authToken = payload.dropboxAuthToken
      console.log('mutation dropboxAuthToken with payload', payload)
    },
    dropboxNotesFolderPath (state, payload) {
      state.dropbox.notesFolderPath
    },
    setOptions (state, payload) {
      payload.options.map((val) => {
        console.log('map val', val)
        state.options[val.key] = val.value
      })
    }
  },
  actions: {
    loadOptionsFromDB (context) {
      db.options.toArray().then((vals) => {
        console.log('getOptions', vals)
        context.commit({
          type: 'setOptions',
          options: vals
        })
      })
    },
    // ...
    getDropboxAuthTokenFromDB (context) {
      db.options.where('key').equals('dropboxAuthToken').first().then((val) => {
        if (val && val.value) {
          context.commit({
            type: 'dropboxAuthToken',
            dropboxAuthToken: val.value
          })
        }
      }).catch((err) => {
        console.log('getDropboxAuthTokenFromDB catch', err)
        context.commit({
          type: 'dropboxAuthToken',
          dropboxAuthToken: null
        })
      })
    }, // get token
    getDropboxNotesFolderPathFromDB (context) {
      db.options.where('key').equals('dropboxNotesFolder').first().then((val) => {
        if (val && val.value) {
          context.commit({
            type: 'dropboxNotesFolderPath',
            dropboxNotesFolder: val.value
          })
        }
      }).catch((err) => {
        console.log('getDropboxNotesFolderPathFromDB catch', err)
        context.commit({
          type: 'dropboxNotesFolderPath',
          dropboxNotesFolder: null
        })
      })
    } // getDropboxNotesFolderPathFromDB
  }
})

module.exports = store

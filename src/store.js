/* jshint esversion: 6 */

import Vue from 'vue'
import Vuex from 'vuex'
import db from './db.js'
import _ from 'lodash'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    debug: '',
    // appBootDone: null,
    appTitle: 'Rocket 🚀 Notes ',
    options: {
      dropboxAuthToken: null,
      dropboxNotesFolderPath: null,
      // cursor: Pass the cursor into list_folder/continue to see what's changed in the folder since your previous query.
      dropboxCursor: null
    },
    notes: [],
    // notes filtered by search
    filteredNotes: [],
    /*
    {
      id: 'note1',
      name: 'example 1',
      previewText: 'Lorem ipsum dolor sit amet',
      ...
    }
    */
    dropbox: {
      appKey: 'wytvhdqaazystov',
      authUrl: null,
      user: null,
      isAuthed: false,
      folders: null,
    },
    currentNote: {
      // same params as every note
      id: null,
      name: null,
      text: null,
      dateModified: null,
      dropboxMeta: {
        // metadata
      }
    }
  },
  mutations: {
    log(state, what) {
      state.debug += "\n" + what;
    },
    setOption(state, payload) {
      state.options[payload.key] = payload.value

      db.options.put({
        key: payload.key,
        value: payload.value
      })

    },
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
    },
    // set note being edited
    setCurrentNote (state, payload) {
      // state.currentNote
      // console.log('setCurrentNote', payload)
      state.currentNote = payload.note
    },
    setSingleNote (state, payload) {
      // find note by id
      // console.log('setSingleNote payload.note', payload.note)
      // @TODO: make function of this, get note from state by note id
      let noteIndex = _.findIndex(state.notes, (val) => {
        return val.id === payload.note.id
      })

      let note = state.notes[noteIndex]

      if (note) {
        if (payload.note.name) {
          note.name = payload.note.name
        }

        if (payload.note.text) {
          note.text = payload.note.text
        }

        if (payload.note.dateModified) {
          note.dateModified = payload.note.dateModified
        }
      }

      // move note first, no need to sort, it's simply the latest updated
      state.notes.splice(noteIndex, 1)
      state.notes.splice(0, 0, note)
    }
  },
  actions: {
    setCurrentNote (context, payload) {
      return db.notes.get(payload.noteID).then(val => {
        // console.log('got result from db', val)
        if (!val) {
          console.log('could not get note from db, note id was', payload.noteID)
          return
        }

        var note = {
          id: val.id,
          name: val.name,
          previewText: val.previewText,
          text: val.text
        }

        return context.commit({
          type: 'setCurrentNote',
          note
        })
      })
    },
    loadOptionsFromDB (context) {
      return db.options.toArray().then((vals) => {
        console.log(`${vals.length} options loaded from db`)
        return context.commit({
          type: 'setOptions',
          options: vals
        })
      })
    },
    // Load all notes from db
    loadNotesFromDB (context) {
      return db.notes.orderBy('dateModified').reverse().toArray().then((notes) => {
        console.log(`${notes.length} notes loaded from db`)
        return context.commit({
          type: 'setNotes',
          options: notes
        })
      })
    }
  }
})

module.exports = store

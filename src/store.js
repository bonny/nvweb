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
      folders: null
    },
    currentNote: {
      id: null,
      name: null,
      previewText: null,
      text: null
      // modification date etc
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
    },
    // set note being edited
    setCurrentNote (state, payload) {
      // state.currentNote
      console.log('setCurrentNote', payload)
      state.currentNote = payload.note
    }
  },
  actions: {
    setCurrentNote (context, payload) {
      console.log(`action setCurrentNote for note with id ${payload.noteID}`, context, payload)
      db.notes.get(payload.noteID).then((val) => {
        console.log('got note from db', val)
        var note = {
          id: val.id,
          name: val.name,
          previewText: val.previewText,
          text: val.text
        }
        context.commit({
          type: 'setCurrentNote',
          note
        })
      })
    },
    loadOptionsFromDB (context) {
      db.options.toArray().then((vals) => {
        console.log(`${vals.length} options loaded from db`)
        context.commit({
          type: 'setOptions',
          options: vals
        })
      })
    },
    // Load all notes from db
    loadNotesFromDB (context) {
      db.notes.orderBy('dateModified').reverse().toArray().then((notes) => {
        console.log(`${notes.length} notes loaded from db`)
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
          previewText: 'Lorem ipsum dolor sit amet',
          text: 'Lorem ipsum dolor sit amet :) Några smileys: ✌️📝🗒 consectetur adipiscing elit.\nNon quaeritur autem quid naturae tuae consentaneum sit, sed quid disciplinae. Deinde disputat, quod cuiusque generis animantium statui deceat extremum.'
        },
        {
          name: 'En till 🗒 yo ' + Math.round(Math.random() * 999),
          dateModified: Date.now(),
          previewText: 'Look, just because I don\'t be givin\' no man a foot massage don\'t make it right',
          text: 'Meheh 👍🏽\naturae tuae consentaneum sit, sed quid disciplinae. Deinde disputat, quod cuiusque generis animantium statui deceat extremum.',
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

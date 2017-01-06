
import Dexie from 'dexie'

let db = new Dexie('MyDatabase')

db.version(1).stores({
  options: '&key',
  notes: '++id,dateModified'
})

// Init DB with some default statuses:
db.on('populate', function () {
  for (let i = 0; i < 5; i++) {
    let notesToAdd = [
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

    db.notes.bulkPut(notesToAdd)
  }
})

/*
var res2 = db.options.add({
  key: 'dropboxAuthToken',
  val: ''
})
console.log('dexie res2', res2)
*/

/*
db.options.where('key').equals('dropboxAuthToken').first().then((val) => {
  console.log('dexie val', val)
})
*/
// console.log('in db.js')
module.exports = db

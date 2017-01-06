
import Dexie from 'dexie'
let faker = require('faker')

let db = new Dexie('MyDatabase')

db.version(1).stores({
  options: '&key',
  notes: '++id,dateModified'
})

// Init DB with some default statuses:
// db.on('populate', function () {
  // for (let i = 0; i < 5; i++) {
let notesToAdd = [
  {
    name: faker.lorem.sentences(2),
    previewText: faker.lorem.sentences(3),
    text: faker.lorem.paragraphs(10),
    dateModified: Date.now(),
    dropboxData: {
      hej: 'hopp',
      yolo: 'hashtag'
    }
  }
]

db.notes.bulkPut(notesToAdd)
  // }
// })

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

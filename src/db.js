
import Dexie from 'dexie'

let db = new Dexie('MyDatabase')
db.version(1).stores({
  options: '&key',
  notes: '++id,dateModified'
})
// console.log('dexie res', res)

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

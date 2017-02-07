
let Dropbox = require('dropbox')
import store from './store.js'
import db from './db.js'
import _ from 'lodash'

class DropboxStorage {

  constructor (store) {
    this.store = store

    this.dbx = new Dropbox({
      clientId: store.state.dropbox.appKey,
      clientID: store.state.dropbox.appKey
    })

    this.loadedPromise = this.getAuthToken().then((token) => {
      // console.log('getAuthToken then with token', token)
      return this.reconfig()
    }).then(() => {
      // console.log('reconfig then')
      // this.loadedPromise = Promise.resolve('loaded yo')
      this.loadedPromise = Promise.resolve(this.loadedPromise)
    })
  }

  reconfig () {
    // console.log('reconfig dropbox', this.authToken)
    this.dbx.setAccessToken(this.authToken)
  }

  /**
   * @returns promise that is resolved when dropbox is ready to use
   */
  load () {
    return this.loadedPromise
  }

  // returns promise
  getUserAcount () {
    console.log('getUserAcount', this.dbx)

    let accountInfo = this.dbx.usersGetCurrentAccount()

    return accountInfo
  }

  getAuthUrl () {
    // https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=abc&redirect_uri=http://localhost:9966/#/settings
    // let redirectUrl = document.location.href;
    let redirectUrl = document.location.protocol + '//' + document.location.host + '/'

    // http://localhost:9966/#/access_token=abcdef&token_type=bearer&uid=123&account_id=abcdef
    let authUrl = this.dbx.getAuthenticationUrl(redirectUrl)

    return authUrl
  }

  isAuthed () {
    return false
  }

  /**
   * Get auth token from options table
   * @TODO: convert to return promise instead of using callback
   *
   * @param callback
   */
  getAuthToken () {
    return db.options.where('key').equals('dropboxAuthToken').first().then((val) => {

      console.log('getAuthToken returned', val)

      if (val) {
        this.authToken = val.value
        return this.authToken
      }

    }).catch((err) => {
      console.log('getAuthToken catch', err)
    })
  }

  getFolderList (path = '') {
    return this.dbx.filesListFolder({
      path: path
    })
  }

  /**
   * Get notes list from the notes folder selected in dropbox
   * This gets all notes so only run this first time we connect or if we somehow
   * lose track of cursor
   *
   * we also get cursor
   * how/when use this?
   */
  getNotesList (path) {
    return this.dbx.filesListFolder({
      path: path
    }).then(FilesMetadata => {
      // keep only .txt and .md
      FilesMetadata.entries = this.keepOnlyTextNotes(FilesMetadata.entries)

      // order by date
      FilesMetadata.entries = this.orderNotesByDate(FilesMetadata.entries)

      return FilesMetadata
    })
  }

  // keep only .txt and .md
  keepOnlyTextNotes (arr) {
    return _.filter(arr, (filevals) => {
      return filevals.name.match(/.(txt|md)$/)
    })
  }

  orderNotesByDate (arr) {
    return arr.sort((b, a) => {
      return (a.server_modified < b.server_modified) ? -1 : ((a.server_modified > b.server_modified) ? 1 : 0)
    })
  }

} // dropboxstorage

let dropboxStorage = new DropboxStorage(store)

module.exports = dropboxStorage

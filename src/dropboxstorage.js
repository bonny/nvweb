
import config from './config.js'
let Dropbox = require('dropbox')
import db from './db.js'

class DropboxStorage {

  constructor () {
    this.dbx = new Dropbox({
      clientId: this.getAppKey(),
      clientID: this.getAppKey()
    })

    this.getAuthToken(() => {
      console.log('getauthtoken in constructor callback, token is now ', this.authToken)
      this.reconfig()
    })
    // this.reconfig()
  }

  reconfig () {
    /* this.dbx = new Dropbox({
      accessToken: this.authToken,
      clientId: this.getAppKey(),
      clientID: this.getAppKey()
    }); */

    console.log('reconfig', this)

    this.dbx.setAccessToken(this.authToken)
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

  getAuthToken (callback) {
    db.options.where('key').equals('dropboxAuthToken').first().then((val) => {
      console.log('getAuthToken returned', val)

      if (val) {
        this.authToken = val.value
        window.bus.$emit('dropboxAuthTokenChanged', val.value)
      }

      if (callback) {
        callback()
      }
    }).catch((err) => {
      console.log('getAuthToken catch', err)
    })

    // var val = yield db.options.where('key').equals('dropboxAuthToken').first();
    // console.log('getAuthToken returned from yield', val)

    // return token
  }

  // store token in db
  storeAuthToken (token) {
    console.log('storeAuthToken', token)

    db.options.put({
      key: 'dropboxAuthToken',
      value: token
    }).then(() => {
      window.bus.$emit('dropboxAuthTokenStored', token)
    })
  }

  getAppKey () {
    return config.dropbox.appKey
  }

  getFolderList () {
    return this.dbx.filesListFolder({path: ''})
  }

  getNotesFolder (callback) {
    db.options.where('key').equals('dropboxNotesFolder').first().then((val) => {
      console.log('getNotesFolder returned', val)

      if (val) {
        this.authToken = val.value
        window.bus.$emit('dropboxNotesFolderChanged', val.value)
      }

      if (callback) {
        callback()
      }
    }).catch((err) => {
      console.log('dropboxNotesFolderChanged catch', err)
    })
  }

} // dropboxstorage

module.exports = DropboxStorage

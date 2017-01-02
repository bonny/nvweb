
<template>
  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <form v-on:submit.prevent="onSubmit">

        <h2>Settings</h2>

        <h5>Dropbox connection</h5>

        <div v-if="dropboxAuthToken">
          <div><b>Auth token</b></div>
          <div v-mdl class="mdl-textfield mdl-js-textfield">
            <input v-mdl class="mdl-textfield__input" type="text" :value="dropboxAuthToken" readonly="">
          </div>
        </div>

        <div v-if="dropboxUser">

          <p>
            <b>Connected account</b>
            <br>{{dropboxUser.name.display_name}}
            <br>{{dropboxUser.email}}
            <!-- <br><img :src="dropboxUser.profile_photo_url"> -->
          </p>

        </div>

        <p v-if="dropboxAuthToken">
          <button v-mdl class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" v-on:click.prevent="disconnectDropbox()">
            Disconnect Dropbox
          </button>
        </p>

        <div v-if="!dropboxAuthToken">
          <p>No Dropbox connection found</p>
          <button v-on:click.prevent="connectToDropbox()" v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
            Connect with Dropbox
          </button>
        </div>

        <p>debug, always show connect:</p>
        <button v-on:click.prevent="connectToDropbox()" v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
          Connect with Dropbox
        </button>

        <div v-if="dropboxAuthToken">

          <h5>Notes Folder</h5>

          <div>
            <div>Folder where notes are stored</div>
            <div v-mdl class="mdl-textfield mdl-js-textfield">
                <input v-mdl class="mdl-textfield__input" type="text" :value="dropboxNotesFolder" readonly="">
            </div>
          </div>

          <p v-if="!dropboxFolders">
            <button v-mdl class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" v-on:click.prevent="getDropboxFolders()">
              Select folder
            </button>
          </p>

          <ul v-mdl class="demo-list-icon mdl-list">
            <li v-mdl class="mdl-list__item" v-for="folder in dropboxFolders">

              <span v-mdl class="mdl-list__item-primary-content">
                <i v-mdl class="material-icons mdl-list__item-icon">folder</i>
                <!-- {{folder.name}} -->
                <span>{{folder.path_lower}}</span>

              </span>

              <span class="mdl-list__item-secondary-action">
                 <label class="demo-list-radio mdl-radio mdl-js-radio mdl-js-ripple-effect" for="list-option-1">
                   <input v-on:click.prevent="selectDropboxFolder(folder)" type="radio" id="list-option-1" class="mdl-radio__button" name="options" value="1" checked />
                 </label>
               </span>

            </li>
          </ul>

        </div>

        <!--
        <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <label v-mdl class="mdl-textfield__label" for="dropboxToken">Dropbox token</label>
          <input v-mdl class="mdl-textfield__input" type="text" id="dropboxToken" value="">
        </div>

        <p>
          <button v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
            Save
          </button>
        </p>
      -->

      </form>

    </div>

  </div>

</template>

<script>

  import db from '../db.js'
  let dropboxStorage = require('../dropboxstorage.js')
  let Dropbox = require('dropbox')

  export default {

    methods: {

      onSubmit (evt) {
        // console.log('form wanna submit', evt)
      },

      /**
       * If ok then user is redirected to
       * http://localhost:9966/#/access_token=RP1EjVGXf0EAAAAAAAKmRkPmernFM-Zuak3RYcBpYGgXZATz3B87PA_XaiszwqNs&token_type=bearer&uid=171101&account_id=dbid%3AAADJMGQ8ifVXcPhzE9ubPPXGyUpoOs5v1xg
       * If deny then redirect is
       * http://localhost:9966/#/error_description=The+user+chose+not+to+give+your+app+access+to+their+Dropbox+account.&error=access_denied
       */
      connectToDropbox (evt) {

        let authUrl = dropboxStorage.getAuthUrl();

        console.log('connectToDropbox', authUrl);
        document.location = authUrl;

      },

      /**
       * Disconnect dropbox by removing auth token and path from options
       * and from db
       */
      disconnectDropbox (evt) {

        // store options in db
        // update state using commit
        db.options.bulkPut([
          { key: 'dropboxAuthToken', value: null },
          { key: 'dropboxNotesFolderPath', value: null }
        ]).then(() => {

          this.$store.commit({
            type: 'setOptions',
            options: [
              { key: 'dropboxAuthToken', value: null },
              { key: 'dropboxNotesFolderPath', value: null }
            ]
          })

        })

      },

      selectDropboxFolder (folder) {
        console.log('selectDropboxFolder', folder)
        this.dropboxNotesFolder = folder.path_lower;
        this.dropboxFolders = null;

        db.options.put({
          key: 'dropboxNotesFolder',
          value: this.dropboxNotesFolder
        }).then(() => {
          window.bus.$emit('dropboxNotesFolderStored', this.dropboxNotesFolder)
        })

      },

      checkCurrentDropboxStatus () {

        console.log('checkCurrentDropboxStatus()', dropboxStorage.dbx)

        let accountInfo = dropboxStorage.getUserAcount();

        accountInfo.then((accountInfo) => {
          console.log('accountInfo in promise', accountInfo)
          this.dropboxAuthed = true;
          this.dropboxUser = accountInfo;
        })

        accountInfo.catch((err) => {
          console.log('accountInfo in catch promise', err)
          this.dropboxUser = `The Dropbox API returned error code ${err.status} with message "${err.error}"`;
          this.dropboxAuthed = false;
        })

      },

      // called when dropbox auth params is found in router
      // save options to db and commit state
      // params: auth_token + more that we don't use
      setDropboxAuth (params) {

        let dropboxAuthToken = params.access_token

        // store options in db
        // update state using commit
        db.options.put({
          key: 'dropboxAuthToken',
          value: dropboxAuthToken
        }).then(() => {

          // set state after save to db
          this.$store.commit({
            type: 'setOptions',
            options: [{
              key: 'dropboxAuthToken',
              value: dropboxAuthToken
            }]
          })

        })

      },

      getDropboxFolders () {

        dropboxStorage.getFolderList()
          .then( (response) => {
            // renderItems(response.entries)
            console.log('response', response)

            // only keep folders
            let folders = response.entries.filter((val) => {
              return val['.tag'] == 'folder'
            })

            this.dropboxFolders = folders

          })
          .catch( (err) => {
            console.error(err)
          })

        }

    }, // methods

    mounted () {

      // check for drobox params from oauth
      // if found then store auth token
      if (this.$route.params.access_token) {

        this.setDropboxAuth(this.$route.params);

      }

    },
    computed: {
      dropboxAuthToken() {
        return this.$store.state.options.dropboxAuthToken
      },
      dropboxNotesFolder() {
        return this.$store.state.options.dropboxNotesFolder
      },
      dropboxUser() {
        return this.$store.state.dropbox.user
      }
    },
    watch: {
      // whenever question changes, this function will run
      dropboxAuthToken: function (newDropboxAuthToken) {
        // console.log('watch detected change in dropboxAuthToken', newDropboxAuthToken);
      }
    }
  }

</script>


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

        <div v-if="dropboxAuthed">

          <p>
            <b>Connected account</b>
            <br>{{dropboxUser.name.display_name}}
            <br>{{dropboxUser.email}}
            <!-- <br><img :src="dropboxUser.profile_photo_url"> -->
          </p>
          <p>
            <button v-mdl class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" v-on:click.prevent="disconnectDropbox()">
              Disconnect Dropbox
            </button>
          </p>

        </div>

        <div v-if="dropboxAuthed == false">
          <p>No Dropbox connection found</p>
          <button v-on:click.prevent="connectToDropbox()" v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
            Connect with Dropbox
          </button>
        </div>

        <!-- <p>debug, always show connect:</p> -->
        <!--
        <button v-on:click.prevent="connectToDropbox()" v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
          Connect with Dropbox
        </button>
        -->

        <div v-if="dropboxAuthed">

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

              <span v-mdl class="mdl-list__item-primary-content" v-on:click.prevent="selectDropboxFolder(folder)">
                <i v-mdl class="material-icons mdl-list__item-icon">folder</i>
                <!-- {{folder.name}} -->
                <span>{{folder.path_lower}}</span>

                <!-- <span class="mdl-list__item-sub-title">
                  <button v-mdl class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" v-on:click.prevent="getDropboxFolders()">
                    Choose
                  </button>
                </span> -->

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

  import config from './config.js'
  import db from './db.js'
  import DropboxStorage from './dropboxstorage.js'
  let Dropbox = require('dropbox')

  let dropboxStorage = new DropboxStorage();

  export default {

    methods: {

      onSubmit (evt) {
        console.log('form wanna submit', evt)
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

      disconnectDropbox (evt) {
        dropboxStorage.storeAuthToken(null)
      },

      selectDropboxFolder (folder) {
        console.log('selectDropboxFolder', folder)
        this.dropboxNotesFolder = folder.path_lower;
        this.dropboxFolders = null;

        db.options.put({
          key: 'dropboxNotesFolder',
          value: this.dropboxNotesFolder
        }).then(() => {
          window.bus.$emit('dropboxNotesFolderStored', token)
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

      authDropbox (params) {

        this.dropboxAuthToken = params.access_token;

        dropboxStorage.storeAuthToken(this.dropboxAuthToken);

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
      console.log("settings mounted");
      console.log("bus in settings", window.bus)

      window.bus.$on('dropboxAuthTokenChanged', (newDropboxAuthToken) => {

        if (this.dropboxAuthToken != newDropboxAuthToken) {

          console.log('bus detected change in dropboxAuthToken', this.dropboxAuthToken, newDropboxAuthToken)
          this.dropboxAuthToken = newDropboxAuthToken
          dropboxStorage.reconfig()
          this.checkCurrentDropboxStatus()

        }

      })

      // when selected folder path is read
      window.bus.$on('dropboxNotesFolderChanged', (newDropboxNotesFolder) => {
        this.dropboxNotesFolder = newDropboxNotesFolder
      })

      // refresh view when auth token is stored
      window.bus.$on('dropboxAuthTokenStored', (newDropboxAuthToken) => {
        this.$router.go({
            path: this.$router.path,
            query: {
                t: + new Date()
            }
        })
      })

      // check for drobox params from oauth
      console.log('settings, $route', this.$route.params);
      if (this.$route.params.access_token) {

        this.authDropbox(this.$route.params);

      } else {
        // can't do stuff here, need to wait for dropbox auth token to be read from db first
      }

      /*window.bus.$on('app-mounted', function () {
        console.log('settings got message that app is mounted')
      })*/

    },
    data () {

      dropboxStorage.getAuthToken()
      dropboxStorage.getNotesFolder()

      return {
        appTitle: config.appTitle,
        dropboxAuthToken: null,
        dropboxAppKey: dropboxStorage.getAppKey(),
        dropboxAuthUrl: null,
        dropboxUser: "Loading...",
        dropboxAuthed: false,
        dropboxNotesFolder: null,
        dropboxFolders: null,
      }
    },
    watch: {
      // whenever question changes, this function will run
      dropboxAuthToken: function (newDropboxAuthToken) {
        console.log('watch detected change in dropboxAuthToken', newDropboxAuthToken);
      }
    }
  }

</script>

<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>Debug</h1>

      <h4>Options</h4>
      <pre>{{ JSON.stringify(options, null, '  ') }}</pre>

      <h4>Files in notes folder</h4>

      <ul class="mdl-list">

        <li v-for="file in this.NotesFolderFiles" class="mdl-list__item mdl-list__item--three-line">

          <span class="mdl-list__item-primary-content">
            <span>{{file.name}}</span>
            <span class="mdl-list__item-text-body">
              {{file.client_modified}}
              {{file.size}} bytes
            </span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
          </span>

        </li>

      </ul>

    </div>

  </div>

</template>

<script>

import DropboxStorage from '../dropboxstorage.js'
import db from '../db.js'

export default {

  mounted () {

    /*
    db.options.where('key').equals('dropboxNotesFolder').first().then((val) => {

      this.dropboxNotesFolder = val && val.value ? val.value : null

      if (!this.dropboxNotesFolder) {
        return
      }

      var dbx = this.DropboxStorage.getFolderList(this.dropboxNotesFolder)
        .then((response) => {
          //console.log(response)

          // keep .txt and .md
          var validExtensionsRegEx = new RegExp(/\.(txt|md)$/)
          var entries = response.entries
          entries = response.entries.filter((val) => {

            // must be file
            if (val['.tag'] != 'file') {
              return false;
            }

            return validExtensionsRegEx.test(val.name)

          });

          // order by server modification date
          entries = entries.sort((a, b) => {
            if (a.server_modified > b.server_modified) return -1
            if (a.server_modified < b.server_modified) return 1
            return 0
          });

          console.log(entries)
          this.NotesFolderFiles = entries
        })
        .catch(function(error) {
          console.error(error)
        });

    });
    */

  },

  computed: {
    options () {
      return this.$store.state.options
    }
  },

}

</script>

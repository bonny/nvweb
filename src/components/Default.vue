<style>
  .mdl-card--recentNotes {
    min-height: 0;
  }
</style>

<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <div v-if="this.$route.params.fromDeleted">
        <h3>Note deleted</h3>
      </div>

      <div class="mdl-card mdl-shadow--2dp mdl-card--recentNotes">
        <div class="mdl-card__title mdl-card--border">
          <h2 class="mdl-card__title-text">Recent notes</h2>
        </div>
        
        <div class="xmdl-card__supporting-text">

          <ul class="mdl-list mdl-list--notes">

            <li v-for="note in recentNotes" 
                class='mdl-list__item mdl-list__item--two-line'
                v-on:click="editNote(note.id)"
                >

              <span class="mdl-list__item-primary-content">
                <span class="NoteList-noteName">{{note.name}}</span>
                <span class="mdl-list__item-sub-title">{{note.text | trim}}</span>
              </span>

              <span class="mdl-list__item-secondary-content">
                <span class="mdl-list__item-secondary-info">{{ note.dateModified | moment('from') }}</span>
              </span>

            </li>

          </ul>

        </div>

        <div class="mdl-card__actions mdl-card--border">
          <button v-mdl class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">New note</button>
        </div>
      </div>

    </div>

  </div>

</template>

<script>

import querystring from 'querystring'
import Mixins from '../mixins.js'
let router = require('../router.js')

export default {
  mixins: [Mixins],
  created () {

     // fetch the data when the view is created and the data is
     // already being observed
     this.checkForDropboxOAuthCallback()

   },
   data () {
    return {}
   },
   computed: {
    recentNotes () {
      let numRecentNotesToShow = 3
      var recentNotes = this.$store.state.notes.slice(0, numRecentNotesToShow)
      return recentNotes
    }
   },
   methods: {
    editNote (noteID) {

      this.$router.push({
        name: 'edit',
        params: {
          noteID: noteID,
          focusText: true
        }
      })

    },
     checkForDropboxOAuthCallback () {
       // create an url with query string instead of hash, so we can use querystring.parse
       let href = document.location.href
       href = href.replace('/#/', '/?a=b&')
       let qs = querystring.parse(href)

       if (qs && qs.access_token && qs.account_id && qs.token_type) {
         console.log('dropbox oauth callback detected, redirecting to settings', qs)

         // redirect to settings screens, because that's where we initiated
         // the dropbox auth process
         this.$router.push({
           name: 'settings',
           params: {
             access_token: qs.access_token,
             accout_id: qs.account_id,
             token_type: qs.token_type
           }
         })

       }
     }
   }
}

</script>

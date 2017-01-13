<template>

  <div class="mdl-grid">

    <div class="mdl-cell mdl-cell--12-col">

      <h1>nvweb</h1>

    </div>

  </div>

</template>

<script>

import querystring from 'querystring'
let router = require('../router.js')

export default {
  created () {

     // fetch the data when the view is created and the data is
     // already being observed
     this.checkForDropboxOAuthCallback()

   },
   methods: {
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

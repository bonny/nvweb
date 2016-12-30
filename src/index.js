
import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueMdl from 'vue-mdl/dist/vue-mdl.js'
import Vuex from 'vuex'
// import config from './config.js'
import appView from './app.vue'
import Settings from './settings.vue'
import Edit from './edit.vue'
import db from './db.js'
import querystring from 'querystring'
// let Dropbox = require('dropbox')

// https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
window.bus = new Vue()

Vue.use(VueRouter)
Vue.use(Vuex)

// Make elements work with Material Design Lite
Vue.directive('mdl', {
  bind: function (el) {
    window.componentHandler.upgradeElement(el)
  }
})

let Default = {
  template: `<h1>yolo</h1>`,
  mounted () {
    console.log('default mounted')

    // detect callbacks from Dropbox
    /**
     * callbacks from dropbox
     * If ok then user is redirected to
     * http://localhost:9966/#/access_token=RP1EjVGXf0EAAAAAAAKmRkPmernFM-Zuak3RYcBpYGgXZATz3B87PA_XaiszwqNs&token_type=bearer&uid=171101&account_id=dbid%3AAADJMGQ8ifVXcPhzE9ubPPXGyUpoOs5v1xg
     * If deny then redirect is
     * http://localhost:9966/#/error_description=The+user+chose+not+to+give+your+app+access+to+their+Dropbox+account.&error=access_denied
     */



  }
}

// Define routes
const routes = [
  {
    path: '/settings',
    component: Settings,
    name: 'settings'
  },
  {
    path: '/edit',
    component: Edit,
    name: 'edit'
  },
  {
    path: '*',
    component: Default,
    name: 'default'
  }
]

// Create the router instance and pass the `routes` option
const router = new VueRouter({
  xmode: 'history',
  routes
})

// Create and mount the root instance.
window.app = new Vue({
  router,
  el: '#app',
  render: function (createElement) {
    return createElement(appView)
  },
  methods: {
    checkForDropboxOAuthCallback () {
      // create an url with query string instead of hash
      let href = document.location.href
      href = href.replace('/#/', '/?a=b&')
      let qs = querystring.parse(href)
      if (qs && qs.access_token && qs.account_id && qs.token_type) {
        console.log('seems like we have a dropbox oauth callback', qs)
        // redirect to settings screens, because that's where we initiated
        // the dropbox auth process
        router.push({
          name: 'settings',
          params: {
            access_token: qs.access_token,
            accout_id: qs.account_id,
            token_type: qs.token_type
          }
        })
      }
    }
  },
  mounted () {
    // check for dropbox oauth response when app is started
    this.checkForDropboxOAuthCallback()
  }
})

// Now the app has started!
// console.log('app', window.app)
// console.log('bus', window.bus)
// console.log('db', db)

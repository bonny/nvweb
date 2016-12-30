<style scoped>
</style>

<template>

  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
              mdl-layout--fixed-header">

              <!-- The drawer is always open in large screens. The header is always shown,
                even in small screens. -->
                <header class="mdl-layout__header">
                  <div class="mdl-layout__header-row">
                    <span class="mdl-layout-title">{{appTitle}}</span>
                    <div class="mdl-layout-spacer"></div>

                    <!-- search icon -->
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                                mdl-textfield--floating-label mdl-textfield--align-right">

                      <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">
                        <i class="material-icons">search</i>
                      </label>

                      <div class="mdl-textfield__expandable-holder">
                        <input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp">
                      </div>

                    </div><!-- // search -->

                    <router-link tag="button" class="mdl-button mdl-js-button mdl-button--icon" :to="{ name: 'settings' }">
                      <i class="material-icons">settings</i>
                    </router-link>

                    <div class="mdl-layout-icon"></div>

                  </div>
                </header>

                <div class="mdl-layout__drawer">

                  <span class="mdl-layout-title">{{appTitle}}</span>

                  <nav class="mdl-navigation">
                    <a class="mdl-navigation__link" href="">Link</a>
                    <a class="mdl-navigation__link" href="">Link</a>
                    <a class="mdl-navigation__link" href="">Link</a>
                    <a class="mdl-navigation__link" href="">Link</a>
                  </nav>

                </div>
                <main class="mdl-layout__content">
                  <div class="page-content">
                    <!-- Your content goes here -->

                    <!-- use router-link component for navigation. -->
                    <!-- specify the link by passing the `to` prop. -->
                    <!-- <router-link> will be rendered as an `<a>` tag by default -->
                    <!-- <router-link to="/bar">Notes</router-link>
                    <router-link :to="{ name: 'settings' }">Settings</router-link>
                    <router-link :to="{ name: 'edit' }">Edit note</router-link> -->

                    <!-- route outlet -->
                    <!-- component matched by the route will render here -->
                    <router-view></router-view>

                  </div>
                </main>

  </div>

</template>

<script>

import config from './config.js'

export default {
  mounted() {
    // console.log('did mount', this.msg)
    // console.log('config', config)
  },
  data () {
    return {
      appTitle: config.appTitle
    }
  }
}

</script>


<template>
  <div>
    <form v-on:submit.prevent="onSubmit">

      <h2>Settings</h2>

      <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label v-mdl class="mdl-textfield__label" for="dropboxToken">Dropbox token</label>
        <input v-mdl class="mdl-textfield__input" type="text" id="dropboxToken" value="">
      </div>

      <p>
        <button v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
          Save
        </button>
      </p>

    </form>

  </div>
</template>

<script>

  import config from './config.js'

  export default {
    methods: {
      onSubmit (evt) {
        console.log('form wanna submit', evt)
      }
    },
    mounted () {
      console.log("settings mounted");
      console.log("bus in settings", window.bus)

      window.bus.$on('app-mounted', function () {
        console.log('settings got message that app is mounted')
      })

    },
    data () {
      return {
        appTitle: config.appTitle
      }
    }
  }

</script>

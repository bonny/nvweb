<template>

  <div class="mdl-layout__drawer">

    <span class="mdl-layout-title">{{title}}</span>

    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
    </nav>

  </div>

</template>

<script>

export default {
  props: ["title"]
}

</script>

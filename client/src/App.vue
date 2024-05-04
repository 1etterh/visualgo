<template>
<article data-theme="dark">
  <nav>
  <ul>
    <li><h3>Visualgo</h3></li>
  </ul>
  <ul>
    <li><a href="#">Accounts</a></li>
  </ul>
</nav>

    <Editor />
  <TestCases />
</article>

  
</template>

<script>
import Editor from './components/Editor.vue';
import TestCases from './components/TestCases.vue';
export default {
  name: 'App',
  components: {
    Editor,
    TestCases
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

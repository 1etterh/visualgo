<template>
  <article data-theme="dark">
    <nav>
    <ul>
    <li><h3>VisuAlgo</h3></li>
  </ul>
  <ul>
    <li><a href="#">Login</a></li>
  </ul>
  </nav>

  <Editor/>
  
  
  </article>
  



  
</template>

<script>
import Editor from './components/Editor.vue';
export default {
  name: 'App',
  components: {
    Editor,
    
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

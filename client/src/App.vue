<template>
  <article data-theme="dark">
    <nav>
    <ul>
    <li><h3>VisuAlgo</h3></li>
  </ul>
  <ul>
    <router-link to="/login">Login</router-link>
  </ul>
  </nav>
  <router-view></router-view>
  
  
  </article>
  



  
</template>

<script>
// import Editor from './components/Editor.vue';
export default {
  name: 'App',
  components: {
    // Editor,
    
  }
}

</script>

<style>
::-webkit-scrollbar{
  display:none
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
</style>

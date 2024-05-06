<template>
  <article data-theme="dark">
    <nav>
    <ul>
    <li><h3>VisuAlgo</h3></li>
  </ul>
  <ul>
    <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    <router-link v-if="isLoggedIn" to="/Workspace">Workspace</router-link>
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
    
  },
  data(){
    return {
      isLoggedIn:false
    }
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

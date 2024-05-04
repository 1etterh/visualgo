<template>
  <article data-theme="dark">
    <nav>
    <ul>
    <li><h3>Visualgo</h3></li>
  </ul>
  <ul>
    <li><a href="#">Login</a></li>
  </ul>
  </nav>
<Login/>
  </article>
  




  
</template>

<script>
import Login from './components/Login.vue';
export default {
  name: 'App',
  components: {
    Login
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

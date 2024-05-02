<template>
  <div>Editor</div>
</template>

<script>
// import loadPyodide from '../pyodide/pyodide.js';
// import { loadScript } from 'vue-plugin-load-script';
export default {
name: 'Editor',
mounted(){
  this.$loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')
  .then(() => {
    console.log('Script loaded');
    this.initPyodide();
  })
},
methods:{
  async initPyodide(){
    let pyodide = await window.loadPyodide();
    console.log(pyodide.runPython("1+2"));
  }
}



}
</script>

<style>

</style>
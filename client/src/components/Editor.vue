<template>
  <CodeMirror
  v-model:value="code"
  :options="{
    mode: 'python',
    theme: 'material',
    lineNumbers: true
  }"
  :height="200"
  
  />
  <div>Editor</div>
</template>

<script>
export default {
name: 'Editor',
components: {

},

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
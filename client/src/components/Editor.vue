<template>
  <div>
    <h1>Visualgo</h1>
  </div>

  <div>
    <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Enter your code here"
    :height="200"
    @change="change"
    ref="cm"
    id="editor"
  />
  </div>

</template>

<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/python/python.js";
import "codemirror/theme/material-ocean.css";
import "codemirror/addon/display/placeholder.js";

import {ref} from 'vue';
export default {
name: 'Editor',
components: {
Codemirror
},
setup(){
  const code = ref(`def test():
    print("1+2")`);
  return{
    code,
    cmOptions:
    {
      styleActiveLine: true,
      lineNumbers: true,
      mode:"text/x-python",
      theme:"material-ocean",
      }
          }
          
        }
      ,
  
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

<style scoped>
#editor{
  text-align: left;
}
</style>
<template>
  <div>
    <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Enter your code here..."
    :height="200"
    @change="change"
    ref="cm"
    id="editor"
  />
  <button @click="runCode()">run</button>
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
data(){
  return{
    codeL:this.code,
    pyodide:null
  }
}
,
setup(){
  const code = ref(``);
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
    this.pyodide = await window.loadPyodide();
    console.log(this.pyodide.runPython("1+2"));
  },
  runCode(){
    console.log(this.pyodide.runPython("1+2"));
  }
}
}





</script>

<style scoped>

</style>
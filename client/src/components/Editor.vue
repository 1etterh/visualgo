<template>
  <div>
    <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Enter your code here..."
    :height="200"
    @change="change"
    id="editor"
  />
  </div>
  <Button @click="runCode()" v-bind:disabled="pyodide==null">Run</Button>
  <p v-if="pyodide==null">Please wait...</p>

  <input type="file" @change="handleFiles" multiple>
  <ul>  
  <li v-for="file in files" :key="file.name">{{ file.name }}</li>
  </ul>


  <Button v-bind:disabled="pyodide==null">Save Results</Button>

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
Codemirror,

},
data(){
  return{
    pyodide:null,
    files:[]
  }
}
,
setup(){
  const code = ref(`3**3`);
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
    console.log(this.pyodide.runPython(this.code));
  },
  runCode(){
    let res = this.pyodide.runPython(this.code);
    console.log(res);
    // this.pyodide.setStdin();
    if(this.files.length>0){
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          this.pyodide.setStdin(new StdinHandler(contents.split()));
          this.pyodide.runPython(
            `
            from sys import stdin as s
            print(s.readlines())
            `
          );
        };
        reader.readAsText(file);
      }
      

    }
      },
  handleFiles(e){
    this.files = e.target.files;
    console.log(this.files);
},

}
}

class StdinHandler{
  constructor(results,options){
    this.results = results;
    this.idx = 0;
    Object.assign(this,options);
  }
  stdin(){
    return this.results[this.idx++];
  }
}

</script>

<style scoped>

</style>
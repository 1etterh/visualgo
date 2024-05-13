<template>
  <div>
    <Codemirror
      v-model:value="code"
      :options="cmOptions"
      border
      placeholder="Enter your code here..."
      :height="200"
      ref="cm"
      id="editor"
    />
    <Button @click="runCode" v-bind:disabled="pyodide == null">Run</Button>
    <p v-if="pyodide == null">Loading Pyodide. Please wait...</p>

    <input type="file" @change="handleFiles" multiple>
    <ul>
      <li v-for="file in files" :key="file.name">{{ file.name }}</li>
    </ul>

    <Button @click="saveResults" v-bind:disabled="pyodide == null">Save Results</Button>
  </div>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/python/python.js";
import "codemirror/theme/material-ocean.css";
import "codemirror/addon/display/placeholder.js";
import axios from 'axios';
import { ref, defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Editor',
  components: {
    Codemirror,
  },
  setup(props, { emit }) {
    const code = ref(`
    x=0
    for i in range:
      x+=i
    `);
    const pyodide = ref(null);
    const files = ref([]);
    
    onMounted(async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      document.head.appendChild(script);
      script.onload = async () => {
        pyodide.value = await window.loadPyodide();
        console.log('Pyodide loaded');
      };
    });

    const runCode = async () => {
      if (pyodide.value) {
        const res = pyodide.value.runPython(code.value);
        console.log(res);
        emit('code-executed', JSON.stringify(res)); // Use `emit` to send the result to the parent
      }
    };

    const handleFiles = (e) => {
      files.value = e.target.files;
    };

    const saveResults = () => {
      let formData = new FormData();
      formData.append('code', code.value);
      for (let file of files.value) {
        formData.append('files', file);
      }
      axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.error(err);
      });
    };

    return {
      code,
      pyodide,
      runCode,
      handleFiles,
      saveResults,
      files,
      cmOptions:{
      styleActiveLine: true,
      lineNumbers: true,
      mode:"text/x-python",
      theme:"material-ocean",
    }
    };
  },
});
</script>

<style scoped>
</style>

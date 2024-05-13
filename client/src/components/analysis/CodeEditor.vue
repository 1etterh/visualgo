<template>
    <div>
      <Codemirror
        v-model:value="state.code"
        :options="cmOptions"
        border
        placeholder="Enter your code here..."
        :height="400"
        ref="cm"
        id="code-editor"
      />
      <button @click="runCode" :disabled="!state.pyodideLoaded">Run</button>
      <p v-if="!state.pyodideLoaded">Loading Pyodide. Please wait...</p>
      <div v-if="state.errorMsg" class="error">{{ state.errorMsg }}</div>
      <pre v-if="state.results">{{ JSON.stringify(state.results, null, 2) }}</pre>
    </div>
  </template>
  
  <script lang="ts">
  import Codemirror from 'codemirror-editor-vue3';
  import 'codemirror/mode/python/python.js';
  import 'codemirror/theme/material-ocean.css';
  import 'codemirror/addon/display/placeholder.js';
  import { defineComponent, onMounted, reactive } from 'vue';
  import type { State } from './Types';
  const state: State = reactive({
        pyodide: null,
        code: `# Write your Python code here\n3**3`,
        results: JSON.parse('{}'),
        variables: {},
        classes: {},
        functions: {},
        timeComplexity: {},
        testCases: undefined,
        errorMsg: null,
        pyodideLoaded: false,
      });
  
  export default defineComponent({
    name: 'CodeEditor',
    components: {
      Codemirror,
    },
    setup() {
      
      onMounted(async () => {
        try {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          document.head.appendChild(script);
          script.onload=async()=>{
          state.pyodide = await window.loadPyodide();
          state.pyodideLoaded = true;
          }
        } catch (error:any) {
          state.errorMsg = 'Failed to load Pyodide: ' + error.message;
        }
      });
  
      const runCode = async () => {
        if (state.pyodide && state.pyodideLoaded) {
          try {
            const output = await state.pyodide.runPythonAsync(state.code);
            state.results = JSON.parse(`${output}`); // Storing results in a generic format
            console.log(state.results);
          } catch (error:any) {
            state.errorMsg = 'Error running Python code: ' + error.message;
          }
        }
      };
  
      const cmOptions = {
        styleActiveLine: true,
        lineNumbers: true,
        mode: "text/x-python",
        theme: "material-ocean",
      };
  
      return { state, runCode, cmOptions };
    },
  });
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  
<template>
    <div>
      <button @click="executeCode" v-bind:disabled="pyodide == null">Run Code in Analyzer</button>
      <p v-if="pyodide == null">Loading Pyodide. Please wait...</p>
      <div v-if="result !== null">Result: {{ result }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Analyzer',
    props: {
      code: String
    },
    data() {
      return {
        pyodide: null,
        result: null
      };
    },
    methods: {
      async executeCode() {
        if (this.pyodide) {
          this.result = this.pyodide.runPython(this.code);
          console.log(this.result);
        }
      },
      async loadPyodide() {
        if (!this.pyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          document.head.appendChild(script);
          script.onload = async () => {
            this.pyodide = await window.loadPyodide();
            console.log('Pyodide loaded');
          };
        }
      }
    },
    mounted() {
      this.loadPyodide();
    }
  }
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  
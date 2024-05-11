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
    <Analyzer :code="code" />
    <input type="file" @change="handleFiles" multiple>
    <ul>  
      <li v-for="file in files" :key="file.name">{{ file.name }}</li>
    </ul>
    <button @click="saveResults">Save Results</button>
  </div>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/python/python.js";
import "codemirror/theme/material-ocean.css";
import "codemirror/addon/display/placeholder.js";
import axios from 'axios';
import Analyzer from './Analyzer.vue';

import { ref } from 'vue';
export default {
  name: 'Editor',
  components: {
    Codemirror,
    Analyzer
  },
  setup() {
    const code = ref(`3**3`);
    return {
      code,
      cmOptions: {
        styleActiveLine: true,
        lineNumbers: true,
        mode: "text/x-python",
        theme: "material-ocean",
      }
    };
  },
  data() {
    return {
      files: []
    };
  },
  methods: {
    handleFiles(e) {
      this.files = e.target.files;
      console.log(this.files);
    },
    saveResults() {
      let formData = new FormData();
      formData.append('code', this.code);
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i]);
      }
      axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<style scoped>
/* Your styles here */
</style>

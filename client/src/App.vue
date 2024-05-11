<template>
  <div>
    <Editor @code-executed="handleCodeResult" />
    <Analysis :result="executionResult" />
  </div>
</template>

<script>
import Editor from './components/analysis/Editor.vue';
import Analysis from './components/analysis/Analysis.vue';
import { ref } from 'vue';

export default {
  components: {
    Editor,
    Analysis
  },
  setup() {
    const executionResult = ref('');

    const handleCodeResult = (result) => {
      executionResult.value = result;
    };

    return {
      executionResult,
      handleCodeResult
    };
  }
}
</script>

<style>
/* Add any necessary styles */
</style>

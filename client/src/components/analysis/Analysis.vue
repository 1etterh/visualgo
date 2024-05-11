<template>
    <div v-if="data">
      <div v-for="(value, key) in data" :key="key">
        <h3>{{ key }}</h3>
        <p>{{ value }}</p>
      </div>
    </div>
    <p v-else>No data to display</p>
  </template>
  
  <script>
  import { defineComponent, ref,watch } from 'vue';
  
  export default defineComponent({
    name: 'Analysis',
    props: {
      result: String
    },
    setup(props) {
      const data = ref(null);
  
      watch(() => props.result, (newResult) => {
        if (newResult) {
          data.value = JSON.parse(newResult);
        }
      }, { immediate: true });
  
      return {
        data
      };
    }
  });
  </script>
  
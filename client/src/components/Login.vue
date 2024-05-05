<template>
<div>
    <input type="text" placeholder='ID' v-model="id">
    <input type="text" placeholder='PW' v-model="pw">
</div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
         id: 'ID',
         pw: 'PW'
            // Your component's data goes here
        };
    },
    methods: {
        // Your component's methods go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>
/* Your component's styles go here */
</style>
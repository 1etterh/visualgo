<template>
    <div>
        <h6>Upload Test Cases</h6>
        <input type="file" @change="handleFiles" multiple>
        <!-- Your component's template goes here -->
        <ul>
        <li v-for="file in files" :key="file.name">{{ file.name }}</li>
        </ul>
</div>
</template>

    
<script>
export default {
    name: 'TestCases',
    data() {
        return {
            files:[]
        }
    },
    // Your component's logic goes here,
    methods: {
        handleFiles(e) {
            this.files = e.target.files;
            for (let i = 0; i < this.files.length; i++) {
                console.log(this.files[i]);
            }
        }
    }
}
</script>

<style scoped>
/* Your component's styles go here */
</style>
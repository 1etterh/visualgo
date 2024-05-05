<!-- LoginPage.vue -->
<template>
    <div class="login-page">

      <div class="login-form">
     
        <input type="text" placeholder="Username" v-model="username">
        <input type="password" placeholder="Password" v-model="password">
        <button @click="login" class="contrast">Login</button>
      </div>
      <div class="create-account">
        <router-link to="/register">
            or create account
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name:'Login',
  data(){
    return{
      username:'',
      password:''
    }
  } 
  ,
    methods:{
      login(){
        axios.post('/login',{username:this.username, password:this.password})
        .then((res)=>{
          if(res.data){
            console.log('logged in')
            this.$router.push('/')
          }
          else{
            this.$router.go(-1)
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>

  
  </style>
  
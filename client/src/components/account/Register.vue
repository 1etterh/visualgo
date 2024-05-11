
<template>
    <div class="register-page">
      <div class="register-head">
        <h1>Register</h1>
      </div>
    
        <div class="register-body" :class="{ 'unique': isUsernameUnique }">
          <div class="register-input">
            <input type="text" name="username" v-model="registerUsername" placeholder="ID" required>
            <button @click="checkUsername" class="contrast">Check</button>
          </div>
          <div class="register-input" >
            <div class="register-password">
              <input type="password" v-model="registerPassword" placeholder="Password" required>
              <input type="password" v-model="registerPasswordConfirm" placeholder="Confirm Password" required>
              <span v-if="!isPasswordConfirmed">Input Valid Password</span>
            </div>
            <button @click="register" class="contrast" :disabled="!isValidRegister">Register</button>
          </div>
        </div>
        <p>
            
        </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: "Register",
    data() {
      return {
        registerUsername: "",
        registerPassword: "",
        registerPasswordConfirm: "",
        isUsernameUnique: false,
        isPasswordVisible: false
      };
    },
    computed: {
      isPasswordConfirmed(){
        return(this.registerPassword == this.registerPasswordConfirm)
      },
      isValidRegister() {
        return (
          this.isUsernameUnique &&
          this.registerPassword === this.registerPasswordConfirm &&
          this.registerUsername !== "" &&
          this.registerPassword !== ""
        );
      }
    },
    methods: {
        checkUsername() {
            axios
            .post("/checkUsername", { username: this.registerUsername })
            .then(res => {
                if (res.data) {
                this.isUsernameUnique = true;
                } else {
                this.isUsernameUnique = false;
                }
            });
        },
        register() {
            axios
            .post("/register", {
                username: this.registerUsername,
                password: this.registerPassword
            })
            .then(res => {
                if (res.data) {
                console.log("registered");
                this.$router.push("/login");
                } else {
                console.log("failed to register");
                }
            });
        }
    }}
  </script>
  
  <style scoped>
 
  </style>
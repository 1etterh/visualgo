
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
      async checkUsername() {
        try {
          const response = await fetch('/checkUsername', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.registerUsername
            })
          });
  
          const data = await response.json();
          if (data.exists) {
            alert('이미 사용 중인 사용자 이름입니다.');
          } else {
            alert('사용 가능한 사용자 이름입니다.');
              this.isUsernameUnique = true;
              this.isPasswordVisible = true;        }
        } catch (error) {
          console.error(error);
          alert('사용자 이름을 확인하는 중 오류가 발생했습니다.');
        }
  
  
      },
      async register() {
        console.log("registerbuttonclicked")
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.registerUsername,
              password: this.registerPassword
            })
          });
  
          const data = await response.json();
          if(data.success==true){
            this.$router.push('/login')
          }
          else{
            this.$router.go(-1)
          }
          console.log('Register.vue, line:99',data.message)
          alert(data.success);
        } catch (error) {
          console.error(error);
          alert('회원 가입 중 오류가 발생했습니다.');
        }
  
  
        // 회원 가입 기능 구현
      }
    }
  };
  </script>
  
  <style scoped>
 
  </style>
<template>
  <div id="mainAuth">
    <!-- Auth Tabs -->
    <div id="authTabs">
      <button id="login" class="tabBtn" v-bind:class="{ selected: currentTab == 'login'}" @click="switchTab">Login</button>
      <button id="register" class="tabBtn" v-bind:class="{ selected: currentTab == 'register'}" @click="switchTab">Register</button>
    </div>


    <!-- Login Form -->
    <form class="authForm" v-if="currentTab == 'login'">
      <h5 class="formError"></h5>
      <input type="text" id="usernameInput" class="formInput" placeholder="Email / Username" required v-model="loginUsername" autocomplete="off" spellcheck="off">
      <input type="password" id="passwordInput" class="formInput" placeholder="Password" required v-model="loginPassword" autocomplete="off" maxlength="24">
      <h5 class="forgotPassword" @click="switchTab">Forgot Password?</h5>
      <button id="loginBtn" class="formBtn" @click="login">Login</button>
    </form>

    <!-- Register Form -->
    <form class="authForm" v-else-if="currentTab == 'register'">
      <h5 class="formError"></h5>
      <input type="text" class="formInput" placeholder="Username" required v-model="registerUsername" autocomplete="off" maxlength="16" spellcheck="off">
      <input type="text" class="formInput" placeholder="Email" required v-model="registerEmail" autocomplete="off" spellcheck="off">
      <input type="password" class="formInput" placeholder="Password" required v-model="registerPassword" autocomplete="off" maxlength="24">
      <button class="formBtn" @click="register">Register</button>
    </form>

    <!-- Reset Password -->
    <form class="authForm" v-else>
      <h5 class="formError"></h5>
      <input type="text" class="formInput" placeholder="Email" required v-model="resetEmail" autocomplete="off" spellcheck="off">
      <button class="formBtn" @click="resetPassword">Reset Password</button>
    </form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';

export default {
  name: 'Auth',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const game = self.props.game; game; EventHandler;
    const loginUsername = ref('');
    const loginPassword = ref('');
    const registerUsername = ref('');
    const registerEmail = ref('');
    const registerPassword = ref('');
    const resetEmail = ref('');
    const currentTab = ref('login');

    const switchTab = (e) => currentTab.value = e.target.id;

    const clearErrors = () => [...document.getElementsByClassName('formError')].forEach(err => err.innerText = '');

    const clearForms = () => {
      loginUsername.value = '';
      loginPassword.value = '';
      registerUsername.value = '';
      registerEmail.value = '';
      registerPassword.value = '';
    }

    const login = (e) => {
      e.preventDefault();
      clearForms();
      clearErrors();
      EventHandler.emit('loggedIn');
    }

    const register = (e) => {
      e.preventDefault();
      clearForms();
      clearErrors();
    }


    return { 
      login,
      register,
      switchTab, 
      loginUsername, 
      loginPassword,
      registerUsername,
      registerEmail,
      registerPassword,
      resetEmail, 
      currentTab 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainAuth {
  width: 350px;
  height: 250px;

  position: absolute;
  top: 40%;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  transform: translateY(-50%);
}



#authTabs {
  width: 95%;
  height: 40px;

  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.tabBtn {
  flex: 1;
  height: 40px;

  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  background-color: rgb(25, 28, 34);

  border: none;
  outline: none;
  border-radius: 5px;
  margin-right: 5px;
  margin-left: 5px;
}
.tabBtn.selected {
  color: rgb(180, 178, 178);
  background-color: rgb(22, 25, 29);
}
.tabBtn:hover:not(.selected) {
  cursor: pointer;
  opacity: 0.8;
}



.authForm {
  width: 100%;
  height: auto;

  position: absolute;
  top: 100px;
}



.formError {
  position: absolute;
  left: 50%;
  top: -35px;
  transform: translateX(-50%);

  color: #4480d4;
  font-size: 16px;
  font-family: 'Quicksand';

  margin: 0;
}



.formInput {
  width: 95%;
  height: 40px;

  position: relative;
  left: 50%;
  transform: translateX(-50%);

  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  text-align: center; 
  background-color: rgb(25, 28, 34);

  border: none;
  outline: none;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.formInput:hover {
  opacity: 0.8;
}
.formInput::placeholder {
  color: rgb(50, 56, 68);
  font-size: 16px;
  font-family: 'Quicksand';
  text-align: center;
}




.forgotPassword {
  color: #4480d4;
  font-size: 14px;
  font-family: 'Quicksand';
  text-align: center;

  margin: 0;
  margin-bottom: 10px;
}
.forgotPassword:hover {
  cursor: pointer;
  opacity: 0.8;
}


.formBtn {
  width: auto;
  height: 40px;

  position: relative;
  left: 50%;
  transform: translateX(-50%);

  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  text-align: center; 
  background-color: rgb(25, 28, 34);
  line-height: 10px;

  border: none;
  outline: none;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
}
.formBtn:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>

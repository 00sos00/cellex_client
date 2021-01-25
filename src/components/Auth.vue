<template>
  <div id="mainAuth">
    <form id="loginForm">
      <input type="text" id="usernameInput" class="formInput" placeholder="Username" required v-model="loginUsername" autocomplete="off" maxlength="10">
      <input type="password" id="passwordInput" class="formInput" placeholder="Password" required v-model="loginPassword" autocomplete="off" maxlength="12">
      <button id="loginBtn" class="formBtn" @click="login">Login</button>
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

    const login = (e) => {
      e.preventDefault();
      EventHandler.emit('loggedIn');
    }
    return { login, loginUsername, loginPassword }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainAuth {
  width: 350px;
  height: 350px;

  position: absolute;
  top: 40%;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  transform: translateY(-50%);

  background-color: blue;
}



#loginForm {
  width: 100%;
  height: auto;

  position: absolute;
  bottom: 10px;
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
  margin-bottom: 2px;
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
.formBtn {
  width: 50%;
  height: 30px;

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
}
</style>

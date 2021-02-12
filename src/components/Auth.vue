<template>
  <button id="loginBtn" @click="login">
    <p style="pointer-events:none;">Login With Discord</p>
    <i class="fab fa-discord" id="discord"></i>
  </button>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'Auth',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const game = self.props.game;

    window.onmessage = (e) => {
        if (e.data.accessToken) {
          localStorage.setItem('accessToken', e.data.accessToken);
          game.profileHandler.checkLoggedIn();
          e.source.close();
        }
        if (window.loginBtn) {
          window.loginBtn.disabled = false;
          window.loginBtn = null;
        }
    };

    const login = game.profileHandler.login.bind(game.profileHandler);


    return { login }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#loginBtn {
  width: auto;
  height: 50px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  color: white;
  font-size: 18px;
  font-family: 'Quicksand';
  text-align: center;
  background-color: #6985d9;

  line-height: 15px;
  white-space: pre;
  padding: 2px 20px 2px 50px;
  border: none;
  outline: none;
  border-radius: 5px;
}
#loginBtn:hover:not(:disabled) {
  cursor: pointer;
  opacity: 0.8;
}
#discord {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);

  color: white;
  font-size: 40px;
  pointer-events: none;
}
</style>

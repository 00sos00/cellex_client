<template>
  <div id="deathMenu">
      <div id="respawnBtn" @click="Respawn">Respawn</div>
      <div id="continueBtn" @click="Continue">Continue</div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'DeathMenu',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const game = self.props.game;

    const Respawn = game.joinGame.bind(game);
    const Continue = () => {
        game.hideDeathMenu();
        game.showMain();
    }
    const closeDeathMenu = game.hideDeathMenu.bind(game);

    return { Respawn, Continue, closeDeathMenu }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#deathMenu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  z-index: -1;
  padding: 5px;
  border-radius: 5px;
}
#respawnBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #4480d4;

    width: 180px;
    height: 40px;

    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin-bottom: 15px;
}
#respawnBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}
#continueBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #2c548d;

    width: 180px;
    height: 40px;

    text-align: center;
    line-height: 40px;
    border-radius: 5px;
}
#continueBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}
</style>

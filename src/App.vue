<template>
  <MainPlay :game="game"/>
  <MainSettings :game="game"/>
  <SkinChanger :game="game"/>
  <MainScene :game="game"/>
  <div id="overlay"></div>
  <div id="background"></div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { getPopupFunctions } from './assets/Functions/getPopupFunctions';
import MainPlay from './components/MainPlay.vue';
import SkinChanger from './components/SkinChanger.vue';
import MainSettings from './components/MainSettings.vue';
import MainScene from './components/MainScene.vue';
import Game from './assets/GameFiles/Game';

export default {
  name: 'App',
  components: {
    MainPlay,
    MainSettings,
    SkinChanger,
    MainScene
  },
  setup() {
    const ws = window.WebSocket;
    delete window['WebSocket'];
    const game = new Game(ws); // Init Game
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const { popupShow, popupHide } = getPopupFunctions();

    EventHandler.on('openSkinChanger', () => {
      popupShow('skinChanger', 250);
    });
    EventHandler.on('closeSkinChanger', () => {
      popupHide('skinChanger', 250);
    });
    EventHandler.on('openSettings', () => {
      game.settings.defaultTabButton.value.click();
      game.settings.updateSettings();
      popupShow('mainSettings', 250);
    });
    EventHandler.on('closeSettings', () => {
      popupHide('mainSettings', 250);
    });

    return { game }
  }
}
</script>

<style>
/* <=== Load Fonts ===> */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');


/* Popup animations */
@keyframes popupShow {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes popupHide {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

body {
  -webkit-user-select: none;        
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: black;
}
#background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #232732;
  z-index: -2;
}
#overlay {
  position: absolute;
  transform: translate(-50%, -50%);

  width: 1000vh;
  height: 1000vh;

  background-color: #111218ee;

  display: none;
  z-index: -1;
  backdrop-filter: blur(50px);
}
.footer_buttons {
  width: 100%;
  height: 40px;

  position: absolute;
  left: 50%;
  bottom: 2%;
  transform: translate(-50%);

  display: grid;
  align-content: center;
  justify-content: center;
  grid-column-gap: 5px;
}
</style>

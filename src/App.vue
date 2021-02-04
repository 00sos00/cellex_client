<template>
  <Auth v-if="!loggedIn && !loading" :game="game"/>
  <MainPlay v-if="loggedIn  && !loading" :game="game"/>
  <MainSettings :game="game"/>
  <Servers :game="game"/>
  <FeaturedVideo />
  <SkinChanger :game="game"/>
  <MainScene :game="game"/>
  <div id="notif"></div>
  <div id="overlay"></div>
  <div id="loadingScreen" v-if="loading">
    <div class="loadingScreenText">Loading...</div>
  </div>
  <div id="background" class="main"></div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import { getPopupFunctions } from './assets/Functions/getPopupFunctions';
import MainPlay from './components/MainPlay';
import SkinChanger from './components/SkinChanger';
import MainSettings from './components/MainSettings';
import MainScene from './components/MainScene';
import Servers from './components/Servers';
import Auth from './components/Auth';
import FeaturedVideo from './components/FeaturedVideo';
import Game from './assets/GameFiles/Game';

export default {
  name: 'App',
  components: {
    MainPlay,
    MainSettings,
    SkinChanger,
    MainScene,
    Servers,
    Auth,
    FeaturedVideo
  },
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const { popupShow, popupHide } = getPopupFunctions();
    const loggedIn = ref(true);
    const loading = ref(false);
    const game = new Game(EventHandler);

    EventHandler.on('loggedIn', () => {
      loggedIn.value = true;
      loading.value = false;
    });
    EventHandler.on('loggedOut', () => loggedIn.value = false);


    EventHandler.on('openSkinChanger', () => {
      popupShow('skinChanger', 250);
    });
    EventHandler.on('closeSkinChanger', () => {
      popupHide('skinChanger', 250);
    });


    EventHandler.on('openSettings', () => {
      popupShow('mainSettings', 250);
      game.settings.updateSettings();
      game.settings.defaultTabBtn.value.click();
    });
    EventHandler.on('closeSettings', () => {
      popupHide('mainSettings', 250);
    });


    EventHandler.on('openServers', () => {
      popupShow('mainServers', 250);
      game.servers.onOpen();
    });
    EventHandler.on('closeServers', () => {
      popupHide('mainServers', 250); 
    });


    EventHandler.on('openFeaturedVideo', () => {
      popupShow('featuredVideo', 250);
    });
    EventHandler.on('closeFeaturedVideo', () => {
      popupHide('featuredVideo', 250); 
    });

    return { game, loggedIn, loading }
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
@keyframes loading {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
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
#notif {
  width: auto;
  height: 50px;
  
  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  background-color: rgb(25, 28, 34);

  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  line-height: 50px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
  transition: opacity 0.1s;
  opacity: 0;
  z-index: 100;
}
#loadingScreen {
  width: 100%;
  height: 100%;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  background-color: #232732;
}
.loadingScreenText {
    color: white;
    font-size: 30px;
    font-family: 'Quicksand';

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    animation: loading 1s infinite;
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

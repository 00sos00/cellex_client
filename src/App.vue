<template>
  <!-- No Transitions -->
  <Auth v-if="!loggedIn && !loading" :game="game"/>
  <MainScene v-show="visibleElements.Scene" :game="game"/>

  <!-- Fades -->
  <transition-group tag="div" name="fade" appear>
    <MainPlay v-if="loggedIn && !loading && visibleElements.Main"  key="1" :game="game"/>
    <DeathMenu v-show="visibleElements.DeathMenu"  key="1" :game="game"/>
    <div id="notif" v-show="visibleElements.Notification" key="1"></div>
    <div id="overlay" v-show="visibleElements.Overlay" key="1"></div>
    <div id="background" v-show="visibleElements.Background" key="1" ></div>
  </transition-group>


  <!-- Popups -->
  <transition-group tag="div" name="popup">
    <MainSettings v-if="visibleElements.Settings" :game="game" key="1"/>
    <Servers v-show="visibleElements.Servers" :game="game" key="1"/>
    <SkinChanger v-show="visibleElements.SkinChanger" :game="game" key="1"/>
    <Profile v-if="visibleElements.Profile" :game="game" key="1"/>
  </transition-group>


  <!-- Loading Screen -->
  <div id="loadingScreen" v-if="loading">
    <div class="loadingScreenText">Loading...</div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import MainPlay from './components/MainPlay';
import SkinChanger from './components/SkinChanger';
import MainSettings from './components/MainSettings';
import MainScene from './components/MainScene';
import Servers from './components/Servers';
import Auth from './components/Auth';
import DeathMenu from './components/DeathMenu';
import Profile from './components/Profile';
/* import FeaturedVideo from './components/FeaturedVideo'; */
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
    DeathMenu,
    Profile
  },
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const on = EventHandler.on;
    const loggedIn = ref(true);
    const loading = ref(false);
    const game = new Game(EventHandler);
    const visibleElements = ref({
      Main: true,
      DeathMenu: false,
      Settings: false,
      Servers: false,
      SkinChanger: false,
      Overlay: false,
      Scene: false,
      Profile: false,
      Background: true,
      Notification: false
    });

    

    on('showNotif', () => visibleElements.value.Notification = true);
    on('hideNotif', () => visibleElements.value.Notification = false);

    on('loggedIn', () => {
      loggedIn.value = true;
      loading.value = false;
      if (window.loginBtn)
        window.loginBtn.disabled = true;
    });
    on('loggedOut', () => {
      loggedIn.value = false;
      loading.value = false;
      localStorage.removeItem('accessToken');
      game.profileHandler.resetProfile();
      if (window.loginBtn)
        window.loginBtn.disabled = false;
    });

    on('showMain', () => {
      visibleElements.value.Background = true;
      visibleElements.value.Main = true;
      visibleElements.value.Scene = false;
    });
    on('hideMain', () => {
      visibleElements.value.Main = false;
      visibleElements.value.Background = false;
      visibleElements.value.Scene = true;
    });
    on('showDeathMenu', () => {
      visibleElements.value.Background = true;
      visibleElements.value.DeathMenu = true;
    });
    on('hideDeathMenu', () => {
      visibleElements.value.DeathMenu = false;
      visibleElements.value.Background = false;
    });


    on('openProfile', () => {
      visibleElements.value.Profile = true;
      visibleElements.value.Overlay = true;
    });
    on('closeProfile', () => {
      visibleElements.value.Profile = false;
      visibleElements.value.Overlay = false;
    });


    on('openSkinChanger', () => {
      visibleElements.value.SkinChanger = true;
      visibleElements.value.Overlay = true;
    });
    on('closeSkinChanger', () => {
      visibleElements.value.SkinChanger = false;
      visibleElements.value.Overlay = false;
    });


    on('openSettings', () => {
      visibleElements.value.Settings = true;
      visibleElements.value.Overlay = true;
    });
    on('closeSettings', () => {
      visibleElements.value.Settings = false;
      visibleElements.value.Overlay = false;  
    });


    on('openServers', () => {
      visibleElements.value.Servers = true;
      visibleElements.value.Overlay = true;
      game.servers.onOpen();
    });
    on('closeServers', () => {
      visibleElements.value.Servers = false;
      visibleElements.value.Overlay = false;  
    });


    game.profileHandler.checkLoggedIn();
    return { game, loggedIn, loading, visibleElements }
  }
}
</script>

<style>
/* <=== Load Fonts ===> */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');


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


/* <=== Popup Transition ===> */
.popup-enter-from {
  opacity: 0;
  transform: scale(1.1);
}
.popup-enter-to {
  opacity: 1;
  transform: scale(1);
}
.popup-leave-from {
  opacity: 1;
  transform: scale(1);
}
.popup-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.popup-enter-active, .popup-leave-active {
  transition: all 0.15s ease;
}

/* <=== Fade Transition */
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}



body {
  -webkit-user-select: none;        
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #232732;
}
#notif {
  width: auto;
  height: 50px;
  
  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  background-color: rgba(10, 10, 10, 0.4);

  position: fixed;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);

  line-height: 50px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
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

  width: 10000vw;
  height: 10000vh;

  background-color: #232732;
  z-index: -2;
}
#overlay {
  position: absolute;
  transform: translate(-50%, -50%);

  width: 1000vh;
  height: 1000vh;

  background-color: #111218ee;

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

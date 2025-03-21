<template>
  <div id="mainPlay">
    <!-- Coins Box -->
    <div class="coinsBox">
      <div class="coinSymbol">$</div>
      <div class="coinsValue">{{ profileCoins }}</div>
    </div>

    <!-- Nav buttons -->
    <div id="mainNav">
      <button class="navBtn">Shop</button>
      <button class="navBtn" @click="openProfile">Profile</button>
      <button class="navBtn" @click="openServers">Servers</button>
      <button class="navBtn">Skins</button>
      <button class="navBtn" @click="openFeaturedVideo">Featured Video</button>
    </div>

    <!-- The xp circle -->
    <svg width="172.5" height="172.5" class="xpCircleHolder">
      <circle r="71.25" cx="86.25" cy="86.25" class="xpCircleBar"></circle>
      <circle r="71.25" cx="86.25" cy="86.25" class="xpCircleProgress">
        <animate attributeType="CSS" attributeName="stroke-dashoffset" 
           from="450" to="200" dur="1s" calcMode="spline" repeatCount="1" keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" keySplines="
            0.1 0.8 0.2 1;
            0.1 0.8 0.2 1;
            0.1 0.8 0.2 1;
            0.1 0.8 0.2 1;
            0.1 0.8 0.2 1;
            0.1 0.8 0.2 1" id="progressAnimation"
        />
      </circle>
    </svg>

    <!-- For the skin inside the xp circle -->
    <div id="skinHolder">
      <img v-on:click="openSkinChanger" class="skinImage" alt="Skin" src="../assets/Images/defaultSkin.png"/>
      <p id="changeSkinText">Change Skin</p>
    </div>

    <!-- Play controls -->
    <div id="playControlsHolder">
      <input v-on:input="onNameChange" type="text" id="nick" placeholder="Nickname" maxlength="12" autocomplete="off">    
      <input v-on:input="onTagChange" type="text" id="tag" placeholder="Tag" maxlength="6" autocomplete="off" required>
      <button @click="joinGame" id="playBtn">Play</button>
      <button @click="spectate" id="spectateBtn">Spectate</button>
      <button id="settingsBtn" v-on:click="openSettings">Settings</button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue';

export default {
  name: 'MainPlay',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const game = self.props.game;
    const videoEmbedCode = 'CmKa4QAUNTA';
    const videoEmbedLink = `https://www.youtube.com/embed/${videoEmbedCode}`;
    onMounted(() => {
      document.getElementById('nick').value = localStorage.getItem('name');
      document.getElementById('tag').value = localStorage.getItem('tag');
      game.profileHandler.updateProgressCircles();
    });

    const joinGame = game.joinGame.bind(game)
    const spectate = game.socket.packetHandler.startSpectating.bind(game);

    const onNameChange = (e) => {
      const name = e.target.value;
      localStorage.setItem('name', name);
    }

    const onTagChange = (e) => {
      const tag = e.target.value;
      localStorage.setItem('tag', tag);
    }
    
    const openSkinChanger = () => {
      EventHandler.emit('openSkinChanger');
    }

    const openSettings = () => {
      EventHandler.emit('openSettings');
    }

    const openServers = () => {
      EventHandler.emit('openServers');
    }

    const openProfile = () => EventHandler.emit('openProfile');

    return { 
      openSkinChanger, 
      openSettings, 
      openServers,
      openProfile,
      onNameChange, 
      onTagChange,
      joinGame,
      spectate,
      videoEmbedLink,
      profileCoins: game.profileHandler.profile.coins 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainPlay {
  position: absolute;
  top: 80px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0 auto;

  width: 400px;
  height: 350px;
  
  z-index: -1;
}

#video {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    width: 365px;
    height: 300px;

    box-sizing: border-box;
    border-radius: 10px;
    display: none;
}


.coinsBox {
  width: 150px;
  height: 40px;

  position: fixed;
  top: 5px;
  right: 10px;

  background-color: #181b227e;

  border-radius: 5px;
}
.coinSymbol {
  width: 25px;
  height: 25px;

  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);


  color: #fad500;
  font-family: 'Quicksand';
  font-size: 16px;
  background-color: #fab700;
  text-align: center;
  line-height: 25px;
  
  box-sizing: border-box;
  border-radius: 50%;
}
.coinsValue {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);

  color: white;
  font-family: 'Quicksand';
  font-size: 16px;
}

#mainNav {
  height: 30px;

  position: fixed;
  top: 0px;
  left: 0px;

  display: flex;
  padding: 5px;
  z-index: -1;
  border-bottom-right-radius: 5px;
}
.navBtn {
  flex: 1;
  height: 30px;

  color: white;
  background-color: transparent;
  font-size: 20px;
  font-family: 'Quicksand';

  white-space: nowrap;
  margin-right: 10px;
  border-radius: 5px;
  border: none;
  outline: none;
}
.navBtn:hover {
  cursor: pointer;
  color: #a7a7a7;
}




.xpCircleHolder {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}
.xpCircleBar {
    fill: none;
    stroke: #1b1e27;
    stroke-width: 15;
}
.xpCircleProgress {
    fill: none;
    stroke: #4480d4;
    stroke-width: 15;
    stroke-dashoffset: 0;
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-linecap: round;
}





#skinHolder {
  width: 127.5px;
  height: 127.5px;
  border: 3px #4480d4 solid;
  border-radius: 50%;

  background-color: transparent;

  position: relative;
  top: 22px;
  left: 50%;
  transform: translate(-50%);

  box-sizing: border-box;
  text-align: center;
}
.skinImage {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  background-color: #3498f7;
  box-shadow: inset 0px 0px 50px #1b1e27;
  opacity: 0.3;
}
.skinImage:hover {
  cursor: pointer;
  opacity: 0.2;
}
.skinImage:hover + #changeSkinText {
  opacity: 0.5;
}
#changeSkinText {
  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
  word-break: keep-all;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;

  opacity: 1;
  white-space: nowrap;
  pointer-events: none;
}


#playControlsHolder {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%);

  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 5px;
  align-content: center;
  justify-content: center;
}
#nick {
    color: white;
    background-color: #15181f;
    font-size: 20px;
    font-family: 'Quicksand';
    text-align: center;

    width: 176px;
    height: 40px;

    grid-row: 1;
    grid-column: 1 / 2;

    border: none;
    outline: none;
    border-radius: 10px;
}
#nick::placeholder {
    color:#353b4b;
    font-family: 'Quicksand';
}
#nick:hover {
    opacity: 0.8;
}




#tag {
    color: white;
    background-color: #15181f;
    font-size: 20px;
    font-family: 'Quicksand';
    text-align: center;

    width: 176px;
    height: 40px;

    grid-row: 1;
    grid-column: 2 / 3;

    border: none;
    outline: none;
    border-radius: 10px;
}
#tag::placeholder {
    color:#353b4b;
    font-family: 'Quicksand';
}
#tag:hover {
    opacity: 0.8;
}
#tag:not(:focus):valid {
    color: transparent;
    text-shadow: 0 0 10px #333b4d
}




#playBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #4480d4;

    width: 180px;
    height: 40px;

    grid-row: 2;
    grid-column: 1 / 2;

    border: none;
    outline: none;
    border-radius: 10px;
}
#playBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}



#spectateBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #4480d4;

    width: 180px;
    height: 40px;

    grid-row: 2;
    grid-column: 2 / 3;
    
    border: none;
    outline: none;
    border-radius: 10px;
}
#spectateBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}



#settingsBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #4a5cd4;

    height: 40px;

    grid-row: 3;
    grid-column: 1 / 3;

    border: none;
    outline: none;
    border-radius: 10px;
}
#settingsBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}
</style>

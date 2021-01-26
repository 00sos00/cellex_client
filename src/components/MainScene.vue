<template>
  <div id="mainScene">
    <div id="mainHUD">
      <div id="mainStats">
        <div class="stat">
          <p id="fps" class="statValue">FPS: 60</p>
        </div>
        <div class="stat" style="display: none;">
          <p id="ping" class="statValue">Ping: 0</p>
        </div>
        <div class="stat" style="display: none;">
          <p id="mass" class="statValue"></p>
        </div>
        <div class="stat" style="display: none;">
          <p id="cells" class="statValue"></p>
        </div>
      </div>
      <div id="mainLeaderboard">
        <p class="leaderboardTitle">Leaderboard</p>
        <div id="leaderboardRows"></div>
      </div>
      <div id="mainChat" @mouseover="chatMouseOver" @mouseout="chatMouseOut">
        <div id="messages"></div>
        <input @focus="onChatFocus" @blur="onChatBlur" type="text" id="chatInput" maxlength="256" spellcheck="false" placeholder="Press enter to chat" autocomplete="off">
      </div>
      <div id="mainMinimap">
        <canvas id="minimapCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue';
import Scene from '../assets/GameFiles/Scene';

export default {
  name: 'MainScene',
  props: ['game'],
  setup() {
    window.canZoom = true;
    window.isTyping = false;
    const self = getCurrentInstance();
    const game = self.props.game;
    onMounted(() => {
        const mainScene = document.getElementById('mainScene');
        const scene = new Scene(game, mainScene); scene
    });

    function chatMouseOver() {
      window.canZoom = false;
    }

    function chatMouseOut() {
      window.canZoom = true;
    }

    function onChatFocus() {
      window.isTyping = true;
    }

    function onChatBlur() {
      window.isTyping = false;
    }

    return { chatMouseOver, chatMouseOut, onChatFocus, onChatBlur }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#mainScene {
    width: 100%;
    height: 100%;

    position: absolute;

    z-index: -2;
}




#mainCanvas {
    width: 100%;
    height: 100%;

    position: absolute;

    margin: 0;
    padding: 0;
    z-index: -1;
}





#mainStats {
  width: auto;
  height: 40px;
  max-zoom: 200;
  background-color: #1b1e2791;

  position: absolute;
  left: 0px;
  top: 0px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-right: 2px #15181f solid;
  border-bottom: 2px #15181f solid;
  border-bottom-right-radius: 5px;
  z-index: 1;
}
.stat {
  width: 120px;
  height: 40px;

  display: inline-block;
  line-height: 10px;
  text-align: center;
}
.statValue {
  color: white;
  font-size: 16px;
  font-family: 'Quicksand';
}




#mainLeaderboard {
  width: 200px;
  height: auto;
  max-width: 200px;
  max-height: 300px;

  background-color: #1b1e2791;

  position: absolute;
  right: 0px;
  top: 0px;

  border-left: 2px #15181f solid;
  border-bottom: 2px #15181f solid;
  border-bottom-left-radius: 5px;
  z-index: 1;
}
.leaderboardTitle {
  color: white;
  font-size: 20px;
  font-family: 'Quicksand';
  text-align: center;

  margin: 10px;
}
.lbRow {
  color: white;
  font-size: 16px;
  font-family: 'Arial';

  text-align: center;
  margin-bottom: 5px;
}
.lbRow.isMe {
  color: rgb(211, 138, 138);
}






#mainChat {
  width: 430px;
  height: 240px;

  background-color: #1b1e2791;

  position: absolute;
  bottom: 0px;
  left: 0px;

  border-top: 2px #15181f solid;
  border-right: 2px #15181f solid;
  border-top-right-radius: 5px;
  z-index: 1;
  user-select: auto !important;
}
#messages {
  width: 100%;
  height: 90%;

  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: 1px;
}
#messages::-webkit-scrollbar {
    width: 5px;

    background-color: #1013187e;

    border-radius: 5px;
}
#messages::-webkit-scrollbar-thumb {
    background-color: #242b36;

    border-radius: 5px;
}
.message {
  width: 100%;
  height: auto;

  color: white;
  font-size: 16px;
  font-family: 'Arial';

  margin: 0;
  margin-bottom: 5px;
  text-indent: 12px;
  float: left;
  word-break: break-all;
}
.messageName {
  color: rgba(255, 255, 255, 0.521);
  font-size: 16px;
  font-family: 'Arial';
}
.messageText {
  color: white;
  font-size: 16px;
  font-family: 'Arial';
  padding-left: 2px;
}
#chatInput {
  width: 100%;
  height: 10%;

  color: white;
  font-size: 16px;
  font-family: 'Arial';
  background-color: #252933b2;

  border: none;
  outline: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  text-indent: 5px;
}
#chatInput::placeholder {
  color: #424857;
  font-size: 16px;
  text-align: left;
}







#mainMinimap {
  width: 200px;
  height: 200px;

  background-color: #1b1e2791;

  position: absolute;
  bottom: 0px;
  right: 0px;

  border-top: 2px #15181f solid;
  border-left: 2px #15181f solid;
  border-top-left-radius: 5px;
  z-index: 1;
}
#minimapCanvas {
  position: absolute;
  bottom: 0px;
  right: 0px;

  z-index: 1;
}
</style>

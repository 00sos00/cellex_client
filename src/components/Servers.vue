<template>
  <div id="mainServers" class="main">
      <!-- Header -->
      <header id="serversHeader">
          <div id="serversTabs">
              <button ref="defaultTabBtn" v-on:click="switchTab" class="serversTabBtn">Europe</button>  
              <button v-on:click="switchTab" class="serversTabBtn">North America</button>
          </div>
      </header>

      <!-- Content -->
      <div id="serversContent">
        <!-- Europe -->
        <div class="serversTab" id="Europe">
            <div v-for="gm in europeGamemodes" :key="gm" class="serversGamemode">
                <p class="serversGamemodeName">{{ gm.name }}</p>
                <div class="gamemodeServers">
                    <button @click="connect" v-for="server in gm.servers" :key="server" class="gamemodeServer" :data-server="JSON.stringify(server)" :data-gamemode="gm.name" :disabled="server.isFull">{{ server.name }}</button>
                </div>
            </div>
        </div>

        <!-- North America -->
        <div class="serversTab" id="North America">
            <div v-for="gm in northAmericaGamemodes" :key="gm" class="serversGamemode">
                <p class="serversGamemodeName">{{ gm.name }}</p>
                <div class="gamemodeServers">
                    <button @click="connect" v-for="server in gm.servers" :key="server" class="gamemodeServer" :data-server="JSON.stringify(server)" :data-gamemode="gm.name" :disabled="server.isFull">{{ server.name }}</button>
                </div>
            </div>
        </div>
      </div>

      <!-- Footer -->
      <footer id="serversFooter">
          <button v-on:click="closeServers" id="serversCloseBtn">Close</button>
      </footer>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import Servers from '../assets/GameFiles/ServersFiles/Servers';

export default {
  name: 'Servers',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const defaultTabBtn = ref(null);
    const europeGamemodes = ref({});
    const northAmericaGamemodes = ref({});
    const game = self.props.game;
          game.servers = new Servers(game, defaultTabBtn, europeGamemodes, northAmericaGamemodes);

    const closeServers = () => {
        EventHandler.emit('closeServers');
    }

    return { 
        closeServers,
        connect: game.servers.connect.bind(game.servers),
        switchTab: game.servers.switchTab.bind(game.servers),
        defaultTabBtn,
        europeGamemodes,
        northAmericaGamemodes
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mainServers {
    width: 500px;
    height: 400px;

    background-color: #191c24;

    position: absolute;
    top: 150px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0 auto;

    border-radius: 15px;

    pointer-events: none;
    opacity: 0;
    overflow: hidden;
}




#serversHeader {
    background-color: #101318;

    width: 480px;
    height: 50px;

    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate(-50%);

    padding: 5px;
    border-radius: 10px;
}
#serversTabs {
    width: 480px;
    height: 50px;

    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate(-50%);

    border-radius: 10px;
    display: flex;
}
.serversTabBtn {
    color: white;
    background-color: transparent;
    font-size: 18px;
    font-family: 'Quicksand';

    flex: 1;
    height: 40px;

    margin-left: 5px;
    margin-right: 5px;
    border: none;
    border-radius: 5px;
    outline: none;
    transition: 0.10s;
}
.serversTabBtn.selectedTab {
    background-color: #0a0c0fd0;
}
.serversTabBtn:hover:not(.selectedTab) {
    opacity: 0.8;
    cursor: pointer;
    background-color: #0a0c0fb4;
}







#serversContent {
    width: 490px;
    height: 240px;

    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    background-color: #1013187e;

    border-radius: 10px;
    overflow-x: none;
    overflow-y: auto;
}
#serversContent::-webkit-scrollbar {
    width: 5px;

    background-color: #1013187e;

    border-radius: 5px;
}
#serversContent::-webkit-scrollbar-thumb {
    background-color: #242b36;

    border-radius: 5px;
}
.serversGamemode {
    width: 470px;
    height: 50px;

    position: relative;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);

    background-color: #101318;

    margin-bottom: 5px;
    border-radius: 10px;
}
.serversGamemodeName {
    color: white;
    font-size: 16px;
    font-family: 'Quicksand';
    line-height: 16px;

    text-indent: 10px;
    float: left;
}
.gamemodeServers {
    width: 300px;
    height: 40px;

    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);

    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    justify-content: space-evenly;
    display: flex;
}
.gamemodeServer {
    flex-grow: 1;
    height: 35px;

    position: relative;
    top: 50%;
    transform: translateY(-50%);

    color: white;
    background-color: #15171E;
    font-size: 15px;
    font-family: 'Quicksand';
    text-align: center;
    line-height: 35px;

    transition: 0.1s;
    padding-left: 5px;
    padding-right: 5px;
    margin-right: 5px;
    margin-left: 5px;
    border-radius: 5px;
    border: none;
    outline: none;
}
.gamemodeServer:disabled {
    color: #e2e2e273;
    background-color: #1d222b73;
}
.gamemodeServer:hover {
    cursor: pointer;
    background-color: #15171eb0;
}
.selectedServer {
    background-color: #1d222b;
}



#serversFooter {
    width: 480px;
    height: 50px;

    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%);

    border-radius: 10px;
}
#serversCloseBtn {
    width: 480px;
    height: 50px;

    color: white;
    background-color: #bb0909;
    font-size: 20px;
    font-family: 'Quicksand';
    
    text-align: center;
    border: none;
    border-radius: 10px;
    outline: none;
}
#serversCloseBtn:hover {
    opacity: 0.8;
    cursor: pointer;
}
</style>

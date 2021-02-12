<template>
  <div id="skinChanger" class="main">
    <div id="skinHolder">
      <img v-on:click="openSkinChanger" class="skinImage" src="../assets/Images/defaultSkin.png" alt="Skin"/>
    </div>

    <input v-on:input="onSkinCodeChange" type="text" id="skinCode" maxlength="7" placeholder="Skin Code" required>
    <p id="errorMessage"></p>

    <div class="footer_buttons">
        <button v-on:click="saveSkin" id="saveBtn">Save</button>
        <button v-on:click="closeSkinChanger" id="cancelBtn">Cancel</button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted} from 'vue';
import SkinChanger from '../assets/GameFiles/SkinChanger';

export default {
  name: 'SkinChanger',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const game = self.props.game;
    const skinChanger = new SkinChanger(game, EventHandler, '6LskVHu');

    onMounted(() => skinChanger.onMounted());

    return { 
        closeSkinChanger: skinChanger.closeSkinChanger.bind(skinChanger),
        onSkinCodeChange: skinChanger.onSkinCodeChange.bind(skinChanger),
        saveSkin: skinChanger.saveSkin.bind(skinChanger)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#skinChanger {
    background-color: #191c24;

    width: 355px;
    height: 350px;

    position: absolute;
    top: 150px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0 auto;

    border-radius: 10px;
    padding: 5px;
}
#skinHolder {
  width: 200px;
  height: 200px;
  border: 5px #3498f7 solid;
  border-radius: 50%;

  background-color: transparent;

  text-align: center;
  position: relative;
  top: 10px;
  left: 50%;
  transform: translate(-50%);
}
.skinImage {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  background-color: #3498f7;
  box-shadow: inset 0px 0px 50px #1b1e27;
  transition: 1s;
}
#skinCode {
    color: white;
    background-color: #15181f;
    font-size: 20px;
    font-family: 'Quicksand';
    text-align: center;

    width: 150px;
    height: 40px;

    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%);

    border: none;
    outline: none;
    border-radius: 10px;
}
#skinCode:not(:focus):valid {
    color: transparent;
    text-shadow: 0 0 10px #333b4d
}
#skinCode::placeholder {
    color:#353b4b;
}
#errorMessage {
    color: red;
    font-size: 15px;
    font-family: 'Quicksand';
    text-align: center;
}
#saveBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #0db323;

    width: 175px;
    height: 40px;

    grid-row: 2;
    grid-column: 1 / 2;

    border: none;
    outline: none;
    border-radius: 10px;
}
#saveBtn:hover:not(.saveBtnLoading) {
    cursor: pointer;
    opacity: 0.8;
}
.saveBtnLoading {
  cursor: default;
  opacity: 0.6;
}
#cancelBtn {
    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #f01212;

    width: 175px;
    height: 40px;

    grid-row: 2;
    grid-column: 2 / 3;

    border: none;
    outline: none;
    border-radius: 10px;
}
#cancelBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}
</style>

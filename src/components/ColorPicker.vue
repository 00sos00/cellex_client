<template>
  <div class="colorSquare" @click="SCP" :data-colorName="name_"></div>
  <transition name="slide">
    <div class="colorPicker" v-show="showColorPicker" @mouseover="mouseover" @mouseout="mouseout">
        <!-- R -->
        <label for="r" class="colorPickerLabel">R</label>
        <input type="range" class="rInput rgbInput" min="0" max="255" step="1">

        <!-- G -->
        <label for="g" class="colorPickerLabel">G</label>
        <input type="range" class="gInput rgbInput" min="0" max="255" step="1">

        <!-- B -->
        <label for="b" class="colorPickerLabel">B</label>
        <input type="range" class="bInput rgbInput" min="0" max="255" step="1">

        <!-- HEX -->
        <label for="hex" class="colorPickerLabel">HEX</label>
        <input type="text" class="hexInput" maxlength="7">
    </div>
  </transition>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue';
import ColorPicker from '../assets/GameFiles/ColorPicker';

export default {
  name: 'ColorPicker',
  props: ['game', 'name'],
  setup() {
    const self = getCurrentInstance();
    const game_ = self.props.game;
    const name_ = self.props.name;
    const showColorPicker = ref(false);
    window.hideColorPicker = true;
    
    const mouseover = () => window.hideColorPicker = false;
    const mouseout = () => window.hideColorPicker = true;

    const SCP = () => showColorPicker.value = true

    onMounted(() => {
      const colorPickerElem = self.vnode.el.nextSibling.nextSibling;
      const colorSqaure = self.vnode.el.nextSibling;
      const rInput = colorPickerElem.getElementsByClassName('rInput')[0];
      const gInput = colorPickerElem.getElementsByClassName('gInput')[0];
      const bInput = colorPickerElem.getElementsByClassName('bInput')[0];
      const hexInput = colorPickerElem.getElementsByClassName('hexInput')[0];
      const initColor = game_.settings.template.colors[name_].value;
      const colorPicker = new ColorPicker(rInput, gInput, bInput, hexInput, colorSqaure, initColor, game_, name_);
      colorPicker

      window.addEventListener('mousedown', () => {
        if (window.hideColorPicker)
          showColorPicker.value = false;
      });
      
    });

    return { SCP, showColorPicker, mouseover, mouseout, name_ }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s;
}





.colorSquare {
    height: 35px;
    width: 35px;

    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    background-color: white;

    border-radius: 5px;
}
.colorSquare:hover {
  cursor: pointer;
  opacity: 0.9;
}



.colorPicker {
  width: 200px;
  height: 108px;

  position: absolute;
  right: 60px;

  background-color: #1c2029;

  z-index: 1;
  border-radius: 5px;
}


.colorPickerLabel {
    width: 50px;

    color: #3e434e;
    font-size: 16px;
    font-family: 'Quicksand';
    text-align: left;

    text-indent: 10px;
    display: inline-block;
    margin-bottom: 7px;
}



.rgbInput {
    -webkit-appearance: none;

    width: 130px;
    height: 10px;

    background-color: transparent;

    outline: none;
}
.rgbInput::-webkit-slider-runnable-track {
    background-color: #414550;

    border-radius: 2px;
}
.rgbInput::-webkit-slider-thumb {
    -webkit-appearance: none;

    width: 10px;
    height: 10px;

    background-color: #31333b;

    border-radius: 2px;
}
.rgbInput::-webkit-slider-thumb:hover {
    cursor: pointer;
    opacity: 0.8;
}



.hexInput {
    width: 130px;
    height: 20px;

    color: white;
    font-size: 16px;
    font-family: 'Quicksand';
    text-align: center;
    background-color: #414550;

    outline: none;
    border: none;
    border-radius: 2px;
}
</style>

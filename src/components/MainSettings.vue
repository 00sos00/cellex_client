<template>
    <div id="mainSettings" class="main">
        <!-- Header -->
        <header id="settingsHeader">
            <div id="settingsTabs">
                <button v-on:click="switchTab" class="settingsTabBtn defaultTabBtn">Options</button>  
                <button v-on:click="switchTab" class="settingsTabBtn">Ranges</button>
                <button v-on:click="switchTab" class="settingsTabBtn">Hotkeys</button>
                <button v-on:click="switchTab" class="settingsTabBtn">Colors</button>
            </div>
        </header>

        <!-- Content -->
        <div id="settingsContent">
            <transition-group name="switch" mode="out-in">
                <!-- Options -->
                <div class="settingsTab" key="1" v-show="visibleTabs.Options">
                    <div v-for="option in options" :key="option" class="settingsOption">
                        <p class="settingsOptionName">{{ option.name }}</p>
                        <div class="settingsOptionValues">
                            <div @click="onOptionChange" :data-optionName="option.name" v-for="value in option.possibleValues" :key="value" class="settingsOptionValue">{{ value }}</div>
                        </div>
                    </div>
                    <button class="settingsResetBtn" @click="resetOptions">Reset</button>
                </div>

                <!-- Ranges -->
                <div class="settingsTab" key="1" v-show="visibleTabs.Ranges">
                    <div v-for="range in ranges" :key="range" class="settingsRange">
                        <p class="settingsRangeName">{{ range.name }}</p>
                        <input @input="onRangeChange" class="settingsRangeInput" type="range" :data-rangeName="range.name" :value="range.defaultValue" :min="range.minValue" :max="range.maxValue" :step="range.step">
                        <div class="rangeInputValue"></div>
                    </div>
                    <button class="settingsResetBtn" @click="resetRanges">Reset</button>
                </div>

                <!-- Hotkeys -->
                <div class="settingsTab" key="1" v-show="visibleTabs.Hotkeys">
                    <div v-for="hotkey in hotkeys" :key="hotkey" class="settingsHotkey">
                        <p class="settingsHotkeyName">{{ hotkey.name }}</p>
                        <HotkeyInput :game="game_" :name="hotkey.name"/>
                    </div>
                    <button class="settingsResetBtn" @click="resetHotkeys">Reset</button>
                </div>

                <!-- Colors -->
                <div class="settingsTab" key="1" v-show="visibleTabs.Colors">
                    <div v-for="color in colors" :key="color" class="settingsColor">
                        <p class="settingsColorName">{{ color.name }}</p>
                        <ColorPicker :name="color.name" :game="game_"/>
                    </div>
                    <button class="settingsResetBtn" @click="resetColors">Reset</button>
                </div>
            </transition-group>
        </div>

        <!-- Footer -->
        <footer id="settingsFooter">
            <button v-on:click="closeSettings" id="settingsCloseBtn">Close</button>
        </footer>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue';
import HotkeyInput from './HotkeyInput';
import ColorPicker from './ColorPicker';

export default {
  name: 'MainSettings',
  props: ['game'],
  components: { 
    HotkeyInput,
    ColorPicker 
  },
  setup() {
    const self = getCurrentInstance();
    const game_ = self.props.game;
    const settings = game_.settings;
    settings.visibleTabs = ref({
        Options: false,
        Ranges: false,
        Hotkeys: false,
        Colors: false
    });
    onMounted(() => {
        self.vnode.el.getElementsByClassName('defaultTabBtn')[0].click();
        settings.updateSettings();
    });

    return { 
        closeSettings: settings.closeSettings.bind(settings),
        switchTab: settings.switchTab.bind(settings),
        onOptionChange: settings.onOptionChange.bind(settings),
        onRangeChange: settings.onRangeChange.bind(settings),
        options: settings.template.options,
        ranges: settings.template.ranges,
        hotkeys: settings.template.hotkeys,
        colors: settings.template.colors,
        resetOptions: settings.resetOptions.bind(settings),
        resetRanges: settings.resetRanges.bind(settings),
        resetHotkeys: settings.resetHotkeys.bind(settings),
        resetColors: settings.resetColors.bind(settings),
        game_,
        visibleTabs: settings.visibleTabs
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.switch-enter-from {
    opacity: 0;
}
.switch-leave-to {
    opacity: 0;
}
.switch-enter-active, 
.switch-leave-active {
    transition: all 0.2s;
}






#mainSettings {
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
    overflow: hidden;
}



#settingsHeader {
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
#settingsTabs {
    width: 480px;
    height: 50px;

    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate(-50%);

    border-radius: 10px;
    display: flex;
}
.settingsTabBtn {
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
.settingsTabBtn.selectedTab {
    background-color: #0a0c0fd0;
}
.settingsTabBtn:hover:not(.selectedTab) {
    opacity: 0.8;
    cursor: pointer;
    background-color: #0a0c0fb4;
}



#settingsContent {
    width: 490px;
    height: 240px;

    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    background-color: #1013187e;

    border-radius: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}
#settingsContent::-webkit-scrollbar {
    width: 5px;

    background-color: #1013187e;

    border-radius: 5px;
}
#settingsContent::-webkit-scrollbar-thumb {
    background-color: #242b36;

    border-radius: 5px;
}
.settingsTab {
    width: 100%;
    height: 100%;

    position: relative;
}
.settingsOption,
.settingsRange,
.settingsHotkey,
.settingsColor {
    width: 470px;
    height: 50px;

    position: relative;
    top: 5px;
    left: 7.5px;

    background-color: #101318;

    margin-bottom: 5px;
    border-radius: 10px;
}
.settingsOptionName,
.settingsRangeName,
.settingsHotkeyName,
.settingsColorName {
    color: white;
    font-size: 16px;
    font-family: 'Quicksand';
    line-height: 16px;

    text-indent: 10px;
    float: left;
}



.settingsOptionValues {
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
.settingsOptionValue {
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
}
.settingsOptionValue:hover:not(.optionSelected) {
    cursor: pointer;
    background-color: #15171eb0;
}
.optionSelected {
    background-color: #1d222b;
}




.settingsRangeInput {
    -webkit-appearance: none;

    width: 50%;

    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);

    background: #323646;

    margin: 0;
    border-radius: 5px;
}
.settingsRangeInput::-webkit-slider-thumb {
  -webkit-appearance: none;

  width: 20px;
  height: 20px;

  background-color: #878c96;

  border-radius: 5px;
}
.settingsRangeInput::-webkit-slider-thumb:hover {
    opacity: 0.8;
    cursor: pointer;
}
.settingsRangeInput:focus {
  outline: none;
}
.rangeInputValue {
    width: auto;
    height: 20px;
    
    color: white;
    background-color: #323646;
    font-size: 16px;
    font-family: 'Quicksand';
    line-height: 20px;

    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    padding: 5px;
    border-radius: 5px;
}




.settingsColorInput {
    width: 100px;
    height: 35px;

    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);

    font-size: 18px;
    font-family: 'Quicksand';
    line-height: 30px;
    text-align: center;

    border: none;
    outline: none;
    border-radius: 5px;
    caret-color: transparent;
}
.settingsColorInput:hover:not(:focus) {
    opacity: 0.8;
    cursor: pointer;
}
.settingsColorInput:focus {
    cursor: default;
}



.settingsResetBtn {
    width: 100px;
    height: 40px;

    position: relative;
    left: 50%;
    transform: translateX(-50%);

    color: white;
    background-color: #101318;
    font-size: 16px;
    font-family: 'Quicksand';

    border: none;
    outline: none;
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.settingsResetBtn:hover {
    opacity: 0.8;
    cursor: pointer;
}




#settingsFooter {
    width: 480px;
    height: 50px;

    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%);

    border-radius: 10px;
}
#settingsCloseBtn {
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
#settingsCloseBtn:hover {
    opacity: 0.8;
    cursor: pointer;
}
</style>

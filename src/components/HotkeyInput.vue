<template>
  <input type="text" class="settingsHotkeyInput" :data-hotkeyName="name_" spellcheck="false" maxlength="1">
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue';

export default {
  name: 'Auth',
  props: ['game', 'name'],
  setup() {
    const self = getCurrentInstance();
    const game_ = self.props.game;
    const name_ = self.props.name;
    onMounted(() => {
        const input = self.vnode.el;
        if (!input) 
            return;
            
        const inputs = [...document.getElementsByClassName('settingsHotkeyInput')];

        // Function to check if same key exists
        const checkSameKey = (valueToCheck) => {
            let sameKey = false;
            inputs.forEach(input => sameKey = input.value == valueToCheck ? input : sameKey);
            return sameKey;
        }


        input.oncontextmenu = (e) => e.preventDefault();

        input.onkeyup = (e) => {
            e.preventDefault()
            if (!checkSameKey(e.code)) {
                input.value = e.code;
                input.blur();
                game_.settings.onHotkeyChange(input);
            } else {
                game_.showNotif('This key is already taken', 1000);
                input.blur();
            }
        }
        
        input.onmousedown = (e) => {
            e.preventDefault();
            if (input !== document.activeElement) {
                input.focus();
                return;
            }
            if (input === document.activeElement && !checkSameKey(`MOUSE${e.which}`)) {
                input.value = `MOUSE${e.which}`;
                input.blur();
                game_.settings.onHotkeyChange(input);
            } else {
                game_.showNotif('This key is already taken', 1000);
                input.blur();
            }
        }
    });

    return { name_ }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settingsHotkeyInput {
    width: 120px;
    height: 30px;

    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);

    color: white;
    background-color: #323646;
    font-size: 18px;
    font-family: 'Quicksand';
    line-height: 30px;
    text-align: center;

    border: none;
    outline: none;
    border-radius: 5px;
    caret-color: transparent;
}
.settingsHotkeyInput:hover:not(:focus) {
    opacity: 0.9;
    cursor: pointer;
}
.settingsHotkeyInput:focus {
    background-color: #242631;
    cursor: default;
}
</style>

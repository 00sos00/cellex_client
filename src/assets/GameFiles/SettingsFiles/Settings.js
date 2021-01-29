/*global $, jQuery*/

import settingsTemplate from './settingsTemplate.json';
import { showNotif } from '../../Functions/showNotif';
import { merge } from 'lodash';

export default class Settings {
    constructor(game, EventHandler, defaultTabButton) {
        this.game = game;
        this.game.settings = this;
        this.EventHandler = EventHandler;
        this.defaultTabButton = defaultTabButton;
        this.template = settingsTemplate;
    }

    closeSettings() {
        this.EventHandler.emit('closeSettings');
    }

    onOptionChange(e) {
        const values = Array.from(e.target.parentElement.getElementsByClassName('settingsOptionValue'));
        const options = this.template.options;
        const optionToChange = options[e.target.dataset.optionname]
        optionToChange.value = e.target.innerText;

        values.forEach(value => {
            value.classList.remove('optionSelected');
        });
        e.target.classList.add('optionSelected');
        this.updateSettings();
    }

    onRangeChange(e) {
        const ranges = this.template.ranges;
        const rangeToChange = ranges[e.target.dataset.rangename]
        rangeToChange.value = e.target.value;
        rangeToChange.value = Math.max(Math.min(rangeToChange.value, rangeToChange.maxValue), rangeToChange.minValue);
        this.updateSettings();
    }

    onHotkeyChange(input) {
        const hotkeys = this.template.hotkeys;
        const hotkeyToChange = hotkeys[input.dataset.hotkeyname];
        hotkeyToChange.value = input.value;
        this.updateSettings();
    }

    onColorChange(input, color) {
        const colors = this.template.colors;
        const colorToChange = colors[input.dataset.colorname];
        input.value = color;
        colorToChange.value = input.value;
        localStorage.setItem('settings', JSON.stringify(this.template));
    }

    switchTab(e) {
        const settingsTabButtons = Array.from(document.getElementsByClassName('settingsTabBtn'));
        const settingsTabs = Array.from(document.getElementsByClassName('settingsTab'));

        // Remove selected class from all buttons first
        settingsTabButtons.forEach(btn => {
            btn.classList.remove('selectedTab');
        });
        settingsTabs.forEach(tab => {
            tab.style.display = 'none';
        });

        switch(e.target.innerText) {
            case 'Options': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
            case 'Ranges': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
            case 'Hotkeys': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
            case 'Colors': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
        }
    }

    resetOptions() {
        const options = this.template.options;
        for (let option in options) {
            options[option].value = options[option].defaultValue;
        }
        this.updateSettings();
    }

    resetRanges() {
        const ranges = this.template.ranges;
        for (let range in ranges) {
            ranges[range].value = ranges[range].defaultValue;
        }
        this.updateSettings();
    }

    resetHotkeys() {
        const hotkeys = this.template.hotkeys;
        for (let hotkey in hotkeys) {
            hotkeys[hotkey].value = hotkeys[hotkey].defaultValue;
        }
        this.updateSettings();
    }

    resetColors() {
        const colors = this.template.colors;
        for (let color in colors) {
            colors[color].value = colors[color].defaultValue;
        }
        this.updateSettings();
    }

    setupHotkeyInputs() {
        const inputs = [...document.getElementsByClassName('settingsHotkeyInput')];

        function checkSameKey(valueToCheck) {
            let sameKey = false;
            inputs.forEach(input => {
                if (input.value == valueToCheck) sameKey = input
            });
            return sameKey;
        }

        inputs.forEach(input => {
            input.oncontextmenu = (e) => e.preventDefault();

            input.onkeyup = (e) => {
                e.preventDefault()
                if (!checkSameKey(e.code)) {
                    input.value = e.code;
                    input.blur();
                    this.onHotkeyChange(input);
                } else {
                    showNotif('This key is already taken', 1000);
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
                    this.onHotkeyChange(input);
                } else {
                    showNotif('This key is already taken', 1000);
                    input.blur();
                }
            }
        });
    }

    setupColorInputs() {
        const self = this;
        setTimeout(() => {
            $('.settingsColorInput').colorPicker({
                opacity: false,
                animationSpeed: 250,
                renderCallback: function (inputs) {
                    self.onColorChange(inputs[0], this.color.colors.HEX)
                }
            });
        }, 200);
    }

    loadSettings() {
        if (!localStorage.getItem('settings'))
            localStorage.setItem('settings', JSON.stringify(this.template));
        else {
            merge(this.template, JSON.parse(localStorage.getItem('settings')));
            localStorage.setItem('settings', JSON.stringify(this.template));
        }
    }

    updateSettings() {
        const options = [...document.getElementsByClassName('settingsOption')];
        const ranges  = [...document.getElementsByClassName('settingsRangeInput')];
        const hotkeys = [...document.getElementsByClassName('settingsHotkeyInput')];
        const colors  = [...document.getElementsByClassName('settingsColorInput')];


        // Update options
        setTimeout(() => {
            options.forEach(option => {
                const optionName = option.getElementsByClassName('settingsOptionName')[0].innerText;
                const optionValues =[...option.getElementsByClassName('settingsOptionValue')];
                const optionValue = this.template.options[optionName].value;
                let valueToChoose = null;
    
                optionValues.forEach(value => {
                    value.classList.remove('optionSelected');
                    if (value.innerText == optionValue) valueToChoose = value;
                });
                valueToChoose.classList.add('optionSelected');
            });
    
            // Update ranges
            ranges.forEach(range => {
                const rangeName = range.dataset.rangename;
                const rangeToChange = this.template.ranges[rangeName];
                const rangeValueText = range.parentElement.getElementsByClassName('rangeInputValue')[0];
    
                rangeToChange.value = Math.max(Math.min(rangeToChange.value, rangeToChange.maxValue), rangeToChange.minValue);
                range.value = rangeToChange.value;
                rangeValueText.innerText = range.value;
            });

            // Update hotkeys
            hotkeys.forEach(hotkey => {
                const hotkeyName = hotkey.dataset.hotkeyname;
                const hotkeyToChange = this.template.hotkeys[hotkeyName];
                hotkey.value = hotkeyToChange.value;
            });

            // Update colors
            colors.forEach(color => {
                const colorName = color.dataset.colorname;
                const colorToChange = this.template.colors[colorName];
                color.value = colorToChange.value;
                color.style.backgroundColor = '#' + color.value;
            });

            // Save Settings
            localStorage.setItem('settings', JSON.stringify(this.template));

            // Update HUD
            this.game.scene.updateHUD();
        }, 100);
    }

    onload() {
        jQuery.event.special.touchstart = {
            setup: function( _, ns, handle ) {
                this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
            }
        }
        setTimeout(() => {
            this.loadSettings();
            this.updateSettings();
            this.setupHotkeyInputs();
            this.setupColorInputs();
        }, 100);
    }
}
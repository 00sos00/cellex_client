import settingsTemplate from './settingsTemplate.json';
import { merge } from 'lodash';

export default class Settings {
    constructor(game) {
        this.game = game;
        this.template = settingsTemplate;
        this.visibleTabs = null;
        this.loadSettings();
    }

    closeSettings() {
        this.game.EventHandler.emit('closeSettings');
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

    onColorChange(colorName, color) {
        const colors = this.template.colors;
        const colorToChange = colors[colorName];
              colorToChange.value = color;
        localStorage.setItem('settings', JSON.stringify(this.template));
        this.game.scene.updateBackgroundColor();
    }

    switchTab(e) {
        const settingsTabButtons = [...document.getElementsByClassName('settingsTabBtn')];

        // Remove selected class from all buttons first
        settingsTabButtons.forEach(btn => btn.classList.remove('selectedTab'));

        // Hide all tabs
        for(let tab in this.visibleTabs.value)
            this.visibleTabs.value[tab] = false;

        // Show Needed Tab
        this.visibleTabs.value[e.target.innerText] = true;

        // Add selected class to needed tab button
        e.target.classList.add('selectedTab');
    }

    resetOptions() {
        const options = this.template.options;
        for (let option in options)
            options[option].value = options[option].defaultValue;
        this.updateSettings();
    }

    resetRanges() {
        const ranges = this.template.ranges;
        for (let range in ranges)
            ranges[range].value = ranges[range].defaultValue;
        this.updateSettings();
    }

    resetHotkeys() {
        const hotkeys = this.template.hotkeys;
        for (let hotkey in hotkeys)
            hotkeys[hotkey].value = hotkeys[hotkey].defaultValue;
        this.updateSettings();
    }

    resetColors() {
        const colors = this.template.colors;
        for (let color in colors)
            colors[color].value = colors[color].defaultValue;
        this.updateSettings();
        this.game.scene.updateBackgroundColor();
    }

    loadSettings() {
        if (!localStorage.getItem('settings'))
            localStorage.setItem('settings', JSON.stringify(this.template));
        else
            merge(this.template, JSON.parse(localStorage.getItem('settings')));
    }

    updateSettings() {
        const options = [...document.getElementsByClassName('settingsOption')];
        const ranges  = [...document.getElementsByClassName('settingsRangeInput')];
        const hotkeys = [...document.getElementsByClassName('settingsHotkeyInput')];
        const colors  = [...document.getElementsByClassName('colorSquare')];


        // Update options
        options.forEach(option => {
            const optionName = option.getElementsByClassName('settingsOptionName')[0].innerText;
            const optionValues =[...option.getElementsByClassName('settingsOptionValue')];
            const optionValue = this.template.options[optionName].value;
            let valueToChoose = null;

            optionValues.forEach(value => {
                value.classList.remove('optionSelected');
                if (value.innerText == optionValue) 
                    valueToChoose = value;
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
            color.style.backgroundColor = '#' + colorToChange.value;
        });

        // Save Settings
        localStorage.setItem('settings', JSON.stringify(this.template));

        // Update HUD
        this.game.scene.updateHUD();
    }
}
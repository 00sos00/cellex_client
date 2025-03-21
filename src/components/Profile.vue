<template>
  <div id="profile">
    <div class="profileAvatar">
        <img :src="avatarLink" alt="Avatar" class="avatarImage">
        <div class="avatarOverlay">{{ level }}</div>
        <svg width="135" height="135" class="xpCircleHolder">
            <circle r="52.5" cx="67.5" cy="67.5" class="xpCircleBar"></circle>
            <circle r="52.5" cx="67.5" cy="67.5" class="xpCircleProgress"></circle>
        </svg>
    </div>
    <div class="profileInfo">
        <div class="profileRow">
            <span class="profileKey">
                Name:
                <span class="profileValue">{{ name }}</span>
            </span>
        </div>
        <div class="profileRow">
            <span class="profileKey">
                Progress:
                <span class="profileValue">{{ progress }}%</span>
            </span>
        </div>
        <div class="profileRow">
            <span class="profileKey">
                Account ID:
                <span class="profileValue">{{ accID }}</span>
            </span>
        </div>
    </div>
    <button id="closeProfileBtn" class="profileBtn" @click="closeProfile">Close</button>
    <button id="logoutBtn" class="profileBtn" @click="logout">Logout</button>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue';

export default {
  name: 'Profile',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const game = self.props.game;
    onMounted(game.profileHandler.updateProgressCircles.bind(game.profileHandler));

    const closeProfile = () => game.EventHandler.emit('closeProfile');
    const logout = () => {
        game.profileHandler.logout();
        setTimeout(closeProfile, 250);
    }

    return { 
        closeProfile, 
        logout, 
        name: game.profileHandler.profile.name,
        xp: game.profileHandler.profile.xp,
        reqXp: game.profileHandler.profile.requiredXp,
        level: game.profileHandler.profile.level,
        progress: game.profileHandler.profile.progress,
        accID: game.profileHandler.profile.id,
        avatarLink: game.profileHandler.profile.avatarLink
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#profile {
    width: 350px;
    height: 210px;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto auto;

    background-color: #191c24;

    border-radius: 10px;
}





.profileAvatar {
    width: 128px;
    height: 128px;

    position: absolute;
    top: 15px;
    left: 5px;

    
    border-radius: 50%;
    
    z-index: 1;
}
.avatarOverlay {
    width: 90px;
    height: 90px;

    position: absolute;
    top: 53%;
    left: 53%;
    transform: translate(-50%, -50%);

    color: white;
    font-family: 'Quicksand';
    font-size: 24px;
    text-align: center;
    line-height: 90px;
    /* background-color: black; */

    opacity: 0;
    border-radius: 50%;
    transition: opacity 0.3s;
    z-index: 1;
}
.avatarOverlay:hover {
    opacity: 0;
}
.avatarImage {
    width: 90px;
    height: 90px;

    position: absolute;
    top: 53%;
    left: 53%;
    transform: translate(-50%, -50%);

    padding: 0;
    border-radius: 50%;
    z-index: -1;
}
.xpCircleHolder {
    overflow: visible;
    opacity: 0.8;
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


.profileInfo {
    width: 340px;
    height: 150px;

    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);

    background-color: #1013187e;

    border-radius: 10px;
}
.profileRow {
    width: 100%;
    height: 35px;

    font-family: 'Quicksand';
    font-size: 14px;

    margin-top: 11px;
    line-height: 35px;
    margin-bottom: 10px;
}
.profileKey {
    color: white;
    margin-left: 140px;
}
.profileValue {
    color: rgb(177, 176, 176);
    position: absolute;
    right: 0;
    margin-right: 5px;
}




.profileBtn {
    width: 165px;
    height: 40px;

    color: white;
    font-family: 'Quicksand';
    font-size: 18px;

    border: none;
    outline: none;
    border-radius: 10px;
}
.profileBtn:hover {
    opacity: 0.8;
    cursor: pointer;
}
#closeProfileBtn {
    position: absolute;
    bottom: 5px;
    right: 5px;

    background-color: #4480d4;
}
#logoutBtn {
    position: absolute;
    bottom: 5px;
    left: 5px;

    background-color: #bb0909;
}
</style>

<template>
  <div id="profile">
    <div class="profileInfo">
        <div class="profileRow">
            <span class="profileKey">
                Name:
                <span class="profileValue">{{ name }}</span>
            </span>
        </div>
        <div class="profileRow">
            <span class="profileKey">
                Xp:
                <span class="profileValue">{{ xp }}</span>
            </span>
        </div>
        <div class="profileRow">
            <span class="profileKey">
                Coins:
                <span class="profileValue">{{ coins }}</span>
            </span>
        </div>
    </div>
    <button id="closeProfileBtn" class="profileBtn" @click="closeProfile">Close</button>
    <button id="logoutBtn" class="profileBtn" @click="logout">Logout</button>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted} from 'vue';

export default {
  name: 'Profile',
  props: ['game'],
  setup() {
    const self = getCurrentInstance();
    const game = self.props.game;

    onMounted(() => {
        game;
    });

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
        coins: game.profileHandler.profile.coins
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#profile {
    width: 350px;
    height: 350px;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto auto;

    background-color: #191c24;

    border-radius: 10px;
}



.profileInfo {
    width: 340px;
    height: 290px;

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

    line-height: 35px;
    margin-bottom: 10px;
}
.profileKey {
    color: white;
    margin-left: 5px;
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

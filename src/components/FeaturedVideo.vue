<template>
  <div id="featuredVideo">
      <iframe id="video" :src="videoEmbedLink" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <div id="closeBtn" @click="closeFeaturedVideo">Close</div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'FeaturedVideo',
  setup() {
    const self = getCurrentInstance();
    const EventHandler = self.appContext.config.globalProperties.EventHandler;
    const videoEmbedCode = 'CmKa4QAUNTA';
    const videoEmbedLink = `https://www.youtube.com/embed/${videoEmbedCode}`;

    const closeFeaturedVideo = () => {
        EventHandler.emit('closeFeaturedVideo');
    }

    return { closeFeaturedVideo, videoEmbedLink }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#featuredVideo {
    width: 600px;
    height: 450px;

    background-color: #191c24;

    position: absolute;
    top: 125px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0 auto;

    border-radius: 15px;

    pointer-events: none;
    opacity: 0;
    overflow: hidden;
}

#video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 600px;
    height: 390px;
}

#closeBtn {
    width: 100%;
    height: 60px;

    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    color: white;
    font-size: 20px;
    font-family: 'Quicksand';
    background-color: #bb0909;

    text-align: center;
    line-height: 60px;
}
#closeBtn:hover {
    cursor: pointer;
    opacity: 0.8;
}
</style>

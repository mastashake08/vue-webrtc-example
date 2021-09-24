<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <vue-webrtc width="100%" :roomId="roomId" ref="webrtc" />
    <input v-model="roomId" placeholder="Enter room ID"/>
    <button @click="toggleRoom">{{hasJoined ? 'Leave Room' : 'Join Room'}}</button>
    <button @click="screenShare" v-if="hasJoined">Screen Share</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      roomId: 'roomId',
      hasJoined: false
    }
  },
  mounted () {

  },
  methods: {
    toggleRoom () {
      if(this.hasJoined) {
        this.$refs.webrtc.leave()
        this.hasJoined = false
      } else {
      this.$refs.webrtc.join()
      this.hasJoined = true
      }
    },
    screenShare () {
      this.$refs.webrtc.shareScreen()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

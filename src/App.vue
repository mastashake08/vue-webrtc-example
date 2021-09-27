<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <vue-webrtc width="100%" :roomId="roomId" ref="webrtc" v-on:share-started="shareStarted"  v-on:share-stopped="leftRoom" v-on:left-room="leftRoom" v-on:joined-room="joinedRoom"/>
    <input v-model="roomId" placeholder="Enter room ID"/>
    <button @click="toggleRoom">{{hasJoined ? 'Leave Room' : 'Join Room'}}</button>
    <button @click="screenShare" v-if="hasJoined">Screen Share</button>
    <button @click="record" v-if="hasJoined">Record</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      roomId: 'roomId',
      hasJoined: false,
      mediaRecorder: null,
      chunks: [],
      userStream: null
    }
  },
  mounted () {},
  methods: {
    onStop () {
      var blob = new Blob(this.chunks, { 'type' : 'video/webm' }); // other types are available such as 'video/webm' for instance, see the doc for more info
      this.chunks = [];
      const file = new File ([blob], 'meeting.mp4', { 'type' : 'video/webm' })
      console.log(file)
      var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'meeting.webm';
        document.body.appendChild(a);
        a.click()
    },
    pushData (e) {
      this.chunks.push(e.data);
      console.log(e.data)
    },
    record () {
      this.mediaRecorder.start()
    },
    async toggleRoom () {
      try {
        if(this.hasJoined) {
          this.$refs.webrtc.leave()
          this.hasJoined = false
          this.mediaRecorder.stop()
        } else {
          await this.$refs.webrtc.join()
          this.userStream = this.$refs.webrtc.videoList[0].stream
          this.mediaRecorder = new MediaRecorder(this.userStream)
          this.mediaRecorder.ondataavailable = e => this.pushData(e)
          this.mediaRecorder.onstop = () => this.onStop()
          this.hasJoined = true
        }
      } catch (e) {
        console.log(e)
      }

    },
    screenShare () {
      this.$refs.webrtc.shareScreen()
    },
    addTrack(streamId) {
      try {
        console.log(streamId)
        const streams = this.$refs.webrtc.videoList
        console.log(streams)
        streams.forEach(stream => {
          console.log(stream.stream)
          this.userStream.addTrack(stream.stream)
        })
      } catch (e) {
          console.log(e)
      }
    },
    joinedRoom (streamId) {
      this.addTrack(streamId)
    },
    shareStarted (streamId) {
      this.addTrack(streamId)
    },
    leftRoom (streamId) {
      console.log(streamId)
      // this.mediaRecorder.removeTrack(streamId)
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

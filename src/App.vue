<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/default-monochrome-white.svg" class="animate-fade-slow object-contain h-80 w-full">
    <Adsense
      data-ad-client="ca-pub-7023023584987784"
      data-ad-slot="5070366491">
    </Adsense>
    <p>
      J Comp Meet is a free open source WebRTC meeting application written in Vue.js. Simply enter
      a meeting room ID and connect to anyone else in that room! You can even share your screen
      if you are on desktop! Future functionality will include:
      <ul>
        <li> Record meeting </li>
        <li> Text chat </li>
        <li> Send files </li>
        <li> And more! </li>
      </ul>
    </p>
    <input v-model="roomId" placeholder="Enter room ID" id="room-input"/>
    <br>
    <button @click="copyClipboard">Share Meeting</button>
    <vue-webrtc id="call-canvas" width="100%" :roomId="roomId" ref="webrtc" v-on:share-started="shareStarted"  v-on:share-stopped="leftRoom" v-on:left-room="leftRoom" v-on:joined-room="joinedRoom"/>
    <button type="button" id="join-btn" @click="toggleRoom">{{hasJoined ? 'Leave Room' : 'Join Room'}}</button>
    <button type="button" id="screen-share-btn" @click="screenShare" v-if="hasJoined">Screen Share</button>
    <!-- <button @click="record" v-if="hasJoined" v->Record</button> -->
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
  mounted () {
    const hash =  window.location.hash
    if(hash != '') {
      this.roomId = hash.substring(1)
      this.toggleRoom()
    }
  },
  methods: {
    onStop () {
      var blob = new Blob(this.chunks, { 'type' : 'video/webm' }); // other types are available such as 'video/webm' for instance, see the doc for more info
      this.chunks = [];
      const file = new File ([blob], 'meeting.webm', { 'type' : 'video/webm' })
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
    async addTrack(streamId) {
      try {
        console.log(streamId)
        const streams = this.$refs.webrtc.videoList
        console.log(streams)
        streams.forEach(stream => {
          console.log(stream.getTracks())
          this.userStream.addTrack(stream)
        })
      } catch (e) {
          console.log(e)
      }
    },
    joinedRoom (streamId) {
      // this.addTrack(streamId)
      console.log(streamId)
    },
    shareStarted (streamId) {
      console.log(streamId)
      // this.addTrack(streamId)
    },
    leftRoom (streamId) {
      // this.mediaRecorder.removeTrack(streamId)
      console.log(streamId)
    },
    async copyClipboard () {
      await navigator.clipboard.writeText(`https://meet.jcompsolu.com/#${this.roomId}`)
      alert('Link copied to clipboard!')
    }
  }
}
</script>

<style>
#room-input {
  margin-bottom: 3px;
}
#call-canvas {
  background-color: transparent;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#join-btn {
  margin: 4px 2px;
}
body {
  background-image: linear-gradient(to bottom right, #E9007F, #FEA134);
}
img {
  height: 80px;
  width: 100%;
}
</style>

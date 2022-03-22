<template>
  <div id="app">
    <div class="bg-black-50">
      <img alt="J Comp Meet Logo" src="./assets/default-monochrome-white.svg" class="object-scale-down h-48 w-96">
    </div>
    <Adsense
      data-ad-client="ca-pub-7023023584987784"
      data-ad-slot="5070366491">
    </Adsense>

    <div class="flex mb-4 mt-4 ml-4 mr-4 pb-4">
        <div class="w-full content-center h-12">
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="room-input">
                Room ID
              </label>
              <input v-model="roomId" placeholder="Enter room ID" id="room-input" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
          <div class="flex items-center justify-between">
            <button type="button" @click="copyClipboard" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Share Meeting</button>
            <button type="button" id="join-btn" @click="toggleRoom" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{{hasJoined ? 'Leave Room' : 'Join Room'}}</button>
            <button type="button" id="screen-share-btn" @click="screenShare" v-if="hasJoined" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Screen Share</button>

            <button type="button" @click="record" v-if="hasJoined" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Record</button>
          </div>
          <vue-webrtc id="call-canvas" :roomId="roomId" ref="webrtc" v-on:share-started="shareStarted"  class="w-full" v-on:share-stopped="leftRoom" v-on:left-room="leftRoom" v-on:joined-room="joinedRoom" width="100%"/>
          <p class="content-center">
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
        </form>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      roomId: 'roomId',
      hasJoined: false,
      mediaRecorder: {},
      chunks: [],
      userStream: {}
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
      var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'meeting.webm';
        document.body.appendChild(a);
        a.click()
    },
    pushData (e) {
      this.chunks.push(e.data);
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
        alert(e)
      }

    },
    screenShare () {
      try {
        this.$refs.webrtc.shareScreen()
      } catch (e) {
        alert('Screen share not available')
      }
    },
    async addTrack() {
      try {
        const streams = this.$refs.webrtc.videoList
        streams.forEach(stream => {
          this.userStream.addTrack(stream)
        })
      } catch (e) {
          alert(e)
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
    },
    async share () {
    const shareData = {
        title: 'J Comp Meet',
        text: 'Join my meeting!',
        url: `https://meet.jcompsolu.com/#${this.roomId}`
      }
      try {
      await navigator.share(shareData)
      } catch(err) {
      this.copyClipboard()
      }
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

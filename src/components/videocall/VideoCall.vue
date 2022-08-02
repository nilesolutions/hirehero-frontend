<template>
  <div class="video-call">
    <v-dialog v-model="vidCallState.isInCall" class="video-call-popup" persistent fullscreen>
      <div class="outer-box">

        <div :class="['inner-box', isMessageBoxOpen ? 'inner-box-open-width' : 'inner-box-close-width']">
          <v-card>
          <v-card-title class="d-flex flex-row align-center">
            <span>Call</span>
            <v-btn class="ml-auto" icon @click="handleCallTermination('Call Closed')">
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
          </v-card-title>

          <div class="video-preview-boxes">
            <video class="col-6 video-preview" ref="localVideoPreview" muted autoplay></video>
            <video class="col-6 video-preview" ref="remoteVideoPreview" autoplay></video>
          </div>

          <v-card-actions class="d-flex flex-row justify-center margin-top">

            <v-btn @click="muteMic" icon color="primary" large outlined>
              <!-- readyScreenSharingStream -->
              <v-icon>
                {{ vidCallState.isMicEnabled ? icons.mdiMicrophone : icons.mdiMicrophoneOff }}
              </v-icon>
            </v-btn>

            <v-btn @click="startScreenShare" icon color="primary" large outlined>
              <v-icon>
                {{ vidCallState.isScreenSharing ? icons.mdiCastOff   : icons.mdiCast}}
              </v-icon>
            </v-btn>

            <v-btn @click="disableCam" icon color="primary" large outlined>
              <v-icon>
                {{ vidCallState.isCamEnabled ? icons.mdiCamera : icons.mdiCameraOff }}
              </v-icon>
            </v-btn>

            <v-btn @click="toggleBox" icon color="primary" large outlined>
              <v-icon>
                {{ icons.mdiMessageBulleted  }}
              </v-icon>
            </v-btn>

            <v-btn
              rounded
              icon
              outlined
              color="warning"
              @click="handleCallTermination('Call Closed')"
            >
              <v-icon>{{ icons.mdiPhoneHangup }}</v-icon>
            </v-btn>
          </v-card-actions>
          </v-card>
        </div>

        <div :class="['chat-box', isMessageBoxOpen ? 'chat-open' : 'chat-close']">

        <!-- Header -->
          <div class="chat-box-header">
            <div class="chat-box-inner-header">
              <h3>Chat</h3>
              <v-icon class="close-icon" @click="toggleBox">{{icons.mdiClose}}</v-icon>
            </div>
          </div>

        <!-- Messages Logs -->

        <div class="message-log-box">
          <MessagesLog :showHeader=false height="642px" :OverFlowScroll=true />
        </div>

        <!-- Send Message TextBox & Button -->

          <div class="send-message-box">
            <SendMessage :attachment="false" :recording="false" />
          </div>
        </div>

<!--
        <div :class="['inner-box-chat',isMessageBoxOpen ? 'chat-open' : 'chat-close']">
          <div class="box-header" @click="toggleBox">
            <div class="adjust-header">
              <h4 class="heading-color">Chat</h4>
              <v-icon class="arrowicon">{{ isMessageBoxOpen ? icons.mdiChevronDown : icons.mdiChevronUp }}</v-icon>
            </div>
          </div>

          <div :class="['bb', !isMessageBoxOpen ? 'display-none' : '']">
          <div style="position:relative !important ; background-color:red;">
            <v-card class="chat-wrapper ">
              <messages-log></messages-log>
              <send-message></send-message>
            </v-card>
          </div>
            <div class="sendMessageBox">
            <v-text-field
            placeholder="Message"
            multi-line
          ></v-text-field>
          <button class="mx-1 my-0 sendButton">
            <v-icon color="primary">
                {{icons.mdiSend }}
            </v-icon>
          </button>
            </div>

          </div>

        </div> -->


      </div>
    </v-dialog>
  </div>
</template>

<script>
import { useUser } from "@/composables/user/user";
import { useVideoCall } from "@/composables/chat/videocall";
import { useMessages } from "@/composables/chat/messages";
import MessagesLog from "@/components/inbox/MessagesLog.vue";
import SendMessage from "@/components/inbox/SendMessage.vue";
import {computed, ref} from '@vue/composition-api'


import {
  mdiClose,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiCamera,
  mdiCameraOff,
  mdiPhoneHangup,
  mdiCast,
  mdiCastOff,
  mdiSend ,
  mdiMessageBulleted ,
  mdiChevronDown,mdiChevronUp
} from "@mdi/js";

export default {
    name: "VideoCall",
    setup() {
        const { localVideoPreview, remoteVideoPreview, handleCallTermination, disableCam, muteMic, readyScreenSharingStream, screenSharingOnOff, shareScreen, startScreenShare, state: vidCallState, } = useVideoCall();
        const { userName } = useUser();
        const { associatedUser } = useMessages();
        const isMessageBoxOpen = ref(false);
        const toggleBox = () => isMessageBoxOpen.value = !isMessageBoxOpen.value;
        return {
            toggleBox,
            isMessageBoxOpen,
            handleCallTermination,
            vidCallState,
            readyScreenSharingStream,
            screenSharingOnOff,
            mdiChevronUp,
            muteMic,
            disableCam,
            localVideoPreview,
            remoteVideoPreview,
            userName,
            associatedUser,
            shareScreen,
            startScreenShare,
            SendMessage,
            isMessageBoxOpen,
            icons: {
                mdiClose,
                mdiMessageBulleted,
                mdiMicrophone,
                mdiMicrophoneOff,
                mdiCamera,
                mdiCameraOff,
                mdiChevronUp,
                mdiPhoneHangup,
                mdiCast,
                mdiCastOff,
                mdiChevronDown,
                mdiSend
            },
        };
    },
    components: { MessagesLog,SendMessage }
};
</script>

<style scoped>

/* Latest Code START */
.v-card__text.d-flex.flex-column{
  padding:0px 0 !important;
}
.outer-box{
  position:fixed;
  width: 100%;
  display: flex !important;
  flex-direction: row !important;
}

.inner-box{
  width: 77% !important;
}

.inner-box-open-width{
  width: 77% !important;
}

.inner-box-close-width{
  width: 100% !important;
}

.chat-box{
  border-left:1px solid rgb(232, 232, 232);
  position:relative;
  /* z-index: -1; */
  height: 100vh !important;
  width:23% !important;
  background: #fff;
}

.chat-box-header{
  width: 100%;
  background: white;
  padding: 1rem 1rem 0.5rem 1rem;
  box-shadow: 0px 2px 10px -3px rgba(0,0,0,0.1) !important;
}

.chat-box-inner-header{
  display: flex;
  justify-content: space-between;
  align-items:center;
}

.close-icon{
  display: none;
}

.chat-open{
  right: 0 !important;
}

.chat-close{
  right: -23% !important;
}

.send-message-box{
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  /* background: bisque; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width:100%;
  padding:0.5rem 1rem 1rem 1rem !important;

}

.send-message-box > #inputMessageBox {
  text-indent: 0.7rem;
  font-size: 1rem;
  border-radius: 1rem;
  height: 2.5rem !important;
  width :85%;
  border:2px solid  bisque;
  box-shadow: 0px 8px 14px -3px rgba(0,0,0,0.1);
  /* outline-color: rgb(172, 172, 172); */

}

.send-message-box > #inputMessageBox:focus{
  outline-color: #f34c57;
}

.send-message-box > #sendButton{
  border-radius: 100%;
  background: bisque;
  height: 2.45rem;
  width: 2.45rem;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 8px 14px -3px rgba(0,0,0,0.1);
}

.send-message-box > #sendButton > span{
  width:20px !important;
  height: 20px !important;
  left:2px;
}

.message-log-box{
  /* background: #f34c57; */
  width: 100% !important;
  height: 83.5% !important;
  overflow-y: scroll;
}

.message-log-box::-webkit-scrollbar{
  display: none !important;
}

.message-log-box{
  padding: 0.2 rem 0;
}

.v-dialog{
  padding: 0 !important;
}

.v-application.pt-5{
  padding: 0 !important;
}
/* Latest Code END */



.display-none{
  display: none !important;
}
.sendBtn{
  border: none;
  background: #fff;
}
.v-dialog--fullscreen{
 position: unset !important;
}
.sendMessageBox > .input-box{
  width:100%;
  height:3rem !important;

  align-items: center;
}

.bb{
  height:90%;
}
.sendMessageBox{
    display: flex !important;
  flex-direction: row !important;
  position: absolute;
  bottom:0;
  width:90%;
  /* background-color:green; */
}

.arrowicon{
  z-index: 1;
}
.heading-color{
  color: rgb(57, 57, 57) !important;
}

.box-header{
  height: 35px !important;
  cursor: pointer;
  border-bottom: 0.5px solid rgb(190 190 190 / 10%);
}
.adjust-header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

}
.inner-box-chat{
  width: 22rem;
  position: absolute;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0px 0px 37px 2px rgba(0,0,0,0.08);
  background: #fff;
  right:1rem;
  padding: 1rem 1rem 0 1rem;
  bottom: 0;
  animation: ease-in-out;
  animation-duration: 5s;
  /* animation-delay: 5s; */
}

.inner-box > .v-card.v-sheet.theme--light{
  height: 100vh !important;
  width:100vw !important;
  border-radius: 0 !important;
}
.video-preview-boxes{
  display: flex;
  flex-direction: row;
}

.margin-top{
  width: 100%;
  padding-top:20px !important;
  position: absolute;
  bottom: 0;
}

@media(max-width:600px){
  .video-preview-boxes{
    flex-direction: row-reverse !important;
}
.video-preview-boxes > video {
  max-width: 50% !important;
}
.chat-box{
  width:25% !important;
}
.inner-box-open-width{
  width: 75% !important;
}

}


@media (max-width:768px){

.send-message-box{
  position: fixed !important;
}
.message-log-box{
  height: 82% !important;
}
.send-message-box > #inputMessageBox {
  height: 3rem !important;
  border-radius: 2rem !important;
}

.send-message-box > #sendButton{
  height: 3rem;
  width: 3rem;

}
.inner-box > .v-card.v-sheet.theme--light{
  min-height:100vh !important;
  height:auto !important
}
.chat-close{
  display: none !important;
}
.close-icon{
  display: block;
}
.chat-box{
  position:fixed !important;
  height: 100vh !important;
  width:100% !important;
  top: 0;
  left:0;
  right:0;
  bottom:0;

}
.inner-box-open-width{
  width: 100% !important;
}

.inner-box-close-width{
  width: 100% !important;
}
.video-preview-boxes{
  flex-direction: column-reverse !important;
  justify-content: center !important;
  align-items: center !important;
  width:100%;

}
.video-preview-boxes > video {
  max-width: 100% !important;
}
.inner-box-chat{
  width: 100%;
  height: 29rem;
  box-shadow: 0px -6px 20px -10px rgba(0,0,0,0.1);
  right:0;
  bottom: 0;
}
}

.video-call {
  position: absolute;
  left: 0;
  background-color: #fff;
  top: 0;
}

.video-preview {
  width: 300px;
  border-radius: 6px;
}
</style>

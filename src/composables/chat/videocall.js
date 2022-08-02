import { usePusher } from "@/composables/pusher";
import { computed, reactive, ref } from "@vue/composition-api";
import { Peer } from "peerjs";
import { useUser } from "../user/user";
import { useMessages } from "./messages";

const { userName ,userId} = useUser();

const { state: msgsState } = useMessages();
const { debugActiveChannels, triggerEvent } = usePusher();

window.RTCIceCandidate =
  window.RTCIceCandidate ||
  window.webkitRTCIceCandidate ||
  window.mozRTCIceCandidate ||
  window.msRTCIceCandidate;

window.RTCPeerConnection =
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.msRTCPeerConnection;

window.RTCSessionDescription =
  window.RTCSessionDescription ||
  window.webkitRTCSessionDescription ||
  window.mozRTCSessionDescription ||
  window.msRTCSessionDescription;

const state = reactive({
  isInCall: false,
  isBeingCalled: false,
  isPeerOnline: false,

  peer: new Peer(),
  activeCall: null,

  activeMediaStream: null,
  activeScreenMediaStream: null,
  screenStream:null,

  isMicEnabled: false,
  isCamEnabled: false,
  isScreenSharing:false,
  currentPeer:null,

  recepientId: null,
  incomingCallRequest: {},
  rtc: new RTCPeerConnection(),
  candidateBuffer: [],
});

const localVideoPreview = ref(null);
const remoteVideoPreview = ref(null);


function initRTC() {
  state.rtc = null;
  state.rtc = new RTCPeerConnection();

  state.rtc.onicecandidate = (event) => {
    if (event.candidate) {
      triggerEvent(peerChannel.value, "client-candidate", {
        candidate: event.candidate,
      });
    }
  };

  state.rtc.ontrack = (event) => {
    console.log("Track added", event.streams[0]);
    remoteVideoPreview.value.srcObject = event.streams[0];
  };

  state.rtc.oniceconnectionstatechange = function () {
    console.log("ICE state: ", state.rtc.iceConnectionState);
    console.log(state.rtc.iceGatheringState);
  };
}

initRTC();

async function readyMediaStream() {
  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    state.activeMediaStream = stream;
    state.activeMediaStream.getAudioTracks()[0].enabled = true;
    state.activeMediaStream.getVideoTracks()[0].enabled = true;

    state.isCamEnabled = true;
    state.isMicEnabled = true;

  } catch (err) {
    console.log(err);
    alert("Please check camera & mic permissions");
    handleCallTermination("Other party failed to connect");
    throw err;
  }
}

async function initCall() {
  try {
    console.log('Init Call User : ', userId)
    state.isInCall = true;

    await readyMediaStream();
    setLocalVideoPreview(state.activeMediaStream)

    triggerEvent(peerChannel.value, "client-call-handshake", {
      peerId: state.peer.id,
      name: userName.value,
    });

  } catch (err) {
    console.log(err);
  }

  state.peer.on("call", (call) => {
    console.log('CALL HERE')
    state.activeCall = call;
    state.activeCall.answer(state.activeMediaStream);
    state.currentPeer = call
    streamVideoRemotely()
  });

}

async function answerCall() {
  console.log('Answer Call',userId)
  try {
    state.isInCall = true;
    await readyMediaStream();
    setLocalVideoPreview(state.activeMediaStream);
    state.activeCall = state.peer.call(state.incomingCallRequest.peerId, state.activeMediaStream);
    state.currentPeer = state.activeCall
    streamVideoRemotely()

  } catch (err) {
    console.log(err);
  }
}



// Set stream to local & remote video preview

function setLocalVideoPreview(stream){
  console.log('localVideoPreview.value.srcObject Before : ',localVideoPreview.value.srcObject)
  localVideoPreview.value.srcObject = stream
  console.log('localVideoPreview.value.srcObject After : ',localVideoPreview.value.srcObject)
}

function setRemoteVideoPreview(stream){
  remoteVideoPreview.value.srcObject = stream
}

function streamVideoRemotely(){
  state.activeCall.on("stream", (stream) => {
    console.log('Media Stream : ',stream)
    setRemoteVideoPreview(stream)
  });

}

function startScreenShare() {
  if (state.isScreenSharing) {
      stopScreenSharing()
      state.isScreenSharing = false
  }
  else{
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      state.screenStream = stream;
      let videoTrack = state.screenStream.getVideoTracks()[0];
      videoTrack.onended = () => {
          stopScreenSharing()
      }
      if (state.peer) {
          let sender = state.currentPeer.peerConnection.getSenders().find(function (s) {
              return s.track.kind == videoTrack.kind;
          })
          sender.replaceTrack(videoTrack)
          state.isScreenSharing = true
      }
      console.log(state.screenStream)
  })
  }

}

function stopScreenSharing() {
  if (!state.isScreenSharing) return;
  let videoTrack = state.activeMediaStream.getVideoTracks()[0];
  if (state.peer) {
      let sender = state.currentPeer.peerConnection.getSenders().find(function (s) {
          return s.track.kind == videoTrack.kind;
      })
      sender.replaceTrack(videoTrack)
  }
  state.screenStream.getTracks().forEach(function (track) {
      track.stop();
  });
  state.isScreenSharing = false
}




const updatePeerStatus = (status) => {
  state.isPeerOnline = status;
  console.log('updatePeerStatus : ' , status)
}

const peerChannel = computed(() => {
  return `presence-video-call-${msgsState.associatedUser.id}`;
});

function clearMediaStream() {
  if (state.activeMediaStream) {
    state.activeMediaStream.getTracks().forEach((track) => track.stop());
    state.activeMediaStream = null;
  }
}



// Buttons

function muteMic() {
  const micStatus = state.activeMediaStream.getAudioTracks()[0].enabled;

  state.activeMediaStream.getAudioTracks()[0].enabled = !micStatus;
  state.isMicEnabled = !micStatus;
}

function disableCam() {
  const camStatus = state.activeMediaStream.getVideoTracks()[0].enabled;

  state.activeMediaStream.getVideoTracks()[0].enabled = !camStatus;
  state.isCamEnabled = !camStatus;
}

// Buttons

function handleIncomingHandshake(request) {
  console.log('handleIncomingHandshake : ', request)
  state.isBeingCalled = true;
  state.incomingCallRequest = request;
}

async function handleCallAnswer(event) {
  console.log("Recieved call answer");
}

function handleIceCandidate(event) {
  if (!state.rtc.remoteDescription) {
    state.candidateBuffer.push(event.candidate);
    return;
  }

  if (state.candidateBuffer.length) {
    for (var candidate of state.candidateBuffer) {
      state.rtc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    state.candidateBuffer = [];
  }

  state.rtc.addIceCandidate(new RTCIceCandidate(event.candidate));
}


function handleCallTermination(message) {
  triggerEvent(peerChannel.value, "client-call-end", {
    message,
  });
  endCall();
}

async function endCall(event) {
  state.isInCall = false;
  state.isBeingCalled = false;

  clearMediaStream();
  //initRTC();

  state.incomingCallRequest = {};

  if (state.activeCall) {
    state.activeCall.close();
    state.activeCall = null;
  }

  if (localVideoPreview.value) {
    localVideoPreview.value.srcObject = null;
  }

  if (remoteVideoPreview.value) {
    remoteVideoPreview.value.srcObject = null;
  }

  if (event?.message) {
    alert(event.message);
  }
}

export function useVideoCall() {
  return {
    state,

    initCall,
    answerCall,
    endCall,

    muteMic,
    disableCam,

    handleCallAnswer,
    handleIncomingHandshake,
    handleIceCandidate,
    handleCallTermination,


    updatePeerStatus,

    localVideoPreview,
    remoteVideoPreview,
    startScreenShare,
    stopScreenSharing

  };
}

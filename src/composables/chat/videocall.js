import { usePusher } from "@/composables/pusher";
import { computed, reactive, ref } from "@vue/composition-api";
import { useUser } from "../user/user";
import { useMessages } from "./messages";

const { userName } = useUser();

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

  activeMediaStream: null,
  isMicEnabled: false,
  isCamEnabled: false,

  recepientId: null,
  incomingCallRequest: {},

  rtc: new RTCPeerConnection(),
  candidateBuffer: [],
});

const localVideoPreview = ref(null);
const remoteVideoPreview = ref(null);

const micStatus = computed(() => {
  if (!state.activeMediaStream) return false;
  return state.activeMediaStream.getAudioTracks()[0].enabled;
});

const isCamDisabled = computed(() => {
  if (!state.activeMediaStream) return false;
  return state.activeMediaStream.getVideoTracks()[0].enabled;
});

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
}

initRTC();

const updatePeerStatus = (status) => (state.isPeerOnline = status);

const peerChannel = computed(() => {
  return `presence-video-call-${msgsState.associatedUser.id}`;
});

async function readyMediaStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    state.activeMediaStream = stream;
    state.isCamEnabled = stream.getVideoTracks()[0].enabled;
    state.isMicEnabled = stream.getAudioTracks()[0].enabled;
  } catch (err) {
    console.log(err);
    alert("Please check camera & mic permissions");
    handleCallTermination("Other party failed to connect");
    throw err;
  }
}

function clearMediaStream() {
  if (state.activeMediaStream) {
    state.activeMediaStream.getTracks().forEach((track) => track.stop());
    state.activeMediaStream = null;
  }
}

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

async function initCall() {
  try {
    state.isInCall = true;

    await readyMediaStream();
    state.activeMediaStream
      .getTracks()
      .forEach((track) => state.rtc.addTrack(track, state.activeMediaStream));

    localVideoPreview.value.srcObject = state.activeMediaStream;

    const callOffer = await state.rtc.createOffer();
    await state.rtc.setLocalDescription(new RTCSessionDescription(callOffer));

    triggerEvent(peerChannel.value, "client-call-handshake", {
      sdp: callOffer,
      name: userName.value,
    });
    console.log(callOffer);
  } catch (err) {
    console.log(err);
  }
}

function handleIncomingHandshake(request) {
  state.isBeingCalled = true;
  state.incomingCallRequest = request;
}

async function handleCallAnswer(event) {
  try {
    await state.rtc.setRemoteDescription(new RTCSessionDescription(event.sdp));
  } catch (err) {
    console.log(err);
  }
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

async function answerCall() {
  try {
    state.isInCall = true;
    await readyMediaStream();
    state.activeMediaStream
      .getTracks()
      .forEach((track) => state.rtc.addTrack(track, state.activeMediaStream));

    localVideoPreview.value.srcObject = state.activeMediaStream;
    state.rtc.setRemoteDescription(new RTCSessionDescription(state.incomingCallRequest.sdp));

    const answer = await state.rtc.createAnswer();
    state.rtc.setLocalDescription(new RTCSessionDescription(answer));
    triggerEvent(peerChannel.value, "client-call-answer", {
      sdp: answer,
    });
  } catch (err) {
    console.log(err);
  }
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
  initRTC();

  state.incomingCallRequest = {};

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
  };
}

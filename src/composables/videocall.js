import { usePusher } from "@/composables/pusher";
import { computed, reactive, ref } from "@vue/composition-api";
import { useMessages } from "./messages";
import { useUser } from "./user";

const username = useUser().userName();

const { state: msgsState } = useMessages();
const { debugActiveChannels, triggerEvent } = usePusher();

const state = reactive({
  isInCall: false,
  isBeingCalled: false,
  incomingCallRequest: {},
  isPeerOnline: false,
  recepientId: null,
  rtc: new RTCPeerConnection(),
  activeMediaStream: null,
});

const localVideoPreview = ref(null);
const remoteVideoPreview = ref(null);

state.rtc.onicecandidate = (event) => {
  if (event.candidate) {
    triggerEvent(peerChannel.value, "client-candidate", {
      candidate: event.candidate,
    });
  }
};

state.rtc.onaddstream = (event) => {
  console.log("Stream added", event);
  remoteVideoPreview.value.srcObject = event.stream;
};

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
  } catch (err) {
    console.log(err);
  }
}

function clearMediaStream() {
  if (state.activeMediaStream) {
    state.activeMediaStream.getTracks().forEach((track) => track.stop());
    state.activeMediaStream = null;
  }
}

async function initCall() {
  try {
    state.isInCall = true;

    await readyMediaStream();
    state.rtc.addStream(state.activeMediaStream);
    localVideoPreview.value.srcObject = state.activeMediaStream;

    const callOffer = await state.rtc.createOffer();
    await state.rtc.setLocalDescription(new RTCSessionDescription(callOffer));

    triggerEvent(peerChannel.value, "client-call-handshake", {
      sdp: callOffer,
      name: username,
    });
    console.log(callOffer);
  } catch (err) {
    console.log(err);
  }
}

function handleIncomingHandshake(request) {
  console.log("Handling Handshake");
  state.isBeingCalled = true;
  state.incomingCallRequest = request;
}

async function handleCallAnswer(event) {
  try {
    console.log("Handling answer and setting remote description");
    await state.rtc.setRemoteDescription(new RTCSessionDescription(event.sdp));
  } catch (err) {
    console.log(err);
  }
}

function handleIceCandidate(event) {
  if (state.rtc.remoteDescription) {
    state.rtc.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

async function answerCall() {
  try {
    state.isInCall = true;
    await readyMediaStream();
    localVideoPreview.value.srcObject = state.activeMediaStream;

    console.log("Adding from answerCall", state.activeMediaStream);
    state.rtc.addStream(state.activeMediaStream);
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

function handleCallTermination() {
  debugActiveChannels();
  triggerEvent(peerChannel.value, "client-call-end", {});
  endCall();
}

async function endCall() {
  state.isInCall = false;
  state.isBeingCalled = false;
  clearMediaStream();
  state.incomingCallRequest = {};
  state.rtc = null;
  state.rtc = new RTCPeerConnection();
  localVideoPreview.value.srcObject = null;
  remoteVideoPreview.value.srcObject = null;
}

export function useVideoCall() {
  return {
    state,

    initCall,
    answerCall,
    endCall,

    handleCallAnswer,
    handleIncomingHandshake,
    handleIceCandidate,
    handleCallTermination,

    updatePeerStatus,

    localVideoPreview,
    remoteVideoPreview,
  };
}

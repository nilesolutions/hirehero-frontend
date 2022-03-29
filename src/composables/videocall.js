import { usePusher } from "@/composables/pusher";
import { computed, reactive, ref } from "@vue/composition-api";
import { useUser } from "./user";

const username = useUser().userName();
const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels, triggerEvent } =
  usePusher();

const state = reactive({
  isInCall: false,
  isBeingCalled: false,
  incomingCallRequest: {},
  associatedUser: {},
  recepientId: null,
  rtc: new RTCPeerConnection(),
  activeMediaStream: null,
});

const localVideoPreview = ref(null);
const remoteVideoPreview = ref(null);

state.rtc.onicecandidate = (event) => {
  if (event.candidate) {
    triggerEvent(recepientUserChannel.value, "client-candidate", {
      candidate: event.candidate,
    });
  }
};

state.rtc.onaddstream = (event) => {
  console.log("STREAM ADDED", event);
  remoteVideoPreview.value.srcObject = event;
  console.log(remoteVideoPreview.value.srcObject);
};

const recepientUserChannel = computed(() => {
  return `private-video-call-${state.associatedUser.id}`;
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

async function initCall(recepientId) {
  try {
    state.isInCall = true;
    await readyMediaStream();
    state.rtc.addStream(state.activeMediaStream);
    localVideoPreview.value.srcObject = state.activeMediaStream;
    console.log("LOCAL STREAM", state.activeMediaStream);

    const callOffer = await state.rtc.createOffer();
    await state.rtc.setLocalDescription(new RTCSessionDescription(callOffer));

    //state.recepientId = recepientId;

    triggerEvent(recepientUserChannel.value, "client-call-sdp", {
      sdp: callOffer,
      name: username,
    });
    console.log(callOffer);
  } catch (err) {
    console.log(err);
  }
}

async function handleIncomingCall(request) {
  state.isInCall = true;
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

async function handleCallRejection(event) {
  try {
    console.log("Handling rejection hhh", event);
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
    // Prepare media devices
    // & set remote connection from incoming call
    await readyMediaStream();
    localVideoPreview.value.srcObject = state.activeMediaStream;
    console.log("REMOTE STREAM TO BE SENT", state.activeMediaStream);
    state.rtc.addStream(state.activeMediaStream);
    state.rtc.setRemoteDescription(new RTCSessionDescription(state.incomingCallRequest.sdp));

    // Send answer and set it as local description
    const answer = await state.rtc.createAnswer();
    state.rtc.setLocalDescription(new RTCSessionDescription(answer));
    triggerEvent(recepientUserChannel.value, "client-call-answer", {
      sdp: answer,
    });

    console.log("Connection after sending the answer", state.rtc);
  } catch (err) {
    console.log(err);
  }
}

function handleCallTermination() {
  console.log("terminating call", recepientUserChannel.value);
  debugActiveChannels();
  triggerEvent(recepientUserChannel.value, "client-call-end", {});
  endCall();
}

async function endCall() {
  state.isInCall = false;
  state.isBeingCalled = false;
  clearMediaStream();
  state.incomingCallRequest = {};
  state.rtc = null;
  state.rtc = new RTCPeerConnection();
}

export function useVideoCall() {
  return {
    state,
    initCall,
    handleCallAnswer,
    handleCallRejection,
    handleIncomingCall,
    handleIceCandidate,
    handleCallTermination,
    answerCall,
    endCall,

    localVideoPreview,
    remoteVideoPreview,
  };
}

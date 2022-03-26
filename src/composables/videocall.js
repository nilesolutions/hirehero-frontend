import { usePusher } from "@/composables/pusher";
import { reactive } from "@vue/composition-api";

const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels, triggerEvent } =
  usePusher();

const state = reactive({
  isInCall: false,
  recepientId: null,
  rtc: new window.RTCPeerConnection(),
  activeMediaStream: null,
});

state.rtc.onicecandidate = (event) => console.log("ice candidate event", event);

async function startCall(recepientId) {
  try {
    const callOffer = await state.rtc.createOffer();
    const recepientUserChannel = `private-video-call-${recepientId}`;

    state.isInCall = true;
    state.recepientId = recepientId;
    state.activeMediaStream = await readyMediaStream();
    await state.rtc.setLocalDescription(new RTCSessionDescription(callOffer));

    triggerEvent(recepientUserChannel, "client-call-sdp", { sdp: callOffer.sdp });
    debugActiveChannels("From videocall composable");

    console.log(callOffer);
  } catch (err) {
    console.log(err);
  }
}

async function endCall() {
  const recepientUserChannel = `private-video-call-${state.recepientId}`;

  state.isInCall = false;
  state.recepientId = null;
  clearMediaStream();
  unsubscribeFromChannel(recepientUserChannel);
}

async function readyMediaStream() {
  try {
    const devices = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return devices;
  } catch (err) {
    console.log(err);
  }
}

function clearMediaStream() {
  if (state.activeMediaStream) {
    state.activeMediaStream.getTracks().forEach((track) => track.stop());
  }
}

export function useVideoCall() {
  return {
    state,
    startCall,
    endCall,
  };
}

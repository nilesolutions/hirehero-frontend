<template>
  <div>
    <messages-log-header v-if="showHeader"></messages-log-header>
    <v-divider></v-divider>

    <div :style="[messagesWrapper]" class="messagesWrapper">
      <ul :class="['messages-list',OverFlowScroll ? 'messagesListScroll' :'']" ref="msgsList" id="messages">
        <p class="py-4 px-4" v-show="!msgsState.messages.length">No messages yet</p>
        <chat-message v-for="msg in msgsState.messages" :key="msg.id" :msgData="msg"></chat-message>
      </ul>
    </div>

  </div>
</template>

<script>
import ChatMessage from "@/components/inbox/ChatMessage.vue";
import MessagesLogHeader from "@/components/inbox/MessagesLogHeader.vue";
import { useMessages } from "@/composables/chat/messages";
import { useVideoCall } from "@/composables/chat/videocall";
import { msgEvents } from "@/composables/event-listeners";
import { usePusher } from "@/composables/pusher";
import axios from "@axios";
import { mdiPhoneOutline } from "@mdi/js";
import { nextTick, onMounted, onUnmounted, reactive, ref } from "@vue/composition-api";

export default {
  name: "MessagesLog",
  updated() {
    // whenever data changes and the component re-renders, this is called.
    this.$nextTick(() => this.scrollToEnd());
  },

  methods: {
    scrollToEnd: function () {
      const ele = this.$el.querySelector("#messages");
      // scroll to the start of the last message
      ele.scrollTop = ele.lastElementChild.offsetTop;
    },
  },

  components: {
    ChatMessage,
    MessagesLogHeader,
  },
  props:{
    showHeader:{
      type:Boolean,
      default:false,
      required:true
    },
    OverFlowScroll:{
      type:Boolean,
      default:true,
      required:true
    },
    height:{
      type:String,
      default:'500px',
      required:true
    }
  },
  setup(props) {

    const { showHeader,height } = props
    const { state: vidCallState } = useVideoCall();
    const { subscribeToChannel, unsubscribeFromChannel } = usePusher();
    const {
      activeConversation,
      setMessages,
      state: msgsState,
      readMsgs,
      unreadMsgs,
    } = useMessages();

    const msgsList = ref(null);
    const scrollHeight = ref(0)

    const state = reactive({
      isLoading: false,
      msgText: "",
      realTimeCon: null,
    });

    // Dynamic Class

    const messagesWrapper = reactive({
      height:height
    })

    function scrollToBottom() {
      msgsList.value.scrollTop = msgsList.value.scrollHeight;
      scrollHeight.value = msgsList.value.scrollHeight
    }

    async function fetchMessages(conversationId) {
      try {
        state.isLoading = true;
        const { data: messages } = await axios.get(`conversations/${conversationId}`);
        setMessages(messages);
        nextTick(() => scrollToBottom());
        subscribeToChannel(`presence-${conversationId}`, msgEvents);
        console.log('FetchMessages')
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    onMounted(() =>{
      fetchMessages(activeConversation.value.id)

    });

    onUnmounted(() => {
      unsubscribeFromChannel(`presence-${activeConversation.value.id}`)

    });

    return {
      state,
      msgsState,
      msgsList,
      messagesWrapper,
      readMsgs,
      unreadMsgs,
      scrollToBottom,
      vidCallState,
      showHeader,
      scrollHeight,
      icons: {
        mdiPhoneOutline,
      },
    };
  },
};
</script>

<style lang="scss">

.messagesWrapper::-webkit-scrollbar{
  display: none !important;
}

.messages-list {
  list-style: none;
  padding: 0px !important;
  margin: 0px;
  height: 100%;
}
.messages-list::-webkit-scrollbar{
  display:none;
}
.messagesListScroll{
  overflow-y: scroll;
}
</style>

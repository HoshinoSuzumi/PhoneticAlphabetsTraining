<script lang="ts" setup>

import type {Message, MessageApi, MessageProviderApi, MessageType} from "~/components/uni/Message/index";

const props = defineProps({
  max: {
    type: Number,
    default: 5
  }
})

const nuxtApp = useNuxtApp()
const messageList = ref<Message[]>([])

const createMessage = (content: string, type: MessageType, duration: number = 3000) => {
  const {max} = props
  messageList.value.push({
    id: (Date.now() + Math.random() * 100).toString(32).toUpperCase(),
    content,
    type,
    duration
  })
  if (messageList.value.length > max) {
    messageList.value.shift()
  }
}

const providerApi: MessageProviderApi = {
  destroy: (id: string) => {
    messageList.value.splice(messageList.value.findIndex(message => message.id === id), 1)
  }
}

const api: MessageApi = {
  info: (content: string, duration: number = 3000) => {
    createMessage(content, 'info', duration);
  },
  success: (content: string, duration: number = 3000) => {
    createMessage(content, 'success', duration);
  },
  warning: (content: string, duration: number = 3000) => {
    createMessage(content, 'warning', duration);
  },
  error: (content: string, duration: number = 3000) => {
    createMessage(content, 'error', duration);
  },
  destroyAll: function (): void {
    throw new Error('Function not implemented.');
  }
}

nuxtApp.vueApp.provide('uni-message-provider', providerApi)
nuxtApp.vueApp.provide('uni-message', api)
</script>

<template>
  <slot/>
  <teleport to="body">
    <div id="message-provider">
      <div class="message-wrapper">
        <TransitionGroup name="message">
          <UniMessage v-for="(message, k) in messageList" :key="message.id" :message="message"/>
        </TransitionGroup>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
#message-provider .message-wrapper {
  @apply z-[50000] fixed inset-0 flex flex-col items-center pointer-events-none;
}

.message-move,
.message-leave-active {
  transition: all .6s ease;
}

.message-enter-active {
  transition: all .6s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.message-enter-from {
  filter: blur(2px);
  opacity: 0;
  transform: translateY(-100%);
}

.message-leave-to {
  filter: blur(6px);
  opacity: 0;
  transform: translateY(-20%);
}

.message-leave-active {
  position: absolute;
}
</style>

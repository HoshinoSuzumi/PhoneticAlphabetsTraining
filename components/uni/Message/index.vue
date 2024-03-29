<script lang="ts" setup>

import type {Message, MessageProviderApi} from "~/components/uni/Message/index";

const providerApi = inject<MessageProviderApi>('uni-message-provider')

const props = defineProps({
  message: {
    require: true,
    type: Object
  }
})

const message = ref<Message>(props.message as Message)

onMounted(() => {
  setTimeout(() => {
    providerApi?.destroy(message.value.id)
  }, message.value?.duration || 3000);
})
</script>

<template>
  <div class="message" :class="{
    '!text-blue-500 !border-blue-400 !bg-blue-50': message.type === 'info',
    '!text-emerald-500 !border-emerald-400 !bg-emerald-50': message.type === 'success',
    '!text-orange-500 !border-orange-400 !bg-orange-50': message.type === 'warning',
    '!text-rose-500 !border-rose-400 !bg-rose-50': message.type === 'error',
    [message.type]: message.type
  }">
    <UniIconCircleSuccess v-if="message.type === 'success'" class="text-xl" />
    <UniIconCircleWarning v-if="message.type === 'warning'" class="text-xl" />
    <UniIconCircleError v-if="message.type === 'error'" class="text-xl" />
    <UniIconCircleInfo v-if="message.type === 'info'" class="text-xl" />
    <span>
      {{ message.content }}
    </span>
  </div>
</template>

<style scoped>
.message {
  min-width: 80px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .2);
  @apply h-fit px-2 py-1.5 border bg-white border-gray-300 rounded-md text-gray-500 text-xs flex items-center gap-1.5 first-of-type:mt-2.5 mt-2.5 font-bold pointer-events-auto;
}

.message.info {
  box-shadow: 0 4px 12px rgba(59, 130, 246, .2);
}

.message.success {
  box-shadow: 0 4px 12px rgba(16, 185, 129, .2);
}

.message.warning {
  box-shadow: 0 4px 12px rgba(249, 115, 22, .2);
}

.message.error {
  box-shadow: 0 4px 12px rgba(244, 63, 94, .2);
}
</style>

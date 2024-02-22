<script setup lang="ts">
import {useMessage} from "~/composables/uni/useMessage";

const props = defineProps({
  hideIcon: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: String,
    default: '1em'
  },
  text: {
    type: String,
    required: true
  }
})

const message = useMessage()

const copied = ref(false)
const copied_timeout = ref()

const fuck_copy = () => {
  navigator.clipboard.writeText(props.text || '').then(() => {
    copied.value = true
    if (copied_timeout.value) clearInterval(copied_timeout.value)
    copied_timeout.value = setTimeout(() => copied.value = false, 1500)
  }).catch(e => {
    message.error(`复制失败`)
  })
}
</script>

<template>
  <div class="inline-flex items-center gap-0.5 cursor-pointer" @click="fuck_copy">
    <slot/>
    <Transition v-if="!hideIcon" name="icon" mode="out-in">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 24 24"
           class="text-neutral-500">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"/>
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
        </g>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 24 24"
           class="text-green-600">
        <defs>
          <mask id="lineMdCheckAll0">
            <g fill="none" stroke="#fff" stroke-dasharray="22" stroke-dashoffset="22" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2">
              <path d="M2 13.5l4 4l10.75 -10.75">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="22;0"/>
              </path>
              <path stroke="#000" stroke-width="4" d="M7.5 13.5l4 4l10.75 -10.75" opacity="0">
                <set attributeName="opacity" begin="0.2s" to="1"/>
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="22;0"/>
              </path>
              <path d="M7.5 13.5l4 4l10.75 -10.75" opacity="0">
                <set attributeName="opacity" begin="0.2s" to="1"/>
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="22;0"/>
              </path>
            </g>
          </mask>
        </defs>
        <rect width="24" height="24" fill="currentColor" mask="url(#lineMdCheckAll0)"/>
      </svg>
    </Transition>
  </div>
</template>

<style scoped>
.icon-enter-active,
.icon-leave-active {
  @apply transition duration-300;
}

.icon-enter-from,
.icon-leave-to {
  @apply opacity-0;
}
</style>
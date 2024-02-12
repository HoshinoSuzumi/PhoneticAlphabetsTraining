<script lang="ts" setup>
import type {PhoneticSet} from "~/components/AlphabetCard/index";
import type {PropType} from "vue";
import {useSpeech} from "~/composables/useSpeech";
import {useMessage} from "~/composables/uni/useMessage";

const tts = useSpeech()
const message = useMessage()

const props = defineProps({
  phonetics: {
    type: Array as PropType<PhoneticSet[]>,
    require: true,
    default: []
  }
})

const showIndex = ref(0)

const fuck_swap = () => {
  if (showIndex.value + 1 >= props.phonetics.length) {
    showIndex.value = 0
  } else {
    showIndex.value++
  }
}

const fuck_tts = (word: string) => {
  const ret = tts(word)
  if (ret === -2) message.info('请等待上则播完')
}
</script>

<template>
  <div>
    <div class="flex flex-row relative overflow-hidden justify-between rounded-lg bg-base-100 border shadow-sm">
      <Transition name="phonetic" mode="out-in">
        <div class="flex flex-col pl-2 py-2 pt-1" :key="showIndex">
          <h1 class="cursor-pointer hover:drop-shadow group" @click="fuck_tts(phonetics[showIndex].word)">
            <span class="text-2xl text-accent font-bold">{{ phonetics[showIndex].word.charAt(0).toUpperCase() }}</span>
            <span class="text-lg text-accent-content font-normal group-hover:text-accent">
              {{ phonetics[showIndex].word.slice(1) }}
            </span>
          </h1>
          <span class="text-xs text-neutral-400 font-ipa font-bold">{{ phonetics[showIndex].ipa }}</span>
        </div>
      </Transition>
      <div class="relative" v-if="phonetics.length > 1">
        <div class="absolute inset-0 -left-2 flex flex-col justify-center space-y-1 pointer-events-none">
          <div v-for="(phonetic, k) in phonetics" :key="k"
               class="w-1 h-1 rounded-full bg-neutral-content transition"
               :class="{'!bg-accent': k === showIndex}"></div>
        </div>
        <button class="h-full bg-neutral-content p-1 cursor-pointer" @click="fuck_swap">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phonetic-enter-active,
.phonetic-leave-active {
  @apply transition;
}

.phonetic-enter-from {
  @apply opacity-0 translate-y-4 scale-95;
}

.phonetic-leave-to {
  @apply opacity-0 -translate-y-4;
}
</style>

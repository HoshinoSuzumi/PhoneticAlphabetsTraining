<script lang="ts" setup>
import type {PhoneticSet} from "~/components/AlphabetCard/index";
import {computed, type PropType} from "vue";
import {useTTS} from "~/composables/useTTS";
import {useMessage} from "~/composables/uni/useMessage";

useHead({
  title: '字母解释法速查表 · HAM c5r'
})

const tts = useTTS()
const message = useMessage()

const props = defineProps({
  phonetics: {
    type: Array as PropType<PhoneticSet[]>,
    require: true,
    default: []
  },
  char: {
    type: String,
    default: ''
  },
  // number: {
  //   type: Number,
  //   default: NaN
  // }
})

const is_number = computed(() => {
  const char_code = props.char.charCodeAt(0)
  return '0'.charCodeAt(0) <= char_code && char_code <= '9'.charCodeAt(0)
})

const showIndex = ref(0)
const speaking = ref(false)

const fuck_swap = () => {
  if (showIndex.value + 1 >= props.phonetics.length) {
    showIndex.value = 0
  } else {
    showIndex.value++
  }
}

const fuck_tts = (word: string) => {
  tts.speech(word, {
    onstart: () => speaking.value = true,
    onend: () => speaking.value = false,
    onerror: (err) => err.error === 'interrupted' ? speaking.value = false : void 0,
    interrupt: true
  })
}
</script>

<template>
  <div>
    <div
        class="flex flex-row relative overflow-hidden justify-between rounded-lg bg-base-100 border shadow-sm border-neutral-content border-b-4">
      <Transition name="phonetic" mode="out-in">
        <div class="w-full flex flex-col p-2 pt-1" :class="{'pr-3': phonetics.length > 1}" :key="showIndex">
          <h1 class="w-fit cursor-pointer hover:drop-shadow group flex flex-row items-end"
              :class="{'space-x-1': is_number}"
              @click="fuck_tts(phonetics[showIndex].word)">
              <span class="text-2xl text-accent font-bold">
                {{ char.toUpperCase() }}
              </span>
            <span class="text-lg text-accent-content font-normal"
                  :class="{'!text-accent': speaking}">
                {{ phonetics[showIndex].word.slice(is_number ? 0 : 1) }}
              </span>
            <Transition name="fadeIn" mode="out-in">
              <IconVolume v-if="speaking" class="inline-block self-center text-lg text-accent ml-0.5 transition"/>
            </Transition>
          </h1>
          <div class="inline-flex justify-between items-center">
            <span class="text-xs text-neutral-400 font-ipa font-bold">{{ phonetics[showIndex].ipa }}</span>
            <span v-if="phonetics[showIndex].tag && phonetics.length > 1"
                  class="text-xs text-neutral-400 font-mono font-bold">
              {{ phonetics[showIndex].tag.label }}
            </span>
          </div>
        </div>
      </Transition>
      <div class="relative" v-if="phonetics.length > 1">
        <div class="absolute inset-0 -left-2 flex flex-col justify-center space-y-1 pointer-events-none">
          <button v-for="(phonetic, k) in phonetics" :key="k"
                  class="w-1 h-1 rounded-full bg-neutral-content transition pointer-events-auto"
                  :class="{'!bg-accent': k === showIndex}" @click="showIndex = k"></button>
        </div>
        <button class="h-full bg-neutral-content/50 p-1 cursor-pointer" @click="fuck_swap">
          <Transition name="swap-btn" mode="out-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :key="showIndex">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"/>
            </svg>
          </Transition>
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

.swap-btn-enter-active,
.swap-btn-leave-active {
  @apply transition;
}

.swap-btn-enter-from {
  @apply opacity-0 translate-y-1;
}

.swap-btn-leave-to {
  @apply opacity-0 -translate-y-1;
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  @apply transition duration-300;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
  @apply opacity-0;
}
</style>

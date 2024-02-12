<script setup lang="ts">
import type {fuck_tts} from "~/components/SpeechSynthesisProvider/index";

const synth = ref<SpeechSynthesis | null>(null)
const fuck_tts: fuck_tts = (
    content: string,
    rate: number = 1.0,
    pitch: number = 1.0,
    onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null = null
): number => {
  if (!content) return -1
  if (!synth.value) return -1
  if (synth.value.speaking) return -2

  const utterance = new SpeechSynthesisUtterance(content)
  utterance.pitch = pitch
  utterance.rate = rate

  if (onend) utterance.onend = onend

  synth.value.speak(utterance)
  return 0
}


provide('fuck_tts', fuck_tts)

onMounted(() => {
  synth.value = window.speechSynthesis

  const initSynth = () => {
    synth.value?.getVoices()
  }
  initSynth()

  if (synth.value.onvoiceschanged !== void 0) {
    synth.value.onvoiceschanged = initSynth
  }
})
</script>

<template>
  <slot/>
</template>

<style scoped>

</style>
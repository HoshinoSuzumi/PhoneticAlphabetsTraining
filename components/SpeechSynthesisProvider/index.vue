<script setup lang="ts">
import type {SpeechOptions, TTSApi} from "~/components/SpeechSynthesisProvider/index";

const synth = ref<SpeechSynthesis | null>(null)

const tts_api: TTSApi = {
  get_voices(lang: string | undefined): Array<any> {
    if (!synth.value) return []
    return synth.value.getVoices().sort(function (a, b) {
      const a_name = a.name.toUpperCase();
      const b_name = b.name.toUpperCase();
      if (a_name < b_name) {
        return -1;
      } else if (a_name == b_name) {
        return 0;
      } else {
        return +1;
      }
    }).filter(v => lang ? lang === v.lang : true)
  },
  shut_up(): void {
    synth.value?.cancel()
  },
  speech(text: string, options: SpeechOptions | undefined): void {
    if (!text) throw new Error('no speech content specified.')
    if (!synth.value) throw new Error('speechSynthesis is not available now.')
    if (options?.interrupt) this.shut_up()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options?.rate || 1.0
    utterance.pitch = options?.pitch || 1.0
    utterance.lang = options?.lang || 'en-US'
    if (options?.onstart) utterance.onstart = options.onstart
    if (options?.onend) utterance.onend = options.onend
    if (options?.onerror) utterance.onerror = options.onerror

    synth.value.speak(utterance)
  }
}

provide('tts_api', tts_api)

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
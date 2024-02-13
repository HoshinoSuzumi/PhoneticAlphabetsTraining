<script setup lang="ts">
import type {SpeechOptions, TTSApi} from "~/components/SpeechSynthesisProvider/index";
import type {Ref} from "vue";

const synth = ref<SpeechSynthesis | null>(null)
const voices = ref<SpeechSynthesisVoice[]>([])
const selected_voice = ref<SpeechSynthesisVoice | null>(null)
const current_speed = ref(1.0)
const current_pitch = ref(1.0)

watch(current_speed, value => console.log('update speed', value))

const tts_api: TTSApi = {
  current_voice: selected_voice,
  current_speed,
  current_pitch,
  set_voice(voice: SpeechSynthesisVoice | null): void {
    selected_voice.value = voice
  },
  get_voices(lang: string | undefined): Ref<SpeechSynthesisVoice[]> {
    return voices
  },
  shut_up(): void {
    synth.value?.cancel()
  },
  speech(text: string, options: SpeechOptions | undefined): void {
    if (!text) throw new Error('no speech content specified.')
    if (!synth.value) throw new Error('speechSynthesis is not available now.')
    if (options?.interrupt) this.shut_up()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options?.rate || current_speed.value
    utterance.pitch = options?.pitch || current_pitch.value
    utterance.voice = selected_voice.value || null
    console.log(utterance)
    if (!selected_voice.value) utterance.lang = options?.lang || 'en-US'
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
    voices.value = synth.value?.getVoices().sort((a, b) => {
      const a_sort = a.lang.toUpperCase();
      const b_sort = b.lang.toUpperCase();
      if (a_sort < b_sort) {
        return -1;
      } else if (a_sort == b_sort) {
        return 0;
      } else {
        return +1;
      }
    }) || []
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
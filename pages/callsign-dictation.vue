<script lang="ts" setup>
import {ref} from "vue";
import {useRandomCallsign} from "~/composables/useRandomCallsign";
import {usePersistence} from "~/composables/usePersistence";
import {useTTS} from "~/composables/useTTS";
import {useMessage} from "~/composables/uni/useMessage";

useHead({
  title: '模拟呼号抄听 · HAM c5r'
})

const message = useMessage()
const persist = usePersistence()
const tts = useTTS()

const callsign_only = ref(false)
const answer_field = ref()
const input_answer = ref('')
const answer_state = ref<-1 | 0 | 1>(0)

const stats = ref({
  total: 0,
  correct: 0,
  is_correct: function () {
    this.total++
    this.correct++
  },
  is_wrong: function () {
    this.total++
  }
})

const challenge = ref({
  speech: '',
  answer: '',
})

const fuck_new_challenge = () => {
  answer_state.value = 0
  const full_phonetic_dict = {
    ...persist.phonetic_dict,
    ...persist.number_phonetic_dict
  }
  const callsign = useRandomCallsign(Object.values(persist.callsign_templates)[Math.floor(Math.random() * Object.keys(persist.callsign_templates).length)])
  // const callsign_phonetic = callsign.split('').map(w => full_phonetic_dict[w] ? full_phonetic_dict[w][Math.floor(Math.random() * full_phonetic_dict[w].length)]?.word : w).join(',')
  // const callsign_phonetic = 'boston delta six papa mike egypt'.split(' ').map(w => full_phonetic_dict[w] ? full_phonetic_dict[w][Math.floor(Math.random() * full_phonetic_dict[w].length)]?.word : w).join('...')
  challenge.value = {
    speech: persist.random_reply('cq', callsign),
    answer: callsign,
  }
  input_answer.value = ''
  fuck_speech()
}

const fuck_speech = (slow: boolean = false) => {
  tts.speech(callsign_only.value ? persist.to_phonetic(challenge.value.answer).join(',') : challenge.value.speech, {
    interrupt: true,
    rate: slow ? 0.6 : void 0
  })
  answer_field.value.focus()
}

const fuck_qrz = () => {
  tts.speech(persist.random_reply('qrz', challenge.value.answer), {
    interrupt: true,
  })
  answer_field.value.focus()
}

const fuck_submit = () => {
  if (input_answer.value.toLowerCase() === challenge.value.answer.toLowerCase()) {
    message.success('正确')
    stats.value.is_correct()
    answer_state.value = 1
    setTimeout(fuck_new_challenge, 1000)
  } else {
    message.error('错误')
    stats.value.is_wrong()
    fuck_speech(true)
    answer_state.value = -1
  }
}

onMounted(() => {
  fuck_new_challenge()
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between items-center p-4 gap-4">
    <div class="flex-1 flex flex-col w-full md:w-[640px] bg-base-100 border shadow rounded-lg overflow-hidden">
      <div>
        <div class="stats border-b w-full rounded-none">
          <div class="stat place-items-center">
            <div class="stat-value text-xl">
              <span class="countdown" v-if="stats?.total < 100">
                <span :style="`--value: ${stats.total || 0};`"></span>
              </span>
              <span v-else>{{ stats.total || 0 }}</span>
            </div>
            <div class="stat-desc text-xs">答题数</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-value text-xl">
              <span class="countdown" v-if="Math.round(stats.correct / stats.total * 100) < 100">
                <span :style="`--value: ${Math.round(stats.correct / stats.total * 100) || 0};`"></span>
              </span>
              <span v-else>{{ Math.round(stats.correct / stats.total * 100) || 0 }}</span>
              <span class="text-xs font-bold">%</span>
            </div>
            <div class="stat-desc text-xs">正确率</div>
          </div>
        </div>
      </div>
      <div class="w-full h-full flex flex-col justify-center items-center space-y-10">
        <div
            class="px-8 py-6 border rounded-lg overflow-hidden answer relative select-none pointer-events-none text-center">
          <div class="absolute inset-0 backdrop-blur-sm answer" v-if="answer_state !== -1"></div>
          <h1 class="text-4xl font-black font-mono">
            {{ challenge.answer || '------' }}
          </h1>
        </div>
        <div class="flex gap-2">
          <button class="btn" @click="fuck_speech(false)">
            <IconReload class="w-6 h-6"/>
            重播
          </button>
          <button class="btn" @click="fuck_qrz()" v-if="!callsign_only">
            <IconMessageQuestion class="w-6 h-6"/>
            QRZ
          </button>
        </div>
      </div>
      <div class="w-full h-fit flex flex-row justify-center select-none p-2">
        <p class="text-xs text-neutral-500 font-['MiSans'] font-medium">出现的呼号均为随机生成，仅供听力训练使用</p>
      </div>
    </div>
    <div class="flex flex-col w-full md:w-[640px] p-8 bg-base-100 border shadow rounded-lg space-y-2">
      <div class="join mb-2">
        <input type="text" autocomplete="none" placeholder="输入你听到的呼号" ref="answer_field"
               @keydown.enter="(!input_answer || answer_state === 1) ? void 0 : answer_state === -1 ? fuck_new_challenge() : fuck_submit()"
               :class="{'text-red-500': answer_state === -1, 'text-green-500': answer_state === 1}"
               class="join-item input input-lg input-bordered text-center w-full uppercase font-bold text-2xl"
               maxlength="8" v-model="input_answer"/>
      </div>
      <div class="w-full flex flex-col-reverse md:flex-row justify-between gap-2 md:gap-0">
        <div class="flex items-center gap-2 text-sm text-neutral-400 font-bold">
          <UniToggle id="callsign_only" size="sm" v-model="callsign_only"/>
          <div class="tooltip tooltip-bottom" data-tip="仅播放呼号而不套用模板">
            <label for="callsign_only" class="inline-flex items-center gap-0.5 cursor-help select-none">
              快速模式
              <svg class="mt-0.5" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
                  <path d="M12 16v.01M12 13a2 2 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/>
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/>
                </g>
              </svg>
            </label>
          </div>
        </div>
        <button class="btn btn-primary btn-block md:btn-wide"
                @click="answer_state === -1 ? fuck_new_challenge() : fuck_submit()"
                :disabled="!input_answer || answer_state === 1">
          {{ answer_state === -1 ? '下一题' : answer_state === 1 ? '正确' : '提交' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.answer {
  background-color: #e5e5e5;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b4b4b4' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
}
</style>

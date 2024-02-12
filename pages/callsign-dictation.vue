<script lang="ts" setup>
import {ref} from "vue";
import {useRandomCallsign} from "~/composables/useRandomCallsign";
import {usePersistence} from "~/composables/usePersistence";
import {useSpeech} from "~/composables/useSpeech";
import {useMessage} from "~/composables/uni/useMessage";

useHead({
  title: '模拟呼号抄听 · HAM c5r'
})

const message = useMessage()
const persist = usePersistence()
const tts = useSpeech()

const input_answer = ref('')
// const correct_answer = ref(true)
// const wrong_answer = ref(false)
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
  const callsign = useRandomCallsign(Object.values(persist.callsign_templates)[Math.floor(Math.random() * Object.keys(persist.callsign_templates).length)])
  const callsign_phonetic = callsign.split('').map(w => persist.phonetic_dict[w] ? persist.phonetic_dict[w][Math.floor(Math.random() * persist.phonetic_dict[w].length)]?.word : w).join(' ')
  challenge.value = {
    speech: persist.random_cq(callsign_phonetic),
    answer: callsign,
  }
  input_answer.value = ''
  fuck_speech()
}

const fuck_speech = (slow: boolean = false) => {
  tts(challenge.value.speech, slow ? 0.8 : 1.0)
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

// const handle_input = (e: any) => {
//   console.log(e)
//   const nextElement = e.target.nextElementSibling
//   const prevElement = e.target.previousElementSibling
//
//   if (e.inputType === 'deleteContentBackward') {
//     if (prevElement) prevElement.focus()
//   } else if (e.inputType === 'insertText') {
//     if (nextElement) nextElement.focus()
//     else e.target.blur()
//   }
// }
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
          <!--          <p class="text-xs">{{ challenge.speech }}</p>-->
        </div>
        <button class="btn btn-square btn-lg btn-primary" @click="fuck_speech">
          <IconVolume class="w-8 h-8"/>
        </button>
      </div>
      <div class="w-full h-fit flex flex-row justify-center select-none p-2">
        <p class="text-xs text-neutral-500 font-['MiSans'] font-medium">出现的呼号均为随机生成，仅供听力训练使用</p>
      </div>
    </div>
    <div class="flex flex-col w-full md:w-[640px] p-8 bg-base-100 border shadow rounded-lg space-y-2">
      <div class="join mb-2">
        <input type="text" autocomplete="none" placeholder="输入你听到的呼号"
               :class="{'text-red-500': answer_state === -1, 'text-green-500': answer_state === 1}"
               class="join-item input input-lg input-bordered text-center w-full uppercase font-bold text-2xl"
               maxlength="8" v-model="input_answer"/>
      </div>
      <div class="w-full flex flex-row justify-end">
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

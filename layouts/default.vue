<script lang="ts" setup>
import {ref} from 'vue';
import {useRoute} from 'vue-router';
import {useTTS} from "~/composables/useTTS";

const route = useRoute()
const tts = useTTS()

const nav = ref([
  {
    label: '速查表',
    route: 'index',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 4v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z"/><path d="M19 16H7a2 2 0 0 0-2 2M9 8h6"/></g></svg>'
  },
  {
    label: '呼号听写',
    route: 'callsign-dictation',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4m9.5-13.5l4 4"/></svg>'
  },
])

const selected_voice = ref<SpeechSynthesisVoice | null>(null)
watch(selected_voice, value => tts.set_voice(value))

const current_speed = ref(tts.current_speed.value + '')
const current_pitch = ref(tts.current_pitch.value + '')
watch(current_speed, value => tts.current_speed.value = parseFloat(parseFloat(value).toFixed(1)))
watch(current_pitch, value => tts.current_pitch.value = parseFloat(parseFloat(value).toFixed(1)))
</script>

<template>
  <div class="drawer min-h-screen">
    <input id="my-drawer" type="checkbox" class="drawer-toggle"/>
    <div class="drawer-content h-full flex flex-col">
      <!-- page content -->
      <div class="sticky top-0 w-full h-16 bg-base-100 border-b-2 flex flex-row items-center justify-between px-2 z-50">
        <div class="flex space-x-2">
          <div class="flex-none lg:hidden">
            <label for="my-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div class="cursor-pointer select-none">
            <h1 class="text-lg font-bold flex items-center">
              字母解释法练习器
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 10v7m-5-5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm9 8V9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2"/>
              </svg>
            </h1>
            <h2 class="text-xs font-serif uppercase">Phonetic Alphabets Trainer</h2>
          </div>
        </div>
        <div class="flex-none hidden lg:block">
          <ul class="menu menu-horizontal space-x-2">
            <!-- navbar menu -->
            <li v-for="(link, k) in nav" :key="k">
              <RouterLink :class="{ 'active': link.route === route.name }" :to="{ name: link.route }">
                <div v-if="link.icon" v-html="link.icon"/>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
          <a class="btn btn-sm btn-ghost" href="https://github.com/HoshinoSuzumi/PhoneticAlphabetsTraining"
             target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 250">
              <path fill="#161614"
                    d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002C256 57.307 198.691 0 128.001 0m-80.06 182.34c-.282.636-1.283.827-2.194.39c-.929-.417-1.45-1.284-1.15-1.922c.276-.655 1.279-.838 2.205-.399c.93.418 1.46 1.293 1.139 1.931m6.296 5.618c-.61.566-1.804.303-2.614-.591c-.837-.892-.994-2.086-.375-2.66c.63-.566 1.787-.301 2.626.591c.838.903 1 2.088.363 2.66m4.32 7.188c-.785.545-2.067.034-2.86-1.104c-.784-1.138-.784-2.503.017-3.05c.795-.547 2.058-.055 2.861 1.075c.782 1.157.782 2.522-.019 3.08m7.304 8.325c-.701.774-2.196.566-3.29-.49c-1.119-1.032-1.43-2.496-.726-3.27c.71-.776 2.213-.558 3.315.49c1.11 1.03 1.45 2.505.701 3.27m9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033c-1.448-.439-2.395-1.613-2.103-2.626c.301-1.01 1.747-1.484 3.207-1.028c1.446.436 2.396 1.602 2.095 2.622m10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95c-1.53.034-2.769-.82-2.786-1.86c0-1.065 1.202-1.932 2.733-1.958c1.522-.03 2.768.818 2.768 1.868m10.555-.405c.182 1.03-.875 2.088-2.387 2.37c-1.485.271-2.861-.365-3.05-1.386c-.184-1.056.893-2.114 2.376-2.387c1.514-.263 2.868.356 3.061 1.403"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="min-h-[calc(100vh-4rem)]">
        <slot/>
      </div>
      <footer class="footer p-10 bg-base-300 text-base-content">
        <aside>
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 10v7m-5-5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm9 8V9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2"/>
          </svg>
          <p class="text-neutral-500 font-mono">
            A part of <a href="https://c5r.app" class="link link-hover font-bold" target="_blank">CTFever</a><br/>
            Fantastic toolkit for CTFers and everyone
          </p>
        </aside>
        <div>
          <h6 class="footer-title">Speech Settings</h6>
          <fieldset class="form-control w-72">
            <UniSelect :items="[
              {label: tts.get_voices().value.length === 0 ? '无法索引系统声音' : '系统默认', value: null},
            ...tts.get_voices().value.map(item => {return {
              label: `${item.lang} - ${item.name}`,
              value: item
            }})]" v-model="selected_voice" align="top"/>
            <h6 class="text-xs font-bold text-neutral-400 mt-0.5">
              语音来自你的浏览器和系统 TTS 服务
            </h6>
          </fieldset>
          <fieldset class="form-control w-72">
            <div class="join items-center space-x-2">
              <h2 class="font-mono inline-flex flex-col items-center">
                <span class="leading-none">SPEED</span>
                <span class="text-xs leading-none">{{ tts.current_speed }}</span>
              </h2>
              <input type="range" min="0.5" max="2.0" v-model="current_speed" class="range range-xs" step="0.1"/>
            </div>
          </fieldset>
          <fieldset class="form-control w-72">
            <div class="join items-center space-x-2">
              <h2 class="font-mono inline-flex flex-col items-center leading-none">
                <span class="leading-none">PITCH</span>
                <span class="text-xs leading-none">{{ tts.current_pitch }}</span>
              </h2>
              <input type="range" min="0.5" max="2.0" v-model="current_pitch" class="range range-xs" step="0.1"/>
            </div>
          </fieldset>
        </div>
      </footer>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul
          class="menu pt-16 px-1 w-64 space-y-1 min-h-screen bg-base-100/80 backdrop-blur-lg backdrop-saturate-50 text-base-content">
        <!-- sidebar menu -->
        <li v-for="(link, k) in nav" :key="k">
          <RouterLink :class="{ 'active': link.route === route.name }" :to="{ name: link.route }">
            <div v-if="link.icon" v-html="link.icon"/>
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
body {
  background-color: #f8f8f8;
  background-image: url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23e5e5e5' fill-opacity='0.41' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>

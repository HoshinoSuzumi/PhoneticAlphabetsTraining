<script lang="ts" setup>
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute()
const router = useRouter()

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
          <div>
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
        </div>
      </div>
      <div class="h-full">
        <slot/>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul
          class="menu pt-16 px-1 w-64 space-y-1 min-h-screen bg-base-100/80 backdrop-blur-lg backdrop-saturate-50 text-base-content">
        <!-- sidebar menu -->
        <li v-for="(link, k) in nav" :key="k">
          <RouterLink :class="{ 'active': link.route === route.name }" :to="{ name: link.route }">
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

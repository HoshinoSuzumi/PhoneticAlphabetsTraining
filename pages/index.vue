<script lang="ts" setup>
import {usePersistence} from "~/composables/usePersistence";
import TablerExternalLink from '~/components/TablerExternalLink.vue'

const persist = usePersistence()

</script>

<template>
  <div class="p-4 space-y-2 md:space-y-4">
    <div class="w-full p-2 gap-2 text-xs rounded-lg bg-primary border shadow-sm border-primary-content/50 border-b-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-1.5 text-accent" width="1.5em" height="1.5em"
           viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"/>
      </svg>
      <div class="inline-flex flex-col">
        <p class="inline ml-1 text-neutral-50">
          <b>字母解释法练习器</b> 正在升级为 <b><a href="https://ham-dev.c5r.app/">HAM Set</a></b> 工具箱
        </p>
        <p class="inline ml-1 text-neutral-50">
          重新设计的 UI，包含题库解析、卫星数据库等新的工具（模拟呼号听写功能重做中），未来将打造为一个一站式业余无线电工具箱
        </p>
        <a
          class="text-neutral-50 hover:text-neutral-100 transition-colors font-bold underline underline-offset-4 animate-pulse ml-1 mt-1"
          href="https://ham-dev.c5r.app/"
        >
          前往体验 <TablerExternalLink class="inline -mt-0.5"/>
        </a>
      </div>
    </div>
    <div class="w-full p-2 gap-2 text-xs rounded-lg bg-base-100 border shadow-sm border-neutral-content border-b-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-1.5 text-accent" width="1.5em" height="1.5em"
           viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"/>
      </svg>
      <p class="inline ml-1 text-neutral-500">
        {{ Object.values(persist.phonetic_tags).map(item => `${item.label} = ${item.desc}`).join(' | ') }}
      </p>
    </div>
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4">
      <AlphabetCard v-for="(words, alphabet) in persist.phonetic_dict" :key="alphabet" :phonetics="words"
                    :char="alphabet"/>
      <AlphabetCard v-for="(words, num) in persist.number_phonetic_dict" :key="num" :phonetics="words"
                    :char="num"/>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import {usePersistence} from "~/composables/usePersistence";

const persist = usePersistence()

</script>

<template>
  <div class="p-4 space-y-2 md:space-y-4">
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

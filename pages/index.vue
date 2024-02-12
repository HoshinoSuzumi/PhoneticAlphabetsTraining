<script lang="ts" setup>
import {usePersistence} from "~/composables/usePersistence";

const persist = usePersistence()

</script>

<template>
  <div class="p-4">
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4">
      <AlphabetCard v-for="(words, alphabet) in persist.phonetic_dict" :key="alphabet" :phonetics="words"/>
    </div>
  </div>
</template>

<style scoped></style>

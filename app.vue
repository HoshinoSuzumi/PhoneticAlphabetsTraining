<script setup lang="ts">
</script>

<template>
  <div>
    <UniMessageProvider :max="3">
      <SpeechSynthesisProvider>
        <NuxtLayout>
          <NuxtPage/>
        </NuxtLayout>
      </SpeechSynthesisProvider>
    </UniMessageProvider>
  </div>
</template>
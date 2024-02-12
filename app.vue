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
<script setup lang="ts">
</script>
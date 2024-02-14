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
useHead({
  script: [
    {
      src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=G53LAC6duWQm9TExskrP5Fxvn0QZ6oU9'
    }
  ]
})
</script>
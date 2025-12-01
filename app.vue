<script setup lang="ts">
import { useHead } from "#imports";

useHead({
  script: [
    {
      src: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
      defer: true
    }
  ]
});
</script>

<template>
  <NuxtPage />
</template>

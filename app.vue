<script setup lang="ts">
import { useHead } from "#imports";

useHead({
  script: [
    {
      src: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
      defer: true
    }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
  ]
});
</script>

<template>
  <NuxtPage />
</template>

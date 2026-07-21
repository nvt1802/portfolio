<script setup lang="ts">
import '~/assets/css/main.css'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | My Portfolio` : 'My Portfolio'
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

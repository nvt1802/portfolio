<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center list-none p-0 m-0 mb-6 text-[14px]">
      <li class="flex items-center text-[color:var(--text-secondary)]">
        <NuxtLink to="/admin" class="inline-flex items-center text-inherit no-underline transition-colors duration-150 hover:text-[color:var(--primary)] hover:drop-shadow-[0_0_8px_var(--primary-glow)]">
          <svg class="w-[14px] h-[14px] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </NuxtLink>
      </li>
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="flex items-center text-[color:var(--text-secondary)]"
      >
        <span class="mx-[10px] text-[color:var(--text-muted)] font-light">/</span>
        <NuxtLink 
          v-if="item.to" 
          :to="item.to" 
          class="inline-flex items-center text-inherit no-underline transition-colors duration-150 hover:text-[color:var(--primary)] hover:drop-shadow-[0_0_8px_var(--primary-glow)]"
        >
          {{ item.name }}
        </NuxtLink>
        <span v-else class="text-[color:var(--text-primary)] font-medium">
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>

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
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <NuxtLink to="/admin" class="breadcrumb-link">
          <svg style="width: 14px; height: 14px; margin-right: 4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </NuxtLink>
      </li>
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="breadcrumb-item"
      >
        <span class="breadcrumb-separator">/</span>
        <NuxtLink 
          v-if="item.to" 
          :to="item.to" 
          class="breadcrumb-link"
        >
          {{ item.name }}
        </NuxtLink>
        <span v-else class="breadcrumb-active">
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  transition: var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--primary);
  text-shadow: 0 0 8px var(--primary-glow);
}

.breadcrumb-separator {
  margin: 0 10px;
  color: var(--text-muted);
  font-weight: 300;
}

.breadcrumb-active {
  color: var(--text-primary);
  font-weight: 500;
}
</style>

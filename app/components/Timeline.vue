<script setup lang="ts">
export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  order?: number
  logoUrl?: string
  logoScale?: number
  logoX?: number
  logoY?: number
  logoBg?: string
}

defineProps<{
  items: Experience[]
}>()

// Helper to format startDate/endDate strings
const formatPeriod = (start: string, end: string) => {
  const formatMonth = (str: string) => {
    if (!str || str.toLowerCase() === 'present') return 'Hiện tại'
    const parts = str.split('-')
    const year = parts[0]
    const month = parts[1]
    if (year !== undefined && month !== undefined) {
      return `${parseInt(month)}/${year}`
    }
    return str
  }
  return `${formatMonth(start)} — ${formatMonth(end)}`
}
</script>

<template>
  <div class="timeline">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="timeline-item"
    >
      <!-- Column 1: Logo Card -->
      <div class="timeline-logo-container">
        <div class="timeline-logo-card" :style="{ backgroundColor: item.logoBg || '#ffffff' }">
          <img 
            v-if="item.logoUrl" 
            :src="item.logoUrl" 
            :alt="item.company"
            class="timeline-logo-img"
            :style="{ transform: `scale(${item.logoScale ?? 1}) translate(${item.logoX ?? 0}px, ${item.logoY ?? 0}px)` }"
          />
          <span v-else class="timeline-logo-placeholder">
            {{ item.company.charAt(0) }}
          </span>
        </div>
      </div>

      <!-- Column 2: Dot & Line -->
      <div class="timeline-line-container">
        <div class="timeline-line"></div>
        <div class="timeline-dot"></div>
      </div>

      <!-- Column 3: Details Card -->
      <div class="timeline-details">
        <div class="glass-card">
          <div class="timeline-time">{{ formatPeriod(item.startDate, item.endDate) }}</div>
          <h3 class="timeline-title">{{ item.role }}</h3>
          <div class="timeline-subtitle">{{ item.company }}</div>
          <p class="timeline-desc" style="white-space: pre-wrap;">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

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
    if (!str || str.toLowerCase() === 'present') return 'Present'
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
  <div class="relative max-w-[900px] mx-auto py-10 px-4 sm:px-0">
    <div 
      v-for="(item, index) in items" 
      :key="item.id" 
      class="group relative flex flex-col sm:grid sm:grid-cols-[120px_40px_1fr] items-start mb-8 sm:mb-12 gap-0"
    >
      <!-- Mobile Timeline Line -->
      <div class="absolute left-[15px] top-[30px] bottom-[-30px] w-[2px] bg-gradient-to-b from-[color:var(--primary)] to-[color:var(--secondary)] opacity-30 sm:hidden" v-if="index !== items.length - 1"></div>
      
      <!-- Mobile Timeline Dot -->
      <div class="absolute left-[11px] top-[40px] w-2.5 h-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)] sm:hidden z-10"></div>

      <!-- Column 1: Logo Card (Desktop only) -->
      <div class="hidden sm:flex sm:justify-end sm:pr-2.5 sm:mt-2">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center p-2.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.1)] border border-black/5 transition-all duration-300 overflow-hidden group-hover:scale-105 group-hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5)]" :style="{ backgroundColor: item.logoBg || '#ffffff' }">
          <img 
            v-if="item.logoUrl" 
            :src="item.logoUrl" 
            :alt="item.company"
            class="max-w-full max-h-full object-contain"
            :style="{ transform: `scale(${item.logoScale ?? 1}) translate(${item.logoX ?? 0}px, ${item.logoY ?? 0}px)` }"
          />
          <span v-else class="font-display text-[28px] font-extrabold text-slate-800">
            {{ item.company.charAt(0) }}
          </span>
        </div>
      </div>

      <!-- Column 2: Dot & Line (Desktop only) -->
      <div class="relative hidden sm:flex justify-center h-full min-h-[100px]">
        <div class="absolute top-0 w-[2px] bg-gradient-to-b from-[color:var(--primary)] to-[color:var(--secondary)] opacity-30" :class="index === items.length - 1 ? 'bottom-0' : '-bottom-12'"></div>
        <div class="w-4 h-4 rounded-full bg-[color:var(--bg-dark)] border-[3px] border-[color:var(--accent)] shadow-[0_0_12px_var(--accent)] z-10 mt-8 transition-all duration-300 group-hover:bg-[color:var(--accent)] group-hover:scale-125"></div>
      </div>

      <!-- Column 3: Details Card -->
      <div class="w-full pl-10 sm:pl-2.5">
        <div class="bg-[color:var(--glass-bg)] backdrop-blur-[12px] border border-[color:var(--glass-border)] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-[color:var(--border-color-hover)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_20px_0_var(--primary-glow)]">
          
          <!-- Mobile Header (Logo + Company + Date) -->
          <div class="flex items-center gap-3.5 sm:hidden mb-4 border-b border-white/10 pb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-black/5" :style="{ backgroundColor: item.logoBg || '#ffffff' }">
              <img 
                v-if="item.logoUrl" 
                :src="item.logoUrl" 
                class="max-w-full max-h-full object-contain"
                :style="{ transform: `scale(${item.logoScale ?? 1}) translate(${item.logoX ?? 0}px, ${item.logoY ?? 0}px)` }"
              />
              <span v-else class="font-display text-[18px] font-extrabold text-slate-800">
                {{ item.company.charAt(0) }}
              </span>
            </div>
            <div>
              <div class="text-[13px] font-semibold text-[color:var(--accent)] mb-0.5">{{ formatPeriod(item.startDate, item.endDate) }}</div>
              <div class="text-[14px] text-[color:var(--text-secondary)] font-medium">{{ item.company }}</div>
            </div>
          </div>
          
          <!-- Desktop Header (Date only) -->
          <div class="hidden sm:block text-[14px] font-semibold text-[color:var(--accent)] mb-1">{{ formatPeriod(item.startDate, item.endDate) }}</div>
          
          <h3 class="text-[17px] sm:text-[18px] font-bold mb-1.5 sm:mb-1.5">{{ item.role }}</h3>
          <div class="hidden sm:block text-[14px] text-[color:var(--text-secondary)] mb-3">{{ item.company }}</div>
          <div class="text-[14px] sm:text-[15px] text-[color:var(--text-secondary)] leading-[1.6] [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2 last:[&>p]:mb-0" v-html="item.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

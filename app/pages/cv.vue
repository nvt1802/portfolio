<script setup lang="ts">
import { doc, collection, query, orderBy } from 'firebase/firestore'
import { useFirestore, useDocument, useCollection } from 'vuefire'
import TemplateClassic from '~/components/cv/TemplateClassic.vue'
import TemplateModern from '~/components/cv/TemplateModern.vue'
import TemplateMinimal from '~/components/cv/TemplateMinimal.vue'

useHead({ title: 'CV Profile' })

definePageMeta({
  layout: false, // No navigation bar, footer, etc.
  title: 'My CV'
})

const db = useFirestore()

// Fetch CV Profile & Personal Info
const cvProfileRef = useDocument(doc(db, 'settings', 'cv_profile'))
const personalInfo = useDocument(doc(db, 'settings', 'personal'))

// Fetch CV Settings (for cvUrl)
const cvSettings = useDocument(computed(() => {
  if (!import.meta.client || !db) return null
  return doc(db, 'settings', 'general')
}))

// Fetch all collections using vuefire useCollection for reactivity and SSR support
const rawExperiences = useCollection(computed(() => db ? collection(db, 'experiences') : null))
const rawProjects = useCollection(computed(() => db ? collection(db, 'projects') : null))
const rawSkills = useCollection(computed(() => db ? collection(db, 'skills') : null))
const rawCompanies = useCollection(computed(() => db ? collection(db, 'companies') : null))
const skillCategories = useCollection(computed(() => db ? query(collection(db, 'skill_categories'), orderBy('order', 'asc')) : null))

const isLoading = computed(() => {
  return rawExperiences.pending.value || rawProjects.pending.value || rawSkills.pending.value
})

// Computed filtered data
const filteredExperiences = computed(() => {
  if (!rawExperiences.value) return []
  let selected = cvProfileRef.value?.selectedExperiences
  let source = rawExperiences.value
  
  if (selected && Array.isArray(selected) && selected.length > 0) {
    source = source.filter(e => selected.includes(e.id))
  } else if (selected && Array.isArray(selected) && selected.length === 0) {
    // If explicitly saved as empty array, don't show any (or maybe show all by default if user is confused? Let's show all if empty for better UX)
    // Actually, if it's empty, let's just show all.
  }
  
  // Show all if selected is missing or empty array
  if (!selected || (Array.isArray(selected) && selected.length === 0)) {
    source = rawExperiences.value
  }

  return source
    .sort((a, b) => (b.order || 0) - (a.order || 0))
    .map(exp => {
      const comp = rawCompanies.value?.find(c => c.id === exp.companyId)
      return {
        ...exp,
        company: comp ? comp.name : (exp.company || ''),
        logoUrl: comp?.logoUrl || exp.logoUrl,
        logoScale: comp?.logoScale ?? exp.logoScale,
        logoX: comp?.logoX ?? exp.logoX,
        logoY: comp?.logoY ?? exp.logoY,
        logoBg: comp?.logoBg || exp.logoBg
      }
    })
})

const parseDateStr = (dateStr: string) => {
  if (!dateStr || dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'hiện tại') return Date.now()
  const parts = dateStr.split('/')
  if (parts.length === 2) {
    return new Date(Number(parts[1]), Number(parts[0]) - 1).getTime()
  }
  if (parts.length === 1 && parts[0]?.length === 4 && !isNaN(Number(parts[0]))) {
    return new Date(Number(parts[0]), 0).getTime()
  }
  const timestamp = Date.parse(dateStr)
  if (!isNaN(timestamp)) return timestamp
  
  return 0
}

const filteredProjects = computed(() => {
  if (!rawProjects.value) return []
  let selected = cvProfileRef.value?.selectedProjects
  let source = rawProjects.value
  
  if (!selected || (Array.isArray(selected) && selected.length === 0)) {
    source = rawProjects.value
  } else {
    source = source.filter(p => selected.includes(p.id))
  }

  return source
    .sort((a, b) => {
      const orderDiff = (b.order || 0) - (a.order || 0)
      if (orderDiff !== 0) return orderDiff
      return parseDateStr(b.startDate || '') - parseDateStr(a.startDate || '')
    })
    .map(proj => {
      const comp = rawCompanies.value?.find(c => c.id === proj.companyId)
      return {
        ...proj,
        companyName: comp ? comp.name : (proj.companyId ? '' : 'Personal Project')
      }
    })
})

const filteredSkills = computed(() => {
  if (!rawSkills.value) return []
  let selected = cvProfileRef.value?.selectedSkills
  let source = rawSkills.value
  
  if (!selected || (Array.isArray(selected) && selected.length === 0)) {
    source = rawSkills.value
  } else {
    source = source.filter(s => selected.includes(s.id))
  }

  return source
    .sort((a, b) => (a.order || 0) - (b.order || 0))
})

// Group skills by dynamic category, maintaining order from skill_categories
const groupedSkills = computed(() => {
  const legacyMap: Record<string, string> = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'tools': 'Tools & DevOps',
    'ai-automation': 'AI Agent & Automation'
  }
  
  const result: Record<string, any[]> = {}
  
  // 1. Process managed categories first
  if (skillCategories.value && filteredSkills.value) {
    skillCategories.value.forEach(cat => {
      const catSkills = filteredSkills.value.filter(s => s.category === cat.name || s.category === cat.id)
      if (catSkills.length > 0) {
        result[cat.name] = catSkills
      }
    })
    
    // 2. Process any remaining skills not in managed categories
    const knownNames = skillCategories.value.map(c => c.name)
    filteredSkills.value.forEach(skill => {
      const rawCat = skill.category || 'Other'
      if (!knownNames.includes(rawCat)) {
        const catName = legacyMap[rawCat] || rawCat
        if (!result[catName]) {
          result[catName] = []
        }
        result[catName].push(skill)
      }
    })
  }

  return result
})

const printCv = () => {
  window.print()
}
</script>

<template>
  <div class="min-h-screen p-10 sm:p-[40px_20px] bg-[#f3f4f6] font-sans print:p-0 print:bg-transparent [--cv-bg:#ffffff] [--cv-text:#333333] [--cv-text-light:#666666] [--cv-primary:#111111] [--cv-accent:#2563eb] [--cv-border:#e5e7eb]">
    <!-- Print Action Button (Hidden when printing) -->
    <div class="fixed top-5 right-5 flex gap-3 z-[100] print:hidden">
      <button @click="printCv" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none py-2.5 px-4 rounded-md font-semibold cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Print to PDF
      </button>
      <a 
        v-if="cvSettings && cvSettings.cvUrl" 
        :href="cvSettings.cvUrl" 
        target="_blank" 
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none py-2.5 px-4 rounded-md font-semibold cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-200 no-underline"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        Download CV
      </a>
      <NuxtLink to="/" class="flex items-center bg-white text-[#333] border border-gray-200 py-2.5 px-4 rounded-md no-underline font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">Back to Home</NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center mt-[100px] text-gray-500 print:hidden">
      Loading CV data...
    </div>

    <!-- CV Document -->
    <div v-else-if="cvProfileRef && personalInfo">
      <component 
        :is="cvProfileRef.templateId === 'modern' ? TemplateModern : (cvProfileRef.templateId === 'minimal' ? TemplateMinimal : TemplateClassic)"
        :personalInfo="personalInfo"
        :cvProfileRef="cvProfileRef"
        :filteredExperiences="filteredExperiences"
        :filteredProjects="filteredProjects"
        :groupedSkills="groupedSkills"
      />
    </div>
    
    <div v-else class="text-center mt-[100px] text-gray-500 print:hidden">
      No CV configuration found. Please go to the admin panel to create one.
    </div>

  </div>
</template>

<style>
/* @media print for PDF Export */
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

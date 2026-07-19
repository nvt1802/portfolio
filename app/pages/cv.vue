<script setup lang="ts">
import { doc, collection, getDocs } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
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

// State
const experiences = ref<any[]>([])
const projects = ref<any[]>([])
const skills = ref<any[]>([])
const companies = ref<any[]>([])

const isLoading = ref(true)

// Fetch all collections on mount
onMounted(async () => {
  try {
    const [expSnap, projSnap, skillSnap, compSnap] = await Promise.all([
      getDocs(collection(db, 'experiences')),
      getDocs(collection(db, 'projects')),
      getDocs(collection(db, 'skills')),
      getDocs(collection(db, 'companies'))
    ])

    experiences.value = expSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    projects.value = projSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    skills.value = skillSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    companies.value = compSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error("Error fetching CV data:", error)
  } finally {
    isLoading.value = false
  }
})

// Computed filtered data
const filteredExperiences = computed(() => {
  if (!cvProfileRef.value || !cvProfileRef.value.selectedExperiences) return []
  return experiences.value
    .filter(e => cvProfileRef.value!.selectedExperiences.includes(e.id))
    .sort((a, b) => (b.order || 0) - (a.order || 0))
    .map(exp => {
      const comp = companies.value.find(c => c.id === exp.companyId)
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
  if (parts.length === 1 && parts[0].length === 4) {
    return new Date(Number(parts[0]), 0).getTime()
  }
  return 0
}

const filteredProjects = computed(() => {
  if (!cvProfileRef.value || !cvProfileRef.value.selectedProjects) return []
  return projects.value
    .filter(p => cvProfileRef.value!.selectedProjects.includes(p.id))
    .sort((a, b) => parseDateStr(a.startDate || '') - parseDateStr(b.startDate || ''))
    .map(proj => {
      const comp = companies.value.find(c => c.id === proj.companyId)
      return {
        ...proj,
        companyName: comp ? comp.name : (proj.companyId ? '' : 'Personal Project')
      }
    })
})

const filteredSkills = computed(() => {
  if (!cvProfileRef.value || !cvProfileRef.value.selectedSkills) return []
  return skills.value
    .filter(s => cvProfileRef.value!.selectedSkills.includes(s.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
})

const groupedSkills = computed(() => {
  const groups: Record<string, any[]> = {}
  
  const categoryNames: Record<string, string> = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'tools': 'Tools',
    'ai-automation': 'AI Agent & Automation'
  }
  
  filteredSkills.value.forEach(skill => {
    const groupName = categoryNames[skill.category] || skill.category
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(skill)
  })
  
  return groups
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

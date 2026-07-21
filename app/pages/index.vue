<script setup lang="ts">
import { collection, doc, query, orderBy } from 'firebase/firestore'
import type { CollectionReference, Query } from 'firebase/firestore'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import type { Experience } from '~/components/Timeline.vue'
import type { Project } from '~/components/ProjectCard.vue'

useHead({ title: 'Home' })

interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'ai-automation'
  displayType?: 'icon' | 'text'
  order: number
  iconUrl?: string
  description?: string
}

const db = useFirestore()

// Fetch data dynamically from Firestore (Client-side only to avoid build-time errors)
const experiences = useCollection<Experience>(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'experiences'), orderBy('startDate', 'desc')) as Query<Experience>
}))

const companies = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'companies')
}))

const mappedExperiences = computed(() => {
  if (!experiences.value) return []
  return experiences.value.map((exp: any) => {
    const comp = companies.value?.find((c: any) => c.id === exp.companyId)
    return {
      ...exp,
      company: comp ? comp.name : (exp.company || ''),
      logoUrl: comp?.logoUrl || exp.logoUrl,
      logoScale: comp?.logoScale ?? exp.logoScale,
      logoX: comp?.logoX ?? exp.logoX,
      logoY: comp?.logoY ?? exp.logoY,
      logoBg: comp?.logoBg || exp.logoBg
    }
  }) as Experience[]
})

const projects = useCollection<Project>(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'projects') as CollectionReference<Project>
}))

const mappedProjects = computed(() => {
  if (!projects.value) return []
  return projects.value.map((proj: any) => {
    const comp = companies.value?.find((c: any) => c.id === proj.companyId)
    return {
      ...proj,
      companyName: comp ? comp.name : (proj.companyId ? '' : 'Personal Project')
    }
  }) as Project[]
})

const skills = useCollection<Skill>(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'skills'), orderBy('order', 'asc')) as Query<Skill>
}))

const cvSettings = useDocument(computed(() => {
  if (!import.meta.client || !db) return null
  return doc(db, 'settings', 'general')
}))

const personalInfo = useDocument(computed(() => {
  if (!import.meta.client || !db) return null
  return doc(db, 'settings', 'personal')
}))

const homepageSettings = useDocument(computed(() => {
  if (!import.meta.client || !db) return null
  return doc(db, 'settings', 'homepage')
}))

const defaultSections = [
  { id: 'hero', name: 'Hero', visible: true },
  { id: 'skills', name: 'Professional Skills', subtitle: 'Core technologies and specialized tools I use regularly', visible: true },
  { id: 'experience', name: 'Work Experience', subtitle: 'My career journey and professional milestones', visible: true },
  { id: 'projects', name: 'Featured Projects', subtitle: 'Systems, solutions, and products I have developed', visible: true }
]

const orderedSections = computed(() => {
  if (!homepageSettings.value || !homepageSettings.value.sections) {
    return defaultSections
  }
  return homepageSettings.value.sections.map((saved: any) => {
    const def = defaultSections.find(d => d.id === saved.id)
    return def ? { ...def, ...saved } : saved
  })
})


const heroData = computed(() => {
  if (!homepageSettings.value || !homepageSettings.value.hero) {
    return {
      badgeText: 'Available for work',
      titleLine1: 'Hello, I am a',
      titleLine2: 'Software Engineer',
      description: 'Passionate about building high-quality software solutions, optimizing backend systems, developing intelligent AI Agents, and automating workflows to enhance business productivity.'
    }
  }
  return homepageSettings.value.hero
})

// SEO Optimization
useSeoMeta({
  title: 'Personal Portfolio | Software Engineer & AI Agent',
  ogTitle: 'Personal Portfolio | Software Engineer & AI Agent',
  description: 'Information, work experience, featured projects, and professional skills.',
  ogDescription: 'Information, work experience, featured projects, and professional skills.',
  ogImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// Group skills by category
const frontendSkills = computed(() => skills.value.filter(s => s.category === 'frontend'))
const backendSkills = computed(() => skills.value.filter(s => s.category === 'backend'))
const toolsSkills = computed(() => skills.value.filter(s => s.category === 'tools'))
const aiSkills = computed(() => skills.value.filter(s => s.category === 'ai-automation'))

const isMobileMenuOpen = ref(false)

// Nav links smooth scroll helper
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Glow Backdrop Effects -->
    <div class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[color:var(--primary)] opacity-[0.15] blur-[100px] animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[color:var(--accent)] opacity-[0.1] blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
    </div>

    <!-- Header Navigation -->
    <header class="fixed top-0 left-0 right-0 h-20 bg-slate-900/70 backdrop-blur-md border-b border-[color:var(--border-color)] z-50 flex items-center">
      <div class="container flex justify-between items-center">
        <a href="#" class="font-display text-[20px] md:text-[22px] font-extrabold text-[color:var(--text-primary)] no-underline tracking-[-0.02em]">PORTFOLIO</a>
        
        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <template v-for="section in orderedSections" :key="'nav-' + section.id">
            <button v-if="section.id !== 'hero' && section.visible" @click="scrollToSection(section.id)" class="bg-transparent border-none text-[color:var(--text-secondary)] font-sans text-[15px] font-medium cursor-pointer transition-colors duration-200 hover:text-[color:var(--text-primary)]">{{ section.name }}</button>
          </template>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-[color:var(--text-primary)] p-2">
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <!-- Mobile Nav Dropdown -->
      <div v-if="isMobileMenuOpen" class="absolute top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-[color:var(--border-color)] md:hidden flex flex-col p-4 gap-4 shadow-2xl">
        <template v-for="section in orderedSections" :key="'mob-nav-' + section.id">
          <button v-if="section.id !== 'hero' && section.visible" @click="scrollToSection(section.id); isMobileMenuOpen = false" class="text-left bg-transparent border-none text-[color:var(--text-secondary)] font-sans text-[16px] font-medium cursor-pointer py-2 px-4 hover:bg-white/5 rounded-lg">{{ section.name }}</button>
        </template>
      </div>
    </header>

    <template v-for="section in orderedSections" :key="section.id">
      <!-- Hero Section -->
      <section v-if="section.id === 'hero' && section.visible" class="min-h-screen flex items-center pt-[100px] pb-[40px]">
      <div class="container flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16 justify-between text-center lg:text-left">
        <div class="max-w-[700px] flex flex-col items-center lg:items-start">
          <h1 class="text-[36px] sm:text-[44px] md:text-[54px] leading-[1.2] font-extrabold mb-6">
            {{ heroData.titleLine1 }}<br />
            <span class="gradient-text font-display">{{ heroData.titleLine2 }}</span>
          </h1>
          <div 
            class="text-[color:var(--text-secondary)] text-[16px] sm:text-[18px] leading-[1.6] mb-10 max-w-[90%] sm:max-w-full [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
            v-html="heroData.description"
          ></div>
          <div class="flex gap-4 flex-wrap justify-center lg:justify-start">
            <button @click="scrollToSection('projects')" class="btn btn-primary w-full sm:w-auto">
              View Projects
            </button>
            <a 
              v-if="cvSettings && cvSettings.cvUrl" 
              :href="cvSettings.cvUrl" 
              target="_blank" 
              class="btn btn-secondary w-full sm:w-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download CV
            </a>
          </div>
        </div>
        <div v-if="personalInfo && personalInfo.avatarUrl" class="flex-1 w-full flex justify-center lg:justify-end items-center">
          <img :src="personalInfo.avatarUrl" alt="Avatar" class="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full object-cover shadow-[0_0_40px_rgba(124,58,237,0.4)] border-2 border-[color:var(--border-color)]" />
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section v-else-if="section.id === 'skills' && section.visible" id="skills" class="py-12">
      <div class="container">
        <div class="text-center mb-10">
          <h2 class="text-[36px] font-extrabold mb-3 gradient-text">{{ section.name }}</h2>
          <p class="text-[color:var(--text-secondary)] text-[16px] max-w-[600px] mx-auto" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          <!-- Category: Frontend -->
          <div class="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 class="text-[18px] font-bold mb-6 text-center text-white border-b border-[color:var(--border-color)] pb-2.5 w-full">Frontend Development</h3>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6" v-if="frontendSkills.filter(s => s.displayType !== 'text').length > 0">
              <div v-for="skill in frontendSkills.filter(s => s.displayType !== 'text')" :key="skill.id" class="flex flex-col items-center group">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center mb-2.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110" />
                  <span v-else class="text-[20px] font-bold text-[color:var(--primary)]">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="text-[12px] sm:text-[13px] font-medium text-[color:var(--text-secondary)] text-center transition-colors duration-300 group-hover:text-white">{{ skill.name }}</div>
              </div>
            </div>
            <div v-if="frontendSkills.filter(s => s.displayType === 'text').length > 0" class="mt-6 flex flex-col gap-4 text-left px-4 w-full">
              <div v-for="skill in frontendSkills.filter(s => s.displayType === 'text')" :key="skill.id">
                <div class="whitespace-pre-wrap text-[14px] text-[color:var(--text-secondary)] leading-[1.6]">{{ skill.description }}</div>
              </div>
            </div>
            <div v-if="frontendSkills.length === 0" class="text-center text-[color:var(--text-secondary)] mt-2.5">Updating...</div>
          </div>

          <!-- Category: Backend -->
          <div class="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 class="text-[18px] font-bold mb-6 text-center text-white border-b border-[color:var(--border-color)] pb-2.5 w-full">Backend Development</h3>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6" v-if="backendSkills.filter(s => s.displayType !== 'text').length > 0">
              <div v-for="skill in backendSkills.filter(s => s.displayType !== 'text')" :key="skill.id" class="flex flex-col items-center group">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center mb-2.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110" />
                  <span v-else class="text-[20px] font-bold text-[color:var(--primary)]">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="text-[12px] sm:text-[13px] font-medium text-[color:var(--text-secondary)] text-center transition-colors duration-300 group-hover:text-white">{{ skill.name }}</div>
              </div>
            </div>
            <div v-if="backendSkills.filter(s => s.displayType === 'text').length > 0" class="mt-6 flex flex-col gap-4 text-left px-4 w-full">
              <div v-for="skill in backendSkills.filter(s => s.displayType === 'text')" :key="skill.id">
                <div class="whitespace-pre-wrap text-[14px] text-[color:var(--text-secondary)] leading-[1.6]">{{ skill.description }}</div>
              </div>
            </div>
            <div v-if="backendSkills.length === 0" class="text-center text-[color:var(--text-secondary)] mt-2.5">Updating...</div>
          </div>

          <!-- Category: AI & Automation -->
          <div class="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 class="text-[18px] font-bold mb-6 text-center text-white border-b border-[color:var(--border-color)] pb-2.5 w-full">AI & Automation</h3>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6" v-if="aiSkills.filter(s => s.displayType !== 'text').length > 0">
              <div v-for="skill in aiSkills.filter(s => s.displayType !== 'text')" :key="skill.id" class="flex flex-col items-center group">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center mb-2.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110" />
                  <span v-else class="text-[20px] font-bold text-[color:var(--primary)]">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="text-[12px] sm:text-[13px] font-medium text-[color:var(--text-secondary)] text-center transition-colors duration-300 group-hover:text-white">{{ skill.name }}</div>
              </div>
            </div>
            <div v-if="aiSkills.filter(s => s.displayType === 'text').length > 0" class="mt-6 flex flex-col gap-4 text-left px-4 w-full">
              <div v-for="skill in aiSkills.filter(s => s.displayType === 'text')" :key="skill.id">
                <div class="whitespace-pre-wrap text-[14px] text-[color:var(--text-secondary)] leading-[1.6]">{{ skill.description }}</div>
              </div>
            </div>
            <div v-if="aiSkills.length === 0" class="text-center text-[color:var(--text-secondary)] mt-2.5">Updating...</div>
          </div>

          <!-- Category: Tools & DevOps -->
          <div class="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 class="text-[18px] font-bold mb-6 text-center text-white border-b border-[color:var(--border-color)] pb-2.5 w-full">Tools & DevOps</h3>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6" v-if="toolsSkills.filter(s => s.displayType !== 'text').length > 0">
              <div v-for="skill in toolsSkills.filter(s => s.displayType !== 'text')" :key="skill.id" class="flex flex-col items-center group">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center mb-2.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110" />
                  <span v-else class="text-[20px] font-bold text-[color:var(--primary)]">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="text-[12px] sm:text-[13px] font-medium text-[color:var(--text-secondary)] text-center transition-colors duration-300 group-hover:text-white">{{ skill.name }}</div>
              </div>
            </div>
            <div v-if="toolsSkills.filter(s => s.displayType === 'text').length > 0" class="mt-6 flex flex-col gap-4 text-left px-4 w-full">
              <div v-for="skill in toolsSkills.filter(s => s.displayType === 'text')" :key="skill.id">
                <div class="whitespace-pre-wrap text-[14px] text-[color:var(--text-secondary)] leading-[1.6]">{{ skill.description }}</div>
              </div>
            </div>
            <div v-if="toolsSkills.length === 0" class="text-center text-[color:var(--text-secondary)] mt-2.5">Updating...</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section v-else-if="section.id === 'experience' && section.visible" id="experience" class="py-12">
      <div class="container">
        <div class="text-center mb-10">
          <h2 class="text-[36px] font-extrabold mb-3 gradient-text">{{ section.name }}</h2>
          <p class="text-[color:var(--text-secondary)] text-[16px] max-w-[600px] mx-auto" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <Timeline v-if="mappedExperiences && mappedExperiences.length > 0" :items="mappedExperiences" />
        <div v-else class="text-center text-[color:var(--text-secondary)] py-10">
          Experience data is being updated...
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section v-else-if="section.id === 'projects' && section.visible" id="projects" class="py-12">
      <div class="container">
        <div class="text-center mb-10">
          <h2 class="text-[36px] font-extrabold mb-3 gradient-text">{{ section.name }}</h2>
          <p class="text-[color:var(--text-secondary)] text-[16px] max-w-[600px] mx-auto" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <div v-if="mappedProjects && mappedProjects.length > 0" class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 sm:gap-8">
          <ProjectCard 
            v-for="project in mappedProjects" 
            :key="project.id" 
            :project="project"
            :skills="skills || []"
          />
        </div>
        <div v-else class="text-center text-[color:var(--text-secondary)] py-10">
          Projects are being updated...
        </div>
      </div>
    </section>
    </template>

    <!-- Footer -->
    <footer class="mt-auto border-t border-[color:var(--border-color)] py-8 bg-slate-900/40">
      <div class="container flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p class="text-[color:var(--text-secondary)] text-[14px]">&copy; {{ new Date().getFullYear() }} Personal Portfolio. All rights reserved.</p>
        <div class="flex gap-6">
        </div>
      </div>
    </footer>
  </div>
</template>

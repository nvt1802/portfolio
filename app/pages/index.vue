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
  level?: string
  order: number
  iconUrl?: string
  iconPath?: string
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

// Nav links smooth scroll helper
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="portfolio-wrapper">
    <!-- Glow Backdrop Effects -->
    <div class="glow-backdrop">
      <div class="glow-orb-1"></div>
      <div class="glow-orb-2"></div>
    </div>

    <!-- Header Navigation -->
    <header class="header">
      <div class="container nav-container">
        <a href="#" class="logo">PORTFOLIO</a>
        <nav class="nav-links">
          <template v-for="section in orderedSections" :key="'nav-' + section.id">
            <button v-if="section.id !== 'hero' && section.visible" @click="scrollToSection(section.id)">{{ section.name }}</button>
          </template>
          <NuxtLink to="/admin" class="nav-admin-btn">
            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Admin
          </NuxtLink>
        </nav>
      </div>
    </header>

    <template v-for="section in orderedSections" :key="section.id">
      <!-- Hero Section -->
      <section v-if="section.id === 'hero' && section.visible" class="hero-section">
      <div class="container hero-container" style="display: flex; gap: 40px; justify-content: space-between; flex-wrap: wrap-reverse;">
        <div class="hero-content">
          <div class="badge badge-primary hero-badge">{{ heroData.badgeText }}</div>
          <h1 class="hero-title">
            {{ heroData.titleLine1 }}<br />
            <span class="gradient-text font-display">{{ heroData.titleLine2 }}</span>
          </h1>
          <p class="hero-description">
            {{ heroData.description }}
          </p>
          <div class="hero-actions">
            <button @click="scrollToSection('projects')" class="btn btn-primary">
              View Projects
            </button>
            <a 
              v-if="cvSettings && cvSettings.cvUrl" 
              :href="cvSettings.cvUrl" 
              target="_blank" 
              class="btn btn-secondary"
            >
              <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download CV (PDF)
            </a>
          </div>
        </div>
        <div v-if="personalInfo && personalInfo.avatarUrl" class="hero-image" style="flex: 1; min-width: 280px; display: flex; justify-content: center; align-items: center;">
          <img :src="personalInfo.avatarUrl" alt="Avatar" style="width: 320px; height: 320px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 40px rgba(124, 58, 237, 0.4); border: 2px solid var(--border-color);" />
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section v-else-if="section.id === 'skills' && section.visible" id="skills" class="skills-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">{{ section.name }}</h2>
          <p class="section-subtitle" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <div class="skills-grid-new">
          <!-- Category: Frontend -->
          <div class="skills-category-container">
            <h3 class="skills-category-title">Frontend Development</h3>
            <div class="skills-circles-grid">
              <div v-for="skill in frontendSkills" :key="skill.id" class="skill-circle-item">
                <div class="skill-circle-wrapper">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="skill-circle-img" />
                  <span v-else class="skill-circle-placeholder">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="skill-circle-name">{{ skill.name }}</div>
                <div class="skill-circle-level">{{ skill.level || 'N/A' }}</div>
              </div>
            </div>
            <div v-if="frontendSkills.length === 0" style="text-align: center; color: var(--text-secondary); margin-top: 10px;">Updating...</div>
          </div>

          <!-- Category: Backend -->
          <div class="skills-category-container">
            <h3 class="skills-category-title">Backend Development</h3>
            <div class="skills-circles-grid">
              <div v-for="skill in backendSkills" :key="skill.id" class="skill-circle-item">
                <div class="skill-circle-wrapper">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="skill-circle-img" />
                  <span v-else class="skill-circle-placeholder">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="skill-circle-name">{{ skill.name }}</div>
                <div class="skill-circle-level">{{ skill.level || 'N/A' }}</div>
              </div>
            </div>
            <div v-if="backendSkills.length === 0" style="text-align: center; color: var(--text-secondary); margin-top: 10px;">Updating...</div>
          </div>

          <!-- Category: AI & Automation -->
          <div class="skills-category-container">
            <h3 class="skills-category-title">AI & Automation</h3>
            <div class="skills-circles-grid">
              <div v-for="skill in aiSkills" :key="skill.id" class="skill-circle-item">
                <div class="skill-circle-wrapper">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="skill-circle-img" />
                  <span v-else class="skill-circle-placeholder">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="skill-circle-name">{{ skill.name }}</div>
                <div class="skill-circle-level">{{ skill.level || 'N/A' }}</div>
              </div>
            </div>
            <div v-if="aiSkills.length === 0" style="text-align: center; color: var(--text-secondary); margin-top: 10px;">Updating...</div>
          </div>

          <!-- Category: Tools & DevOps -->
          <div class="skills-category-container">
            <h3 class="skills-category-title">Tools & DevOps</h3>
            <div class="skills-circles-grid">
              <div v-for="skill in toolsSkills" :key="skill.id" class="skill-circle-item">
                <div class="skill-circle-wrapper">
                  <NuxtImg v-if="skill.iconUrl" :src="skill.iconUrl" :alt="skill.name" class="skill-circle-img" />
                  <span v-else class="skill-circle-placeholder">{{ skill.name.charAt(0) }}</span>
                </div>
                <div class="skill-circle-name">{{ skill.name }}</div>
                <div class="skill-circle-level">{{ skill.level || 'N/A' }}</div>
              </div>
            </div>
            <div v-if="toolsSkills.length === 0" style="text-align: center; color: var(--text-secondary); margin-top: 10px;">Updating...</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section v-else-if="section.id === 'experience' && section.visible" id="experience" class="experience-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">{{ section.name }}</h2>
          <p class="section-subtitle" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <Timeline v-if="mappedExperiences && mappedExperiences.length > 0" :items="mappedExperiences" />
        <div v-else style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
          Experience data is being updated...
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section v-else-if="section.id === 'projects' && section.visible" id="projects" class="projects-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">{{ section.name }}</h2>
          <p class="section-subtitle" v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>

        <div v-if="mappedProjects && mappedProjects.length > 0" class="projects-grid">
          <ProjectCard 
            v-for="project in mappedProjects" 
            :key="project.id" 
            :project="project" 
          />
        </div>
        <div v-else style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
          Projects are being updated...
        </div>
      </div>
    </section>
    </template>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-container">
        <p class="copyright">&copy; {{ new Date().getFullYear() }} Personal Portfolio. All rights reserved.</p>
        <div class="footer-links">
          <NuxtLink to="/admin" style="color: var(--text-muted); text-decoration: none; font-size: 14px;">Admin Panel</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.portfolio-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Navigation */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 50;
  display: flex;
  align-items: center;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.nav-links button:hover {
  color: var(--text-primary);
}

.nav-admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: var(--border-color);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  transition: var(--transition-fast);
}

.nav-admin-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-color-hover);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 80px;
}

.hero-container {
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 700px;
}

.hero-badge {
  margin-bottom: 24px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
}

.hero-title {
  font-size: 54px;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }
}

.hero-description {
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

/* Skills Section */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.skill-category-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-text {
  color: var(--text-muted);
  font-size: 14px;
  font-style: italic;
}

/* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

/* Footer */
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  padding: 30px 0;
  background: rgba(15, 23, 42, 0.4);
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  color: var(--text-secondary);
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 24px;
}
</style>

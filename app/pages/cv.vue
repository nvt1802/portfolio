<script setup lang="ts">
import { doc, collection, getDocs } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'

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

const filteredProjects = computed(() => {
  if (!cvProfileRef.value || !cvProfileRef.value.selectedProjects) return []
  return projects.value
    .filter(p => cvProfileRef.value!.selectedProjects.includes(p.id))
    .sort((a, b) => (b.order || 0) - (a.order || 0))
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
  <div class="cv-wrapper">
    <!-- Print Action Button (Hidden when printing) -->
    <div class="print-actions no-print">
      <button @click="printCv" class="print-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Print to PDF
      </button>
      <NuxtLink to="/" class="back-link">Back to Home</NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state no-print">
      Loading CV data...
    </div>

    <!-- CV Document -->
    <div v-else-if="cvProfileRef && personalInfo" class="cv-document">
      
      <!-- Header / Personal Info -->
      <header class="cv-header">
        <div class="cv-header-content" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">
          <div class="cv-header-text">
            <h1 class="cv-name">{{ personalInfo.fullName || 'Your Name' }}</h1>
            <h2 class="cv-title">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
            
            <div class="cv-contact">
              <div v-if="personalInfo.email" class="contact-item">
                <strong>Email:</strong> {{ personalInfo.email }}
              </div>
              <div v-if="personalInfo.phone" class="contact-item">
                <strong>Phone:</strong> {{ personalInfo.phone }}
              </div>
              <div v-if="personalInfo.website" class="contact-item">
                <strong>Web:</strong> <a :href="personalInfo.website" target="_blank">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a>
              </div>
              <div v-if="personalInfo.linkedin" class="contact-item">
                <strong>LinkedIn:</strong> <a :href="'https://' + personalInfo.linkedin" target="_blank">{{ personalInfo.linkedin }}</a>
              </div>
              <div v-if="personalInfo.github" class="contact-item">
                <strong>GitHub:</strong> <a :href="'https://' + personalInfo.github" target="_blank">{{ personalInfo.github }}</a>
              </div>
            </div>
          </div>
          
          <!-- Avatar (CV Avatar or Personal Avatar) -->
          <div v-if="cvProfileRef.cvAvatarUrl || personalInfo.avatarUrl" class="cv-avatar" style="flex-shrink: 0;">
            <img :src="cvProfileRef.cvAvatarUrl || personalInfo.avatarUrl" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color); box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
          </div>
        </div>

        <div v-if="personalInfo.summary" class="cv-summary" style="margin-top: 16px;">
          <p>{{ personalInfo.summary }}</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="cv-main">
        
        <!-- Experience Section -->
        <section v-if="filteredExperiences.length > 0" class="cv-section">
          <h3 class="section-title">Work Experience</h3>
          <div class="section-content">
            <div v-for="exp in filteredExperiences" :key="exp.id" class="exp-item">
              <div class="exp-header">
                <div class="exp-role-company">
                  <span class="exp-role">{{ exp.role }}</span>
                  <span class="separator">|</span>
                  <span class="exp-company">{{ exp.company }} <span v-if="exp.projectName" style="font-weight: normal; margin-left: 4px;">— Project: {{ exp.projectName }}</span></span>
                </div>
                <div class="exp-period">{{ exp.startDate || '' }} - {{ exp.endDate || 'Present' }}</div>
              </div>
              <div class="exp-desc" v-html="exp.description"></div>
            </div>
          </div>
        </section>

        <!-- Projects Section -->
        <section v-if="filteredProjects.length > 0" class="cv-section">
          <h3 class="section-title">Featured Projects</h3>
          <div class="section-content">
            <div v-for="proj in filteredProjects" :key="proj.id" class="proj-item">
              <div class="proj-header">
                <span class="proj-title">{{ proj.title }}</span>
                <a v-if="proj.link" :href="proj.link" target="_blank" class="proj-link">{{ proj.link.replace(/^https?:\/\//, '') }}</a>
              </div>
              <div class="proj-tech">
                <span v-for="tech in proj.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
              <div class="proj-desc" v-html="proj.description"></div>
            </div>
          </div>
        </section>

        <!-- Skills Section -->
        <section v-if="filteredSkills.length > 0" class="cv-section">
          <h3 class="section-title">SKILL</h3>
          <div class="section-content">
            <table class="cv-skills-table" style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                  <td style="width: 25%; padding: 12px 0; vertical-align: top; font-weight: 700; color: var(--cv-primary);">
                    {{ categoryName }}
                  </td>
                  <td style="width: 75%; padding: 12px 0; vertical-align: top; color: var(--cv-text);">
                    <!-- Icon Skills (comma separated) -->
                    <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" style="margin-bottom: 4px;">
                      {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(', ') }}
                    </div>
                    
                    <!-- Text Skills (bullet points) -->
                    <div v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin-top: 4px;">
                      {{ skill.description }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
    
    <div v-else class="loading-state no-print">
      No CV configuration found. Please go to the admin panel to create one.
    </div>

  </div>
</template>

<style scoped>
/* Reset and Base Variables for CV */
.cv-wrapper {
  --cv-bg: #ffffff;
  --cv-text: #333333;
  --cv-text-light: #666666;
  --cv-primary: #111111;
  --cv-accent: #2563eb;
  --cv-border: #e5e7eb;
  
  background-color: #f3f4f6; /* Gray background outside A4 */
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--cv-text);
  line-height: 1.6;
}

/* Print Actions (Floating) */
.print-actions {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 100;
}
.print-btn {
  background: var(--cv-accent);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.print-btn:hover {
  background: #1d4ed8;
}
.print-btn svg {
  width: 20px;
  height: 20px;
}
.back-link {
  background: white;
  color: var(--cv-text);
  border: 1px solid var(--cv-border);
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}
.loading-state {
  text-align: center;
  margin-top: 100px;
  color: var(--cv-text-light);
}

/* A4 Document styling */
.cv-document {
  background: var(--cv-bg);
  max-width: 210mm; /* A4 width */
  min-height: 297mm; /* A4 height */
  margin: 0 auto;
  padding: 20mm;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  border-radius: 4px;
}

/* Header */
.cv-header {
  border-bottom: 2px solid var(--cv-primary);
  padding-bottom: 20px;
  margin-bottom: 24px;
}
.cv-name {
  font-size: 32px;
  font-weight: 800;
  color: var(--cv-primary);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cv-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--cv-accent);
  margin: 0 0 16px 0;
}
.cv-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--cv-text-light);
  margin-bottom: 16px;
}
.cv-contact a {
  color: var(--cv-text-light);
  text-decoration: none;
}
.cv-summary {
  font-size: 14px;
  color: var(--cv-text);
  text-align: justify;
}
.cv-summary p {
  margin: 0;
}

/* Main Content */
.cv-section {
  margin-bottom: 28px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--cv-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
  border-bottom: 1px solid var(--cv-border);
  padding-bottom: 6px;
}

/* Experience */
.exp-item {
  margin-bottom: 20px;
}
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.exp-role {
  font-weight: 700;
  color: var(--cv-primary);
  font-size: 15px;
}
.separator {
  margin: 0 6px;
  color: var(--cv-text-light);
}
.exp-company {
  font-weight: 500;
  font-size: 14px;
}
.exp-period {
  font-size: 13px;
  color: var(--cv-text-light);
  font-style: italic;
}
.exp-desc {
  font-size: 14px;
  color: var(--cv-text);
}
.exp-desc :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}
.exp-desc :deep(li) {
  margin-bottom: 4px;
}

/* Projects */
.proj-item {
  margin-bottom: 20px;
}
.proj-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.proj-title {
  font-weight: 700;
  color: var(--cv-primary);
  font-size: 15px;
}
.proj-link {
  font-size: 12px;
  color: var(--cv-accent);
  text-decoration: none;
}
.proj-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.tech-tag {
  background: #f3f4f6;
  color: #4b5563;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}
.proj-desc {
  font-size: 14px;
}

/* Skills */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.skill-item {
  background: var(--cv-primary);
  color: white;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

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
  
  .cv-wrapper {
    padding: 0;
    background: transparent;
  }
  
  .cv-document {
    box-shadow: none;
    max-width: none;
    width: 210mm;
    margin: 0;
    padding: 20mm;
  }

  .no-print {
    display: none !important;
  }

  /* Avoid page breaks inside items */
  .exp-item, .proj-item, .skill-item {
    page-break-inside: avoid;
  }
}
</style>

<script setup lang="ts">
defineProps<{
  personalInfo: any
  cvProfileRef: any
  filteredExperiences: any[]
  filteredProjects: any[]
  groupedSkills: Record<string, any[]>
}>()
</script>

<template>
  <div class="cv-document">
    <div class="cv-layout">
      <!-- Left Column: Sidebar -->
      <aside class="cv-sidebar">
        <!-- Avatar -->
        <div v-if="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" class="cv-avatar-container">
          <img :src="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" alt="Avatar" class="cv-avatar-img" />
        </div>
        
        <!-- Contact -->
        <section class="sidebar-section">
          <h3 class="sidebar-title">Contact</h3>
          <div class="contact-list">
            <div v-if="personalInfo.email" class="contact-item">
              <span class="contact-icon">✉</span> {{ personalInfo.email }}
            </div>
            <div v-if="personalInfo.phone" class="contact-item">
              <span class="contact-icon">☏</span> {{ personalInfo.phone }}
            </div>
            <div v-if="personalInfo.website" class="contact-item">
              <span class="contact-icon">🌐</span> <a :href="personalInfo.website" target="_blank">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a>
            </div>
            <div v-if="personalInfo.linkedin" class="contact-item">
              <span class="contact-icon">in</span> <a :href="'https://' + personalInfo.linkedin" target="_blank">{{ personalInfo.linkedin }}</a>
            </div>
            <div v-if="personalInfo.github" class="contact-item">
              <span class="contact-icon">gh</span> <a :href="'https://' + personalInfo.github" target="_blank">{{ personalInfo.github }}</a>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="Object.keys(groupedSkills).length > 0" class="sidebar-section">
          <h3 class="sidebar-title">Skills</h3>
          <div v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="skill-category">
            <h4 class="skill-category-name">{{ categoryName }}</h4>
            
            <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="icon-skills">
              {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(', ') }}
            </div>
            
            <ul class="text-skills-list">
              <li v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="text-skill-item">
                {{ skill.description }}
              </li>
            </ul>
          </div>
        </section>
      </aside>

      <!-- Right Column: Main Content -->
      <main class="cv-main">
        <!-- Header / Name -->
        <header class="cv-header">
          <h1 class="cv-name">{{ personalInfo.fullName || 'Your Name' }}</h1>
          <h2 class="cv-title">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
          <div v-if="personalInfo.summary" class="cv-summary">
            <p>{{ personalInfo.summary }}</p>
          </div>
        </header>

        <!-- Experience Section -->
        <section v-if="filteredExperiences.length > 0" class="cv-section">
          <h3 class="section-title">Work Experience</h3>
          <div class="section-content">
            <div v-for="exp in filteredExperiences" :key="exp.id" class="exp-item">
              <div class="exp-header">
                <div class="exp-role-company">
                  <span class="exp-role">{{ exp.role }}</span>
                  <span class="exp-company">at {{ exp.company }} <span v-if="exp.projectName" style="font-weight: normal;">(Project: {{ exp.projectName }})</span></span>
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

      </main>
    </div>
  </div>
</template>

<style scoped>
/* A4 Document styling */
.cv-document {
  background: var(--cv-bg);
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.cv-layout {
  display: flex;
  min-height: 297mm;
}

/* Sidebar */
.cv-sidebar {
  width: 32%;
  background-color: #f8fafc;
  padding: 40px 24px;
  border-right: 1px solid var(--cv-border);
}

.cv-avatar-container {
  text-align: center;
  margin-bottom: 32px;
}

.cv-avatar-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.sidebar-section {
  margin-bottom: 32px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--cv-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 16px 0;
  border-bottom: 2px solid var(--cv-accent);
  padding-bottom: 8px;
  display: inline-block;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  color: var(--cv-text);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  word-break: break-all;
}

.contact-icon {
  color: var(--cv-accent);
  font-weight: bold;
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.contact-list a {
  color: inherit;
  text-decoration: none;
}

.skill-category {
  margin-bottom: 20px;
}

.skill-category-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--cv-primary);
  margin: 0 0 8px 0;
}

.icon-skills {
  font-size: 13px;
  color: var(--cv-text);
  margin-bottom: 8px;
  line-height: 1.5;
}

.text-skills-list {
  list-style-type: disc;
  padding-left: 16px;
  margin: 0;
  font-size: 12px;
  color: var(--cv-text-light);
  line-height: 1.5;
}

.text-skill-item {
  margin-bottom: 4px;
  white-space: pre-wrap;
}

/* Main Content */
.cv-main {
  width: 68%;
  padding: 40px 32px;
}

.cv-header {
  margin-bottom: 36px;
}

.cv-name {
  font-size: 38px;
  font-weight: 800;
  color: var(--cv-primary);
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.cv-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--cv-accent);
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cv-summary {
  font-size: 14px;
  color: var(--cv-text);
  line-height: 1.7;
}
.cv-summary p {
  margin: 0;
}

.cv-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--cv-primary);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title::after {
  content: "";
  flex-grow: 1;
  height: 1px;
  background-color: var(--cv-border);
}

/* Experience */
.exp-item {
  margin-bottom: 24px;
}
.exp-header {
  margin-bottom: 8px;
}
.exp-role-company {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}
.exp-role {
  font-weight: 700;
  color: var(--cv-primary);
  font-size: 16px;
}
.exp-company {
  font-weight: 500;
  font-size: 14px;
  color: var(--cv-text-light);
}
.exp-period {
  font-size: 12px;
  color: var(--cv-accent);
  font-weight: 600;
}
.exp-desc {
  font-size: 13px;
  color: var(--cv-text);
  line-height: 1.6;
}
.exp-desc :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}
.exp-desc :deep(li) {
  margin-bottom: 6px;
}

/* Projects */
.proj-item {
  margin-bottom: 24px;
}
.proj-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}
.proj-title {
  font-weight: 700;
  color: var(--cv-primary);
  font-size: 16px;
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
  margin-bottom: 10px;
}
.tech-tag {
  background: white;
  border: 1px solid var(--cv-border);
  color: #4b5563;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
.proj-desc {
  font-size: 13px;
  line-height: 1.6;
}

/* @media print for PDF Export */
@media print {
  .cv-document {
    box-shadow: none;
    max-width: none;
    width: 210mm;
    margin: 0;
  }
}
</style>

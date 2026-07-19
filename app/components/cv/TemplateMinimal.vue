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
    
    <!-- Header -->
    <header class="cv-header">
      <h1 class="cv-name">{{ personalInfo.fullName || 'Your Name' }}</h1>
      <h2 class="cv-title">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
      
      <div class="cv-contact">
        <span v-if="personalInfo.email">{{ personalInfo.email }}</span>
        <span v-if="personalInfo.phone">{{ personalInfo.phone }}</span>
        <span v-if="personalInfo.website"><a :href="personalInfo.website" target="_blank">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a></span>
        <span v-if="personalInfo.linkedin"><a :href="'https://' + personalInfo.linkedin" target="_blank">{{ personalInfo.linkedin }}</a></span>
        <span v-if="personalInfo.github"><a :href="'https://' + personalInfo.github" target="_blank">{{ personalInfo.github }}</a></span>
      </div>

      <div v-if="personalInfo.summary" class="cv-summary">
        <p>{{ personalInfo.summary }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="cv-main">
      
      <!-- Experience -->
      <section v-if="filteredExperiences.length > 0" class="cv-section">
        <h3 class="section-title">Experience</h3>
        
        <div v-for="exp in filteredExperiences" :key="exp.id" class="exp-item">
          <div class="exp-header">
            <span class="exp-role">{{ exp.role }}</span>
            <span class="exp-company">{{ exp.company }}</span>
            <span class="exp-period">{{ exp.startDate || '' }} – {{ exp.endDate || 'Present' }}</span>
          </div>
          <div v-if="exp.projectName" class="exp-project">Project: {{ exp.projectName }}</div>
          <div class="exp-desc" v-html="exp.description"></div>
        </div>
      </section>

      <!-- Projects -->
      <section v-if="filteredProjects.length > 0" class="cv-section">
        <h3 class="section-title">Projects</h3>
        
        <div v-for="proj in filteredProjects" :key="proj.id" class="proj-item">
          <div class="proj-header">
            <span class="proj-title">{{ proj.title }}</span>
            <a v-if="proj.link" :href="proj.link" target="_blank" class="proj-link">{{ proj.link.replace(/^https?:\/\//, '') }}</a>
          </div>
          <div class="proj-tech">
            <span v-for="tech in proj.technologies" :key="tech" class="tech-text">{{ tech }}</span>
          </div>
          <div class="proj-desc" v-html="proj.description"></div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="Object.keys(groupedSkills).length > 0" class="cv-section">
        <h3 class="section-title">Skills</h3>
        
        <div v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="skill-category">
          <h4 class="skill-category-name">{{ categoryName }}</h4>
          <div class="skill-content">
            <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="icon-skills">
              {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(' • ') }}
            </div>
            
            <div v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="text-skill">
              {{ skill.description }}
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* A4 Document styling */
.cv-document {
  background: white;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 25mm 20mm;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  color: #111;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

/* Header */
.cv-header {
  margin-bottom: 40px;
}

.cv-name {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 8px 0;
}

.cv-title {
  font-size: 16px;
  font-weight: 400;
  color: #666;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
}

.cv-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: #555;
  margin-bottom: 24px;
}

.cv-contact span:not(:last-child)::after {
  content: "|";
  margin-left: 16px;
  color: #ccc;
}

.cv-contact a {
  color: inherit;
  text-decoration: none;
}

.cv-summary {
  font-size: 13px;
  color: #333;
  text-align: justify;
  line-height: 1.6;
}
.cv-summary p {
  margin: 0;
}

/* Main Content */
.cv-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
  padding-bottom: 4px;
}

/* Experience */
.exp-item {
  margin-bottom: 20px;
}

.exp-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.exp-role {
  font-weight: 600;
  font-size: 14px;
}

.exp-company {
  font-weight: 400;
  font-size: 14px;
  color: #555;
}

.exp-period {
  font-size: 12px;
  color: #888;
  margin-left: auto;
}

.exp-project {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-bottom: 6px;
}

.exp-desc {
  font-size: 13px;
  color: #333;
}
.exp-desc :deep(ul) {
  margin: 4px 0;
  padding-left: 16px;
}
.exp-desc :deep(li) {
  margin-bottom: 2px;
}

/* Projects */
.proj-item {
  margin-bottom: 20px;
}

.proj-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}

.proj-title {
  font-weight: 600;
  font-size: 14px;
}

.proj-link {
  font-size: 12px;
  color: #666;
  text-decoration: underline;
}

.proj-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666;
}

.tech-text {
  font-style: italic;
}

.tech-text:not(:last-child)::after {
  content: ",";
  font-style: normal;
}

.proj-desc {
  font-size: 13px;
  color: #333;
}

/* Skills */
.skill-category {
  display: flex;
  margin-bottom: 12px;
}

.skill-category-name {
  width: 140px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 13px;
  margin: 0;
}

.skill-content {
  flex-grow: 1;
}

.icon-skills {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.text-skill {
  font-size: 13px;
  color: #555;
  white-space: pre-wrap;
  margin-bottom: 4px;
}

/* @media print for PDF Export */
@media print {
  .cv-document {
    box-shadow: none;
    max-width: none;
    width: 210mm;
    margin: 0;
    padding: 25mm 20mm;
  }
}
</style>

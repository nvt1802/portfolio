<script setup lang="ts">
export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  demoLink?: string
  githubLink?: string
  imageUrl?: string
  imagePath?: string
  companyName?: string
}

defineProps<{
  project: Project
}>()
</script>

<template>
  <div class="glass-card project-card">
    <div class="project-img-wrapper">
      <NuxtImg 
        v-if="project.imageUrl" 
        :src="project.imageUrl" 
        :alt="project.title"
        loading="lazy"
        class="project-img"
      />
      <div v-else class="project-img-placeholder">
        <span>{{ project.title.charAt(0) }}</span>
      </div>
    </div>
    
    <div class="project-info">
      <h3 class="project-title" style="margin-bottom: 4px;">{{ project.title }}</h3>
      <div v-if="project.companyName" style="color: var(--accent); font-size: 13px; margin-bottom: 12px; display: inline-flex; align-items: center; gap: 4px;">
        <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"></path>
        </svg>
        {{ project.companyName }}
      </div>
      <p class="project-desc">{{ project.description }}</p>
      
      <div class="project-tags">
        <span 
          v-for="tech in project.techStack" 
          :key="tech" 
          class="badge badge-accent"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="project-links">
        <a 
          v-if="project.githubLink" 
          :href="project.githubLink" 
          target="_blank" 
          class="project-link"
        >
          <svg style="width:16px;height:16px;" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          GitHub
        </a>
        <a 
          v-if="project.demoLink" 
          :href="project.demoLink" 
          target="_blank" 
          class="project-link demo-link"
        >
          <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Live Demo
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0;
  border-radius: var(--radius-md);
}

.project-img-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.project-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.project-card:hover .project-img {
  transform: scale(1.05);
}

.project-img-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  color: var(--primary);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.project-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.project-desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  margin-bottom: 20px;
}

.project-links {
  display: flex;
  gap: 16px;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.project-link:hover {
  color: var(--text-primary);
}

.demo-link {
  color: var(--accent);
}

.demo-link:hover {
  color: #22d3ee;
}
</style>

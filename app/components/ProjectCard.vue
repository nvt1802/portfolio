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
  <div class="flex flex-col h-full overflow-hidden bg-[color:var(--glass-bg)] backdrop-blur-[12px] border border-[color:var(--glass-border)] rounded-2xl p-0 transition-all duration-300 hover:-translate-y-2 hover:border-[color:var(--border-color-hover)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6),0_0_25px_0_var(--primary-glow)] group">
    <div class="relative w-full h-40 sm:h-48 bg-white/2 overflow-hidden border-b border-[color:var(--border-color)]">
      <NuxtImg 
        v-if="project.imageUrl" 
        :src="project.imageUrl" 
        :alt="project.title"
        loading="lazy"
        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="absolute top-0 left-0 w-full h-full flex items-center justify-center font-display text-[48px] font-extrabold text-[color:var(--primary)] bg-gradient-to-br from-violet-600/10 to-pink-500/5 transition-transform duration-500 group-hover:scale-110">
        <span>{{ project.title.charAt(0) }}</span>
      </div>
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- View Project Button -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
        <a 
          v-if="project.demoLink || project.githubLink" 
          :href="project.demoLink || project.githubLink"
          target="_blank"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-[14px] hover:bg-white/20 hover:scale-105 transition-all no-underline"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          View Project
        </a>
      </div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
      <h3 class="text-[18px] font-bold mb-1">{{ project.title }}</h3>
      <div v-if="project.companyName" class="text-[color:var(--accent)] text-[13px] mb-3 inline-flex items-center gap-1">
        <svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"></path>
        </svg>
        {{ project.companyName }}
      </div>
      <p class="text-[color:var(--text-secondary)] text-[14px] mb-5 leading-relaxed line-clamp-3">{{ project.description }}</p>
      
      <div class="flex flex-wrap gap-1.5 mt-auto mb-5">
        <span 
          v-for="tech in project.techStack" 
          :key="tech" 
          class="inline-flex px-3 py-1 rounded-full text-[12px] font-medium bg-white/5 text-white/80 border border-white/10 backdrop-blur-sm transition-colors duration-200 group-hover:border-white/20 group-hover:text-white"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="flex gap-4 border-t border-[color:var(--border-color)] pt-4">
        <a 
          v-if="project.githubLink" 
          :href="project.githubLink" 
          target="_blank" 
          class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[color:var(--text-secondary)] no-underline transition-colors duration-200 hover:text-white"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          GitHub
        </a>
        <a 
          v-if="project.demoLink" 
          :href="project.demoLink" 
          target="_blank" 
          class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[color:var(--accent)] no-underline transition-all duration-300 hover:text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Live Demo
        </a>
      </div>
    </div>
  </div>
</template>

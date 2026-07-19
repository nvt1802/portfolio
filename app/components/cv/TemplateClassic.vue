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
  <div class="bg-[color:var(--cv-bg)] max-w-[210mm] min-h-[297mm] mx-auto p-[20mm] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] rounded print:shadow-none print:max-w-none print:w-[210mm] print:m-0 print:p-[20mm]">
    <!-- Header / Personal Info -->
    <header class="border-b-2 border-[color:var(--cv-primary)] pb-5 mb-6">
      <div class="flex justify-between items-start gap-6">
        <div>
          <h1 class="text-[32px] font-extrabold text-[color:var(--cv-primary)] m-0 mb-1 uppercase tracking-[1px]">{{ personalInfo.fullName || 'Your Name' }}</h1>
          <h2 class="text-[18px] font-medium text-[color:var(--cv-accent)] m-0 mb-4">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
          
          <div class="flex flex-wrap gap-4 text-[13px] text-[color:var(--cv-text-light)] mb-4">
            <div v-if="personalInfo.email">
              <strong>Email:</strong> {{ personalInfo.email }}
            </div>
            <div v-if="personalInfo.phone">
              <strong>Phone:</strong> {{ personalInfo.phone }}
            </div>
            <div v-if="personalInfo.website">
              <strong>Web:</strong> <a :href="personalInfo.website" target="_blank" class="text-[color:var(--cv-text-light)] no-underline">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a>
            </div>
            <div v-if="personalInfo.linkedin">
              <strong>LinkedIn:</strong> <a :href="'https://' + personalInfo.linkedin" target="_blank" class="text-[color:var(--cv-text-light)] no-underline">{{ personalInfo.linkedin }}</a>
            </div>
            <div v-if="personalInfo.github">
              <strong>GitHub:</strong> <a :href="'https://' + personalInfo.github" target="_blank" class="text-[color:var(--cv-text-light)] no-underline">{{ personalInfo.github }}</a>
            </div>
          </div>
        </div>
        
        <!-- Avatar (CV Avatar or Personal Avatar) -->
        <div v-if="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" class="shrink-0">
          <img :src="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" alt="Avatar" class="w-[120px] h-[120px] rounded-full object-cover border-2 border-[color:var(--border-color)] shadow-[0_4px_10px_rgba(0,0,0,0.1)]" />
        </div>
      </div>

      <div v-if="personalInfo.summary" class="mt-4 text-[14px] text-[color:var(--cv-text)] text-justify">
        <p class="m-0">{{ personalInfo.summary }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      
      <!-- Experience Section -->
      <section v-if="filteredExperiences.length > 0" class="mb-7">
        <h3 class="text-[16px] font-bold text-[color:var(--cv-primary)] uppercase tracking-[0.5px] m-0 mb-4 border-b border-[color:var(--cv-border)] pb-1.5">Work Experience</h3>
        <div>
          <div v-for="exp in filteredExperiences" :key="exp.id" class="mb-5">
            <div class="flex justify-between items-baseline mb-2">
              <div>
                <span class="font-bold text-[color:var(--cv-primary)] text-[15px]">{{ exp.role }}</span>
                <span class="mx-1.5 text-[color:var(--cv-text-light)]">|</span>
                <span class="font-medium text-[14px]">{{ exp.company }} <span v-if="exp.projectName" class="font-normal ml-1">— Project: {{ exp.projectName }}</span></span>
              </div>
              <div class="text-[13px] text-[color:var(--cv-text-light)] italic">{{ exp.startDate || '' }} - {{ exp.endDate || 'Present' }}</div>
            </div>
            <div class="text-[14px] text-[color:var(--cv-text)] [&>ul]:my-2 [&>ul]:pl-5 [&>ul>li]:mb-1" v-html="exp.description"></div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section v-if="filteredProjects.length > 0" class="mb-7">
        <h3 class="text-[16px] font-bold text-[color:var(--cv-primary)] uppercase tracking-[0.5px] m-0 mb-4 border-b border-[color:var(--cv-border)] pb-1.5">Featured Projects</h3>
        <div class="space-y-6">
          <div v-for="proj in filteredProjects" :key="proj.id" class="group">
            <div class="flex justify-between items-start mb-1.5 flex-col sm:flex-row gap-1 sm:gap-4">
              <div class="flex items-center gap-2.5 flex-wrap">
                <span class="font-bold text-[color:var(--cv-primary)] text-[16px]">{{ proj.title }}</span>
                <span v-if="proj.role" class="text-[14px] text-[color:var(--cv-text-light)] hidden sm:inline">|</span>
                <span v-if="proj.role" class="text-[14px] font-medium text-[color:var(--cv-text)]">{{ proj.role }}</span>
              </div>
              <div v-if="proj.startDate" class="text-[13px] text-[color:var(--cv-text-light)] italic shrink-0 mt-0.5 sm:mt-0">{{ proj.startDate }} - {{ proj.endDate || 'Present' }}</div>
            </div>
            
            <div v-if="proj.client || proj.teamSize || proj.companyName" class="text-[13px] text-[color:var(--cv-text-light)] mb-2.5 flex flex-wrap gap-x-3 gap-y-1 items-center">
               <span v-if="proj.companyName"><strong class="font-semibold text-[color:var(--cv-text)]">Company:</strong> {{ proj.companyName }}</span>
               <span v-if="proj.companyName && proj.client" class="text-gray-300">•</span>
               <span v-if="proj.client"><strong class="font-semibold text-[color:var(--cv-text)]">Client:</strong> {{ proj.client }}</span>
               <span v-if="(proj.companyName || proj.client) && proj.teamSize" class="text-gray-300">•</span>
               <span v-if="proj.teamSize"><strong class="font-semibold text-[color:var(--cv-text)]">Team Size:</strong> {{ proj.teamSize }} members</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-3">
              <a v-if="proj.demoLink" :href="proj.demoLink" target="_blank" class="text-[11px] text-[color:var(--cv-accent)] border border-[color:var(--cv-accent)]/30 bg-[color:var(--cv-accent)]/5 hover:bg-[color:var(--cv-accent)]/10 px-2 py-0.5 rounded flex items-center gap-1.5 no-underline transition-colors"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> Demo</a>
              <a v-if="proj.githubLink" :href="proj.githubLink" target="_blank" class="text-[11px] text-gray-700 border border-gray-300 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1.5 no-underline transition-colors"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg> GitHub</a>
              
              <span v-for="tech in proj.techStack" :key="tech" class="bg-gray-100/80 border border-gray-200/60 text-gray-600 px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium">{{ tech }}</span>
            </div>
            
            <div class="text-[14px] text-[color:var(--cv-text)] leading-[1.6] [&>ul]:my-1.5 [&>ul]:pl-5 [&>ul>li]:mb-1" v-html="proj.description"></div>
            
            <div v-if="proj.workDone" class="text-[14px] text-[color:var(--cv-text)] leading-[1.6] mt-2 [&>ul]:my-1.5 [&>ul]:pl-5 [&>ul>li]:mb-1">
              <strong class="text-[color:var(--cv-primary)] block mb-1">Responsibilities & Achievements:</strong>
              <div v-html="proj.workDone"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section v-if="Object.keys(groupedSkills).length > 0" class="mb-7">
        <h3 class="text-[16px] font-bold text-[color:var(--cv-primary)] uppercase tracking-[0.5px] m-0 mb-4 border-b border-[color:var(--cv-border)] pb-1.5">SKILL</h3>
        <div>
          <table class="w-full border-collapse">
            <tbody>
              <tr v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="border-b border-black/5">
                <td class="w-[25%] py-3 align-top font-bold text-[color:var(--cv-primary)]">
                  {{ categoryName }}
                </td>
                <td class="w-[75%] py-3 align-top text-[color:var(--cv-text)]">
                  <!-- Icon Skills (comma separated) -->
                  <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="mb-1">
                    {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(', ') }}
                  </div>
                  
                  <!-- Text Skills (bullet points) -->
                  <div v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="whitespace-pre-wrap text-[14px] leading-[1.6] mt-1">
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
</template>

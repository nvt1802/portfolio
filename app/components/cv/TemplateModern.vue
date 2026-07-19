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
  <div class="bg-[color:var(--cv-bg)] max-w-[210mm] min-h-[297mm] mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] rounded overflow-hidden print:shadow-none print:max-w-none print:w-[210mm] print:m-0">
    <div class="flex min-h-[297mm]">
      <!-- Left Column: Sidebar -->
      <aside class="w-[32%] bg-[#f8fafc] py-10 px-6 border-r border-[color:var(--cv-border)]">
        <!-- Avatar -->
        <div v-if="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" class="text-center mb-8">
          <img :src="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" alt="Avatar" class="w-[140px] h-[140px] rounded-full object-cover border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] mx-auto" />
        </div>
        
        <!-- Contact -->
        <section class="mb-8">
          <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-[1.5px] m-0 mb-4 border-b-2 border-[color:var(--cv-accent)] pb-2 inline-block">Contact</h3>
          <div class="flex flex-col gap-3 text-[13px] text-[color:var(--cv-text)]">
            <div v-if="personalInfo.email" class="flex items-center gap-2.5 break-all">
              <span class="text-[color:var(--cv-accent)] font-bold text-[14px] w-4 text-center">✉</span> {{ personalInfo.email }}
            </div>
            <div v-if="personalInfo.phone" class="flex items-center gap-2.5 break-all">
              <span class="text-[color:var(--cv-accent)] font-bold text-[14px] w-4 text-center">☏</span> {{ personalInfo.phone }}
            </div>
            <div v-if="personalInfo.website" class="flex items-center gap-2.5 break-all">
              <span class="text-[color:var(--cv-accent)] font-bold text-[14px] w-4 text-center">🌐</span> <a :href="personalInfo.website" target="_blank" class="text-inherit no-underline">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a>
            </div>
            <div v-if="personalInfo.linkedin" class="flex items-center gap-2.5 break-all">
              <span class="text-[color:var(--cv-accent)] font-bold text-[14px] w-4 text-center">in</span> <a :href="'https://' + personalInfo.linkedin" target="_blank" class="text-inherit no-underline">{{ personalInfo.linkedin }}</a>
            </div>
            <div v-if="personalInfo.github" class="flex items-center gap-2.5 break-all">
              <span class="text-[color:var(--cv-accent)] font-bold text-[14px] w-4 text-center">gh</span> <a :href="'https://' + personalInfo.github" target="_blank" class="text-inherit no-underline">{{ personalInfo.github }}</a>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="Object.keys(groupedSkills).length > 0" class="mb-8">
          <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-[1.5px] m-0 mb-4 border-b-2 border-[color:var(--cv-accent)] pb-2 inline-block">Skills</h3>
          <div v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="mb-5">
            <h4 class="text-[13px] font-bold text-[color:var(--cv-primary)] m-0 mb-2">{{ categoryName }}</h4>
            
            <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="text-[13px] text-[color:var(--cv-text)] mb-2 leading-[1.5]">
              {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(', ') }}
            </div>
            
            <ul class="list-disc pl-4 m-0 text-[12px] text-[color:var(--cv-text-light)] leading-[1.5]">
              <li v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="mb-1 whitespace-pre-wrap">
                {{ skill.description }}
              </li>
            </ul>
          </div>
        </section>
      </aside>

      <!-- Right Column: Main Content -->
      <main class="w-[68%] py-10 px-8">
        <!-- Header / Name -->
        <header class="mb-9">
          <h1 class="text-[38px] font-extrabold text-[color:var(--cv-primary)] m-0 mb-1 tracking-[-0.5px] leading-[1.1]">{{ personalInfo.fullName || 'Your Name' }}</h1>
          <h2 class="text-[18px] font-medium text-[color:var(--cv-accent)] m-0 mb-5 uppercase tracking-[1px]">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
          <div v-if="personalInfo.summary" class="text-[14px] text-[color:var(--cv-text)] leading-[1.7]">
            <p class="m-0">{{ personalInfo.summary }}</p>
          </div>
        </header>

        <!-- Experience Section -->
        <section v-if="filteredExperiences.length > 0" class="mb-8">
          <h3 class="text-[18px] font-bold text-[color:var(--cv-primary)] m-0 mb-5 flex items-center gap-3 after:content-[''] after:grow after:h-px after:bg-[color:var(--cv-border)]">Work Experience</h3>
          <div>
            <div v-for="exp in filteredExperiences" :key="exp.id" class="mb-6">
              <div class="mb-2">
                <div class="flex flex-col mb-1">
                  <span class="font-bold text-[color:var(--cv-primary)] text-[16px]">{{ exp.role }}</span>
                  <span class="font-medium text-[14px] text-[color:var(--cv-text-light)]">at {{ exp.company }} <span v-if="exp.projectName" class="font-normal">(Project: {{ exp.projectName }})</span></span>
                </div>
                <div class="text-[12px] text-[color:var(--cv-accent)] font-semibold">{{ exp.startDate || '' }} - {{ exp.endDate || 'Present' }}</div>
              </div>
              <div class="text-[13px] text-[color:var(--cv-text)] leading-[1.6] [&>ul]:my-2 [&>ul]:pl-5 [&>ul>li]:mb-1.5" v-html="exp.description"></div>
            </div>
          </div>
        </section>

        <!-- Projects Section -->
        <section v-if="filteredProjects.length > 0" class="mb-8">
          <h3 class="text-[18px] font-bold text-[color:var(--cv-primary)] m-0 mb-6 flex items-center gap-3 after:content-[''] after:grow after:h-px after:bg-[color:var(--cv-border)]">Featured Projects</h3>
          <div class="space-y-7">
            <div v-for="proj in filteredProjects" :key="proj.id" class="group mb-8">
              <div class="mb-2">
                <span class="font-bold text-[color:var(--cv-primary)] text-[16px] block">{{ proj.title }}</span>
                <span v-if="proj.startDate" class="text-[13.5px] text-[color:var(--cv-text)]">({{ proj.startDate }} - {{ proj.endDate || 'Present' }})</span>
              </div>
              
              <div class="text-[13.5px] text-[color:var(--cv-text)] mt-3">
                <div v-if="proj.client || proj.companyName" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">Customer:</span>
                  <span class="flex-1">{{ proj.client || proj.companyName }}</span>
                </div>
                <div v-if="proj.description" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">Description:</span>
                  <div class="flex-1 [&>p]:m-0" v-html="proj.description"></div>
                </div>
                <div v-if="proj.teamSize" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">Team size:</span>
                  <span class="flex-1">{{ proj.teamSize }}</span>
                </div>
                <div v-if="proj.role" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">My position:</span>
                  <span class="flex-1">{{ proj.role }}</span>
                </div>
                <div v-if="proj.workDone" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">My responsibilities:</span>
                  <div class="flex-1 [&>ul]:m-0 [&>ul]:pl-4 [&>ul>li]:mb-1 [&>p]:m-0" v-html="proj.workDone"></div>
                </div>
                <div v-if="proj.techStack && proj.techStack.length > 0" class="mb-1.5 flex flex-col sm:flex-row sm:gap-2">
                  <span class="font-bold sm:w-[150px] shrink-0">Technologies used:</span>
                  <span class="flex-1">{{ proj.techStack.join(', ') }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-3" v-if="proj.demoLink || proj.githubLink">
                <a v-if="proj.demoLink" :href="proj.demoLink" target="_blank" class="text-[11px] text-[color:var(--cv-accent)] border border-[color:var(--cv-accent)]/30 bg-[color:var(--cv-accent)]/5 hover:bg-[color:var(--cv-accent)]/10 px-2 py-0.5 rounded flex items-center gap-1.5 no-underline transition-colors"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> Demo</a>
                <a v-if="proj.githubLink" :href="proj.githubLink" target="_blank" class="text-[11px] text-gray-700 border border-gray-300 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1.5 no-underline transition-colors"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg> GitHub</a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

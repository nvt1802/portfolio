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
        <div>
          <div v-for="proj in filteredProjects" :key="proj.id" class="mb-5">
            <div class="flex items-center gap-3 mb-1.5">
              <span class="font-bold text-[color:var(--cv-primary)] text-[15px]">{{ proj.title }}</span>
              <a v-if="proj.link" :href="proj.link" target="_blank" class="text-[12px] text-[color:var(--cv-accent)] no-underline">{{ proj.link.replace(/^https?:\/\//, '') }}</a>
            </div>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span v-for="tech in proj.technologies" :key="tech" class="bg-[#f3f4f6] text-[#4b5563] px-2 py-0.5 rounded-[12px] text-[11px] font-medium">{{ tech }}</span>
            </div>
            <div class="text-[14px] text-[color:var(--cv-text)] [&>ul]:my-2 [&>ul]:pl-5 [&>ul>li]:mb-1" v-html="proj.description"></div>
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

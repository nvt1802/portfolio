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
          <h3 class="text-[18px] font-bold text-[color:var(--cv-primary)] m-0 mb-5 flex items-center gap-3 after:content-[''] after:grow after:h-px after:bg-[color:var(--cv-border)]">Featured Projects</h3>
          <div>
            <div v-for="proj in filteredProjects" :key="proj.id" class="mb-6">
              <div class="flex items-baseline gap-3 mb-2">
                <span class="font-bold text-[color:var(--cv-primary)] text-[16px]">{{ proj.title }}</span>
                <a v-if="proj.link" :href="proj.link" target="_blank" class="text-[12px] text-[color:var(--cv-accent)] no-underline">{{ proj.link.replace(/^https?:\/\//, '') }}</a>
              </div>
              <div class="flex flex-wrap gap-1.5 mb-2.5">
                <span v-for="tech in proj.technologies" :key="tech" class="bg-white border border-[color:var(--cv-border)] text-[#4b5563] px-2.5 py-0.5 rounded text-[11px] font-semibold">{{ tech }}</span>
              </div>
              <div class="text-[13px] leading-[1.6]" v-html="proj.description"></div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

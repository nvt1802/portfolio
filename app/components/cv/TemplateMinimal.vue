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
  <div class="bg-white max-w-[210mm] min-h-[297mm] mx-auto py-[25mm] px-[20mm] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] text-[#111] font-['Helvetica_Neue',Helvetica,Arial,sans-serif] leading-[1.5] print:shadow-none print:max-w-none print:w-[210mm] print:m-0 print:py-[25mm] print:px-[20mm]">
    
    <!-- Header -->
    <header class="mb-10">
      <h1 class="text-[28px] font-light tracking-[2px] uppercase m-0 mb-2">{{ personalInfo.fullName || 'Your Name' }}</h1>
      <h2 class="text-[16px] font-normal text-[#666] tracking-[1px] m-0 mb-4">{{ personalInfo.jobTitle || 'Job Title' }}</h2>
      
      <div class="flex flex-wrap gap-4 text-[12px] text-[#555] mb-6 [&>span:not(:last-child)]:after:content-['|'] [&>span:not(:last-child)]:after:ml-4 [&>span:not(:last-child)]:after:text-[#ccc]">
        <span v-if="personalInfo.email">{{ personalInfo.email }}</span>
        <span v-if="personalInfo.phone">{{ personalInfo.phone }}</span>
        <span v-if="personalInfo.website"><a :href="personalInfo.website" target="_blank" class="text-inherit no-underline">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a></span>
        <span v-if="personalInfo.linkedin"><a :href="'https://' + personalInfo.linkedin" target="_blank" class="text-inherit no-underline">{{ personalInfo.linkedin }}</a></span>
        <span v-if="personalInfo.github"><a :href="'https://' + personalInfo.github" target="_blank" class="text-inherit no-underline">{{ personalInfo.github }}</a></span>
      </div>

      <div v-if="personalInfo.summary" class="text-[13px] text-[#333] text-justify leading-[1.6]">
        <p class="m-0">{{ personalInfo.summary }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      
      <!-- Experience -->
      <section v-if="filteredExperiences.length > 0" class="mb-8">
        <h3 class="text-[14px] font-semibold tracking-[2px] uppercase m-0 mb-4 pb-1">Experience</h3>
        
        <div v-for="exp in filteredExperiences" :key="exp.id" class="mb-5">
          <div class="flex flex-wrap items-baseline gap-2 mb-1">
            <span class="font-semibold text-[14px]">{{ exp.role }}</span>
            <span class="font-normal text-[14px] text-[#555]">{{ exp.company }}</span>
            <span class="text-[12px] text-[#888] ml-auto">{{ exp.startDate || '' }} – {{ exp.endDate || 'Present' }}</span>
          </div>
          <div v-if="exp.projectName" class="text-[12px] text-[#666] italic mb-1.5">Project: {{ exp.projectName }}</div>
          <div class="text-[13px] text-[#333] [&>ul]:my-1 [&>ul]:pl-4 [&>ul>li]:mb-0.5" v-html="exp.description"></div>
        </div>
      </section>

      <!-- Projects -->
      <section v-if="filteredProjects.length > 0" class="mb-8">
        <h3 class="text-[14px] font-semibold tracking-[2px] uppercase m-0 mb-4 pb-1">Projects</h3>
        
        <div v-for="proj in filteredProjects" :key="proj.id" class="mb-5">
          <div class="flex items-baseline gap-3 mb-1">
            <span class="font-semibold text-[14px]">{{ proj.title }}</span>
            <a v-if="proj.link" :href="proj.link" target="_blank" class="text-[12px] text-[#666] underline">{{ proj.link.replace(/^https?:\/\//, '') }}</a>
          </div>
          <div class="flex flex-wrap gap-2 mb-1.5 text-[12px] text-[#666] [&>span:not(:last-child)]:after:content-[','] [&>span:not(:last-child)]:after:not-italic">
            <span v-for="tech in proj.technologies" :key="tech" class="italic">{{ tech }}</span>
          </div>
          <div class="text-[13px] text-[#333]" v-html="proj.description"></div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="Object.keys(groupedSkills).length > 0" class="mb-8">
        <h3 class="text-[14px] font-semibold tracking-[2px] uppercase m-0 mb-4 pb-1">Skills</h3>
        
        <div v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="flex mb-3">
          <h4 class="w-[140px] shrink-0 font-semibold text-[13px] m-0">{{ categoryName }}</h4>
          <div class="flex-grow">
            <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="text-[13px] text-[#333] mb-1">
              {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(' • ') }}
            </div>
            
            <div v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="text-[13px] text-[#555] whitespace-pre-wrap mb-1">
              {{ skill.description }}
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

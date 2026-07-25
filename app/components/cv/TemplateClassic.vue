<script setup lang="ts">
defineProps<{
  personalInfo: any
  cvProfileRef: any
  filteredExperiences: any[]
  filteredProjects: any[]
  groupedSkills: Record<string, any[]>
}>()

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const formatDateRange = (item: any) => {
  let startStr = item.startDate || ''
  if (item.startMonth && item.startYear) {
    startStr = `${MONTH_NAMES[item.startMonth - 1]} ${item.startYear}`
  } else if (startStr.match(/^\d{4}-\d{2}$/)) {
    const y = parseInt(startStr.split('-')[0])
    const m = parseInt(startStr.split('-')[1])
    startStr = `${MONTH_NAMES[m - 1]} ${y}`
  }

  let endStr = item.endDate || 'Present'
  if (item.isCurrent) {
    endStr = 'PRESENT'
  } else if (item.endMonth && item.endYear) {
    endStr = `${MONTH_NAMES[item.endMonth - 1]} ${item.endYear}`
  } else if (endStr.match(/^\d{4}-\d{2}$/)) {
    const y = parseInt(endStr.split('-')[0])
    const m = parseInt(endStr.split('-')[1])
    endStr = `${MONTH_NAMES[m - 1]} ${y}`
  } else if (endStr.toLowerCase() === 'present' || endStr.toLowerCase() === 'đến nay' || endStr.toLowerCase() === 'hiện tại') {
    endStr = 'PRESENT'
  }

  return startStr ? `${startStr} - ${endStr}` : ''
}
</script>

<template>
  <div class="bg-[color:var(--cv-bg)] max-w-[210mm] min-h-[297mm] mx-auto p-[15mm] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] rounded print:shadow-none print:max-w-none print:w-[210mm] print:m-0 print:p-[15mm]">
    <!-- Header / Personal Info -->
    <header class="mb-6">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h1 class="text-[32px] font-bold text-[color:var(--cv-primary)] m-0 mb-4 tracking-wide">{{ personalInfo.fullName || 'Your Name' }}</h1>
          
          <table class="text-[12px] text-black">
            <tbody>
              <tr v-if="personalInfo.phone">
                <td class="font-bold w-[90px] py-0.5">Phone</td>
                <td>{{ personalInfo.phone }}</td>
              </tr>
              <tr v-if="personalInfo.email">
                <td class="font-bold w-[90px] py-0.5">Email</td>
                <td>{{ personalInfo.email }}</td>
              </tr>
              <tr v-if="personalInfo.address">
                <td class="font-bold w-[90px] py-0.5">Address</td>
                <td>{{ personalInfo.address }}</td>
              </tr>
              <tr v-if="personalInfo.website">
                <td class="font-bold w-[90px] py-0.5">Website</td>
                <td><a :href="personalInfo.website" target="_blank" class="text-black no-underline">{{ personalInfo.website.replace(/^https?:\/\//, '') }}</a></td>
              </tr>
              <tr v-if="personalInfo.linkedin && !personalInfo.website">
                <td class="font-bold w-[90px] py-0.5">LinkedIn</td>
                <td><a :href="'https://' + personalInfo.linkedin" target="_blank" class="text-black no-underline">{{ personalInfo.linkedin }}</a></td>
              </tr>
              <tr v-if="personalInfo.github && !personalInfo.website">
                <td class="font-bold w-[90px] py-0.5">GitHub</td>
                <td><a :href="'https://' + personalInfo.github" target="_blank" class="text-black no-underline">{{ personalInfo.github }}</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Avatar -->
        <div v-if="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" class="shrink-0 ml-6">
          <img :src="cvProfileRef?.cvAvatarUrl || personalInfo.avatarUrl" alt="Avatar" class="w-[100px] h-[130px] rounded object-cover" />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      
      <!-- ABOUT ME -->
      <section v-if="personalInfo.summary" class="mb-5">
        <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-wide m-0 mb-2 border-b-2 border-[color:var(--cv-primary)] pb-1">ABOUT ME</h3>
        <div class="text-[12px] text-black text-justify leading-relaxed">
          <p class="m-0 whitespace-pre-wrap">{{ personalInfo.summary }}</p>
        </div>
      </section>

      <!-- SKILL -->
      <section v-if="Object.keys(groupedSkills).length > 0" class="mb-5">
        <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-wide m-0 mb-2 border-b-2 border-[color:var(--cv-primary)] pb-1">SKILL</h3>
        <div>
          <table class="w-full border-collapse text-[12px] text-black">
            <tbody>
              <tr v-for="(categorySkills, categoryName) in groupedSkills" :key="categoryName" class="border-b border-black/10 last:border-0">
                <td class="w-[30%] py-2 align-top font-bold">
                  {{ categoryName }}
                </td>
                <td class="w-[70%] py-2 align-top">
                  <div v-if="categorySkills.filter(s => s.displayType !== 'text').length > 0" class="mb-0.5">
                    - {{ categorySkills.filter(s => s.displayType !== 'text').map(s => s.name).join(', ') }}
                  </div>
                  <div v-for="skill in categorySkills.filter(s => s.displayType === 'text')" :key="skill.id" class="whitespace-pre-wrap leading-relaxed">
                    <span v-if="!skill.description.trim().startsWith('-')">- </span>{{ skill.description }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- WORK EXPERIENCE -->
      <section v-if="filteredExperiences.length > 0" class="mb-5">
        <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-wide m-0 mb-2 border-b-2 border-[color:var(--cv-primary)] pb-1">WORK EXPERIENCE</h3>
        <div>
          <div v-for="exp in filteredExperiences" :key="exp.id" class="mb-3 flex text-[12px] text-black">
            <div class="w-[30%] shrink-0 pr-4 pt-0.5">
              <span class="whitespace-nowrap">{{ formatDateRange(exp) }}</span>
            </div>
            <div class="w-[70%]">
              <div class="font-bold mb-0.5">{{ exp.company }}</div>
              <div class="mb-1">{{ exp.role }}</div>
              <div class="leading-relaxed [&>ul]:m-0 [&>ul]:pl-0 [&>ul>li]:list-none [&>ul>li]:before:content-['-'] [&>ul>li]:before:mr-1.5 [&>ul>li]:mb-0.5" v-html="exp.description"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- PROJECTS Section -->
      <section v-if="filteredProjects.length > 0" class="mb-5">
        <h3 class="text-[14px] font-extrabold text-[color:var(--cv-primary)] uppercase tracking-wide m-0 mb-2 border-b-2 border-[color:var(--cv-primary)] pb-1">PROJECTS</h3>
        <div class="space-y-4 text-[12px] text-black">
          <div v-for="proj in filteredProjects" :key="proj.id" class="border-b border-black/10 pb-4 last:border-0 last:pb-0">
            <!-- Header: Title | Company -->
            <div class="mb-0.5">
              <span class="font-bold text-[13px]">{{ proj.title }}</span>
              <span v-if="proj.companyName"> | <span class="italic">{{ proj.companyName }}</span></span>
            </div>
            
            <!-- Subtitle: Role (Dates) -->
            <div class="mb-2">
              <span v-if="proj.role" class="italic">{{ proj.role }}</span>
              <span v-if="formatDateRange(proj)" :class="{ 'ml-1': proj.role }">({{ formatDateRange(proj) }})</span>
            </div>
            
            <!-- Details List -->
            <ul class="list-[circle] pl-5 m-0 space-y-1">
              <!-- Description -->
              <li v-if="proj.description || proj.teamSize" class="[&_p]:inline">
                <strong>Description:</strong> 
                <span v-if="proj.description" v-html="proj.description" class="ml-1"></span>
                <span v-if="proj.teamSize" class="ml-1">Team size: {{ proj.teamSize }}.</span>
              </li>
              
              <!-- Responsibilities -->
              <li v-if="proj.workDone" class="[&_ul]:list-[circle] [&_ul]:pl-5 [&_ul]:mt-1 [&_ul_li]:mb-0.5 [&_p]:inline">
                <strong>Responsibilities & Achievements:</strong>
                <div v-html="proj.workDone" class="mt-1"></div>
              </li>
              
              <!-- Technologies -->
              <li v-if="proj.techStack && proj.techStack.length > 0">
                <strong>Technologies:</strong> {{ proj.techStack.join(', ') }}
              </li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

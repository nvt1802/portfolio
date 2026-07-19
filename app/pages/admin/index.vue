<script setup lang="ts">
import { collection } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

useHead({ title: 'Bảng Điều Khiển Quản Trị' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()

// Fetch collections
const companies = useCollection(computed(() => import.meta.client && db ? collection(db, 'companies') : null))
const projects = useCollection(computed(() => import.meta.client && db ? collection(db, 'projects') : null))
const skills = useCollection(computed(() => import.meta.client && db ? collection(db, 'skills') : null))
const experiences = useCollection(computed(() => import.meta.client && db ? collection(db, 'experiences') : null))

// Calculate statistics
const stats = computed(() => {
  const totalCompanies = companies.value?.length || 0
  const totalProjects = projects.value?.length || 0
  const totalSkills = skills.value?.length || 0
  
  let yearsOfExperience = 0
  if (experiences.value && experiences.value.length > 0) {
    // Find the earliest start date
    const startDates = experiences.value
      .map((e: any) => e.startDate)
      .filter(Boolean)
      .map(dateStr => new Date(dateStr).getTime())
      
    if (startDates.length > 0) {
      const earliestDate = Math.min(...startDates)
      const now = new Date().getTime()
      const diffTime = Math.abs(now - earliestDate)
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
      yearsOfExperience = Math.round(diffYears * 10) / 10 // round to 1 decimal place
    }
  }

  return {
    totalCompanies,
    totalProjects,
    totalSkills,
    yearsOfExperience
  }
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto">
    <div class="mb-6">
      <div>
        <h1 class="text-[28px] font-bold text-[color:var(--text-primary)] m-0">Tổng quan (Dashboard)</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Xem nhanh các chỉ số thống kê về hồ sơ năng lực của bạn</p>
      </div>
    </div>
    
    <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      <!-- Mảnh ghép 1: Năm kinh nghiệm -->
      <div class="p-6 flex items-center gap-4 rounded-xl transition-transform duration-200 ease-in-out hover:-translate-y-1 glass-card">
        <div class="w-14 h-14 rounded-[14px] flex items-center justify-center bg-blue-500/20 text-blue-500">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="text-[32px] font-bold text-[color:var(--text-primary)] leading-[1.2]">{{ stats.yearsOfExperience }}</div>
          <div class="text-[14px] text-[color:var(--text-secondary)] font-medium mt-1">Năm Kinh Nghiệm</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 2: Tổng dự án -->
      <div class="p-6 flex items-center gap-4 rounded-xl transition-transform duration-200 ease-in-out hover:-translate-y-1 glass-card">
        <div class="w-14 h-14 rounded-[14px] flex items-center justify-center bg-emerald-500/20 text-emerald-500">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="text-[32px] font-bold text-[color:var(--text-primary)] leading-[1.2]">{{ stats.totalProjects }}</div>
          <div class="text-[14px] text-[color:var(--text-secondary)] font-medium mt-1">Dự Án Đã Làm</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 3: Tổng Kỹ năng -->
      <div class="p-6 flex items-center gap-4 rounded-xl transition-transform duration-200 ease-in-out hover:-translate-y-1 glass-card">
        <div class="w-14 h-14 rounded-[14px] flex items-center justify-center bg-amber-500/20 text-amber-500">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="text-[32px] font-bold text-[color:var(--text-primary)] leading-[1.2]">{{ stats.totalSkills }}</div>
          <div class="text-[14px] text-[color:var(--text-secondary)] font-medium mt-1">Kỹ Năng Chuyên Môn</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 4: Tổng công ty -->
      <div class="p-6 flex items-center gap-4 rounded-xl transition-transform duration-200 ease-in-out hover:-translate-y-1 glass-card">
        <div class="w-14 h-14 rounded-[14px] flex items-center justify-center bg-indigo-500/20 text-indigo-500">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="text-[32px] font-bold text-[color:var(--text-primary)] leading-[1.2]">{{ stats.totalCompanies }}</div>
          <div class="text-[14px] text-[color:var(--text-secondary)] font-medium mt-1">Công Ty Từng Làm</div>
        </div>
      </div>
    </div>
    
    <div class="mt-10 text-center">
      <NuxtLink to="/admin/content" class="btn btn-primary px-6 py-3 text-base">
        Chỉnh sửa Dữ liệu (Kinh nghiệm, Dự án...)
      </NuxtLink>
    </div>
  </div>
</template>

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
  <div class="dashboard-container">
    <div class="admin-header" style="margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 28px;">Tổng quan (Dashboard)</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Xem nhanh các chỉ số thống kê về hồ sơ năng lực của bạn</p>
      </div>
    </div>
    
    <div class="stats-grid">
      <!-- Mảnh ghép 1: Năm kinh nghiệm -->
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background-color: rgba(59, 130, 246, 0.2); color: #3b82f6;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.yearsOfExperience }}</div>
          <div class="stat-label">Năm Kinh Nghiệm</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 2: Tổng dự án -->
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background-color: rgba(16, 185, 129, 0.2); color: #10b981;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalProjects }}</div>
          <div class="stat-label">Dự Án Đã Làm</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 3: Tổng Kỹ năng -->
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background-color: rgba(245, 158, 11, 0.2); color: #f59e0b;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalSkills }}</div>
          <div class="stat-label">Kỹ Năng Chuyên Môn</div>
        </div>
      </div>
      
      <!-- Mảnh ghép 4: Tổng công ty -->
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background-color: rgba(99, 102, 241, 0.2); color: #6366f1;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalCompanies }}</div>
          <div class="stat-label">Công Ty Từng Làm</div>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 40px; text-align: center;">
      <NuxtLink to="/admin/content" class="btn btn-primary" style="padding: 12px 24px; font-size: 16px;">
        Chỉnh sửa Dữ liệu (Kinh nghiệm, Dự án...)
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: var(--radius-md);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 4px;
}
</style>

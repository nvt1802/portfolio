<script setup lang="ts">
import { collection, doc, query, orderBy, setDoc } from 'firebase/firestore'
import { useFirestore, useCollection, useDocument } from 'vuefire'

useHead({ title: 'Trình Tạo CV' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()

// --- Toast System ---
const toastMessage = ref('')
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Fetch all items for checklists
const _experiences = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'experiences'), orderBy('startDate', 'desc'))
}))

const companies = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'companies')
}))

const experiences = computed(() => {
  if (!_experiences.value) return []
  return _experiences.value.map((exp: any) => {
    const comp = companies.value?.find((c: any) => c.id === exp.companyId)
    return {
      ...exp,
      id: exp.id,
      company: comp ? comp.name : (exp.company || '')
    }
  })
})

const projects = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'projects')
}))

const skills = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'skills'), orderBy('order', 'asc'))
}))

const categoriesMap: Record<string, string> = {
  'frontend': 'Frontend',
  'backend': 'Backend',
  'tools': 'Tools/DevOps',
  'ai-automation': 'AI Agent & Automation'
}

const tabs = [
  { id: 'personal', name: 'Thông tin cá nhân' },
  { id: 'experiences', name: 'Kinh nghiệm' },
  { id: 'projects', name: 'Dự án' },
  { id: 'skills', name: 'Kỹ năng' }
] as const

const activeTab = ref<'personal' | 'experiences' | 'projects' | 'skills'>('personal')

// CV Builder Profile State
const cvProfileRef = useDocument(doc(db, 'settings', 'cv_profile'))
const isSavingCvProfile = ref(false)

const cvProfileForm = ref({
  selectedExperiences: [] as string[],
  selectedProjects: [] as string[],
  selectedSkills: [] as string[],
  cvAvatarUrl: ''
})

watch(cvProfileRef, (newProfile) => {
  if (newProfile) {
    cvProfileForm.value = {
      selectedExperiences: newProfile.selectedExperiences || [],
      selectedProjects: newProfile.selectedProjects || [],
      selectedSkills: newProfile.selectedSkills || [],
      cvAvatarUrl: newProfile.cvAvatarUrl || ''
    }
  }
}, { immediate: true })

const saveCvProfile = async () => {
  isSavingCvProfile.value = true
  try {
    await setDoc(doc(db, 'settings', 'cv_profile'), {
      ...cvProfileForm.value,
      updatedAt: new Date().toISOString()
    })
    showToast('Lưu Cấu Hình CV thành công!')
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu: ${error.message || error}`)
  } finally {
    isSavingCvProfile.value = false
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Tạo & Cấu Hình CV</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Tùy chỉnh thông tin và xuất PDF chuyên nghiệp</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Tạo CV' }]" />

    <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 20px;">
      <NuxtLink to="/cv" target="_blank" class="btn btn-primary" style="text-decoration: none; background: var(--accent); border-color: var(--bg-dark); color: var(--bg-dark); box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);">
        Xem & In CV
      </NuxtLink>
    </div>

    <!-- Tabs Menu for CV Builder -->
    <div class="tabs-container" style="margin-bottom: 24px;">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click.prevent="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="glass-card">
      <form @submit.prevent="saveCvProfile">
        
        <!-- Tab 1: Personal -->
        <div v-show="activeTab === 'personal'">
          <h4 style="margin-bottom: 16px; color: var(--accent); font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Thông tin cá nhân</h4>
          <div style="margin-bottom: 24px; padding: 16px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: var(--radius-sm); color: var(--text-secondary);">
            <p style="margin-bottom: 8px;">
              <strong style="color: var(--text-primary);">Lưu ý:</strong> Dữ liệu cá nhân (Họ tên, Email, SĐT...) hiện được quản lý tập trung. Vui lòng vào trang <strong>Quản lý Dữ liệu > Cá nhân</strong> để cập nhật.
            </p>
            <p>Trình tạo CV sẽ tự động lấy các thông tin đó. Tại đây bạn chỉ cần cấu hình ảnh đại diện (avatar) dành riêng cho CV (nếu có).</p>
          </div>
          
          <div class="form-group" style="margin-bottom: 32px; max-width: 500px;">
            <label class="form-label">Avatar URL (Dành riêng cho CV)</label>
            <input v-model="cvProfileForm.cvAvatarUrl" type="text" class="form-control" placeholder="Để trống nếu muốn dùng avatar chung từ Quản lý dữ liệu" />
          </div>

        </div>
        
        <!-- Tab 2: Experiences -->
        <div v-show="activeTab === 'experiences'">
          <h4 style="margin-bottom: 16px; color: var(--accent); font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">2. Kinh nghiệm làm việc</h4>
          <div style="margin-bottom: 32px; background: rgba(0,0,0,0.15); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div v-for="exp in experiences" :key="exp.id" style="display: flex; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.05);">
            <input type="checkbox" :id="'exp-'+exp.id" :value="exp.id" v-model="cvProfileForm.selectedExperiences" style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent);" />
            <label :for="'exp-'+exp.id" style="cursor: pointer; color: var(--text-primary); user-select: none; display: flex; align-items: center; flex: 1;">
              <div style="flex: 1;">
                <strong>{{ exp.role }}</strong> <span style="color: var(--text-secondary);">tại {{ exp.company }}</span>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">{{ exp.startDate }} - {{ exp.endDate }}</div>
              </div>
            </label>
          </div>
          <div v-if="!experiences || experiences.length === 0" style="color: var(--text-muted); font-size: 14px;">Chưa có kinh nghiệm nào.</div>
        </div>

        </div>

        <!-- Tab 3: Projects -->
        <div v-show="activeTab === 'projects'">
          <h4 style="margin-bottom: 16px; color: var(--accent); font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">3. Dự án nổi bật</h4>
          <div style="margin-bottom: 32px; background: rgba(0,0,0,0.15); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div v-for="proj in projects" :key="proj.id" style="display: flex; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.05);">
            <input type="checkbox" :id="'proj-'+proj.id" :value="proj.id" v-model="cvProfileForm.selectedProjects" style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent);" />
            <label :for="'proj-'+proj.id" style="cursor: pointer; color: var(--text-primary); user-select: none;">
              <strong>{{ proj.title }}</strong>
            </label>
          </div>
          <div v-if="!projects || projects.length === 0" style="color: var(--text-muted); font-size: 14px;">Chưa có dự án nào.</div>
        </div>

        </div>

        <!-- Tab 4: Skills -->
        <div v-show="activeTab === 'skills'">
          <h4 style="margin-bottom: 16px; color: var(--accent); font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">4. Kỹ năng chuyên môn</h4>
          <div style="margin-bottom: 32px; background: rgba(0,0,0,0.15); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
            <div v-for="skill in skills" :key="skill.id" style="display: flex; align-items: center;">
              <input type="checkbox" :id="'skill-'+skill.id" :value="skill.id" v-model="cvProfileForm.selectedSkills" style="margin-right: 12px; width: 16px; height: 16px; cursor: pointer; accent-color: var(--accent);" />
              <label :for="'skill-'+skill.id" style="cursor: pointer; color: var(--text-primary); font-size: 14px; user-select: none; display: flex; align-items: center; gap: 8px;">
                <div style="width: 24px; height: 24px; background: rgba(255,255,255,0.05); border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 4px;">
                  <img v-if="skill.iconUrl" :src="skill.iconUrl" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                  <span v-else style="color: var(--primary); font-size: 10px;">{{ skill.name.charAt(0) }}</span>
                </div>
                <span>{{ skill.name }}</span>
                <span style="color: var(--text-muted); font-size: 11px; background: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 3px;">{{ categoriesMap[skill.category] }}</span>
              </label>
            </div>
          </div>
          <div v-if="!skills || skills.length === 0" style="color: var(--text-muted); font-size: 14px;">Chưa có kỹ năng nào.</div>
        </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSavingCvProfile" style="width: 100%; padding: 14px; font-size: 16px; font-weight: 600; margin-top: 16px;">
          {{ isSavingCvProfile ? 'Đang lưu...' : 'Lưu Cấu Hình CV' }}
        </button>
      </form>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>

  </div>
</template>

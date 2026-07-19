<script setup lang="ts">
import { collection, doc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore'
import { useFirestore, useCollection, useDocument } from 'vuefire'

useHead({ title: 'Quản lý Dữ liệu' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const route = useRoute()
const router = useRouter()

// --- Toast System ---
const toastMessage = ref('')
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// --- Tabs Configuration ---
const activeTab = ref<'personal' | 'companies' | 'experiences' | 'projects' | 'skills'>('personal')
const tabs = [
  { id: 'personal', name: 'Cá nhân' },
  { id: 'companies', name: 'Công ty' },
  { id: 'experiences', name: 'Kinh nghiệm' },
  { id: 'projects', name: 'Dự án' },
  { id: 'skills', name: 'Kỹ năng' }
] as const

// Watch query parameters to update active tab
watch(() => route.query.tab, (newTab) => {
  if (newTab && ['personal', 'companies', 'experiences', 'projects', 'skills'].includes(newTab as string)) {
    activeTab.value = newTab as any
  }
}, { immediate: true })

const changeTab = (tabId: 'personal' | 'companies' | 'experiences' | 'projects' | 'skills') => {
  activeTab.value = tabId
  router.push({ query: { tab: tabId } })
}


// ==========================================
// 1. TAB: COMPANIES CRUD
// ==========================================
const companies = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'companies')
}))

const getCompanyById = (id: string) => {
  if (!companies.value) return null
  return companies.value.find(c => c.id === id)
}

const deleteCompany = (id: string) => {
  triggerConfirm('Bạn có chắc chắn muốn xóa công ty này? Hành động này không thể hoàn tác.', async () => {
    try {
      await deleteDoc(doc(db, 'companies', id))
      showToast('Xóa công ty thành công!')
    } catch (error: any) {
      console.error(error)
      showToast(`Xóa thất bại: ${error.message || error}`)
    }
  })
}

// ==========================================
// 2. TAB: EXPERIENCES CRUD
// ==========================================
const experiences = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'experiences'), orderBy('startDate', 'desc'))
}))

// --- Custom Confirmation Dialog ---
const isConfirmOpen = ref(false)
const confirmMessage = ref('')
const confirmCallback = ref<(() => void) | null>(null)

const triggerConfirm = (msg: string, callback: () => void) => {
  confirmMessage.value = msg
  confirmCallback.value = callback
  isConfirmOpen.value = true
}

const handleConfirmYes = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  isConfirmOpen.value = false
  confirmCallback.value = null
}

const handleConfirmNo = () => {
  isConfirmOpen.value = false
  confirmCallback.value = null
}

const deleteExperience = (id: string) => {
  triggerConfirm('Bạn có chắc chắn muốn xóa mốc kinh nghiệm này? Hành động này không thể hoàn tác.', async () => {
    try {
      await deleteDoc(doc(db, 'experiences', id))
      showToast('Xóa kinh nghiệm thành công!')
    } catch (error: any) {
      console.error(error)
      showToast(`Xóa thất bại: ${error.message || error}`)
    }
  })
}

// ==========================================
// 3. TAB: PROJECTS CRUD
// ==========================================
const projects = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'projects')
}))

const deleteProject = (id: string) => {
  triggerConfirm('Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.', async () => {
    try {
      await deleteDoc(doc(db, 'projects', id))
      showToast('Xóa dự án thành công!')
    } catch (error: any) {
      console.error(error)
      showToast(`Xóa thất bại: ${error.message || error}`)
    }
  })
}

// ==========================================
// 4. TAB: SKILLS CRUD
// ==========================================
interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'ai-automation'
  order: number
  level?: string
  iconUrl?: string
}

const skills = useCollection<Skill>(computed(() => {
  if (!import.meta.client || !db) return null
  return query(collection(db, 'skills'), orderBy('order', 'asc'))
}))

const deleteSkill = (id: string) => {
  triggerConfirm('Bạn có chắc chắn muốn xóa kỹ năng này? Hành động này không thể hoàn tác.', async () => {
    try {
      await deleteDoc(doc(db, 'skills', id))
      showToast('Xóa kỹ năng thành công!')
    } catch (error: any) {
      console.error(error)
      showToast(`Xóa thất bại: ${error.message || error}`)
    }
  })
}

// Helpers
const categoriesMap: Record<string, string> = {
  'frontend': 'Frontend',
  'backend': 'Backend',
  'tools': 'Tools/DevOps',
  'ai-automation': 'AI Agent & Automation'
}

const currentTabName = computed(() => {
  const found = tabs.find(t => t.id === activeTab.value)
  return found ? found.name : ''
})

// ==========================================
// 5. TAB: PERSONAL INFO
// ==========================================
const personalInfoRef = useDocument(computed(() => import.meta.client && db ? doc(db, 'settings', 'personal') : null))
const isSavingPersonal = ref(false)

const personalForm = ref({
  fullName: '',
  jobTitle: '',
  avatarUrl: '',
  email: '',
  phone: '',
  website: '',
  github: '',
  linkedin: '',
  summary: ''
})

watch(personalInfoRef, (newProfile) => {
  if (newProfile) {
    personalForm.value = {
      fullName: newProfile.fullName || '',
      jobTitle: newProfile.jobTitle || '',
      avatarUrl: newProfile.avatarUrl || '',
      email: newProfile.email || '',
      phone: newProfile.phone || '',
      website: newProfile.website || '',
      github: newProfile.github || '',
      linkedin: newProfile.linkedin || '',
      summary: newProfile.summary || ''
    }
  }
}, { immediate: true })

const savePersonalInfo = async () => {
  isSavingPersonal.value = true
  try {
    await setDoc(doc(db, 'settings', 'personal'), {
      ...personalForm.value,
      updatedAt: new Date().toISOString()
    })
    showToast('Lưu thông tin cá nhân thành công!')
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu: ${error.message || error}`)
  } finally {
    isSavingPersonal.value = false
  }
}


</script>

<template>
  <div>
    <!-- Header -->
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Bảng Điều Khiển Quản Trị</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Quản lý dữ liệu hiển thị trên Portfolio cá nhân của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: currentTabName }]" />

    <!-- Tabs Menu -->
    <div class="tabs-container">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="changeTab(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- TAB CONTENTS -->
    <div class="tab-content">
      
      <!-- ==================== TAB: PERSONAL ==================== -->
      <div v-if="activeTab === 'personal'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px;">Quản lý Thông tin Cá nhân</h3>
        </div>

        <div class="glass-card" style="padding: 24px;">
          <form @submit.prevent="savePersonalInfo">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div class="form-group">
                <label class="form-label">Họ và Tên</label>
                <input v-model="personalForm.fullName" type="text" class="form-control" placeholder="VD: Nguyễn Văn A" />
              </div>
              <div class="form-group">
                <label class="form-label">Chức danh (Job Title)</label>
                <input v-model="personalForm.jobTitle" type="text" class="form-control" placeholder="VD: Frontend Developer" />
              </div>
              <div class="form-group">
                <label class="form-label">Avatar URL</label>
                <input v-model="personalForm.avatarUrl" type="text" class="form-control" placeholder="URL hình ảnh đại diện chung" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="personalForm.email" type="email" class="form-control" placeholder="VD: a@example.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <input v-model="personalForm.phone" type="text" class="form-control" placeholder="VD: 0912 345 678" />
              </div>
              <div class="form-group">
                <label class="form-label">Website</label>
                <input v-model="personalForm.website" type="text" class="form-control" placeholder="VD: myportfolio.com" />
              </div>
              <div class="form-group">
                <label class="form-label">GitHub</label>
                <input v-model="personalForm.github" type="text" class="form-control" placeholder="VD: github.com/username" />
              </div>
              <div class="form-group">
                <label class="form-label">LinkedIn</label>
                <input v-model="personalForm.linkedin" type="text" class="form-control" placeholder="VD: linkedin.com/in/username" />
              </div>
            </div>
            
            <div class="form-group" style="margin-bottom: 32px;">
              <label class="form-label">Tóm tắt bản thân (Summary)</label>
              <textarea v-model="personalForm.summary" class="form-control" rows="4" placeholder="Viết một đoạn giới thiệu ngắn về bản thân..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isSavingPersonal">
              {{ isSavingPersonal ? 'Đang lưu...' : 'Lưu Thông Tin' }}
            </button>
          </form>
        </div>
      </div>

      <!-- ==================== TAB: COMPANIES ==================== -->
      <div v-if="activeTab === 'companies'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px;">Quản lý Công ty</h3>
          <NuxtLink to="/admin/companies/new" class="btn btn-primary" style="text-decoration: none;">
            + Thêm công ty
          </NuxtLink>
        </div>

        <div class="glass-card" style="padding: 0; overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Tên công ty</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comp in companies" :key="comp.id">
                <td style="width: 80px;">
                  <div :style="{ backgroundColor: comp.logoBg || '#ffffff' }" style="width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 4px; border: 1px solid var(--border-color); overflow: hidden;">
                    <img v-if="comp.logoUrl" :src="comp.logoUrl" :style="{ transform: `scale(${comp.logoScale ?? 1}) translate(${comp.logoX ?? 0}px, ${comp.logoY ?? 0}px)` }" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                    <span v-else style="color: #1e293b; font-weight: 800; font-size: 18px;">{{ comp.name?.charAt(0) || '?' }}</span>
                  </div>
                </td>
                <td style="font-weight:600;">{{ comp.name }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/companies/${comp.id}`" class="action-icon-btn edit-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteCompany(comp.id)" class="action-icon-btn delete-btn" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="companies && companies.length === 0">
                <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 40px;">Chưa có dữ liệu công ty.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: EXPERIENCES ==================== -->
      <div v-if="activeTab === 'experiences'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px;">Lộ trình làm việc</h3>
          <NuxtLink to="/admin/experiences/new" class="btn btn-primary" style="text-decoration: none;">
            + Thêm kinh nghiệm
          </NuxtLink>
        </div>

        <div class="glass-card" style="padding: 0; overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Công ty</th>
                <th>Vị trí</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Thứ tự</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exp in experiences" :key="exp.id">
                <td style="width: 80px;">
                  <div :style="{ backgroundColor: getCompanyById(exp.companyId)?.logoBg || exp.logoBg || '#ffffff' }" style="width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 4px; border: 1px solid var(--border-color); overflow: hidden;">
                    <img v-if="getCompanyById(exp.companyId)?.logoUrl || exp.logoUrl" :src="getCompanyById(exp.companyId)?.logoUrl || exp.logoUrl" :style="{ transform: `scale(${getCompanyById(exp.companyId)?.logoScale ?? exp.logoScale ?? 1}) translate(${getCompanyById(exp.companyId)?.logoX ?? exp.logoX ?? 0}px, ${getCompanyById(exp.companyId)?.logoY ?? exp.logoY ?? 0}px)` }" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                    <span v-else style="color: #1e293b; font-weight: 800; font-size: 18px;">{{ (getCompanyById(exp.companyId)?.name || exp.company || '?').charAt(0) }}</span>
                  </div>
                </td>
                <td style="font-weight:600;">{{ getCompanyById(exp.companyId)?.name || exp.company }}</td>
                <td>{{ exp.role }}</td>
                <td>{{ exp.startDate }}</td>
                <td>{{ exp.endDate }}</td>
                <td>{{ exp.order }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/experiences/${exp.id}`" class="action-icon-btn edit-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteExperience(exp.id)" class="action-icon-btn delete-btn" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="experiences && experiences.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">Chưa có dữ liệu kinh nghiệm.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: PROJECTS ==================== -->
      <div v-if="activeTab === 'projects'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px;">Dự án nổi bật</h3>
          <NuxtLink to="/admin/projects/new" class="btn btn-primary" style="text-decoration: none;">
            + Thêm dự án
          </NuxtLink>
        </div>

        <div class="glass-card" style="padding: 0; overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên dự án</th>
                <th>Thời gian</th>
                <th>Công ty / Tổ chức</th>
                <th>Tech Stack</th>
                <th>Links</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proj in projects" :key="proj.id">
                <td style="width: 80px;">
                  <img v-if="proj.imageUrl" :src="proj.imageUrl" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" />
                  <span v-else style="color: var(--text-muted); font-size: 12px;">No Image</span>
                </td>
                <td style="font-weight:600;">{{ proj.title }}</td>
                <td style="color: var(--text-secondary); font-size: 14px; white-space: nowrap;">
                  <span v-if="proj.startDate || proj.endDate">{{ proj.startDate }}<span v-if="proj.endDate"> - {{ proj.endDate }}</span></span>
                  <span v-else>-</span>
                </td>
                <td style="color: var(--accent);">{{ proj.companyId ? getCompanyById(proj.companyId)?.name : 'Cá nhân' }}</td>
                <td>
                  <span v-for="tech in proj.techStack" :key="tech" class="badge" style="margin-right: 4px; margin-bottom: 2px;">{{ tech }}</span>
                </td>
                <td>
                  <div style="display:flex; gap: 8px;">
                    <a v-if="proj.demoLink" :href="proj.demoLink" target="_blank" style="color: var(--accent); font-size: 13px;">Demo</a>
                    <a v-if="proj.githubLink" :href="proj.githubLink" target="_blank" style="color: var(--text-secondary); font-size: 13px;">GitHub</a>
                  </div>
                </td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/projects/${proj.id}`" class="action-icon-btn edit-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteProject(proj.id)" class="action-icon-btn delete-btn" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="projects && projects.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">Chưa có dữ liệu dự án.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: SKILLS ==================== -->
      <div v-if="activeTab === 'skills'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 20px;">Kỹ năng chuyên môn</h3>
          <NuxtLink to="/admin/skills/new" class="btn btn-primary" style="text-decoration: none;">
            + Thêm kỹ năng
          </NuxtLink>
        </div>

        <div class="glass-card" style="padding: 0; overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên kỹ năng</th>
                <th>Phân mục</th>
                <th>Cấp độ</th>
                <th>Thứ tự</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="skill in skills" :key="skill.id">
                <td style="width: 80px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; padding: 6px; border: 1px solid var(--border-color); overflow: hidden;">
                    <img v-if="skill.iconUrl" :src="skill.iconUrl" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                    <span v-else style="color: var(--primary); font-weight: 800; font-size: 14px;">{{ skill.name.charAt(0) }}</span>
                  </div>
                </td>
                <td style="font-weight:600;">{{ skill.name }}</td>
                <td>
                  <span class="badge" :class="skill.category === 'frontend' || skill.category === 'ai-automation' ? 'badge-primary' : 'badge-accent'">
                    {{ categoriesMap[skill.category] }}
                  </span>
                </td>
                <td style="color: var(--accent); font-weight: 600; font-size: 14px;">{{ skill.level || 'N/A' }}</td>
                <td>{{ skill.order }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/skills/${skill.id}`" class="action-icon-btn edit-btn" title="Chỉnh sửa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteSkill(skill.id)" class="action-icon-btn delete-btn" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="skills && skills.length === 0">
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">Chưa có kỹ năng nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>

    <!-- Custom Confirm Dialog -->
    <div v-if="isConfirmOpen" class="modal-overlay" style="z-index: 2000;">
      <div class="modal-content" style="max-width: 440px; padding: 28px; text-align: center; border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(239, 68, 68, 0.05);">
        <div style="margin-bottom: 20px;">
          <!-- Sleek Warning Icon -->
          <div style="width: 56px; height: 56px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <svg style="width: 28px; height: 28px; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Xác nhận xóa</h3>
        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 24px; text-align: center;">{{ confirmMessage }}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button @click="handleConfirmNo" class="btn btn-secondary" style="flex: 1; padding: 10px 16px;">Hủy bỏ</button>
          <button @click="handleConfirmYes" class="btn btn-primary" style="flex: 1; padding: 10px 16px; background: #ef4444; border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>

  </div>
</template>

<style scoped>
.action-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.action-icon-btn svg {
  width: 16px;
  height: 16px;
}

.action-icon-btn.edit-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  transform: translateY(-2px);
}

.action-icon-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: translateY(-2px);
}
</style>

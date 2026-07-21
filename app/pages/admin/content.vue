<script setup lang="ts">
import { collection, doc, deleteDoc, query, orderBy, setDoc, writeBatch } from 'firebase/firestore'
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
const rawProjects = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'projects')
}))
const projects = computed(() => {
  return [...(rawProjects.value || [])].sort((a, b) => (b.order || 0) - (a.order || 0))
})

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

// --- Project Drag & Drop Sort ---
const isProjectSortMode = ref(false)
const sortableProjects = ref<any[]>([])
const projectDraggedIndex = ref<number | null>(null)
const isSavingProjectOrder = ref(false)

const toggleProjectSortMode = () => {
  if (!isProjectSortMode.value) {
    sortableProjects.value = [...(projects.value || [])]
  }
  isProjectSortMode.value = !isProjectSortMode.value
}

const onProjectDragStart = (index: number) => {
  projectDraggedIndex.value = index
}

const onProjectDragEnter = (index: number) => {
  if (projectDraggedIndex.value === null || projectDraggedIndex.value === index) return
  const draggedItem = sortableProjects.value[projectDraggedIndex.value]
  sortableProjects.value.splice(projectDraggedIndex.value, 1)
  sortableProjects.value.splice(index, 0, draggedItem)
  projectDraggedIndex.value = index
}

const onProjectDragEnd = () => {
  projectDraggedIndex.value = null
}

const saveProjectsOrder = async () => {
  if (!sortableProjects.value.length) return
  isSavingProjectOrder.value = true
  try {
    const batch = writeBatch(db)
    const total = sortableProjects.value.length
    sortableProjects.value.forEach((proj, index) => {
      const projRef = doc(db, 'projects', proj.id)
      batch.update(projRef, { order: total - index })
    })
    await batch.commit()
    showToast('Đã lưu thứ tự dự án!')
    isProjectSortMode.value = false
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu thứ tự: ${error.message}`)
  } finally {
    isSavingProjectOrder.value = false
  }
}

// ==========================================
// 4. TAB: SKILLS CRUD
// ==========================================
interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'ai-automation'
  displayType?: 'icon' | 'text'
  order: number
  iconUrl?: string
  description?: string
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
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Bảng Điều Khiển Quản Trị</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Quản lý dữ liệu hiển thị trên Portfolio cá nhân của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: currentTabName }]" class="mb-6" />

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
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[20px] font-bold">Quản lý Thông tin Cá nhân</h3>
        </div>

        <div class="glass-card p-6">
          <form @submit.prevent="savePersonalInfo">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            
            <div class="form-group mb-8">
              <label class="form-label">Tóm tắt bản thân (Summary)</label>
              <RichTextEditor v-model="personalForm.summary" />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isSavingPersonal">
              {{ isSavingPersonal ? 'Đang lưu...' : 'Lưu Thông Tin' }}
            </button>
          </form>
        </div>
      </div>

      <!-- ==================== TAB: COMPANIES ==================== -->
      <div v-if="activeTab === 'companies'">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[20px] font-bold">Quản lý Công ty</h3>
          <NuxtLink to="/admin/companies/new" class="btn btn-primary no-underline">
            + Thêm công ty
          </NuxtLink>
        </div>

        <div class="glass-card p-0 overflow-x-auto">
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
                <td class="w-[80px]">
                  <div :style="{ backgroundColor: comp.logoBg || '#ffffff' }" class="w-[50px] h-[50px] rounded-lg flex items-center justify-center p-1 border border-[color:var(--border-color)] overflow-hidden">
                    <img v-if="comp.logoUrl" :src="comp.logoUrl" :style="{ transform: `scale(${comp.logoScale ?? 1}) translate(${comp.logoX ?? 0}px, ${comp.logoY ?? 0}px)` }" class="max-w-full max-h-full object-contain" />
                    <span v-else class="text-slate-800 font-extrabold text-[18px]">{{ comp.name?.charAt(0) || '?' }}</span>
                  </div>
                </td>
                <td class="font-semibold">{{ comp.name }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/companies/${comp.id}`" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-500 hover:-translate-y-0.5" title="Chỉnh sửa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteCompany(comp.id)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-500 hover:-translate-y-0.5" title="Xóa">

                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="companies && companies.length === 0">
                <td colspan="3" class="text-center text-[color:var(--text-muted)] p-10">Chưa có dữ liệu công ty.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: EXPERIENCES ==================== -->
      <div v-if="activeTab === 'experiences'">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[20px] font-bold">Lộ trình làm việc</h3>
          <NuxtLink to="/admin/experiences/new" class="btn btn-primary no-underline">
            + Thêm kinh nghiệm
          </NuxtLink>
        </div>

        <div class="glass-card p-0 overflow-x-auto">
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
                <td class="w-[80px]">
                  <div :style="{ backgroundColor: getCompanyById(exp.companyId)?.logoBg || exp.logoBg || '#ffffff' }" class="w-[50px] h-[50px] rounded-lg flex items-center justify-center p-1 border border-[color:var(--border-color)] overflow-hidden">
                    <img v-if="getCompanyById(exp.companyId)?.logoUrl || exp.logoUrl" :src="getCompanyById(exp.companyId)?.logoUrl || exp.logoUrl" :style="{ transform: `scale(${getCompanyById(exp.companyId)?.logoScale ?? exp.logoScale ?? 1}) translate(${getCompanyById(exp.companyId)?.logoX ?? exp.logoX ?? 0}px, ${getCompanyById(exp.companyId)?.logoY ?? exp.logoY ?? 0}px)` }" class="max-w-full max-h-full object-contain" />
                    <span v-else class="text-slate-800 font-extrabold text-[18px]">{{ (getCompanyById(exp.companyId)?.name || exp.company || '?').charAt(0) }}</span>
                  </div>
                </td>
                <td class="font-semibold">{{ getCompanyById(exp.companyId)?.name || exp.company }}</td>
                <td>{{ exp.role }}</td>
                <td>{{ exp.startDate }}</td>
                <td>{{ exp.endDate }}</td>
                <td>{{ exp.order }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/experiences/${exp.id}`" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-500 hover:-translate-y-0.5" title="Chỉnh sửa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteExperience(exp.id)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-500 hover:-translate-y-0.5" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="experiences && experiences.length === 0">
                <td colspan="7" class="text-center text-[color:var(--text-muted)] p-10">Chưa có dữ liệu kinh nghiệm.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: PROJECTS ==================== -->
      <div v-if="activeTab === 'projects'">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[20px] font-bold">Dự án nổi bật</h3>
          <div class="flex gap-3">
            <button v-if="!isProjectSortMode" @click="toggleProjectSortMode" class="btn bg-black/30 border border-white/10 hover:bg-white/10">
              <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
              Sắp xếp
            </button>
            <button v-else @click="toggleProjectSortMode" class="btn bg-black/30 border border-white/10 hover:bg-white/10">
              Hủy
            </button>
            <NuxtLink v-if="!isProjectSortMode" to="/admin/projects/new" class="btn btn-primary no-underline">
              + Thêm dự án
            </NuxtLink>
            <button v-if="isProjectSortMode" @click="saveProjectsOrder" class="btn btn-primary" :disabled="isSavingProjectOrder">
              {{ isSavingProjectOrder ? 'Đang lưu...' : 'Lưu thứ tự' }}
            </button>
          </div>
        </div>

        <div v-if="isProjectSortMode" class="glass-card p-6 mb-5">
          <p class="text-[color:var(--text-secondary)] mb-4 text-sm"><span class="font-bold text-white">Hướng dẫn:</span> Kéo thả các ô bên dưới để thay đổi thứ tự (mục trên cùng sẽ hiển thị đầu tiên). Nhấn "Lưu thứ tự" khi hoàn tất.</p>
          <div class="flex flex-col gap-2">
            <div
              v-for="(proj, index) in sortableProjects"
              :key="proj.id"
              draggable="true"
              @dragstart="onProjectDragStart(index)"
              @dragenter.prevent="onProjectDragEnter(index)"
              @dragover.prevent
              @dragend="onProjectDragEnd"
              class="flex items-center gap-4 bg-black/20 p-3 rounded-md border border-[color:var(--border-color)] cursor-move hover:border-[color:var(--cv-primary)] hover:bg-white/5 transition-colors"
              :class="{ 'opacity-50 border-dashed': projectDraggedIndex === index }"
            >
              <div class="text-[color:var(--text-muted)]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </div>
              <img v-if="proj.imageUrl" :src="proj.imageUrl" class="w-[40px] h-[30px] object-cover rounded border border-[color:var(--border-color)]" />
              <div v-else class="w-[40px] h-[30px] bg-white/5 rounded border border-[color:var(--border-color)] flex items-center justify-center text-[10px] text-[color:var(--text-muted)]">No Img</div>
              <div class="font-semibold flex-1">{{ proj.title }}</div>
              <div class="text-sm text-[color:var(--text-secondary)]">Thứ tự cũ: {{ proj.order || 0 }}</div>
            </div>
          </div>
        </div>

        <div v-show="!isProjectSortMode" class="glass-card p-0 overflow-x-auto">
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
                <td class="w-[80px]">
                  <img v-if="proj.imageUrl" :src="proj.imageUrl" class="w-[60px] h-[40px] object-cover rounded border border-[color:var(--border-color)]" />
                  <span v-else class="text-[color:var(--text-muted)] text-[12px]">No Image</span>
                </td>
                <td class="font-semibold">{{ proj.title }}</td>
                <td class="text-[color:var(--text-secondary)] text-[14px] whitespace-nowrap">
                  <span v-if="proj.startDate || proj.endDate">{{ proj.startDate }}<span v-if="proj.endDate"> - {{ proj.endDate }}</span></span>
                  <span v-else>-</span>
                </td>
                <td class="text-[color:var(--accent)]">{{ proj.companyId ? getCompanyById(proj.companyId)?.name : 'Cá nhân' }}</td>
                <td>
                  <span v-for="tech in proj.techStack" :key="tech" class="badge mr-1 mb-0.5">{{ tech }}</span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <a v-if="proj.demoLink" :href="proj.demoLink" target="_blank" class="text-[color:var(--accent)] text-[13px]">Demo</a>
                    <a v-if="proj.githubLink" :href="proj.githubLink" target="_blank" class="text-[color:var(--text-secondary)] text-[13px]">GitHub</a>
                  </div>
                </td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/projects/${proj.id}`" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-500 hover:-translate-y-0.5" title="Chỉnh sửa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteProject(proj.id)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-500 hover:-translate-y-0.5" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="projects && projects.length === 0">
                <td colspan="7" class="text-center text-[color:var(--text-muted)] p-10">Chưa có dữ liệu dự án.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== TAB: SKILLS ==================== -->
      <div v-if="activeTab === 'skills'">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[20px] font-bold">Kỹ năng chuyên môn</h3>
          <NuxtLink to="/admin/skills/new" class="btn btn-primary no-underline">
            + Thêm kỹ năng
          </NuxtLink>
        </div>

        <div class="glass-card p-0 overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên kỹ năng</th>
                <th>Phân mục</th>
                <th>Loại hiển thị</th>
                <th>Thứ tự</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="skill in skills" :key="skill.id">
                <td class="w-[80px]">
                  <div v-if="skill.displayType !== 'text'" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-1.5 border border-[color:var(--border-color)] overflow-hidden">
                    <img v-if="skill.iconUrl" :src="skill.iconUrl" class="max-w-full max-h-full object-contain" />
                    <span v-else class="text-[color:var(--primary)] font-extrabold text-[14px]">{{ skill.name.charAt(0) }}</span>
                  </div>
                  <div v-else class="text-[color:var(--text-secondary)] text-[12px] italic">Văn bản</div>
                </td>
                <td class="font-semibold">{{ skill.name }}</td>
                <td>
                  <span class="badge" :class="skill.category === 'frontend' || skill.category === 'ai-automation' ? 'badge-primary' : 'badge-accent'">
                    {{ categoriesMap[skill.category] }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="skill.displayType === 'text' ? 'badge-accent' : 'badge-primary'">
                    {{ skill.displayType === 'text' ? 'Văn bản' : 'Icon' }}
                  </span>
                </td>
                <td>{{ skill.order }}</td>
                <td class="actions-cell">
                  <div class="actions-wrapper">
                    <NuxtLink :to="`/admin/skills/${skill.id}`" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-500 hover:-translate-y-0.5" title="Chỉnh sửa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteSkill(skill.id)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/5 bg-black/20 cursor-pointer transition-all duration-200 text-[color:var(--text-secondary)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-500 hover:-translate-y-0.5" title="Xóa">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="skills && skills.length === 0">
                <td colspan="6" class="text-center text-[color:var(--text-muted)] p-10">Chưa có kỹ năng nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>

      <!-- Custom Confirm Dialog -->
    <div v-if="isConfirmOpen" class="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center backdrop-blur-[2px]">
      <div class="glass-card max-w-[440px] p-7 text-center border-red-500/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_40px_rgba(239,68,68,0.05)] w-[90%]">
        <div class="mb-5">
          <!-- Sleek Warning Icon -->
          <div class="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-[18px] font-bold text-[color:var(--text-primary)] mb-2">Xác nhận xóa</h3>
        <p class="text-[14px] text-[color:var(--text-secondary)] leading-[1.5] mb-6 text-center">{{ confirmMessage }}</p>
        <div class="flex gap-3 justify-center">
          <button @click="handleConfirmNo" class="btn btn-secondary flex-1 px-4 py-2.5">Hủy bỏ</button>
          <button @click="handleConfirmYes" class="btn btn-primary flex-1 px-4 py-2.5 bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:border-red-600">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>

  </div>
</template>

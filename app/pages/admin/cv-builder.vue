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

const rawProjects = useCollection(computed(() => {
  if (!import.meta.client || !db) return null
  return collection(db, 'projects')
}))
const projects = computed(() => {
  return [...(rawProjects.value || [])].sort((a, b) => (b.order || 0) - (a.order || 0))
})

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
  { id: 'template', name: 'Giao diện CV' },
  { id: 'experiences', name: 'Kinh nghiệm' },
  { id: 'projects', name: 'Dự án' },
  { id: 'skills', name: 'Kỹ năng' }
] as const

const activeTab = ref<'personal' | 'template' | 'experiences' | 'projects' | 'skills'>('personal')

// CV Builder Profile State
const cvProfileRef = useDocument(doc(db, 'settings', 'cv_profile'))
const isSavingCvProfile = ref(false)

const cvProfileForm = ref({
  selectedExperiences: [] as string[],
  selectedProjects: [] as string[],
  selectedSkills: [] as string[],
  cvAvatarUrl: '',
  templateId: 'classic' as 'classic' | 'modern' | 'minimal'
})

watch(cvProfileRef, (newProfile) => {
  if (newProfile) {
    cvProfileForm.value = {
      selectedExperiences: newProfile.selectedExperiences || [],
      selectedProjects: newProfile.selectedProjects || [],
      selectedSkills: newProfile.selectedSkills || [],
      cvAvatarUrl: newProfile.cvAvatarUrl || '',
      templateId: newProfile.templateId || 'classic'
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
  <div class="pb-10">
    <!-- Header -->
    <div class="mb-4 flex flex-col md:flex-row justify-between md:items-center">
      <div>
        <h1 class="text-[28px] font-bold text-[color:var(--text-primary)]">Tạo & Cấu Hình CV</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Tùy chỉnh thông tin và xuất PDF chuyên nghiệp</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Tạo CV' }]" />

    <div class="flex justify-end items-center mb-5 mt-2">
      <NuxtLink to="/cv" target="_blank" class="px-4 py-2 rounded font-medium text-[color:var(--bg-dark)] bg-[color:var(--accent)] hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-[color:var(--bg-dark)]">
        Xem & In CV
      </NuxtLink>
    </div>

    <!-- Tabs Menu for CV Builder -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-2">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors border border-transparent"
        :class="activeTab === tab.id ? 'bg-[color:var(--accent)] text-[color:var(--bg-dark)] font-bold' : 'bg-white/5 text-[color:var(--text-secondary)] hover:bg-white/10 hover:text-white'"
        @click.prevent="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
      <form @submit.prevent="saveCvProfile">
        
        <!-- Tab 1: Personal -->
        <div v-show="activeTab === 'personal'">
          <h4 class="mb-4 text-[color:var(--accent)] text-lg border-b border-white/10 pb-2 font-semibold">1. Thông tin cá nhân</h4>
          <div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-gray-400">
            <p class="mb-2">
              <strong class="text-white">Lưu ý:</strong> Dữ liệu cá nhân (Họ tên, Email, SĐT...) hiện được quản lý tập trung. Vui lòng vào trang <strong class="text-white">Quản lý Dữ liệu > Cá nhân</strong> để cập nhật.
            </p>
            <p>Trình tạo CV sẽ tự động lấy các thông tin đó. Tại đây bạn chỉ cần cấu hình ảnh đại diện (avatar) dành riêng cho CV (nếu có).</p>
          </div>
          
          <div class="mb-8 max-w-lg">
            <label class="block text-sm font-medium text-gray-300 mb-2">Avatar URL (Dành riêng cho CV)</label>
            <input v-model="cvProfileForm.cvAvatarUrl" type="text" class="w-full bg-black/20 border border-white/10 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)] transition-colors" placeholder="Để trống nếu muốn dùng avatar chung từ Quản lý dữ liệu" />
          </div>
        </div>

        <!-- Tab 1.5: Template -->
        <div v-show="activeTab === 'template'">
          <h4 class="mb-4 text-[color:var(--accent)] text-lg border-b border-white/10 pb-2 font-semibold">Giao diện CV</h4>
          
          <div class="mb-8 max-w-4xl">
            <div class="flex flex-col sm:flex-row justify-between sm:items-end mb-4 gap-2">
              <label class="block text-sm font-medium text-gray-300">Mẫu giao diện CV (Template)</label>
              <select v-model="cvProfileForm.templateId" class="bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-[color:var(--accent)] w-full sm:w-48 appearance-none">
                <option value="classic">Classic (1 cột)</option>
                <option value="modern">Modern (2 cột)</option>
                <option value="minimal">Minimalist (Tối giản)</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              
              <!-- Template: Classic -->
              <div class="cursor-pointer rounded-lg border-2 transition-all p-1" :class="cvProfileForm.templateId === 'classic' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10' : 'border-transparent hover:border-white/20'" @click="cvProfileForm.templateId = 'classic'">
                <div class="bg-black/20 rounded-md overflow-hidden">
                  <div class="bg-white border border-gray-200 h-32 rounded-md p-3 flex flex-col m-2 shadow-sm">
                    <div class="h-5 border-b-2 border-gray-900 mb-2"></div>
                    <div class="flex-1 bg-gray-100 mb-1"></div>
                    <div class="flex-[2] bg-gray-100"></div>
                  </div>
                  <div class="mt-2 text-center pb-3">
                    <div class="font-semibold text-white">Classic</div>
                    <div class="text-xs text-gray-400 mt-1">Truyền thống, 1 cột</div>
                  </div>
                </div>
              </div>

              <!-- Template: Modern -->
              <div class="cursor-pointer rounded-lg border-2 transition-all p-1" :class="cvProfileForm.templateId === 'modern' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10' : 'border-transparent hover:border-white/20'" @click="cvProfileForm.templateId = 'modern'">
                <div class="bg-black/20 rounded-md overflow-hidden">
                  <div class="bg-white border border-gray-200 h-32 rounded-md flex overflow-hidden m-2 shadow-sm">
                    <div class="w-[35%] bg-slate-50 border-r border-gray-200 p-2 flex flex-col items-center">
                      <div class="w-6 h-6 rounded-full bg-gray-300 mb-2"></div>
                      <div class="w-full h-1 bg-gray-200 mb-1"></div>
                    </div>
                    <div class="w-[65%] p-2 flex flex-col">
                      <div class="h-3 bg-gray-900 mb-2 w-[60%]"></div>
                      <div class="flex-1 bg-gray-100 mb-1"></div>
                    </div>
                  </div>
                  <div class="mt-2 text-center pb-3">
                    <div class="font-semibold text-white">Modern</div>
                    <div class="text-xs text-gray-400 mt-1">Hiện đại, 2 cột</div>
                  </div>
                </div>
              </div>

              <!-- Template: Minimal -->
              <div class="cursor-pointer rounded-lg border-2 transition-all p-1" :class="cvProfileForm.templateId === 'minimal' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10' : 'border-transparent hover:border-white/20'" @click="cvProfileForm.templateId = 'minimal'">
                <div class="bg-black/20 rounded-md overflow-hidden">
                  <div class="bg-white border border-gray-200 h-32 rounded-md p-3 flex flex-col items-center m-2 shadow-sm">
                    <div class="h-3.5 bg-gray-900 w-1/2 mb-1"></div>
                    <div class="h-1.5 bg-gray-400 w-[30%] mb-3"></div>
                    <div class="w-full h-1 bg-gray-100 mb-1.5"></div>
                    <div class="w-full h-1 bg-gray-100 mb-1.5"></div>
                    <div class="w-full h-1 bg-gray-100"></div>
                  </div>
                  <div class="mt-2 text-center pb-3">
                    <div class="font-semibold text-white">Minimalist</div>
                    <div class="text-xs text-gray-400 mt-1">Tối giản, chữ lớn</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <!-- Tab 2: Experiences -->
        <div v-show="activeTab === 'experiences'">
          <h4 class="mb-4 text-[color:var(--accent)] text-lg border-b border-white/10 pb-2 font-semibold">2. Kinh nghiệm làm việc</h4>
          <div class="mb-8 bg-black/15 p-4 rounded-lg border border-white/10">
            <div v-for="exp in experiences" :key="exp.id" class="flex items-center mb-3 pb-3 border-b border-dashed border-white/5 last:border-0 last:mb-0 last:pb-0">
              <input type="checkbox" :id="'exp-'+exp.id" :value="exp.id" v-model="cvProfileForm.selectedExperiences" class="mr-3 w-4.5 h-4.5 cursor-pointer accent-[color:var(--accent)] rounded border-gray-700 bg-gray-900" />
              <label :for="'exp-'+exp.id" class="cursor-pointer text-gray-200 select-none flex items-center flex-1">
                <div class="flex-1">
                  <strong class="text-white">{{ exp.role }}</strong> <span class="text-gray-400">tại {{ exp.company }}</span>
                  <div class="text-[13px] text-gray-500 mt-1">{{ exp.startDate }} - {{ exp.endDate }}</div>
                </div>
              </label>
            </div>
            <div v-if="!experiences || experiences.length === 0" class="text-gray-500 text-sm">Chưa có kinh nghiệm nào.</div>
          </div>
        </div>

        <!-- Tab 3: Projects -->
        <div v-show="activeTab === 'projects'">
          <h4 class="mb-4 text-[color:var(--accent)] text-lg border-b border-white/10 pb-2 font-semibold">3. Dự án nổi bật</h4>
          <div class="mb-8 bg-black/15 p-4 rounded-lg border border-white/10">
            <div v-for="proj in projects" :key="proj.id" class="flex items-center mb-3 pb-3 border-b border-dashed border-white/5 last:border-0 last:mb-0 last:pb-0">
              <input type="checkbox" :id="'proj-'+proj.id" :value="proj.id" v-model="cvProfileForm.selectedProjects" class="mr-3 w-4.5 h-4.5 cursor-pointer accent-[color:var(--accent)] rounded border-gray-700 bg-gray-900" />
              <label :for="'proj-'+proj.id" class="cursor-pointer text-gray-200 select-none">
                <strong class="text-white">{{ proj.title }}</strong>
              </label>
            </div>
            <div v-if="!projects || projects.length === 0" class="text-gray-500 text-sm">Chưa có dự án nào.</div>
          </div>
        </div>

        <!-- Tab 4: Skills -->
        <div v-show="activeTab === 'skills'">
          <h4 class="mb-4 text-[color:var(--accent)] text-lg border-b border-white/10 pb-2 font-semibold">4. Kỹ năng chuyên môn</h4>
          <div class="mb-8 bg-black/15 p-4 rounded-lg border border-white/10">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="skill in skills" :key="skill.id" class="flex items-center">
                <input type="checkbox" :id="'skill-'+skill.id" :value="skill.id" v-model="cvProfileForm.selectedSkills" class="mr-3 w-4.5 h-4.5 cursor-pointer accent-[color:var(--accent)] rounded border-gray-700 bg-gray-900" />
                <label :for="'skill-'+skill.id" class="cursor-pointer text-gray-200 text-sm select-none flex items-center gap-2 flex-1">
                  <div class="w-7 h-7 bg-white/5 rounded flex items-center justify-center p-1">
                    <img v-if="skill.iconUrl" :src="skill.iconUrl" class="max-w-full max-h-full object-contain" />
                    <span v-else class="text-[color:var(--primary)] text-[10px] uppercase font-bold">{{ skill.name.charAt(0) }}</span>
                  </div>
                  <span class="font-medium">{{ skill.name }}</span>
                  <span class="text-gray-500 text-[10px] bg-white/5 px-1.5 py-0.5 rounded ml-auto border border-white/5">{{ categoriesMap[skill.category] }}</span>
                </label>
              </div>
            </div>
            <div v-if="!skills || skills.length === 0" class="text-gray-500 text-sm">Chưa có kỹ năng nào.</div>
          </div>
        </div>

        <button type="submit" :disabled="isSavingCvProfile" class="w-full py-3.5 px-4 text-base font-semibold rounded bg-[color:var(--accent)] text-[color:var(--bg-dark)] mt-4 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200">
          {{ isSavingCvProfile ? 'Đang lưu...' : 'Lưu Cấu Hình CV' }}
        </button>
      </form>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="fixed bottom-6 right-6 bg-[color:var(--accent)] text-[color:var(--bg-dark)] px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] z-50 font-medium transform transition-all animate-bounce">
      {{ toastMessage }}
    </div>

  </div>
</template>

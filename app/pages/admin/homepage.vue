<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({ title: 'Cấu Hình Trang Chủ' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const isSaving = ref(false)
const toastMessage = ref('')
const isLoading = ref(true)

const defaultSections = [
  { id: 'hero', name: 'Giới thiệu (Hero)', visible: true },
  { id: 'skills', name: 'Kỹ Năng Chuyên Môn', subtitle: 'Hệ thống công nghệ nền tảng và công cụ chuyên sâu mà tôi thường sử dụng', visible: true },
  { id: 'experience', name: 'Kinh Nghiệm Làm Việc', subtitle: 'Hành trình phát triển và các cột mốc công việc từ trước tới nay', visible: true },
  { id: 'projects', name: 'Dự Án Nổi Bật', subtitle: 'Các dự án, giải pháp hệ thống và sản phẩm tôi từng phát triển', visible: true }
]

const sections = ref<{ id: string, name: string, subtitle?: string, visible: boolean }[]>([])

const heroSettings = ref({
  badgeText: 'Sẵn sàng hợp tác',
  titleLine1: 'Xin chào, tôi là một',
  titleLine2: 'Software Engineer',
  description: 'Đam mê xây dựng các giải pháp phần mềm chất lượng cao, tối ưu hóa hệ thống backend, phát triển các AI Agent thông minh và quy trình tự động hóa nhằm nâng cao hiệu suất doanh nghiệp.'
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

onMounted(async () => {
  try {
    const docRef = doc(db, 'settings', 'homepage')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data.hero) {
        heroSettings.value = { ...heroSettings.value, ...data.hero }
      }
      if (data.sections) {
      // Merge with default sections in case new ones were added in code
      const savedSections = docSnap.data().sections
      
      // Ensure all default sections exist
      const merged = savedSections.map((saved: any) => {
        const def = defaultSections.find(d => d.id === saved.id)
        return def ? { ...def, ...saved } : saved
      })
      
      // Add missing sections at the end
      defaultSections.forEach(def => {
        if (!merged.find((m: any) => m.id === def.id)) {
          merged.push(def)
        }
      })
      
      sections.value = merged
      }
    } else {
      // If document doesn't exist, use default
      sections.value = [...defaultSections]
    }
  } catch (error) {
    console.error("Error loading homepage settings:", error)
  } finally {
    isLoading.value = false
  }
})

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = sections.value[index]!
    sections.value[index] = sections.value[index - 1]!
    sections.value[index - 1] = temp
  }
}

const moveDown = (index: number) => {
  if (index < sections.value.length - 1) {
    const temp = sections.value[index]!
    sections.value[index] = sections.value[index + 1]!
    sections.value[index + 1] = temp
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    await setDoc(doc(db, 'settings', 'homepage'), {
      hero: heroSettings.value,
      sections: sections.value,
      updatedAt: new Date().toISOString()
    })
    showToast('Lưu cấu hình thành công!')
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu: ${error.message || error}`)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <!-- Admin Header -->
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Cấu Hình Trang Chủ</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Sắp xếp thứ tự và ẩn/hiện các phân vùng (sections) trên trang chủ</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Cấu hình Trang chủ' }]" class="mb-6" />

    <div v-if="isLoading" class="text-[color:var(--text-secondary)]">
      Đang tải cấu hình...
    </div>

    <div v-else class="glass-card p-8">
      
      <!-- Hero Settings -->
      <h3 class="mb-6 text-[color:var(--text-primary)] border-b border-[color:var(--border-color)] pb-3 font-bold text-lg">Cấu hình khối Giới thiệu (Hero)</h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label class="form-label">Dòng Badge (nhỏ)</label>
          <input v-model="heroSettings.badgeText" type="text" class="form-control" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label class="form-label">Tiêu đề - Dòng 1</label>
          <input v-model="heroSettings.titleLine1" type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label class="form-label">Tiêu đề - Dòng 2 (Gradient)</label>
          <input v-model="heroSettings.titleLine2" type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group mb-10">
        <label class="form-label">Đoạn mô tả ngắn</label>
        <textarea v-model="heroSettings.description" class="form-control" rows="3"></textarea>
      </div>

      <!-- Sections order -->
      <h3 class="mb-6 text-[color:var(--text-primary)] border-b border-[color:var(--border-color)] pb-3 font-bold text-lg">Sắp xếp hiển thị</h3>
      
      <div class="flex flex-col gap-3 mb-8">
        <div 
          v-for="(section, index) in sections" 
          :key="section.id"
          class="flex items-center justify-between bg-black/20 p-4 rounded-md border border-[color:var(--border-color)]"
        >
          <div class="flex items-center gap-4 w-full">
            <!-- Reorder buttons -->
            <div class="flex flex-col gap-1">
              <button 
                @click="moveUp(index)" 
                :disabled="index === 0"
                class="bg-transparent border-none text-[color:var(--text-secondary)] cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
                title="Lên trên"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <button 
                @click="moveDown(index)" 
                :disabled="index === sections.length - 1"
                class="bg-transparent border-none text-[color:var(--text-secondary)] cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
                title="Xuống dưới"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div class="flex flex-col flex-1 ml-3 gap-2">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-[color:var(--text-secondary)]">{{ index + 1 }}.</span>
                <input 
                  v-if="section.id !== 'hero'"
                  v-model="section.name" 
                  type="text" 
                  class="form-control max-w-[300px] px-3 py-1.5 font-semibold text-[15px]"
                  placeholder="Tiêu đề chính"
                />
                <span v-else class="font-semibold text-[color:var(--text-primary)] text-[16px]">
                  {{ section.name }}
                </span>
              </div>
              <div v-if="section.id !== 'hero'" class="flex items-center gap-2 ml-5">
                <input 
                  v-model="section.subtitle" 
                  type="text" 
                  class="form-control w-full max-w-[500px] px-3 py-1.5 text-[14px] text-[color:var(--text-secondary)]"
                  placeholder="Phụ đề (Subtitle)"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 ml-4">
            <label class="cursor-pointer flex items-center gap-2">
              <span class="text-[color:var(--text-secondary)] text-[14px]">{{ section.visible ? 'Hiển thị' : 'Đang ẩn' }}</span>
              <input 
                type="checkbox" 
                v-model="section.visible"
                class="w-[18px] h-[18px] accent-[color:var(--accent)] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      <button @click="saveSettings" class="btn btn-primary px-6 py-3 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSaving">
        {{ isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
      </button>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

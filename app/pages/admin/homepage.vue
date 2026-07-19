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
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Cấu Hình Trang Chủ</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Sắp xếp thứ tự và ẩn/hiện các phân vùng (sections) trên trang chủ</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Cấu hình Trang chủ' }]" style="margin-bottom: 24px;" />

    <div v-if="isLoading" style="color: var(--text-secondary);">
      Đang tải cấu hình...
    </div>

    <div v-else class="glass-card" style="padding: 32px;">
      
      <!-- Hero Settings -->
      <h3 style="margin-bottom: 24px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">Cấu hình khối Giới thiệu (Hero)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Dòng Badge (nhỏ)</label>
          <input v-model="heroSettings.badgeText" type="text" class="form-control" />
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Tiêu đề - Dòng 1</label>
          <input v-model="heroSettings.titleLine1" type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label class="form-label">Tiêu đề - Dòng 2 (Gradient)</label>
          <input v-model="heroSettings.titleLine2" type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 40px;">
        <label class="form-label">Đoạn mô tả ngắn</label>
        <textarea v-model="heroSettings.description" class="form-control" rows="3"></textarea>
      </div>

      <!-- Sections order -->
      <h3 style="margin-bottom: 24px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">Sắp xếp hiển thị</h3>
      
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
        <div 
          v-for="(section, index) in sections" 
          :key="section.id"
          style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"
        >
          <div style="display: flex; align-items: center; gap: 16px;">
            <!-- Reorder buttons -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <button 
                @click="moveUp(index)" 
                :disabled="index === 0"
                style="background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center;"
                :style="{ opacity: index === 0 ? '0.3' : '1' }"
                title="Lên trên"
              >
                <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <button 
                @click="moveDown(index)" 
                :disabled="index === sections.length - 1"
                style="background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center;"
                :style="{ opacity: index === sections.length - 1 ? '0.3' : '1' }"
                title="Xuống dưới"
              >
                <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; margin-left: 12px; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; color: var(--text-secondary);">{{ index + 1 }}.</span>
                <input 
                  v-if="section.id !== 'hero'"
                  v-model="section.name" 
                  type="text" 
                  class="form-control"
                  style="max-width: 300px; padding: 6px 12px; font-weight: 600; font-size: 15px;"
                  placeholder="Tiêu đề chính"
                />
                <span v-else style="font-weight: 600; color: var(--text-primary); font-size: 16px;">
                  {{ section.name }}
                </span>
              </div>
              <div v-if="section.id !== 'hero'" style="display: flex; align-items: center; gap: 8px; margin-left: 20px;">
                <input 
                  v-model="section.subtitle" 
                  type="text" 
                  class="form-control"
                  style="width: 100%; max-width: 500px; padding: 6px 12px; font-size: 14px; color: var(--text-secondary);"
                  placeholder="Phụ đề (Subtitle)"
                />
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--text-secondary); font-size: 14px;">{{ section.visible ? 'Hiển thị' : 'Đang ẩn' }}</span>
              <input 
                type="checkbox" 
                v-model="section.visible"
                style="width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer;"
              />
            </label>
          </div>
        </div>
      </div>

      <button @click="saveSettings" class="btn btn-primary" :disabled="isSaving" style="padding: 12px 24px; font-size: 15px;">
        {{ isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
      </button>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed !important;
}
</style>

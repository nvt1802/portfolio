<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({ title: 'Thêm Kỹ Năng' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const router = useRouter()

const isSavingSkill = ref(false)
const toastMessage = ref('')

const skillForm = ref({
  name: '',
  category: 'frontend' as 'frontend' | 'backend' | 'tools' | 'ai-automation',
  displayType: 'icon' as 'icon' | 'text',
  order: 0,
  iconUrl: '',
  description: ''
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const saveSkill = async () => {
  isSavingSkill.value = true
  try {
    const dataToSave = {
      name: skillForm.value.name,
      category: skillForm.value.category,
      displayType: skillForm.value.displayType,
      order: skillForm.value.order,
      iconUrl: skillForm.value.displayType === 'icon' ? skillForm.value.iconUrl : '',
      description: skillForm.value.displayType === 'text' ? skillForm.value.description : ''
    }

    await addDoc(collection(db, 'skills'), dataToSave)
    showToast('Thêm kỹ năng thành công!')
    setTimeout(() => {
      router.push('/admin/content?tab=skills')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu kỹ năng: ${error.message || error}`)
  } finally {
    isSavingSkill.value = false
  }
}
</script>

<template>
  <div>
    <!-- Admin Header -->
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Thêm Kỹ Năng</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Thêm kỹ năng mới vào hồ sơ của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Kỹ năng', to: '/admin/content?tab=skills' }, { name: 'Thêm mới' }]" class="mb-6" />

    <div class="pb-10">
    <!-- Form Container -->
    <div class="glass-card p-8">
      <form @submit.prevent="saveSkill">
        <div class="form-group mb-5">
          <label class="form-label">Tên kỹ năng / Công nghệ</label>
          <input v-model="skillForm.name" type="text" class="form-control" placeholder="Ví dụ: Java, TypeScript, Docker" required />
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Phân loại danh mục</label>
          <select v-model="skillForm.category" class="form-control p-3 bg-black/20 text-white border border-white/10" required>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="tools">Tools/DevOps</option>
            <option value="ai-automation">AI Agent & Automation</option>
          </select>
        </div>
        
        <div class="form-group mb-5">
          <label class="form-label">Kiểu hiển thị</label>
          <div class="flex gap-4 mt-2">
            <label class="flex items-center gap-2 cursor-pointer text-[color:var(--text-primary)]">
              <input type="radio" v-model="skillForm.displayType" value="icon" class="accent-[color:var(--accent)]" />
              Biểu tượng (Icon)
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-[color:var(--text-primary)]">
              <input type="radio" v-model="skillForm.displayType" value="text" class="accent-[color:var(--accent)]" />
              Văn bản (Text)
            </label>
          </div>
        </div>

        <div v-if="skillForm.displayType === 'icon'" class="form-group mb-5">
          <label class="form-label">Đường dẫn Logo / Icon Công nghệ (URL hoặc local path)</label>
          <input v-model="skillForm.iconUrl" type="text" class="form-control" placeholder="Ví dụ: /images/skills/vue.png hoặc https://..." />
          <div v-if="skillForm.iconUrl" class="mt-4 p-3 bg-white/5 border border-[color:var(--border-color)] rounded-[color:var(--radius-sm)] inline-flex flex-col gap-2">
            <span class="text-[13px] text-[color:var(--text-secondary)]">Xem trước icon:</span>
            <div class="w-[50px] h-[50px] rounded-full bg-white/5 flex items-center justify-center p-1.5 border border-[color:var(--border-color)] overflow-hidden">
              <img :src="skillForm.iconUrl" class="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>

        <div v-if="skillForm.displayType === 'text'" class="form-group mb-5">
          <label class="form-label">Mô tả chi tiết (Hỗ trợ xuống dòng)</label>
          <textarea v-model="skillForm.description" class="form-control" rows="5" placeholder="Ví dụ:&#10;- Web Workers, Code Splitting&#10;- Lighthouse optimization"></textarea>
        </div>
        
        <div class="form-group mb-6">
          <label class="form-label">Thứ tự ưu tiên hiển thị (Số nhỏ đứng trước)</label>
          <input v-model.number="skillForm.order" type="number" class="form-control" required />
        </div>
        
        <div class="flex gap-4">
          <NuxtLink to="/admin/content?tab=skills" class="btn btn-secondary flex-1 text-center no-underline">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary flex-[2]" :disabled="isSavingSkill">
            {{ isSavingSkill ? 'Đang lưu...' : 'Thêm Kỹ Năng' }}
          </button>
        </div>
      </form>
    </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

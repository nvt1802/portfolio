<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({ title: 'Chỉnh Sửa Kỹ Năng' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const router = useRouter()
const route = useRoute()

const skillId = route.params.id as string
const isSavingSkill = ref(false)
const toastMessage = ref('')

const skillForm = ref({
  name: '',
  category: 'frontend' as 'frontend' | 'backend' | 'tools' | 'ai-automation',
  order: 0,
  level: '',
  iconUrl: ''
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

onMounted(async () => {
  try {
    const docRef = doc(db, 'skills', skillId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      skillForm.value = {
        name: data.name || '',
        category: data.category || 'frontend',
        order: data.order || 0,
        level: data.level || '',
        iconUrl: data.iconUrl || ''
      }
    } else {
      showToast('Không tìm thấy kỹ năng!')
      setTimeout(() => {
        router.push('/admin/content?tab=skills')
      }, 1500)
    }
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi tải dữ liệu: ${error.message || error}`)
  }
})

const saveSkill = async () => {
  isSavingSkill.value = true
  try {
    const dataToSave = {
      name: skillForm.value.name,
      category: skillForm.value.category,
      order: skillForm.value.order,
      level: skillForm.value.level,
      iconUrl: skillForm.value.iconUrl
    }

    await updateDoc(doc(db, 'skills', skillId), dataToSave)
    showToast('Cập nhật kỹ năng thành công!')
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
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Chỉnh Sửa Kỹ Năng</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Cập nhật thông tin kỹ năng của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Kỹ năng', to: '/admin/content?tab=skills' }, { name: 'Chỉnh sửa' }]" style="margin-bottom: 24px;" />

    <div style="padding-bottom: 40px;">
    <!-- Form Container -->
    <div class="glass-card" style="padding: 32px;">
      <form @submit.prevent="saveSkill">
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Tên kỹ năng / Công nghệ</label>
          <input v-model="skillForm.name" type="text" class="form-control" placeholder="Ví dụ: Java, TypeScript, Docker" required />
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Phân loại danh mục</label>
          <select v-model="skillForm.category" class="form-control" required>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="tools">Tools/DevOps</option>
            <option value="ai-automation">AI Agent & Automation</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Cấp độ kỹ năng (Ví dụ: Lead, Senior, Junior)</label>
          <input v-model="skillForm.level" type="text" class="form-control" placeholder="Ví dụ: Senior, Lead, 3 năm kinh nghiệm..." required />
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Đường dẫn Logo / Icon Công nghệ (URL hoặc local path)</label>
          <input v-model="skillForm.iconUrl" type="text" class="form-control" placeholder="Ví dụ: /images/skills/vue.png hoặc https://..." />
          <div v-if="skillForm.iconUrl" style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: inline-flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 13px; color: var(--text-secondary);">Xem trước icon:</span>
            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; padding: 6px; border: 1px solid var(--border-color); overflow: hidden;">
              <img :src="skillForm.iconUrl" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Thứ tự ưu tiên hiển thị (Số nhỏ đứng trước)</label>
          <input v-model.number="skillForm.order" type="number" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSavingSkill">
          {{ isSavingSkill ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </form>
    </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

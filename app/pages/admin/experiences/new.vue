<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

useHead({ title: 'Thêm Kinh Nghiệm' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const router = useRouter()

const companies = useCollection(collection(db, 'companies'))

const isSavingExp = ref(false)
const toastMessage = ref('')

const expForm = ref({
  companyId: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
  order: 0
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const saveExperience = async () => {
  isSavingExp.value = true
  try {
    const dataToSave = {
      companyId: expForm.value.companyId,
      role: expForm.value.role,
      startDate: expForm.value.startDate,
      endDate: expForm.value.endDate,
      description: expForm.value.description,
      order: expForm.value.order
    }

    await addDoc(collection(db, 'experiences'), dataToSave)
    showToast('Thêm kinh nghiệm thành công!')
    setTimeout(() => {
      router.push('/admin/content?tab=experiences')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu kinh nghiệm: ${error.message || error}`)
  } finally {
    isSavingExp.value = false
  }
}
</script>

<template>
  <div>
    <!-- Admin Header -->
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Thêm Kinh Nghiệm</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Thêm kinh nghiệm làm việc mới vào hồ sơ của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Kinh nghiệm', to: '/admin/content?tab=experiences' }, { name: 'Thêm mới' }]" style="margin-bottom: 24px;" />

    <div style="padding-bottom: 40px;">
    <!-- Form Container -->
    <div class="glass-card" style="padding: 32px;">
      <form @submit.prevent="saveExperience">
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Công ty / Tổ chức</label>
          <select v-model="expForm.companyId" class="form-control" required style="padding: 12px; background: rgba(0,0,0,0.2); color: white; border: 1px solid rgba(255,255,255,0.1);">
            <option value="" disabled>-- Chọn công ty --</option>
            <option v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Vị trí đảm nhận</label>
          <input v-model="expForm.role" type="text" class="form-control" placeholder="Ví dụ: Senior Developer" required />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label">Tháng bắt đầu</label>
            <input v-model="expForm.startDate" type="text" class="form-control" placeholder="YYYY-MM (Ví dụ: 2019-06)" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tháng kết thúc</label>
            <input v-model="expForm.endDate" type="text" class="form-control" placeholder="YYYY-MM hoặc Present" required />
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Thứ tự hiển thị (Tùy chọn)</label>
          <input v-model.number="expForm.order" type="number" class="form-control" />
        </div>

        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Mô tả chi tiết công việc</label>
          <textarea v-model="expForm.description" class="form-control" rows="6" placeholder="Nhập mô tả các nhiệm vụ và thành tựu..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSavingExp">
          {{ isSavingExp ? 'Đang lưu...' : 'Thêm Kinh Nghiệm' }}
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

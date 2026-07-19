<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc, collection } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

useHead({ title: 'Chỉnh Sửa Kinh Nghiệm' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const router = useRouter()
const route = useRoute()

const companies = useCollection(collection(db, 'companies'))

const expId = route.params.id as string
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

onMounted(async () => {
  try {
    const docRef = doc(db, 'experiences', expId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      expForm.value = {
        companyId: data.companyId || '',
        role: data.role || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        description: data.description || '',
        order: data.order || 0
      }
    } else {
      showToast('Không tìm thấy dữ liệu kinh nghiệm!')
      setTimeout(() => {
        router.push('/admin/content?tab=experiences')
      }, 1500)
    }
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi tải dữ liệu: ${error.message || error}`)
  }
})

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

    await updateDoc(doc(db, 'experiences', expId), dataToSave)
    showToast('Cập nhật kinh nghiệm thành công!')
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
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Chỉnh Sửa Kinh Nghiệm</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Cập nhật thông tin kinh nghiệm làm việc</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Kinh nghiệm', to: '/admin/content?tab=experiences' }, { name: 'Chỉnh sửa' }]" class="mb-6" />

    <div class="pb-10">
    <!-- Form Container -->
    <div class="glass-card p-8">
      <form @submit.prevent="saveExperience">
        <div class="form-group mb-5">
          <label class="form-label">Công ty / Tổ chức</label>
          <select v-model="expForm.companyId" class="form-control p-3 bg-black/20 text-white border border-white/10" required>
            <option value="" disabled>-- Chọn công ty --</option>
            <option v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Vị trí đảm nhận</label>
          <input v-model="expForm.role" type="text" class="form-control" placeholder="Ví dụ: Senior Developer" required />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="form-group">
            <label class="form-label">Tháng bắt đầu</label>
            <input v-model="expForm.startDate" type="text" class="form-control" placeholder="YYYY-MM (Ví dụ: 2019-06)" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tháng kết thúc</label>
            <input v-model="expForm.endDate" type="text" class="form-control" placeholder="YYYY-MM hoặc Present" required />
          </div>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Thứ tự hiển thị (Tùy chọn)</label>
          <input v-model.number="expForm.order" type="number" class="form-control" />
        </div>

        <div class="form-group mb-6">
          <label class="form-label">Mô tả chi tiết công việc</label>
          <textarea v-model="expForm.description" class="form-control" rows="6" placeholder="Nhập mô tả các nhiệm vụ và thành tựu..." required></textarea>
        </div>
        
        <div class="flex gap-4">
          <NuxtLink to="/admin/content?tab=experiences" class="btn btn-secondary flex-1 text-center no-underline">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary flex-[2]" :disabled="isSavingExp">
            {{ isSavingExp ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
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

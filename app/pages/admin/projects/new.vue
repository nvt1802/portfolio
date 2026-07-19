<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore, useFirebaseStorage, useCollection } from 'vuefire'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

useHead({ title: 'Thêm Dự Án' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const storage = useFirebaseStorage()
const router = useRouter()

const companies = useCollection(collection(db, 'companies'))

const isSavingProj = ref(false)
const isUploading = ref(false)
const toastMessage = ref('')

const projForm = ref({
  companyId: '',
  title: '',
  description: '',
  techStackInput: '',
  demoLink: '',
  githubLink: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  teamSize: '',
  role: '',
  workDone: '',
  client: ''
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const fileRef = storageRef(storage, `projects/${Date.now()}_${file.name}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    projForm.value.imageUrl = url
    showToast('Tải ảnh lên thành công!')
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi tải lên: ${error.message || error}`)
  } finally {
    isUploading.value = false
  }
}

const saveProject = async () => {
  isSavingProj.value = true
  try {
    const techStack = projForm.value.techStackInput
      ? projForm.value.techStackInput.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const dataToSave = {
      companyId: projForm.value.companyId,
      title: projForm.value.title,
      description: projForm.value.description,
      techStack,
      demoLink: projForm.value.demoLink,
      githubLink: projForm.value.githubLink,
      imageUrl: projForm.value.imageUrl,
      startDate: projForm.value.startDate,
      endDate: projForm.value.endDate,
      teamSize: projForm.value.teamSize,
      role: projForm.value.role,
      workDone: projForm.value.workDone,
      client: projForm.value.client
    }

    await addDoc(collection(db, 'projects'), dataToSave)
    showToast('Thêm dự án thành công!')
    setTimeout(() => {
      router.push('/admin/content?tab=projects')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu dự án: ${error.message || error}`)
  } finally {
    isSavingProj.value = false
  }
}
</script>

<template>
  <div>
    <!-- Admin Header -->
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Thêm Dự Án</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Thêm dự án mới vào hồ sơ của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Dự án', to: '/admin/content?tab=projects' }, { name: 'Thêm mới' }]" class="mb-6" />

    <div class="pb-10">
    <!-- Form Container -->
    <div class="glass-card p-8">
      <form @submit.prevent="saveProject">
        <div class="form-group mb-5">
          <label class="form-label">Công ty / Tổ chức</label>
          <select v-model="projForm.companyId" class="form-control p-3 bg-black/20 text-white border border-white/10">
            <option value="">-- Thuộc dự án cá nhân (Không thuộc công ty) --</option>
            <option v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Tên dự án</label>
          <input v-model="projForm.title" type="text" class="form-control" placeholder="Ví dụ: Hệ thống AI Chatbot" required />
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Mô tả dự án</label>
          <textarea v-model="projForm.description" class="form-control" rows="4" placeholder="Nhập mô tả ngắn về dự án..." required></textarea>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="form-group">
            <label class="form-label">Thời gian bắt đầu</label>
            <input v-model="projForm.startDate" type="text" class="form-control" placeholder="Ví dụ: 01/2021" />
          </div>
          <div class="form-group">
            <label class="form-label">Thời gian kết thúc</label>
            <input v-model="projForm.endDate" type="text" class="form-control" placeholder="Ví dụ: 12/2021 hoặc Hiện tại" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="form-group">
            <label class="form-label">Team size</label>
            <input v-model="projForm.teamSize" type="text" class="form-control" placeholder="Ví dụ: 5 members" />
          </div>
          <div class="form-group">
            <label class="form-label">Vai trò / Trách nhiệm</label>
            <input v-model="projForm.role" type="text" class="form-control" placeholder="Ví dụ: Frontend Developer" />
          </div>
        </div>
        
        <div class="form-group mb-5">
          <label class="form-label">Khách hàng / Đối tác</label>
          <input v-model="projForm.client" type="text" class="form-control" placeholder="Ví dụ: Tập đoàn Vingroup, Khách hàng cá nhân,..." />
        </div>
        
        <div class="form-group mb-5">
          <label class="form-label">Chi tiết công việc / Đóng góp</label>
          <textarea v-model="projForm.workDone" class="form-control" rows="4" placeholder="Liệt kê chi tiết các công việc bạn làm trong dự án (Có thể dùng gạch đầu dòng)..."></textarea>
        </div>
        
        <div class="form-group mb-5">
          <label class="form-label">Công nghệ sử dụng (Cách nhau bằng dấu phẩy)</label>
          <input v-model="projForm.techStackInput" type="text" class="form-control" placeholder="Ví dụ: Vue 3, Node.js, TensorFlow" required />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="form-group">
            <label class="form-label">Demo Link (Nếu có)</label>
            <input v-model="projForm.demoLink" type="url" class="form-control" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">GitHub Link (Nếu có)</label>
            <input v-model="projForm.githubLink" type="url" class="form-control" placeholder="https://github.com/..." />
          </div>
        </div>
        <div class="form-group mb-6">
          <label class="form-label">Ảnh minh họa (Tải lên hoặc nhập URL)</label>
          <div class="flex flex-col sm:flex-row gap-4 mb-3">
            <input type="file" @change="handleFileUpload" accept="image/*" class="form-control flex-1 p-2.5" />
            <input v-model="projForm.imageUrl" type="text" class="form-control flex-[2]" placeholder="Hoặc nhập https://..." />
          </div>
          <div v-if="isUploading" class="text-[13px] text-[color:var(--accent)] mb-3">Đang tải lên...</div>
          
          <div v-if="projForm.imageUrl" class="mt-4 p-3 bg-white/5 border border-[color:var(--border-color)] rounded-[color:var(--radius-sm)]">
            <span class="text-[13px] text-[color:var(--text-secondary)] block mb-2">Xem trước ảnh:</span>
            <img :src="projForm.imageUrl" class="block w-full max-h-[200px] object-contain rounded-md border border-dashed border-[color:var(--border-color)]" />
          </div>
        </div>
        
        <div class="flex gap-4">
          <NuxtLink to="/admin/content?tab=projects" class="btn btn-secondary flex-1 text-center no-underline">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary flex-[2]" :disabled="isSavingProj">
            {{ isSavingProj ? 'Đang xử lý...' : 'Thêm Dự Án' }}
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

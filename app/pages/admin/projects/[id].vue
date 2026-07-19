<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc, collection } from 'firebase/firestore'
import { useFirestore, useFirebaseStorage, useCollection } from 'vuefire'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

useHead({ title: 'Chỉnh Sửa Dự Án' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const storage = useFirebaseStorage()
const router = useRouter()
const route = useRoute()

const companies = useCollection(collection(db, 'companies'))

const projId = route.params.id as string
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

onMounted(async () => {
  try {
    const docRef = doc(db, 'projects', projId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      projForm.value = {
        companyId: data.companyId || '',
        title: data.title || '',
        description: data.description || '',
        techStackInput: data.techStack ? data.techStack.join(', ') : '',
        demoLink: data.demoLink || '',
        githubLink: data.githubLink || '',
        imageUrl: data.imageUrl || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        teamSize: data.teamSize || '',
        role: data.role || '',
        workDone: data.workDone || '',
        client: data.client || ''
      }
    } else {
      showToast('Không tìm thấy dự án!')
      setTimeout(() => {
        router.push('/admin/content?tab=projects')
      }, 1500)
    }
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi tải dữ liệu: ${error.message || error}`)
  }
})

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

    await updateDoc(doc(db, 'projects', projId), dataToSave)
    showToast('Cập nhật dự án thành công!')
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
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Chỉnh Sửa Dự Án</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Cập nhật thông tin dự án của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Dự án', to: '/admin/content?tab=projects' }, { name: 'Chỉnh sửa' }]" style="margin-bottom: 24px;" />

    <div style="padding-bottom: 40px;">
    <!-- Form Container -->
    <div class="glass-card" style="padding: 32px;">
      <form @submit.prevent="saveProject">
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Công ty / Tổ chức</label>
          <select v-model="projForm.companyId" class="form-control" style="padding: 12px; background: rgba(0,0,0,0.2); color: white; border: 1px solid rgba(255,255,255,0.1);">
            <option value="">-- Thuộc dự án cá nhân (Không thuộc công ty) --</option>
            <option v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Tên dự án</label>
          <input v-model="projForm.title" type="text" class="form-control" placeholder="Ví dụ: Hệ thống AI Chatbot" required />
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Mô tả dự án</label>
          <textarea v-model="projForm.description" class="form-control" rows="4" placeholder="Nhập mô tả ngắn về dự án..." required></textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label">Thời gian bắt đầu</label>
            <input v-model="projForm.startDate" type="text" class="form-control" placeholder="Ví dụ: 01/2021" />
          </div>
          <div class="form-group">
            <label class="form-label">Thời gian kết thúc</label>
            <input v-model="projForm.endDate" type="text" class="form-control" placeholder="Ví dụ: 12/2021 hoặc Hiện tại" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label">Team size</label>
            <input v-model="projForm.teamSize" type="text" class="form-control" placeholder="Ví dụ: 5 members" />
          </div>
          <div class="form-group">
            <label class="form-label">Vai trò / Trách nhiệm</label>
            <input v-model="projForm.role" type="text" class="form-control" placeholder="Ví dụ: Frontend Developer" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Khách hàng / Đối tác</label>
          <input v-model="projForm.client" type="text" class="form-control" placeholder="Ví dụ: Tập đoàn Vingroup, Khách hàng cá nhân,..." />
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Chi tiết công việc / Đóng góp</label>
          <textarea v-model="projForm.workDone" class="form-control" rows="4" placeholder="Liệt kê chi tiết các công việc bạn làm trong dự án (Có thể dùng gạch đầu dòng)..."></textarea>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label">Công nghệ sử dụng (Cách nhau bằng dấu phẩy)</label>
          <input v-model="projForm.techStackInput" type="text" class="form-control" placeholder="Ví dụ: Vue 3, Node.js, TensorFlow" required />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label">Demo Link (Nếu có)</label>
            <input v-model="projForm.demoLink" type="url" class="form-control" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">GitHub Link (Nếu có)</label>
            <input v-model="projForm.githubLink" type="url" class="form-control" placeholder="https://github.com/..." />
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Ảnh minh họa (Tải lên hoặc nhập URL)</label>
          <div style="display: flex; gap: 16px; margin-bottom: 12px;">
            <input type="file" @change="handleFileUpload" accept="image/*" class="form-control" style="flex: 1; padding: 10px;" />
            <input v-model="projForm.imageUrl" type="text" class="form-control" placeholder="Hoặc nhập https://..." style="flex: 2;" />
          </div>
          <div v-if="isUploading" style="font-size: 13px; color: var(--accent); margin-bottom: 12px;">Đang tải lên...</div>

          <div v-if="projForm.imageUrl" style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
            <span style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 8px;">Xem trước ảnh:</span>
            <img :src="projForm.imageUrl" style="display: block; width: 100%; max-height: 200px; object-fit: contain; border-radius: 6px; border: 1px dashed var(--border-color);" />
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSavingProj">
          {{ isSavingProj ? 'Đang xử lý...' : 'Lưu Thay Đổi' }}
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

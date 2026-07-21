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
  startDate: '', // legacy
  endDate: '', // legacy
  startMonth: 1,
  startYear: new Date().getFullYear(),
  endMonth: 1,
  endYear: new Date().getFullYear(),
  isCurrent: false,
  teamSize: '',
  role: '',
  workDone: '',
  client: '',
  order: 0,
  imageScale: 1,
  imageX: 0,
  imageY: 0,
  imageBg: '',
  imageFit: 'cover'
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

    const sMonth = projForm.value.startMonth.toString().padStart(2, '0')
    const computedStartDate = `${projForm.value.startYear}-${sMonth}`
    
    let computedEndDate = 'Present'
    if (!projForm.value.isCurrent) {
      const eMonth = projForm.value.endMonth.toString().padStart(2, '0')
      computedEndDate = `${projForm.value.endYear}-${eMonth}`
    }

    const dataToSave = {
      companyId: projForm.value.companyId,
      title: projForm.value.title,
      description: projForm.value.description,
      techStack,
      demoLink: projForm.value.demoLink,
      githubLink: projForm.value.githubLink,
      imageUrl: projForm.value.imageUrl,
      startDate: computedStartDate,
      endDate: computedEndDate,
      startMonth: projForm.value.startMonth,
      startYear: projForm.value.startYear,
      endMonth: projForm.value.isCurrent ? null : projForm.value.endMonth,
      endYear: projForm.value.isCurrent ? null : projForm.value.endYear,
      isCurrent: projForm.value.isCurrent,
      teamSize: projForm.value.teamSize,
      role: projForm.value.role,
      workDone: projForm.value.workDone,
      client: projForm.value.client,
      order: projForm.value.order,
      imageScale: projForm.value.imageScale,
      imageX: projForm.value.imageX,
      imageY: projForm.value.imageY,
      imageBg: projForm.value.imageBg,
      imageFit: projForm.value.imageFit
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
            <option class="text-black" value="">-- Thuộc dự án cá nhân (Không thuộc công ty) --</option>
            <option class="text-black" v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Tên dự án</label>
          <input v-model="projForm.title" type="text" class="form-control" placeholder="Ví dụ: Hệ thống AI Chatbot" required />
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Thứ tự hiển thị (Order)</label>
          <input v-model.number="projForm.order" type="number" class="form-control" placeholder="Số lớn hơn sẽ hiển thị trước (hoặc tuỳ sắp xếp)" />
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Mô tả dự án</label>
          <RichTextEditor v-model="projForm.description" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
          <!-- Start Date -->
          <div class="form-group">
            <label class="form-label">Thời gian bắt đầu</label>
            <div class="flex gap-3">
              <select v-model="projForm.startMonth" class="form-control flex-1 p-3 bg-black/20 text-white border border-white/10" required>
                <option class="text-black" v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
              <input v-model.number="projForm.startYear" type="number" class="form-control flex-1" placeholder="Năm (VD: 2021)" required />
            </div>
          </div>
          
          <!-- End Date -->
          <div class="form-group">
            <div class="flex justify-between items-center mb-2">
              <label class="form-label mb-0">Thời gian kết thúc</label>
              <label class="flex items-center gap-2 cursor-pointer text-[13px] text-gray-300">
                <input v-model="projForm.isCurrent" type="checkbox" class="rounded border-gray-600 bg-black/20 text-[color:var(--cv-primary)]" />
                Đến nay (Present)
              </label>
            </div>
            <div class="flex gap-3" :class="{ 'opacity-50 pointer-events-none': projForm.isCurrent }">
              <select v-model="projForm.endMonth" class="form-control flex-1 p-3 bg-black/20 text-white border border-white/10" :required="!projForm.isCurrent">
                <option class="text-black" v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
              <input v-model.number="projForm.endYear" type="number" class="form-control flex-1" placeholder="Năm (VD: 2024)" :required="!projForm.isCurrent" />
            </div>
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
          <RichTextEditor v-model="projForm.workDone" />
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
            <div class="overflow-hidden bg-white/5 border border-[color:var(--border-color)] mb-4" :style="{ backgroundColor: projForm.imageBg || '' }">
              <img :src="projForm.imageUrl" 
                   class="block w-full h-[160px] sm:h-[192px]" 
                   :class="projForm.imageFit === 'contain' ? 'object-contain' : 'object-cover'"
                   :style="{ transform: `scale(${projForm.imageScale}) translate(${projForm.imageX}px, ${projForm.imageY}px)` }" />
            </div>
            
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div class="form-group">
                <label class="form-label text-[12px]">Kích thước (Scale) - Mặc định: 1</label>
                <input v-model.number="projForm.imageScale" type="number" step="0.1" class="form-control p-2 text-[14px]" />
              </div>
              <div class="form-group">
                <label class="form-label text-[12px]">Kiểu hiển thị</label>
                <select v-model="projForm.imageFit" class="form-control p-2 text-[14px] bg-black/20 text-white">
                  <option class="text-black" value="cover">Lấp đầy (Cover)</option>
                  <option class="text-black" value="contain">Vừa vặn (Contain)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label text-[12px]">Dịch ngang (X) px</label>
                <input v-model.number="projForm.imageX" type="number" step="5" class="form-control p-2 text-[14px]" />
              </div>
              <div class="form-group">
                <label class="form-label text-[12px]">Dịch dọc (Y) px</label>
                <input v-model.number="projForm.imageY" type="number" step="5" class="form-control p-2 text-[14px]" />
              </div>
              <div class="form-group col-span-2">
                <label class="form-label text-[12px]">Màu nền (nếu dùng Contain)</label>
                <input v-model="projForm.imageBg" type="text" class="form-control p-2 text-[14px]" placeholder="VD: #ffffff, transparent, rgba(0,0,0,0.5)" />
              </div>
            </div>
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

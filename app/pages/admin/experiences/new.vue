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
  startDate: '', // legacy
  endDate: '', // legacy
  startMonth: 1,
  startYear: new Date().getFullYear(),
  endMonth: 1,
  endYear: new Date().getFullYear(),
  isCurrent: false,
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
    // Compute legacy dates for backwards compatibility / sorting
    const sMonth = expForm.value.startMonth.toString().padStart(2, '0')
    const computedStartDate = `${expForm.value.startYear}-${sMonth}`
    
    let computedEndDate = 'Present'
    if (!expForm.value.isCurrent) {
      const eMonth = expForm.value.endMonth.toString().padStart(2, '0')
      computedEndDate = `${expForm.value.endYear}-${eMonth}`
    }

    const dataToSave = {
      companyId: expForm.value.companyId,
      role: expForm.value.role,
      startDate: computedStartDate,
      endDate: computedEndDate,
      startMonth: expForm.value.startMonth,
      startYear: expForm.value.startYear,
      endMonth: expForm.value.isCurrent ? null : expForm.value.endMonth,
      endYear: expForm.value.isCurrent ? null : expForm.value.endYear,
      isCurrent: expForm.value.isCurrent,
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
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Thêm Kinh Nghiệm</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Thêm kinh nghiệm làm việc mới vào hồ sơ của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[{ name: 'Kinh nghiệm', to: '/admin/content?tab=experiences' }, { name: 'Thêm mới' }]" class="mb-6" />

    <div class="pb-10">
    <!-- Form Container -->
    <div class="glass-card p-8">
      <form @submit.prevent="saveExperience">
        <div class="form-group mb-5">
          <label class="form-label">Công ty / Tổ chức</label>
          <select v-model="expForm.companyId" class="form-control p-3 bg-black/20 text-white border border-white/10" required>
            <option class="text-black" value="" disabled>-- Chọn công ty --</option>
            <option class="text-black" v-for="comp in companies" :key="comp.id" :value="comp.id">{{ comp.name }}</option>
          </select>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Vị trí đảm nhận</label>
          <input v-model="expForm.role" type="text" class="form-control" placeholder="Ví dụ: Senior Developer" required />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
          <!-- Start Date -->
          <div class="form-group">
            <label class="form-label">Thời gian bắt đầu</label>
            <div class="flex gap-3">
              <select v-model="expForm.startMonth" class="form-control flex-1 p-3 bg-black/20 text-white border border-white/10" required>
                <option class="text-black" v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
              <input v-model.number="expForm.startYear" type="number" class="form-control flex-1" placeholder="Năm (VD: 2020)" required />
            </div>
          </div>
          
          <!-- End Date -->
          <div class="form-group">
            <div class="flex justify-between items-center mb-2">
              <label class="form-label mb-0">Thời gian kết thúc</label>
              <label class="flex items-center gap-2 cursor-pointer text-[13px] text-gray-300">
                <input v-model="expForm.isCurrent" type="checkbox" class="rounded border-gray-600 bg-black/20 text-[color:var(--cv-primary)]" />
                Đến nay (Present)
              </label>
            </div>
            <div class="flex gap-3" :class="{ 'opacity-50 pointer-events-none': expForm.isCurrent }">
              <select v-model="expForm.endMonth" class="form-control flex-1 p-3 bg-black/20 text-white border border-white/10" :required="!expForm.isCurrent">
                <option class="text-black" v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
              <input v-model.number="expForm.endYear" type="number" class="form-control flex-1" placeholder="Năm (VD: 2024)" :required="!expForm.isCurrent" />
            </div>
          </div>
        </div>
        <div class="form-group mb-5">
          <label class="form-label">Thứ tự hiển thị (Tùy chọn)</label>
          <input v-model.number="expForm.order" type="number" class="form-control" />
        </div>

        <div class="form-group mb-6">
          <label class="form-label">Mô tả chi tiết công việc</label>
          <RichTextEditor v-model="expForm.description" />
        </div>
        
        <div class="flex gap-4">
          <NuxtLink to="/admin/content?tab=experiences" class="btn btn-secondary flex-1 text-center no-underline">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary flex-[2]" :disabled="isSavingExp">
            {{ isSavingExp ? 'Đang lưu...' : 'Thêm Kinh Nghiệm' }}
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

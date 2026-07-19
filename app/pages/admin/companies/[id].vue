<script setup lang="ts">
import { ref, watch } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'

useHead({ title: 'Chỉnh Sửa Công Ty' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const db = useFirestore()

const companyId = route.params.id as string
const companyRef = useDocument(doc(db, 'companies', companyId))

const isSaving = ref(false)
const toastMessage = ref('')

const form = ref({
  name: '',
  logoUrl: '',
  logoScale: 1,
  logoX: 0,
  logoY: 0,
  logoBg: '#ffffff'
})

// Populate form when data is loaded
watch(companyRef, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      logoUrl: newVal.logoUrl || '',
      logoScale: newVal.logoScale ?? 1,
      logoX: newVal.logoX ?? 0,
      logoY: newVal.logoY ?? 0,
      logoBg: newVal.logoBg || '#ffffff'
    }
  }
}, { immediate: true })

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const saveCompany = async () => {
  isSaving.value = true
  try {
    const dataToSave = {
      name: form.value.name,
      logoUrl: form.value.logoUrl,
      logoScale: form.value.logoScale,
      logoX: form.value.logoX,
      logoY: form.value.logoY,
      logoBg: form.value.logoBg
    }
    await updateDoc(doc(db, 'companies', companyId), dataToSave)
    showToast('Cập nhật công ty thành công!')
    setTimeout(() => {
      router.push('/admin/content?tab=companies')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi cập nhật: ${error.message || error}`)
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div>
        <h1 class="text-[28px] font-bold">Sửa Công Ty</h1>
        <p class="text-[color:var(--text-secondary)] mt-1">Chỉnh sửa thông tin công ty</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[
      { name: 'Công ty', to: '/admin/content?tab=companies' },
      { name: 'Chỉnh sửa' }
    ]" class="mb-6" />

    <div v-if="!companyRef" class="p-10 text-center text-[color:var(--text-muted)]">
      Đang tải dữ liệu...
    </div>

    <div v-else class="glass-card p-8">
      <form @submit.prevent="saveCompany">
        
        <div class="form-group mb-6">
          <label class="form-label">Tên công ty <span class="text-[color:var(--primary)]">*</span></label>
          <input v-model="form.name" type="text" class="form-control" required placeholder="VD: Google, Microsoft..." />
        </div>

        <h4 class="mt-8 mb-4 text-[color:var(--accent)] border-b border-white/10 pb-2 font-semibold">Logo & Hiển thị</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
          <!-- Controls -->
          <div>
            <div class="form-group">
              <label class="form-label">Đường dẫn URL Logo</label>
              <input v-model="form.logoUrl" type="text" class="form-control" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label class="form-label">Màu nền Logo (Hex)</label>
              <div class="flex gap-3">
                <input v-model="form.logoBg" type="color" class="w-10 h-10 p-0 border border-[color:var(--border-color)] rounded bg-transparent cursor-pointer" />
                <input v-model="form.logoBg" type="text" class="form-control" placeholder="#ffffff" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Kích thước (Scale: {{ form.logoScale }})</label>
              <input v-model.number="form.logoScale" type="range" min="0.1" max="3" step="0.1" class="w-full accent-[color:var(--accent)]" />
            </div>

            <div class="form-group">
              <label class="form-label">Vị trí X ({{ form.logoX }}px)</label>
              <input v-model.number="form.logoX" type="range" min="-100" max="100" step="1" class="w-full accent-[color:var(--accent)]" />
            </div>

            <div class="form-group">
              <label class="form-label">Vị trí Y ({{ form.logoY }}px)</label>
              <input v-model.number="form.logoY" type="range" min="-100" max="100" step="1" class="w-full accent-[color:var(--accent)]" />
            </div>
          </div>

          <!-- Preview -->
          <div>
            <label class="form-label">Xem trước (Preview)</label>
            <div class="w-full max-w-[300px] mx-auto aspect-square border border-dashed border-[color:var(--border-color)] rounded-xl flex items-center justify-center bg-black/20">
              <div :style="{ backgroundColor: form.logoBg || '#ffffff' }" class="w-[100px] h-[100px] rounded-2xl flex items-center justify-center p-2 shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
                <img v-if="form.logoUrl" :src="form.logoUrl" :style="{ transform: `scale(${form.logoScale}) translate(${form.logoX}px, ${form.logoY}px)` }" class="max-w-full max-h-full object-contain" />
                <span v-else class="text-slate-800 font-extrabold text-3xl">{{ form.name.charAt(0) || '?' }}</span>
              </div>
            </div>
            <p class="text-xs text-[color:var(--text-muted)] mt-3 text-center">
              Di chuyển các thanh trượt bên trái để căn chỉnh logo vừa vặn trong khung hiển thị (kích thước chuẩn 100x100px).
            </p>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <NuxtLink to="/admin/content?tab=companies" class="btn btn-secondary flex-1 text-center no-underline">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary flex-[2]" :disabled="isSaving">
            {{ isSaving ? 'Đang cập nhật...' : 'Cập nhật Công ty' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>

  </div>
</template>

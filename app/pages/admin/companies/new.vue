<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({ title: 'Thêm Công Ty' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const router = useRouter()

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
    await addDoc(collection(db, 'companies'), dataToSave)
    showToast('Thêm công ty thành công!')
    setTimeout(() => {
      router.push('/admin/content?tab=companies')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    showToast(`Lỗi khi lưu: ${error.message || error}`)
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="admin-header" style="margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px;">Thêm Công Ty</h1>
        <p style="color: var(--text-secondary); margin-top: 4px;">Thêm công ty mới vào hồ sơ của bạn</p>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <Breadcrumbs :items="[
      { name: 'Công ty', to: '/admin/content?tab=companies' },
      { name: 'Thêm mới' }
    ]" />

    <div class="glass-card" style="padding: 32px;">
      <form @submit.prevent="saveCompany">
        
        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Tên công ty <span style="color: var(--primary);">*</span></label>
          <input v-model="form.name" type="text" class="form-control" required placeholder="VD: Google, Microsoft..." />
        </div>

        <h4 style="margin-top: 32px; margin-bottom: 16px; color: var(--accent); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Logo & Hiển thị</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; align-items: start;">
          <!-- Controls -->
          <div>
            <div class="form-group">
              <label class="form-label">Đường dẫn URL Logo</label>
              <input v-model="form.logoUrl" type="text" class="form-control" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label class="form-label">Màu nền Logo (Hex)</label>
              <div style="display: flex; gap: 12px;">
                <input v-model="form.logoBg" type="color" style="width: 40px; height: 40px; padding: 0; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; cursor: pointer;" />
                <input v-model="form.logoBg" type="text" class="form-control" placeholder="#ffffff" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Kích thước (Scale: {{ form.logoScale }})</label>
              <input v-model.number="form.logoScale" type="range" min="0.1" max="3" step="0.1" style="width: 100%; accent-color: var(--accent);" />
            </div>

            <div class="form-group">
              <label class="form-label">Vị trí X ({{ form.logoX }}px)</label>
              <input v-model.number="form.logoX" type="range" min="-100" max="100" step="1" style="width: 100%; accent-color: var(--accent);" />
            </div>

            <div class="form-group">
              <label class="form-label">Vị trí Y ({{ form.logoY }}px)</label>
              <input v-model.number="form.logoY" type="range" min="-100" max="100" step="1" style="width: 100%; accent-color: var(--accent);" />
            </div>
          </div>

          <!-- Preview -->
          <div>
            <label class="form-label">Xem trước (Preview)</label>
            <div style="width: 100%; max-width: 300px; margin: 0 auto; aspect-ratio: 1; border: 1px dashed var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2);">
              <div :style="{ backgroundColor: form.logoBg || '#ffffff' }" style="width: 100px; height: 100px; border-radius: 16px; display: flex; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <img v-if="form.logoUrl" :src="form.logoUrl" :style="{ transform: `scale(${form.logoScale}) translate(${form.logoX}px, ${form.logoY}px)` }" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                <span v-else style="color: #1e293b; font-weight: 800; font-size: 32px;">{{ form.name.charAt(0) || '?' }}</span>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 12px; text-align: center;">
              Di chuyển các thanh trượt bên trái để căn chỉnh logo vừa vặn trong khung hiển thị (kích thước chuẩn 100x100px).
            </p>
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-top: 32px;">
          <NuxtLink to="/admin/content?tab=companies" class="btn btn-secondary" style="flex: 1; text-align: center; text-decoration: none;">
            Hủy
          </NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="isSaving" style="flex: 2;">
            {{ isSaving ? 'Đang lưu...' : 'Lưu Công ty' }}
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

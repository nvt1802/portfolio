<script setup lang="ts">
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({ title: 'Chỉnh sửa Danh mục Kỹ năng' })

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const db = useFirestore()
const route = useRoute()
const router = useRouter()

const isSubmitting = ref(false)
const isLoading = ref(true)
const toastMessage = ref('')

const form = ref({
  name: '',
  order: 1
})

const categoryId = computed(() => route.params.id as string)

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

onMounted(async () => {
  if (!import.meta.client || !db) return
  
  try {
    const docRef = doc(db, 'skill_categories', categoryId.value)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      form.value = {
        name: data.name || '',
        order: data.order || 1
      }
    } else {
      showToast('Không tìm thấy danh mục!')
      setTimeout(() => router.push('/admin/content?tab=skill_categories'), 1500)
    }
  } catch (error: any) {
    console.error(error)
    showToast(`Có lỗi khi tải dữ liệu: ${error.message || error}`)
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.name) {
    showToast('Vui lòng nhập tên danh mục!')
    return
  }
  
  isSubmitting.value = true
  try {
    const docRef = doc(db, 'skill_categories', categoryId.value)
    const dataToSave = {
      name: form.value.name,
      order: form.value.order,
      updatedAt: Date.now()
    }
    
    await updateDoc(docRef, dataToSave)
    router.push('/admin/content?tab=skill_categories')
  } catch (error: any) {
    console.error(error)
    showToast(`Có lỗi xảy ra: ${error.message || error}`)
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/content?tab=skill_categories" class="text-[color:var(--text-secondary)] hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </NuxtLink>
      <h2 class="text-[24px] font-bold m-0">Chỉnh sửa Danh mục Kỹ năng</h2>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in font-medium">
      {{ toastMessage }}
    </div>

    <div v-if="isLoading" class="glass-card p-10 flex justify-center items-center">
      <div class="w-8 h-8 border-4 border-[color:var(--cv-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="glass-card p-6 md:p-8 max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Tên danh mục -->
        <div class="form-group mb-5">
          <label class="form-label">Tên danh mục <span class="text-red-500">*</span></label>
          <input 
            v-model="form.name" 
            type="text" 
            class="form-control" 
            placeholder="VD: Core Technologies" 
            required 
          />
        </div>

        <!-- Thứ tự -->
        <div class="form-group mb-5">
          <label class="form-label">Thứ tự hiển thị</label>
          <input 
            v-model.number="form.order" 
            type="number" 
            class="form-control" 
            min="1"
          />
          <p class="text-[12px] text-[color:var(--text-secondary)] mt-1">Số nhỏ sẽ hiển thị trước (trên cùng).</p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center gap-4 pt-4 border-t border-white/10 mt-8">
          <button type="submit" class="btn btn-primary min-w-[120px]" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang lưu...' : 'Lưu Danh mục' }}
          </button>
          <NuxtLink to="/admin/content?tab=skill_categories" class="btn bg-black/30 border border-white/10 hover:bg-white/10 no-underline">
            Hủy
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

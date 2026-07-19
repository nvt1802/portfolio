<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'

const auth = useFirebaseAuth()
const router = useRouter()
const route = useRoute()

const handleLogout = async () => {
  if (auth) {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[color:var(--bg-dark)] text-[color:var(--text-primary)]">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-[color:var(--bg-dark-soft)] border-r border-white/10 py-[30px] px-[20px] flex flex-col h-screen overflow-y-auto shrink-0">
      <div class="font-display text-[20px] font-extrabold mb-[40px] text-[color:var(--text-primary)]">PORTFOLIO ADMIN</div>
      <ul class="list-none flex flex-col gap-2 flex-grow">
        <li class="group">
          <NuxtLink to="/admin" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[color:var(--text-secondary)] bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:text-[color:var(--text-primary)] hover:bg-white/5 border-l-[3px] border-transparent" active-class="!bg-[color:var(--primary-glow)] !text-[#c084fc] !border-[color:var(--primary)]" :class="{ '!bg-[color:var(--primary-glow)] !text-[#c084fc] !border-[color:var(--primary)]': route.path === '/admin' }">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
            </svg>
            Dashboard
          </NuxtLink>
        </li>
        <li class="group">
          <NuxtLink to="/admin/content" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[color:var(--text-secondary)] bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:text-[color:var(--text-primary)] hover:bg-white/5 border-l-[3px] border-transparent" :class="{ '!bg-[color:var(--primary-glow)] !text-[#c084fc] !border-[color:var(--primary)]': route.path.startsWith('/admin/content') }">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
            Quản lý Dữ liệu
          </NuxtLink>
        </li>
        <li class="group">
          <NuxtLink to="/admin/cv-builder" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[color:var(--text-secondary)] bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:text-[color:var(--text-primary)] hover:bg-white/5 border-l-[3px] border-transparent" active-class="!bg-[color:var(--primary-glow)] !text-[#c084fc] !border-[color:var(--primary)]">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Tạo CV
          </NuxtLink>
        </li>
        <li class="group">
          <NuxtLink to="/admin/homepage" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[color:var(--text-secondary)] bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:text-[color:var(--text-primary)] hover:bg-white/5 border-l-[3px] border-transparent" active-class="!bg-[color:var(--primary-glow)] !text-[#c084fc] !border-[color:var(--primary)]">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Cấu hình Trang chủ
          </NuxtLink>
        </li>
        <li class="group">
          <NuxtLink to="/" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[color:var(--text-secondary)] bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:text-[color:var(--text-primary)] hover:bg-white/5 border-l-[3px] border-transparent">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Xem Portfolio
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-auto group">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 bg-transparent font-sans text-[15px] font-medium text-left cursor-pointer transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400 border-l-[3px] border-transparent">
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-grow p-[40px] bg-[color:var(--bg-dark)] h-screen overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

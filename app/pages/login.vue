<script setup lang="ts">
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'

useHead({ title: 'Login' })

const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

// Redirect if already logged in
watch(user, (newUser) => {
  if (newUser) {
    router.push('/admin')
  }
}, { immediate: true })

const handleLogin = async () => {
  if (!auth) return
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/admin')
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.code === 'auth/invalid-credential') {
      errorMessage.value = 'Incorrect email or password.'
    } else if (error.code === 'auth/missing-password') {
      errorMessage.value = 'Please enter your password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Invalid email.'
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = async () => {
  if (!auth) return
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/admin')
  } catch (error: any) {
    console.error('Google Login error:', error)
    errorMessage.value = 'Google login failed.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <!-- Glow Backdrop Effects -->
    <div class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[color:var(--primary)] opacity-[0.15] blur-[100px] animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[color:var(--accent)] opacity-[0.1] blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
    </div>
    
    <div class="w-full max-w-[440px]">
      <div class="glass-card p-10 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
        <h2 class="text-[26px] font-extrabold mb-2 gradient-text">PORTFOLIO ADMIN</h2>
        <p class="text-[color:var(--text-secondary)] text-[14px] mb-8">Login to manage your content</p>
        
        <form @submit.prevent="handleLogin" class="text-left">
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-[14px] mb-5 text-left">
            {{ errorMessage }}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input 
              v-model="email" 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="admin@example.com" 
              required
              :disabled="isSubmitting"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input 
              v-model="password" 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="••••••••" 
              required
              :disabled="isSubmitting"
            />
          </div>
          
          <button type="submit" class="btn btn-primary w-full mt-2" :disabled="isSubmitting">
            <span v-if="isSubmitting">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
        
        <div class="flex items-center text-center text-[color:var(--text-muted)] text-[13px] my-6 before:content-[''] before:flex-1 before:border-b before:border-[color:var(--border-color)] before:mr-2 after:content-[''] after:flex-1 after:border-b after:border-[color:var(--border-color)] after:ml-2">Or</div>
        
        <button @click="handleGoogleLogin" class="btn btn-secondary w-full flex items-center justify-center gap-3" :disabled="isSubmitting">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  </div>
</template>

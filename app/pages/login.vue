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
  <div class="login-wrapper">
    <!-- Glow Backdrop Effects -->
    <div class="glow-backdrop">
      <div class="glow-orb-1"></div>
      <div class="glow-orb-2"></div>
    </div>
    
    <div class="login-container">
      <div class="glass-card login-card">
        <h2 class="login-title gradient-text">PORTFOLIO ADMIN</h2>
        <p class="login-subtitle">Login to manage your content</p>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="errorMessage" class="error-banner">
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
          
          <button type="submit" class="btn btn-primary login-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
        
        <div class="divider">Or</div>
        
        <button @click="handleGoogleLogin" class="btn btn-secondary google-btn" :disabled="isSubmitting">
          <svg style="width:18px;height:18px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7);
}

.login-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 8px;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 32px;
}

.login-form {
  text-align: left;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  margin-bottom: 20px;
  text-align: left;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider:not(:empty)::before {
  margin-right: .5em;
}

.divider:not(:empty)::after {
  margin-left: .5em;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
</style>

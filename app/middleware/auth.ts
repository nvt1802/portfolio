export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser()
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return navigateTo('/login')
  }
})

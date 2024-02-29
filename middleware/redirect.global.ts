export default defineNuxtRouteMiddleware((to, from) => {
  const { isMobile, firstRedirect } = useStore()
  const d = from.query.d
  if (d) {
    isMobile.value = d === 'true'
  }

  to.query = {}
  navigateTo(to)
})

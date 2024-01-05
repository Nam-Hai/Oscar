export default defineNuxtRouteMiddleware((to, from) => {
  const { isMobile, firstRedirect } = useStore()
  const d = from.query.d
  if (d) {
    isMobile.value = d === 'true'
  }

  if (!firstRedirect.value) {
    firstRedirect.value = true
    // return navigateTo('/')
  }

  // history.pushState(isMobile, '', '')
  // navigateTo({ path: to.path, query: {} })
  to.query = {}
  navigateTo(to)
})

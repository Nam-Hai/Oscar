export default defineNuxtRouteMiddleware((to, from) => {
  // const allowedRoutes = ['/']
  // if (!allowedRoutes.includes(to.path)) {
  const { isMobile, firstRedirect } = useStore()
  if (!firstRedirect.value) {
    firstRedirect.value = true
    // return navigateTo('/')
  }
  // }

  const d = from.query.d
  if (!d) return
  isMobile.value = d == 'true'
  console.log('middle', d);
  // history.pushState(isMobile, '', '')
  // navigateTo({ path: to.path, query: {} })
  to.query = {}
  navigateTo(to)
})
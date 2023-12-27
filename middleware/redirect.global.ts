export default defineNuxtRouteMiddleware((to, from) => {
  const { isMobile, firstRedirect } = useStore()
  if (!firstRedirect.value) {
    firstRedirect.value = true
    // return navigateTo('/')
  }

  const d = from.query.d
  if (d) {
    isMobile.value = d == 'true'
    console.log('middle', d);
  }


  // history.pushState(isMobile, '', '')
  // navigateTo({ path: to.path, query: {} })
  to.query = {}
  return navigateTo(to)
})
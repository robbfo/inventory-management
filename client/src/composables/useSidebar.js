import { ref, watch } from 'vue'

const STORAGE_KEY = 'sidebar-collapsed'
const isCollapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')

watch(isCollapsed, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val))
})

export function useSidebar() {
  const toggle = () => { isCollapsed.value = !isCollapsed.value }
  const expand = () => { isCollapsed.value = false }
  return { isCollapsed, toggle, expand }
}

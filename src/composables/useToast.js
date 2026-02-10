import { ref, computed } from 'vue'

const toasts = ref([])
let nextId = 0
// Map to track timeoutId for each toast to enable proper cleanup
const timeoutMap = new Map()
// Maximum number of toasts to display at once
const MAX_TOASTS = 5

export function useToast() {
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = nextId++
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    }
    
    // Remove oldest toast if limit reached to prevent accumulation
    if (toasts.value.length >= MAX_TOASTS) {
      const oldestToast = toasts.value[0]
      removeToast(oldestToast.id)
    }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(id)
      }, duration)
      // Store timeout ID for cleanup
      timeoutMap.set(id, timeoutId)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    // Clear timeout if it exists to prevent orphaned timers
    if (timeoutMap.has(id)) {
      clearTimeout(timeoutMap.get(id))
      timeoutMap.delete(id)
    }
    
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  // Cleanup function to clear all timeouts on app unmount
  const cleanup = () => {
    timeoutMap.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    timeoutMap.clear()
    toasts.value = []
  }
  
  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)
  
  return {
    toasts: computed(() => toasts.value),
    addToast,
    removeToast,
    cleanup,
    success,
    error,
    warning,
    info
  }
}

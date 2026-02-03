<template>
  <button 
    @click="handleClick" 
    aria-label="Shopping cart"
    class="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700 hover:text-blue-600"
  >
    <div class="relative">
      <svg
        class="w-6 h-6 sm:w-7 sm:h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span 
        v-if="itemCount > 0" 
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-tight animate-bounce"
      >
        {{ itemCount > 99 ? '99+' : itemCount }}
      </span>
    </div>
    <span class="hidden sm:block text-sm font-medium">Cart</span>
  </button>
</template>

<script setup>
import { useCart } from '../composables/useCart'
import { useRouter } from 'vue-router'

const props = defineProps({
  mode: {
    type: String,
    default: 'toggle', // 'toggle' or 'navigate'
    validator: (value) => ['toggle', 'navigate'].includes(value)
  }
})

const router = useRouter()
const { itemCount, toggleCart } = useCart()

const handleClick = () => {
  if (props.mode === 'navigate') {
    router.push('/cart')
  } else {
    toggleCart()
  }
}
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

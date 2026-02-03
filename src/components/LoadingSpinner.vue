<template>
  <div class="loading-container" :class="sizeClass">
    <div class="spinner" :class="colorClass"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary', // 'primary', 'white'
    validator: (value) => ['primary', 'white'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'size-small',
    medium: 'size-medium',
    large: 'size-large'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'spinner-primary',
    white: 'spinner-white'
  }
  return colors[props.color]
})
</script>

<style scoped>
.loading-container {
  @apply flex flex-col items-center justify-center gap-3;
}

.spinner {
  @apply rounded-full animate-spin;
  border-style: solid;
  border-color: transparent;
}

.spinner-primary {
  @apply border-primary-600;
  border-top-color: transparent;
  border-right-color: transparent;
}

.spinner-white {
  @apply border-white;
  border-top-color: transparent;
  border-right-color: transparent;
}

.size-small .spinner {
  @apply w-5 h-5;
  border-width: 2px;
}

.size-medium .spinner {
  @apply w-10 h-10;
  border-width: 3px;
}

.size-large .spinner {
  @apply w-16 h-16;
  border-width: 4px;
}

.loading-message {
  @apply text-sm text-gray-600 m-0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

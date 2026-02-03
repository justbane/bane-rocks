<template>
  <div class="empty-state">
    <div class="empty-icon">
      <slot name="icon">
        {{ icon }}
      </slot>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '🔍'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.empty-state {
  @apply text-center py-16 px-8;
}

.empty-icon {
  @apply text-6xl mb-4 opacity-60;
}

.empty-title {
  @apply text-2xl font-semibold text-gray-900 mb-2 m-0;
}

.empty-message {
  @apply text-base text-gray-600 mb-6 m-0 max-w-md mx-auto;
}

.empty-action {
  @apply mt-6;
}

@media (max-width: 640px) {
  .empty-state {
    @apply py-12 px-4;
  }
  
  .empty-icon {
    @apply text-5xl;
  }
  
  .empty-title {
    @apply text-xl;
  }
  
  .empty-message {
    @apply text-sm;
  }
}
</style>

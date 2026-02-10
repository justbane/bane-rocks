<template>
  <div class="w-full">
    <ais-search-box placeholder="Search products...">
      <template v-slot="{ currentRefinement, refine }">
        <div class="relative">
          <input
            :value="currentRefinement"
            @input="handleSearchInput($event, refine)"
            type="search"
            placeholder="Search products..."
            class="w-full px-4 py-3 sm:py-4 pr-12 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </template>
    </ais-search-box>
    <ais-stats>
      <template v-slot="{ nbHits, processingTimeMS, query }">
        <div v-if="query" class="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span class="font-medium text-gray-900">{{ nbHits.toLocaleString() }} results</span>
          <span class="text-gray-400">in {{ processingTimeMS }}ms</span>
        </div>
      </template>
    </ais-stats>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { AisSearchBox, AisStats } from 'vue-instantsearch/vue3/es'

// Debounce timeout for search input (300ms delay for mobile optimization)
const DEBOUNCE_DELAY = 300
const searchTimeout = ref(null)

// Debounced search handler to reduce API request frequency
const handleSearchInput = (event, refine) => {
  const value = event.target.value
  
  // Clear existing timeout to prevent queued requests
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set new timeout to delay the API call
  searchTimeout.value = setTimeout(() => {
    refine(value)
  }, DEBOUNCE_DELAY)
}

// Cleanup timeout on component unmount to prevent memory leaks
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

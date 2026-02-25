<template>
  <div class="w-full" ref="searchBarRef">
    <ais-autocomplete>
      <template v-slot="{ refine, currentRefinement, indices }">
        <div class="relative">
          <input
            :value="currentRefinement"
            @input="handleSearchInput($event, refine)"
            @focus="showDropdown = true"
            @keydown.escape="showDropdown = false"
            type="search"
            placeholder="Search products..."
            class="w-full px-2 py-2 sm:py-2 pr-12 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Autocomplete dropdown -->
          <div
            v-if="showDropdown && currentRefinement && getMainIndexHits(indices).length > 0"
            class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <ul class="py-2">
              <li
                v-for="hit in getMainIndexHits(indices)"
                :key="hit.objectID"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                @click="handleHitClick(hit, indices)"
              >
                <div class="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100">
                  <img
                    v-if="hit.image"
                    :src="hit.image"
                    :alt="hit.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                </div>
                <div class="flex-1 min-w-0">
                  <ais-highlight
                    v-if="hit._highlightResult?.name"
                    attribute="name"
                    :hit="hit"
                    :highlighted-tag-name="'strong'"
                  />
                  <span v-else class="font-medium text-gray-900">{{ hit.name }}</span>
                  <p v-if="hit.brand" class="text-xs text-gray-500 mt-0.5 m-0">{{ hit.brand }}</p>
                </div>
                <div class="flex-shrink-0 font-semibold text-gray-900">${{ hit.price?.toFixed(2) ?? '0.00' }}</div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </ais-autocomplete>
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
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AisAutocomplete, AisStats, AisHighlight } from 'vue-instantsearch/vue3/es'

// Debounce timeout for search input (300ms delay for mobile optimization)
const DEBOUNCE_DELAY = 300
const searchTimeout = ref(null)
const searchBarRef = ref(null)
const showDropdown = ref(true)

const router = useRouter()

// Get hits from the main (first) index, limited to 6 for dropdown
const getMainIndexHits = (indices) => {
  if (!indices?.length) return []
  return (indices[0]?.hits ?? []).slice(0, 6)
}

// Debounced search handler to reduce API request frequency
const handleSearchInput = (event, refine) => {
  const value = event.target.value
  showDropdown.value = true

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    refine(value)
  }, DEBOUNCE_DELAY)
}

// Navigate to product on hit click and close dropdown
const handleHitClick = (hit, indices) => {
  const index = indices[0]
  if (index?.sendEvent) {
    index.sendEvent('click', hit, 'Product Clicked')
  }
  showDropdown.value = false
  router.push({
    path: `/product/${hit.objectID}`,
    query: hit.__queryID ? { queryID: hit.__queryID } : {}
  })
}

// Click-outside to close dropdown
const handleClickOutside = (event) => {
  if (searchBarRef.value && !searchBarRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

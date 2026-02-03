<template>
  <div class="w-full">
    <!-- Sort Options -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 m-0">Products</h2>
      <ais-sort-by
        :items="[
          { value: indexName, label: 'Relevance' },
          { value: `${indexName}_price_asc`, label: 'Price: Low to High' },
          { value: `${indexName}_price_desc`, label: 'Price: High to Low' },
          { value: `${indexName}_rating_desc`, label: 'Highest Rated' },
        ]"
        class="w-full sm:w-auto"
      >
        <template v-slot="{ items, currentRefinement, refine }">
          <select
            :value="currentRefinement"
            @change="refine($event.target.value)"
            class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </template>
      </ais-sort-by>
    </div>

    <!-- Loading and Products Grid -->
    <ais-hits>
      <template v-slot:default="{ items }">
        <!-- Loading State -->
        <ais-state-results>
          <template v-slot="{ status }">
            <div v-if="status === 'loading' || status === 'stalled'" class="py-16">
              <LoadingSpinner size="large" message="Loading products..." />
            </div>

            <!-- Empty State -->
            <EmptyState
              v-else-if="items.length === 0"
              icon="🔍"
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for"
            >
              <template #action>
                <ais-clear-refinements>
                  <template v-slot="{ canRefine, refine }">
                    <button
                      v-if="canRefine"
                      @click="refine"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                  </template>
                </ais-clear-refinements>
              </template>
            </EmptyState>

            <!-- Products Grid -->
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
            >
              <ProductCard
                v-for="item in items"
                :key="item.objectID"
                :product="item"
              />
            </div>
          </template>
        </ais-state-results>
      </template>
    </ais-hits>

    <!-- Pagination -->
    <div class="flex justify-center mt-8">
      <ais-pagination :padding="2">
        <template v-slot="{ pages, currentRefinement, refine, isFirstPage, isLastPage }">
          <nav class="flex items-center gap-2" v-if="pages.length > 1">
            <!-- Previous Button -->
            <button
              @click="refine(currentRefinement - 1)"
              :disabled="isFirstPage"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <!-- Page Numbers -->
            <div class="hidden sm:flex items-center gap-2">
              <button
                v-for="page in pages"
                :key="page"
                @click="refine(page)"
                class="min-w-[2.5rem] px-3 py-2 border rounded-lg text-sm transition-colors"
                :class="page === currentRefinement 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
              >
                {{ page + 1 }}
              </button>
            </div>

            <!-- Current Page Indicator (Mobile) -->
            <div class="sm:hidden px-4 py-2 text-sm text-gray-700">
              Page {{ currentRefinement + 1 }} of {{ pages.length }}
            </div>

            <!-- Next Button -->
            <button
              @click="refine(currentRefinement + 1)"
              :disabled="isLastPage"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </nav>
        </template>
      </ais-pagination>
    </div>
  </div>
</template>

<script setup>
import { AisHits, AisPagination, AisSortBy, AisStateResults, AisClearRefinements } from 'vue-instantsearch/vue3/es'
import ProductCard from './ProductCard.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import EmptyState from './EmptyState.vue'

defineProps({
  indexName: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

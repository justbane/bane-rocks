<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-4 m-0">Filters</h3>

    <!-- Clear Filters -->
    <ais-clear-refinements>
      <template v-slot="{ canRefine, refine }">
        <button
          :disabled="!canRefine"
          @click="refine"
          class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          Clear all filters
        </button>
      </template>
    </ais-clear-refinements>

    <!-- Category Filter -->
    <div class="mb-6 pb-6 border-b border-gray-200">
      <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 m-0">Category</h4>
      <ais-refinement-list attribute="category" :sort-by="['name:asc']">
        <template v-slot="{ items, refine }">
          <ul class="space-y-2">
            <li v-for="item in items" :key="item.value">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  :checked="item.isRefined"
                  @change="refine(item.value)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span class="flex-1 text-sm text-gray-700 group-hover:text-gray-900">{{ item.label }}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ item.count }}</span>
              </label>
            </li>
          </ul>
        </template>
      </ais-refinement-list>
    </div>

    <!-- Brand Filter -->
    <div class="mb-6 pb-6 border-b border-gray-200">
      <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 m-0">Brand</h4>
      <ais-refinement-list attribute="brand" :sort-by="['name:asc']">
        <template v-slot="{ items, refine }">
          <ul class="space-y-2">
            <li v-for="item in items" :key="item.value">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  :checked="item.isRefined"
                  @change="refine(item.value)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span class="flex-1 text-sm text-gray-700 group-hover:text-gray-900">{{ item.label }}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ item.count }}</span>
              </label>
            </li>
          </ul>
        </template>
      </ais-refinement-list>
    </div>

    <!-- Price Range Filter -->
    <div class="mb-6 pb-6 border-b border-gray-200">
      <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 m-0">Price Range</h4>
      <ais-range-input attribute="price">
        <template v-slot="{ currentRefinement, range, refine }">
          <form
            @submit.prevent="refine({ min: minPrice, max: maxPrice })"
            class="space-y-3"
          >
            <div class="flex items-center gap-2">
              <input
                v-model.number="minPrice"
                type="number"
                :min="range.min"
                :max="range.max"
                :placeholder="range.min?.toString()"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span class="text-sm text-gray-500">to</span>
              <input
                v-model.number="maxPrice"
                type="number"
                :min="range.min"
                :max="range.max"
                :placeholder="range.max?.toString()"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button 
              type="submit" 
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </form>
        </template>
      </ais-range-input>
    </div>

    <!-- In Stock Filter -->
    <div>
      <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 m-0">Availability</h4>
      <ais-toggle-refinement attribute="in_stock" :on="true" label="In Stock Only">
        <template v-slot="{ value, refine }">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              :checked="value.isRefined"
              @change="refine(value)"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span class="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
          </label>
        </template>
      </ais-toggle-refinement>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  AisRefinementList,
  AisRangeInput,
  AisToggleRefinement,
  AisClearRefinements
} from 'vue-instantsearch/vue3/es'

const minPrice = ref(null)
const maxPrice = ref(null)
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

<template>
  <div class="min-h-full">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Algolia Configuration Check -->
      <div v-if="error" class="flex justify-center items-center min-h-[60vh]">
        <div class="max-w-2xl w-full bg-white border-2 border-red-200 rounded-lg p-6 sm:p-8 text-center">
          <div class="text-5xl mb-4">⚠️</div>
          <h2 class="text-2xl font-semibold text-red-600 mb-4 m-0">Algolia Configuration Error</h2>
          <p class="text-gray-600 mb-6 m-0">{{ error }}</p>
          <div class="bg-gray-50 rounded-md p-6 text-left">
            <p class="font-medium text-gray-900 mb-3 m-0">Please ensure you have:</p>
            <ul class="space-y-2 text-gray-700 text-sm">
              <li>Created a <code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">env.local</code> file in the project root</li>
              <li>Added your Algolia credentials:
                <ul class="ml-6 mt-2 space-y-1">
                  <li><code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">VITE_ALGOLIA_APP_ID</code></li>
                  <li><code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">VITE_ALGOLIA_SEARCH_API_KEY</code></li>
                  <li><code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">VITE_ALGOLIA_INDEX_NAME</code></li>
                </ul>
              </li>
              <li>Restarted the development server after adding the .env file</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Search Interface -->
      <ais-instant-search
        v-else
        :search-client="searchClient"
        :index-name="indexName"
        :insights="true"
      >
        <ais-configure
          :hitsPerPage="12"
          :attributesToSnippet="['description:50']"
        />

        <!-- Search Bar -->
        <div class="mb-6 sm:mb-8">
          <SearchBar />
        </div>

        <!-- Filters and Products Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          <!-- Sidebar with Filters - Hidden on mobile, shown on desktop -->
          <aside class="hidden lg:block sticky top-24">
            <Filters />
          </aside>

          <!-- Mobile Filters Toggle -->
          <div class="lg:hidden mb-4">
            <button
              @click="toggleMobileFilters"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>

          <!-- Mobile Filters Overlay -->
          <transition name="fade">
            <div
              v-if="showMobileFilters"
              class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              @click="toggleMobileFilters"
            >
              <div
                class="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
                @click.stop
              >
                <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
                  <h3 class="text-lg font-semibold m-0">Filters</h3>
                  <button
                    @click="toggleMobileFilters"
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="p-4">
                  <Filters />
                </div>
              </div>
            </div>
          </transition>

          <!-- Product List -->
          <main class="min-h-[500px]">
            <ProductList :index-name="indexName" />
          </main>
        </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AisInstantSearch, AisConfigure } from 'vue-instantsearch/vue3/es'
import SearchBar from '../components/SearchBar.vue'
import ProductList from '../components/ProductList.vue'
import Filters from '../components/Filters.vue'
import { useAlgolia } from '../composables/useAlgolia'

const { searchClient, indexName, error } = useAlgolia()
const showMobileFilters = ref(false)

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

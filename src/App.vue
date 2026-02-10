<script setup>
import { onBeforeUnmount } from 'vue'
import CartIcon from './components/CartIcon.vue'
import Toast from './components/Toast.vue'
import { cleanupCart } from './composables/useCart'

// Clean up cart timeout on app unmount to prevent memory leaks
onBeforeUnmount(() => {
  cleanupCart()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Toast Notifications -->
    <Toast />

    <!-- Header with Navigation and Cart Icon -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <router-link to="/" class="no-underline">
            <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent m-0">
              Bane Rocks
            </h1>
          </router-link>
          
          <nav class="flex items-center gap-4">
            <router-link 
              to="/" 
              class="hidden sm:block px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors no-underline"
            >
              Shop
            </router-link>
            <CartIcon mode="navigate" />
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="min-h-[calc(100vh-80px)]">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Router link active styles */
.router-link-active {
  @apply text-blue-600;
}
</style>

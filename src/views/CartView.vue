<template>
  <div class="min-h-[calc(100vh-80px)] bg-gray-50 py-6 sm:py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 m-0">Shopping Cart</h1>

      <!-- Empty State -->
      <EmptyState
        v-if="isEmpty"
        title="Your cart is empty"
        message="Browse our products and add items to your cart"
      >
        <template #icon>
          <svg
            class="w-24 h-24 text-gray-300"
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
        </template>
        <template #action>
          <button 
            @click="$router.push('/')" 
            class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            Continue Shopping
          </button>
        </template>
      </EmptyState>

      <!-- Cart with Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <span class="text-lg font-semibold text-gray-900">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
            <button 
              @click="clearCart" 
              class="px-4 py-2 bg-transparent text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.objectID"
              class="grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr_auto] gap-4 sm:gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <img
                :src="item.image_url"
                :alt="item.name"
                @error="handleImageError"
                @click="goToProduct(item.objectID)"
                class="w-full h-[100px] sm:h-[150px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />

              <div class="flex flex-col gap-2">
                <h3 
                  @click="goToProduct(item.objectID)"
                  class="text-base sm:text-lg font-semibold text-gray-900 m-0 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {{ item.name }}
                </h3>
                <p class="text-sm text-blue-600 font-medium m-0">{{ item.brand }}</p>
                <p class="text-sm text-gray-600 m-0">{{ item.category }}</p>
                
                <div class="flex sm:hidden justify-between items-center mt-2">
                  <span class="text-xl font-bold text-gray-900">${{ item.price.toFixed(2) }}</span>
                  <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      @click="decrementQuantity(item.objectID)"
                      class="w-10 h-10 bg-gray-50 hover:bg-gray-200 text-gray-700 text-lg transition-colors"
                    >
                      -
                    </button>
                    <input
                      :value="item.quantity"
                      @change="updateQuantity(item.objectID, parseInt($event.target.value))"
                      type="number"
                      min="1"
                      max="99"
                      class="w-14 h-10 text-center border-x border-gray-300 text-base font-medium outline-none"
                    />
                    <button
                      @click="incrementQuantity(item.objectID)"
                      class="w-10 h-10 bg-gray-50 hover:bg-gray-200 text-gray-700 text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div class="hidden sm:flex flex-col items-end gap-4">
                <span class="text-xl font-bold text-gray-900">${{ item.price.toFixed(2) }}</span>

                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    @click="decrementQuantity(item.objectID)"
                    class="w-10 h-10 bg-gray-50 hover:bg-gray-200 text-gray-700 text-lg transition-colors"
                  >
                    -
                  </button>
                  <input
                    :value="item.quantity"
                    @change="updateQuantity(item.objectID, parseInt($event.target.value))"
                    type="number"
                    min="1"
                    max="99"
                    class="w-14 h-10 text-center border-x border-gray-300 text-base font-medium outline-none"
                  />
                  <button
                    @click="incrementQuantity(item.objectID)"
                    class="w-10 h-10 bg-gray-50 hover:bg-gray-200 text-gray-700 text-lg transition-colors"
                  >
                    +
                  </button>
                </div>

                <span class="text-xl font-bold text-blue-600">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </span>

                <button
                  @click="removeItem(item.objectID)"
                  aria-label="Remove item"
                  class="p-2 bg-transparent hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="$router.push('/')" 
            class="inline-flex items-center mt-6 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Continue Shopping
          </button>
        </div>

        <!-- Order Summary -->
        <div class="sticky top-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-6 m-0">Order Summary</h2>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Subtotal ({{ itemCount }} items)</span>
              <span class="text-sm font-semibold text-gray-900">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Shipping</span>
              <span class="text-sm font-semibold text-green-600">Free</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Tax (10%)</span>
              <span class="text-sm font-semibold text-gray-900">${{ tax.toFixed(2) }}</span>
            </div>

            <div class="h-px bg-gray-200 my-2"></div>

            <div class="flex justify-between items-center mt-2">
              <span class="text-xl font-bold text-gray-900">Total</span>
              <span class="text-xl font-bold text-gray-900">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <button 
            @click="handleCheckout" 
            class="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            Proceed to Checkout
          </button>

          <div class="flex items-center justify-center gap-2 mt-4 text-gray-600 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../composables/useCart'
import { useRouter } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const {
  cartItems,
  isEmpty,
  itemCount,
  subtotal,
  tax,
  total,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  clearCart
} = useCart()

const goToProduct = (objectID) => {
  router.push(`/product/${objectID}`)
}

const handleCheckout = () => {
  alert('Checkout functionality would be implemented here. This is a demo application for learning Algolia search.')
}

const handleImageError = (event) => {
  event.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
}
</script>

<style scoped>
/* Tailwind utilities handle all styling */
</style>

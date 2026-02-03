<template>
  <div 
    @click="navigateToProduct"
    class="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full group"
  >
    <div class="relative w-full pt-[100%] bg-gray-100 overflow-hidden">
      <img
        :src="product.image_url"
        :alt="product.name"
        @error="handleImageError"
        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span 
        v-if="!product.in_stock" 
        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold uppercase"
      >
        Out of Stock
      </span>
    </div>

    <div class="p-4 flex flex-col flex-1">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">{{ product.brand }}</span>
        <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ product.category }}</span>
      </div>

      <h3 class="text-base font-semibold text-gray-900 mb-2 m-0 line-clamp-2 leading-snug">
        {{ product.name }}
      </h3>

      <p class="text-sm text-gray-600 mb-3 m-0 flex-1 line-clamp-2">
        {{ truncateDescription(product.description) }}
      </p>

      <div v-if="product.rating" class="flex items-center gap-2 mb-3">
        <div class="flex gap-0.5">
          <span 
            v-for="star in 5" 
            :key="star" 
            class="text-base transition-colors"
            :class="star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
          >
            ★
          </span>
        </div>
        <span class="text-sm text-gray-600 font-medium">{{ product.rating.toFixed(1) }}</span>
      </div>

      <div class="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
        <button
          @click.stop="addToCart"
          :disabled="!product.in_stock"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ product.in_stock ? 'Add to Cart' : 'Unavailable' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { addItem } = useCart()

const navigateToProduct = () => {
  router.push(`/product/${props.product.objectID}`)
}

const addToCart = () => {
  if (props.product.in_stock) {
    addItem(props.product)
  }
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/500x500?text=No+Image'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

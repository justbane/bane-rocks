<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading product...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Product Not Found</h2>
      <p>{{ error }}</p>
      <button @click="$router.push('/')" class="back-btn">
        Back to Products
      </button>
    </div>

    <div v-else-if="product" class="product-detail">
      <button @click="$router.back()" class="back-link">
        ← Back
      </button>

      <div class="product-content">
        <div class="product-image-section">
          <img
            :src="product.image"
            :alt="product.name"
            class="product-detail-image"
            @error="handleImageError"
          />
        </div>

        <div class="product-info-section">
          <div class="product-meta">
            <span class="product-brand">{{ product.brand }}</span>
            <span class="product-category">{{ product.category }}</span>
          </div>

          <h1 class="product-title">{{ product.name }}</h1>

          <div class="product-rating" v-if="product.rating">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.round(product.rating) }">
                ★
              </span>
            </div>
            <span class="rating-value">{{ product.rating.toFixed(1) }} out of 5</span>
          </div>

          <div class="product-price-section">
            <span class="product-price">${{ product.price.toFixed(2) }}</span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" class="quantity-btn">-</button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                max="10"
                class="quantity-input"
              />
              <button @click="increaseQuantity" class="quantity-btn">+</button>
            </div>

            <button
              @click="handleAddToCart"
              class="add-to-cart-btn-large"
            >
              Add to Cart
            </button>
          </div>

          <div class="product-details-table">
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr>
                  <td class="detail-label">Brand</td>
                  <td class="detail-value">{{ product.brand }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Category</td>
                  <td class="detail-value">{{ product.category }}</td>
                </tr>
                <tr>
                  <td class="detail-label">Product ID</td>
                  <td class="detail-value">{{ product.objectID }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlgolia } from '../composables/useAlgolia'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { getObject } = useAlgolia()
const { addItem } = useCart()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const quantity = ref(1)

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const productId = route.params.id
    const data = await getObject(productId)
    product.value = data
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Unable to load product details. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleAddToCart = () => {
  for (let i = 0; i < quantity.value; i++) {
    addItem(product.value)
  }
}

const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleImageError = (event) => {
  event.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.back-btn:hover {
  background: #2563eb;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 300;
  margin-bottom: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.back-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-image-section {
  position: relative;
}

.product-detail-image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.product-brand {
  font-size: 0.875rem;
  font-weight: 300;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-category {
  font-size: 0.875rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 300;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  color: #e2e8f0;
  font-size: 1.25rem;
}

.star.filled {
  color: #fbbf24;
}

.rating-value {
  font-size: 0.875rem;
  color: #64748b;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-price {
  font-size: 2.5rem;
  font-weight: 300;
  color: #1e293b;
}

.in-stock-badge {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 300;
}

.out-of-stock-badge {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 300;
}

.product-description {
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.product-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.quantity-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: #f8fafc;
  color: #334155;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.quantity-btn:hover {
  background: #e2e8f0;
}

.quantity-input {
  width: 4rem;
  height: 2.5rem;
  border: none;
  text-align: center;
  font-size: 1rem;
  font-weight: 300;
  outline: none;
}

.add-to-cart-btn-large {
  flex: 1;
  padding: 0.875rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn-large:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.add-to-cart-btn-large:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.product-details-table {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.product-details-table h3 {
  font-size: 1.125rem;
  font-weight: 300;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.product-details-table table {
  width: 100%;
  border-collapse: collapse;
}

.product-details-table tr {
  border-bottom: 1px solid #f1f5f9;
}

.product-details-table tr:last-child {
  border-bottom: none;
}

.detail-label {
  padding: 0.75rem 0;
  font-weight: 300;
  color: #64748b;
  width: 40%;
}

.detail-value {
  padding: 0.75rem 0;
  color: #1e293b;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .product-price {
    font-size: 2rem;
  }

  .product-actions {
    flex-direction: column;
  }

  .add-to-cart-btn-large {
    width: 100%;
  }
}
</style>

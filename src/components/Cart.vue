<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isCartOpen"
      class="cart-overlay"
      @click="closeCart"
    ></div>
  </Transition>

  <!-- Cart Sidebar -->
  <Transition name="slide">
    <div v-if="isCartOpen" class="cart-sidebar">
      <div class="cart-header">
        <h2 class="cart-title">Shopping Cart</h2>
        <button @click="closeCart" class="close-button" aria-label="Close cart">
          <svg
            class="close-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="cart-content">
        <!-- Empty State -->
        <div v-if="isEmpty" class="empty-cart">
          <svg
            class="empty-icon"
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
          <h3 class="empty-title">Your cart is empty</h3>
          <p class="empty-message">Add some products to get started</p>
          <button @click="closeCart" class="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.objectID"
            class="cart-item"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="item-image"
              @error="handleImageError"
            />
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-brand">{{ item.brand }}</p>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>

              <div class="quantity-controls">
                <button
                  @click="decrementQuantity(item.objectID)"
                  class="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span class="quantity-value">{{ item.quantity }}</span>
                <button
                  @click="incrementQuantity(item.objectID)"
                  class="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              @click="removeItem(item.objectID)"
              class="remove-button"
              aria-label="Remove item"
            >
              <svg
                class="remove-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

      <!-- Cart Footer -->
      <div v-if="!isEmpty" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Tax (10%)</span>
            <span class="summary-value">${{ tax.toFixed(2) }}</span>
          </div>
          <div class="summary-row total-row">
            <span class="summary-label">Total</span>
            <span class="summary-value">${{ total.toFixed(2) }}</span>
          </div>
        </div>

        <button @click="goToCheckout" class="checkout-btn">
          Proceed to Checkout
        </button>

        <button @click="clearCart" class="clear-cart-btn">
          Clear Cart
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCart } from '../composables/useCart'
import { useRouter } from 'vue-router'

const router = useRouter()
const {
  cartItems,
  isCartOpen,
  isEmpty,
  subtotal,
  tax,
  total,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  closeCart
} = useCart()

const goToCheckout = () => {
  closeCart()
  router.push('/cart')
}

const handleImageError = (event) => {
  event.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 28rem;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.cart-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #64748b;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.empty-message {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.continue-shopping-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.continue-shopping-btn:hover {
  background: #2563eb;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.item-image {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 0.375rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.item-brand {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.item-price {
  font-size: 1rem;
  font-weight: 500;
  color: #3b82f6;
  margin: 0.25rem 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  color: #334155;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.quantity-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  min-width: 1.5rem;
  text-align: center;
}

.remove-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #64748b;
  border-radius: 0.375rem;
  transition: all 0.2s;
  height: fit-content;
}

.remove-button:hover {
  background: #fee2e2;
  color: #ef4444;
}

.remove-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.cart-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
}

.summary-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.total-row {
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e293b;
}

.checkout-btn {
  width: 100%;
  padding: 0.875rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.checkout-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.clear-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cart-btn:hover {
  background: #fee2e2;
  color: #ef4444;
  border-color: #fecaca;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style>

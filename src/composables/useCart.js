import { ref, computed, watch } from 'vue'
import { useToast } from './useToast'

// Cart state (singleton across the app)
const cartItems = ref([])
const isCartOpen = ref(false)

// Local storage key
const CART_STORAGE_KEY = 'algolia-shop-cart'

// Initialize cart from localStorage
const initializeCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    cartItems.value = []
  }
}

// Save cart to localStorage
const saveCart = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Initialize on first use
if (cartItems.value.length === 0) {
  initializeCart()
}

// Watch for changes and save to localStorage
watch(cartItems, saveCart, { deep: true })

/**
 * Composable for cart functionality
 */
export function useCart() {
  const { success, info } = useToast()

  // Add item to cart
  const addItem = (product) => {
    const existingItem = cartItems.value.find(
      item => item.objectID === product.objectID
    )

    if (existingItem) {
      existingItem.quantity += 1
      success(`Updated quantity of ${product.name}`)
    } else {
      cartItems.value.push({
        objectID: product.objectID,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        brand: product.brand,
        category: product.category,
        in_stock: product.in_stock,
        quantity: 1
      })
      success(`Added ${product.name} to cart`)
    }
  }

  // Remove item from cart
  const removeItem = (objectID) => {
    const index = cartItems.value.findIndex(item => item.objectID === objectID)
    if (index > -1) {
      const itemName = cartItems.value[index].name
      cartItems.value.splice(index, 1)
      info(`Removed ${itemName} from cart`)
    }
  }

  // Update item quantity
  const updateQuantity = (objectID, quantity) => {
    const item = cartItems.value.find(item => item.objectID === objectID)
    if (item) {
      if (quantity <= 0) {
        removeItem(objectID)
      } else {
        item.quantity = quantity
      }
    }
  }

  // Increment item quantity
  const incrementQuantity = (objectID) => {
    const item = cartItems.value.find(item => item.objectID === objectID)
    if (item) {
      item.quantity += 1
    }
  }

  // Decrement item quantity
  const decrementQuantity = (objectID) => {
    const item = cartItems.value.find(item => item.objectID === objectID)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeItem(objectID)
      }
    }
  }

  // Clear entire cart
  const clearCart = () => {
    cartItems.value = []
    info('Cart cleared')
  }

  // Toggle cart sidebar
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  // Computed properties
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    )
  })

  const tax = computed(() => {
    return subtotal.value * 0.1 // 10% tax
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  const isEmpty = computed(() => {
    return cartItems.value.length === 0
  })

  return {
    // State
    cartItems,
    isCartOpen,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Computed
    itemCount,
    subtotal,
    tax,
    total,
    isEmpty
  }
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCart } from '../useCart'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

global.localStorage = localStorageMock

// Mock useToast
vi.mock('../useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  })
}))

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    // Clear cart state between tests
    const { clearCart } = useCart()
    clearCart()
  })

  it('should initialize with empty cart', () => {
    const { cartItems, isEmpty } = useCart()
    expect(cartItems.value).toEqual([])
    expect(isEmpty.value).toBe(true)
  })

  it('should add item to cart', () => {
    const { addItem, cartItems, itemCount } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: 'test.jpg',
      brand: 'Test Brand',
      category: 'Electronics',
      in_stock: true
    }

    addItem(product)
    
    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].name).toBe('Test Product')
    expect(cartItems.value[0].quantity).toBe(1)
    expect(itemCount.value).toBe(1)
  })

  it('should increment quantity when adding existing item', () => {
    const { addItem, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    addItem(product)
    
    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].quantity).toBe(2)
  })

  it('should remove item from cart', () => {
    const { addItem, removeItem, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    expect(cartItems.value).toHaveLength(1)
    
    removeItem('1')
    expect(cartItems.value).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { addItem, updateQuantity, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    updateQuantity('1', 5)
    
    expect(cartItems.value[0].quantity).toBe(5)
  })

  it('should remove item when quantity set to 0', () => {
    const { addItem, updateQuantity, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    updateQuantity('1', 0)
    
    expect(cartItems.value).toHaveLength(0)
  })

  it('should increment quantity', () => {
    const { addItem, incrementQuantity, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    incrementQuantity('1')
    
    expect(cartItems.value[0].quantity).toBe(2)
  })

  it('should decrement quantity', () => {
    const { addItem, incrementQuantity, decrementQuantity, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    incrementQuantity('1')
    decrementQuantity('1')
    
    expect(cartItems.value[0].quantity).toBe(1)
  })

  it('should remove item when decrementing quantity to 0', () => {
    const { addItem, decrementQuantity, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    decrementQuantity('1')
    
    expect(cartItems.value).toHaveLength(0)
  })

  it('should calculate correct subtotal', () => {
    const { addItem, subtotal } = useCart()
    
    const product1 = {
      objectID: '1',
      name: 'Product 1',
      price: 10.00,
      in_stock: true
    }

    const product2 = {
      objectID: '2',
      name: 'Product 2',
      price: 20.00,
      in_stock: true
    }

    addItem(product1)
    addItem(product2)
    
    expect(subtotal.value).toBe(30.00)
  })

  it('should calculate correct tax (10%)', () => {
    const { addItem, tax } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 100.00,
      in_stock: true
    }

    addItem(product)
    
    expect(tax.value).toBe(10.00)
  })

  it('should calculate correct total', () => {
    const { addItem, total } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 100.00,
      in_stock: true
    }

    addItem(product)
    
    // 100 + 10% tax = 110
    expect(total.value).toBe(110.00)
  })

  it('should clear entire cart', () => {
    const { addItem, clearCart, cartItems } = useCart()
    
    const product = {
      objectID: '1',
      name: 'Test Product',
      price: 29.99,
      in_stock: true
    }

    addItem(product)
    addItem(product)
    
    expect(cartItems.value).toHaveLength(1)
    
    clearCart()
    
    expect(cartItems.value).toHaveLength(0)
  })

  it('should toggle cart open/close', () => {
    const { isCartOpen, toggleCart } = useCart()
    
    expect(isCartOpen.value).toBe(false)
    
    toggleCart()
    expect(isCartOpen.value).toBe(true)
    
    toggleCart()
    expect(isCartOpen.value).toBe(false)
  })

  it('should open cart', () => {
    const { isCartOpen, openCart } = useCart()
    
    expect(isCartOpen.value).toBe(false)
    
    openCart()
    expect(isCartOpen.value).toBe(true)
  })

  it('should close cart', () => {
    const { isCartOpen, openCart, closeCart } = useCart()
    
    openCart()
    expect(isCartOpen.value).toBe(true)
    
    closeCart()
    expect(isCartOpen.value).toBe(false)
  })

  it('should calculate correct item count with multiple items', () => {
    const { addItem, incrementQuantity, itemCount } = useCart()
    
    const product1 = {
      objectID: '1',
      name: 'Product 1',
      price: 10.00,
      in_stock: true
    }

    const product2 = {
      objectID: '2',
      name: 'Product 2',
      price: 20.00,
      in_stock: true
    }

    addItem(product1)
    addItem(product2)
    incrementQuantity('1')
    
    // Product 1: qty 2, Product 2: qty 1 = total 3
    expect(itemCount.value).toBe(3)
  })
})

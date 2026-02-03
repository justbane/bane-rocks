import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartView from '../views/CartView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home - Bane Rocks E-commerce'
    }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      title: 'Product Details - Bane Rocks E-commerce'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartView,
    meta: {
      title: 'Shopping Cart - Bane Rocks E-commerce'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top on route change, or to saved position if using back button
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Set page title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Bane Rocks E-commerce'
  next()
})

export default router

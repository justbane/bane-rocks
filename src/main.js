import { createApp } from 'vue'
import aa from 'search-insights'
import './style.css'
import App from './App.vue'
import router from './router'
import InstantSearch from 'vue-instantsearch/vue3/es'

const appId = import.meta.env.VITE_ALGOLIA_APP_ID
const apiKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
if (appId && apiKey && typeof window !== 'undefined') {
  aa('init', { appId, apiKey })
  window.aa = aa
}

const app = createApp(App)

app.use(router)
app.use(InstantSearch)

app.mount('#app')

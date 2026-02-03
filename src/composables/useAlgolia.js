import { ref } from 'vue'
import { liteClient as algoliasearch } from 'algoliasearch/lite'

// Algolia client instance (singleton)
let searchClient = null

/**
 * Composable for Algolia search functionality
 */
export function useAlgolia() {
  const isConfigured = ref(false)
  const error = ref(null)

  // Initialize Algolia client
  const initClient = () => {
    try {
      const appId = import.meta.env.VITE_ALGOLIA_APP_ID
      const searchApiKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY

      if (!appId || !searchApiKey) {
        throw new Error('Algolia credentials not configured. Please check your .env.local file.')
      }

      if (appId === 'your_app_id_here' || searchApiKey === 'your_search_api_key_here') {
        throw new Error('Please replace placeholder Algolia credentials with real values.')
      }

      if (!searchClient) {
        searchClient = algoliasearch(appId, searchApiKey)
      }

      isConfigured.value = true
      error.value = null
      return searchClient
    } catch (e) {
      error.value = e.message
      isConfigured.value = false
      console.error('Algolia initialization error:', e)
      return null
    }
  }

  // Get the search client
  const getClient = () => {
    if (!searchClient) {
      return initClient()
    }
    return searchClient
  }

  // Get index name from environment
  const getIndexName = () => {
    return import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'products'
  }

  // Search function for direct API calls (without InstantSearch widgets)
  const search = async (query, params = {}) => {
    try {
      const client = getClient()
      if (!client) {
        throw new Error('Algolia client not initialized')
      }

      const indexName = getIndexName()
      const index = client.initIndex(indexName)

      const results = await index.search(query, {
        hitsPerPage: params.hitsPerPage || 20,
        page: params.page || 0,
        ...params
      })

      return results
    } catch (e) {
      console.error('Search error:', e)
      throw e
    }
  }

  // Get a single object by ID
  const getObject = async (objectID) => {
    try {
      const client = getClient()
      if (!client) {
        throw new Error('Algolia client not initialized')
      }

      const indexName = getIndexName()
      const index = client.initIndex(indexName)

      const object = await index.getObject(objectID)
      return object
    } catch (e) {
      console.error('Get object error:', e)
      throw e
    }
  }

  return {
    searchClient: getClient(),
    indexName: getIndexName(),
    isConfigured,
    error,
    search,
    getObject,
    initClient
  }
}

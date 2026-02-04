import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAlgolia } from '../useAlgolia'

// Mock the algoliasearch module
vi.mock('algoliasearch/lite', () => ({
  liteClient: vi.fn((appId, apiKey) => ({
    appId,
    apiKey,
    search: vi.fn()
  }))
}))

describe('useAlgolia', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set environment variables
    import.meta.env.VITE_ALGOLIA_APP_ID = 'test_app_id'
    import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY = 'test_api_key'
    import.meta.env.VITE_ALGOLIA_INDEX_NAME = 'test_index'
  })

  it('should initialize with correct configuration', () => {
    const { searchClient, indexName, isConfigured, error } = useAlgolia()
    
    expect(searchClient).toBeTruthy()
    expect(indexName).toBe('test_index')
    expect(isConfigured.value).toBe(true)
    expect(error.value).toBeNull()
  })

  it('should return error when credentials are missing', () => {
    import.meta.env.VITE_ALGOLIA_APP_ID = ''
    import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY = ''
    
    const { initClient, error, isConfigured } = useAlgolia()
    initClient()
    
    expect(isConfigured.value).toBe(false)
    expect(error.value).not.toBeNull()
    expect(error.value).toContain('credentials not configured')
  })

  it('should return error when credentials are placeholders', () => {
    import.meta.env.VITE_ALGOLIA_APP_ID = 'your_app_id_here'
    import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY = 'your_search_api_key_here'
    
    const { initClient, error, isConfigured } = useAlgolia()
    initClient()
    
    expect(isConfigured.value).toBe(false)
    expect(error.value).not.toBeNull()
    expect(error.value).toContain('placeholder')
  })

  it('should use default index name when not provided', () => {
    import.meta.env.VITE_ALGOLIA_INDEX_NAME = ''
    
    const { indexName } = useAlgolia()
    
    expect(indexName).toBe('products')
  })

  it('should perform search with correct parameters', async () => {
    const mockResponse = {
      results: [
        {
          hits: [{ objectID: '1', name: 'Test Product' }],
          nbHits: 1
        }
      ]
    }

    const { search, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockResolvedValue(mockResponse)
    
    const result = await search('test query', { hitsPerPage: 10 })
    
    expect(searchClient.search).toHaveBeenCalledWith({
      requests: [
        {
          indexName: 'test_index',
          query: 'test query',
          hitsPerPage: 10,
          page: 0
        }
      ]
    })
    expect(result.hits).toHaveLength(1)
    expect(result.hits[0].name).toBe('Test Product')
  })

  it('should use default search parameters', async () => {
    const mockResponse = {
      results: [{ hits: [] }]
    }

    const { search, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockResolvedValue(mockResponse)
    
    await search('test')
    
    expect(searchClient.search).toHaveBeenCalledWith({
      requests: [
        {
          indexName: 'test_index',
          query: 'test',
          hitsPerPage: 20,
          page: 0
        }
      ]
    })
  })

  it('should get object by ID', async () => {
    const mockResponse = {
      results: [
        {
          hits: [{ objectID: '123', name: 'Test Product' }]
        }
      ]
    }

    const { getObject, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockResolvedValue(mockResponse)
    
    const result = await getObject('123')
    
    expect(searchClient.search).toHaveBeenCalledWith({
      requests: [
        {
          indexName: 'test_index',
          query: '',
          filters: 'objectID:123',
          hitsPerPage: 1
        }
      ]
    })
    expect(result.objectID).toBe('123')
    expect(result.name).toBe('Test Product')
  })

  it('should throw error when object not found', async () => {
    const mockResponse = {
      results: [{ hits: [] }]
    }

    const { getObject, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockResolvedValue(mockResponse)
    
    await expect(getObject('999')).rejects.toThrow('Product not found')
  })

  it('should handle search errors gracefully', async () => {
    const { search, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockRejectedValue(new Error('Network error'))
    
    await expect(search('test')).rejects.toThrow('Network error')
  })

  it('should handle getObject errors gracefully', async () => {
    const { getObject, searchClient } = useAlgolia()
    searchClient.search = vi.fn().mockRejectedValue(new Error('Network error'))
    
    await expect(getObject('123')).rejects.toThrow('Network error')
  })

  it('should reuse existing client instance', () => {
    const { searchClient: client1 } = useAlgolia()
    const { searchClient: client2 } = useAlgolia()
    
    expect(client1).toBe(client2)
  })
})

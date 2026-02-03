import { algoliasearch } from 'algoliasearch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function uploadProducts() {
  console.log('🚀 Starting Algolia upload process...\n')

  // Validate environment variables
  const appId = process.env.VITE_ALGOLIA_APP_ID
  const adminApiKey = process.env.VITE_ALGOLIA_ADMIN_API_KEY
  const indexName = process.env.VITE_ALGOLIA_INDEX_NAME || 'products'

  if (!appId || !adminApiKey) {
    console.error('❌ Error: Missing Algolia credentials.')
    console.error('Please set VITE_ALGOLIA_APP_ID and VITE_ALGOLIA_ADMIN_API_KEY in .env.local')
    process.exit(1)
  }

  if (appId === 'your_app_id_here' || adminApiKey === 'your_admin_api_key_here') {
    console.error('❌ Error: Please replace placeholder credentials with real Algolia values.')
    process.exit(1)
  }

  try {
    // Initialize Algolia client
    console.log('📡 Connecting to Algolia...')
    const client = algoliasearch(appId, adminApiKey)
    const index = client.initIndex(indexName)

    // Read product data
    const productsPath = path.resolve(__dirname, '../public/sample-products.json')
    console.log(`📖 Reading products from ${productsPath}...`)
    
    const productsData = fs.readFileSync(productsPath, 'utf-8')
    const products = JSON.parse(productsData)

    console.log(`✅ Found ${products.length} products\n`)

    // Upload to Algolia
    console.log('⬆️  Uploading products to Algolia...')
    const { objectIDs } = await index.saveObjects(products)

    console.log(`✅ Successfully uploaded ${objectIDs.length} products!\n`)

    // Configure index settings
    console.log('⚙️  Configuring index settings...')
    await index.setSettings({
      // Searchable attributes (in order of importance)
      searchableAttributes: [
        'name',
        'brand',
        'category',
        'description'
      ],
      
      // Attributes for faceting (filtering)
      attributesForFaceting: [
        'category',
        'brand',
        'filterOnly(in_stock)',
        'searchable(category)',
        'searchable(brand)'
      ],

      // Custom ranking (for relevance)
      customRanking: [
        'desc(rating)',
        'desc(in_stock)',
        'asc(price)'
      ],

      // Pagination
      hitsPerPage: 12,

      // Highlighting
      attributesToHighlight: [
        'name',
        'description',
        'brand'
      ],

      // Snippeting
      attributesToSnippet: [
        'description:20'
      ],

      // Remove words on typos
      removeWordsIfNoResults: 'lastWords',

      // Typo tolerance
      typoTolerance: true,

      // Distinct
      attributeForDistinct: 'name',
      distinct: 1
    })

    console.log('✅ Index settings configured\n')

    // Display index info
    console.log('📊 Index Information:')
    console.log(`   Index name: ${indexName}`)
    console.log(`   Total products: ${objectIDs.length}`)
    console.log(`   Dashboard: https://www.algolia.com/apps/${appId}/explorer/browse/${indexName}\n`)

    console.log('🎉 Upload complete! Your products are now searchable.\n')
    console.log('Next steps:')
    console.log('1. Update your .env.local with the SEARCH API KEY (not admin key)')
    console.log('2. Run "npm run dev" to start the development server')
    console.log('3. Test the search functionality in your app\n')

  } catch (error) {
    console.error('❌ Error uploading to Algolia:', error.message)
    if (error.status === 401) {
      console.error('Authentication failed. Please check your Admin API Key.')
    }
    process.exit(1)
  }
}

uploadProducts()

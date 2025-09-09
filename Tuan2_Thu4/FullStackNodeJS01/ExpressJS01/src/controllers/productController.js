const {
  getProductsByCategoryService,
  getCategoriesService,
  getAllProductsService,
} = require('../services/productService');
const {
  searchProducts,
  indexProduct,
  bulkIndexProducts,
  testConnection,
} = require('../config/elasticsearch');

// Lấy sản phẩm theo category với lazy loading
const getProductsByCategory = async (req, res) => {
  try {
    const { category = 'all', skip = 0, limit = 12 } = req.query;

    const data = await getProductsByCategoryService(category, skip, limit);
    return res.status(200).json(data);
  } catch (error) {
    console.log('>>> Error in getProductsByCategory: ', error);
    return res.status(500).json({
      EC: 1,
      EM: 'Internal server error',
      DT: null,
    });
  }
};

// Lấy danh sách categories
const getCategories = async (req, res) => {
  try {
    const data = await getCategoriesService();
    return res.status(200).json(data);
  } catch (error) {
    console.log('>>> Error in getCategories: ', error);
    return res.status(500).json({
      EC: 1,
      EM: 'Internal server error',
      DT: null,
    });
  }
};

// Tìm kiếm sản phẩm với Elasticsearch
const searchProductsController = async (req, res) => {
  try {
    const searchResult = await searchProducts(req.query);
    return res.status(200).json({
      EC: 0,
      EM: 'Search completed successfully',
      DT: searchResult,
    });
  } catch (error) {
    console.log('>>> Error in searchProducts: ', error);
    return res.status(500).json({
      EC: 1,
      EM: 'Search failed',
      DT: null,
    });
  }
};

// Sync sản phẩm từ MongoDB sang Elasticsearch
const { createProductMapping } = require('../config/elasticsearch');

const syncProductsToElastic = async (req, res) => {
  try {
    console.log('=== SYNC PROCESS STARTED ===');

    // Test connection trước
    console.log('1. Testing Elasticsearch connection...');
    const connectionTest = await testConnection();
    if (!connectionTest.connected) {
      console.error('Connection test failed:', connectionTest.error);
      return res.status(500).json({
        EC: 1,
        EM: 'Elasticsearch connection failed',
        DT: connectionTest,
      });
    }
    console.log('✓ Connection test passed');

    // Tạo index và mapping nếu chưa có
    console.log('2. Creating product mapping...');
    await createProductMapping();
    console.log('✓ Mapping created/verified');

    // Lấy dữ liệu từ MongoDB
    console.log('3. Fetching products from MongoDB...');
    const products = await getAllProductsService();
    console.log(
      `✓ Found ${products ? products.length : 0} products in MongoDB`
    );

    if (products && products.length > 0) {
      console.log('4. Starting bulk indexing to Elasticsearch...');
      await bulkIndexProducts(products);
      console.log('✓ Bulk indexing completed');

      return res.status(200).json({
        EC: 0,
        EM: `Successfully synced ${products.length} products to Elasticsearch`,
        DT: { count: products.length },
      });
    } else {
      return res.status(200).json({
        EC: 0,
        EM: 'No products found to sync',
        DT: { count: 0 },
      });
    }
  } catch (error) {
    console.log('>>> Error in syncProductsToElastic: ', error);
    return res.status(500).json({
      EC: 1,
      EM: 'Sync failed',
      DT: null,
    });
  }
};

module.exports = {
  getProductsByCategory,
  getCategories,
  searchProductsController,
  syncProductsToElastic,
};

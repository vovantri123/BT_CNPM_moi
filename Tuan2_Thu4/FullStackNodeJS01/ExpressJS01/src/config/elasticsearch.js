const { Client } = require('@elastic/elasticsearch');

require('dotenv').config();
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

const PRODUCT_INDEX = 'products';

// Kiểm tra kết nối Elasticsearch
const testConnection = async () => {
  try {
    console.log('>>> Testing Elasticsearch connection...');

    // Sử dụng ping() thay vì cluster.health()
    const pingResult = await client.ping();
    console.log('>>> Elasticsearch ping successful');

    // Thử get info
    try {
      const info = await client.info();
      console.log('>>> Elasticsearch info:', {
        cluster_name: info.cluster_name,
        version: info.version.number,
      });

      return {
        connected: true,
        ping: true,
        info: info,
      };
    } catch (infoError) {
      console.log('>>> Info API unavailable but ping works');
      return {
        connected: true,
        ping: true,
        info: null,
        warning: 'Info API unavailable but connection works',
      };
    }
  } catch (error) {
    console.error('>>> Elasticsearch connection failed:', error);
    return {
      connected: false,
      error: error.message || error,
    };
  }
};

// Tạo mapping cho index products
const createProductMapping = async () => {
  try {
    console.log(`>>> Checking if index '${PRODUCT_INDEX}' exists...`);
    const indexExists = await client.indices.exists({ index: PRODUCT_INDEX });
    console.log(`>>> Index exists: ${indexExists}`);

    if (!indexExists) {
      console.log(`>>> Creating index '${PRODUCT_INDEX}' with mapping...`);
      const createResponse = await client.indices.create({
        index: PRODUCT_INDEX,
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              description: {
                type: 'text',
                analyzer: 'standard',
              },
              category: {
                type: 'keyword',
              },
              price: {
                type: 'float',
              },
              stock: {
                type: 'integer',
              },
              views: {
                type: 'integer',
              },
              promotion: {
                type: 'boolean',
              },
              image: {
                type: 'keyword',
              },
              createdAt: {
                type: 'date',
              },
              updatedAt: {
                type: 'date',
              },
            },
          },
        },
      });
      console.log(`>>> Created index: ${PRODUCT_INDEX}`, createResponse);
    } else {
      console.log(
        `>>> Index '${PRODUCT_INDEX}' already exists, skipping creation`
      );
    }
  } catch (error) {
    console.error('>>> Error creating product mapping:', error);
  }
};

// Hàm để index một sản phẩm
const indexProduct = async (product) => {
  try {
    const response = await client.index({
      index: PRODUCT_INDEX,
      id: product._id || product.id,
      body: {
        ...product,
        views: product.views || Math.floor(Math.random() * 1000),
        promotion: product.promotion || Math.random() > 0.7,
      },
    });
    return response;
  } catch (error) {
    console.error('Error indexing product:', error);
    throw error;
  }
};

// Hàm để index nhiều sản phẩm
const bulkIndexProducts = async (products) => {
  try {
    console.log(`>>> Starting bulk index for ${products.length} products...`);

    const body = products.flatMap((product) => {
      // Loại bỏ _id và __v khỏi document body
      const { _id, __v, ...productData } = product;

      return [
        { index: { _index: PRODUCT_INDEX, _id: _id || product.id } },
        {
          ...productData,
          views: productData.views || Math.floor(Math.random() * 1000),
          promotion:
            productData.promotion !== undefined
              ? productData.promotion
              : Math.random() > 0.7,
        },
      ];
    });

    console.log(`>>> Bulk body length: ${body.length}`);
    console.log(
      `>>> Sample product being indexed:`,
      JSON.stringify(body[1], null, 2)
    );

    const response = await client.bulk({ body });

    console.log(`>>> Bulk response took: ${response.took}ms`);
    console.log(`>>> Bulk response errors: ${response.errors}`);

    if (response.errors) {
      console.error(
        '>>> Bulk indexing errors:',
        JSON.stringify(response.items.slice(0, 3), null, 2)
      );
    } else {
      console.log(`>>> Successfully indexed ${response.items.length} items`);
      console.log(
        `>>> Sample indexed item:`,
        JSON.stringify(response.items[0], null, 2)
      );
    }

    return response;
  } catch (error) {
    console.error('>>> Error bulk indexing products:', error);
    throw error;
  }
};

// Hàm tìm kiếm sản phẩm với fuzzy search và filter
const searchProducts = async (query) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    promotion,
    minViews,
    maxViews,
    sortBy = 'relevance',
    page = 1,
    limit = 10,
  } = query;

  const must = []; // Các điều kiện tìm kiếm
  const filter = []; // Các điều kiện lọc

  // Fuzzy search cho tên sản phẩm
  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^2', 'description'],
        fuzziness: 'AUTO',
        type: 'best_fields',
      },
    });
  }

  // Filter theo category
  if (category) {
    filter.push({ term: { category } });
  }

  // Filter theo promotion
  if (promotion !== undefined) {
    filter.push({ term: { promotion: promotion === 'true' } });
  }

  // Filter theo price range
  if (minPrice || maxPrice) {
    const priceRange = {};
    if (minPrice) priceRange.gte = parseFloat(minPrice);
    if (maxPrice) priceRange.lte = parseFloat(maxPrice);
    filter.push({ range: { price: priceRange } });
  }

  // Filter theo views range
  if (minViews || maxViews) {
    const viewsRange = {};
    if (minViews) viewsRange.gte = parseInt(minViews);
    if (maxViews) viewsRange.lte = parseInt(maxViews);
    filter.push({ range: { views: viewsRange } });
  }

  // Xây dựng query đúng chuẩn Elasticsearch
  let searchQuery;
  if (must.length === 0 && filter.length === 0) {
    searchQuery = { match_all: {} };
  } else {
    searchQuery = { bool: {} };
    if (must.length > 0) searchQuery.bool.must = must;
    if (filter.length > 0) searchQuery.bool.filter = filter;
  }

  // Xây dựng sort
  let sort = [];
  switch (sortBy) {
    case 'price_asc':
      sort = [{ price: { order: 'asc' } }];
      break;
    case 'price_desc':
      sort = [{ price: { order: 'desc' } }];
      break;
    case 'views_desc':
      sort = [{ views: { order: 'desc' } }];
      break;
    case 'name_asc':
      sort = [{ 'name.keyword': { order: 'asc' } }];
      break;
    default:
      sort = q ? ['_score'] : [{ createdAt: { order: 'desc' } }];
  }

  try {
    const response = await client.search({
      index: PRODUCT_INDEX,
      body: {
        query: searchQuery,
        sort: sort, // Sắp xếp kết quả
        from: (page - 1) * limit, // Offset: Số sản phẩm bỏ qua
        size: limit, // Số lượng sản phẩm trả về mỗi trang
        highlight: {
          // Nổi bật từ khóa tìm kiếm
          fields: {
            name: {},
            description: {},
          },
        },
      },
    });

    const products = response.hits.hits.map((hit) => ({
      ...hit._source, // dữ liệu gốc
      _score: hit._score, // độ liên quan
      highlight: hit.highlight, // đoạn text highlight
    }));

    return {
      products,
      total: response.hits.total.value,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(response.hits.total.value / limit),
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

module.exports = {
  client,
  PRODUCT_INDEX,
  testConnection,
  createProductMapping,
  indexProduct,
  bulkIndexProducts,
  searchProducts,
};

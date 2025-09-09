const Product = require('../models/product');

// Lấy danh sách sản phẩm theo category với lazy loading
const getProductsByCategoryService = async (category, skip = 0, limit = 12) => {
  try {
    // Chuyển đổi skip và limit thành số
    const skipNum = parseInt(skip);
    const limitNum = parseInt(limit);

    // Query cơ bản
    let query = { isActive: true };

    // Nếu có category thì filter theo category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Đếm tổng số sản phẩm
    const total = await Product.countDocuments(query);

    // Lấy sản phẩm với skip và limit
    const products = await Product.find(query)
      .select('name description price category image stock')
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
      .skip(skipNum)
      .limit(limitNum)
      .lean(); // Tối ưu performance

    // Kiểm tra có còn sản phẩm không
    const hasMore = skipNum + limitNum < total;

    return {
      EC: 0,
      EM: 'Lấy danh sách sản phẩm thành công',
      DT: {
        products,
        hasMore,
        total,
        currentCount: skipNum + products.length,
      },
    };
  } catch (error) {
    console.log('>>> Error in getProductsByCategoryService: ', error);
    return {
      EC: 1,
      EM: 'Lỗi khi lấy danh sách sản phẩm',
      DT: null,
    };
  }
};

// Lấy danh sách tất cả categories
const getCategoriesService = async () => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    return {
      EC: 0,
      EM: 'Lấy danh sách danh mục thành công',
      DT: categories,
    };
  } catch (error) {
    console.log('>>> Error in getCategoriesService: ', error);
    return {
      EC: 1,
      EM: 'Lỗi khi lấy danh sách danh mục',
      DT: null,
    };
  }
};

// Lấy tất cả sản phẩm (để sync vào Elasticsearch)
const getAllProductsService = async () => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    return products;
  } catch (error) {
    console.log('>>> Error in getAllProductsService: ', error);
    throw error;
  }
};

module.exports = {
  getProductsByCategoryService,
  getCategoriesService,
  getAllProductsService,
};

import React, { useState, useEffect, useCallback } from 'react';
import { searchProductsApi } from '../services/api';
import '../styles/ProductSearch.css';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    promotion: '',
    minViews: '',
    maxViews: '',
    sortBy: 'relevance',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'beauty',
    'toys',
    'food',
  ];

  const handleSearch = useCallback(
    async (page = 1, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          q: searchQuery,
          ...filters,
          page,
          limit: pagination.limit,
        };

        // Loại bỏ các field trống
        Object.keys(params).forEach((key) => {
          if (
            params[key] === '' ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const response = await searchProductsApi(params);

        if (response && response.EC === 0) {
          const newProducts = response.DT.products;

          if (isLoadMore) {
            // Lazy loading - thêm vào danh sách hiện tại
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            // Tìm kiếm mới - thay thế danh sách
            setProducts(newProducts);
          }

          setPagination((prev) => ({
            ...prev,
            page: response.DT.page,
            total: response.DT.total,
            totalPages: response.DT.totalPages,
          }));
        } else {
          // Xử lý lỗi hoặc response không hợp lệ
          console.warn('Search API error or invalid response:', response);
          setProducts([]);
          setPagination((prev) => ({
            ...prev,
            page: 1,
            total: 0,
            totalPages: 0,
          }));
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, filters, pagination.limit]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      promotion: '',
      minViews: '',
      maxViews: '',
      sortBy: 'relevance',
    });
    setProducts([]);
    setPagination({ ...pagination, page: 1 });
  };

  // Luôn gọi API search khi vào trang (hiển thị tất cả sản phẩm mặc định)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(1, false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, handleSearch]);

  // Lazy Loading - Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Nếu cuộn gần đến cuối trang (trong 200px)
      if (scrollTop + windowHeight >= documentHeight - 200) {
        // Và còn trang tiếp theo, không đang loading
        if (
          !loading &&
          !loadingMore &&
          pagination.page < pagination.totalPages &&
          products.length > 0
        ) {
          handleSearch(pagination.page + 1, true); // Load more
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, pagination, products.length, handleSearch]);

  return (
    <div className="product-search">
      <div className="search-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-row">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filters.promotion}
              onChange={(e) => handleFilterChange('promotion', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả sản phẩm</option>
              <option value="true">Có khuyến mãi</option>
              <option value="false">Không khuyến mãi</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="relevance">Liên quan nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="views_desc">Lượt xem nhiều nhất</option>
              <option value="name_asc">Tên A-Z</option>
            </select>
          </div>

          <div className="filter-row">
            <div className="price-range">
              <input
                type="number"
                placeholder="Giá từ"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="filter-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Giá đến"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="views-range">
              <input
                type="number"
                placeholder="Lượt xem từ"
                value={filters.minViews}
                onChange={(e) => handleFilterChange('minViews', e.target.value)}
                className="filter-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Lượt xem đến"
                value={filters.maxViews}
                onChange={(e) => handleFilterChange('maxViews', e.target.value)}
                className="filter-input"
              />
            </div>

            <button onClick={resetFilters} className="reset-btn">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="search-results">
        {loading && <div className="loading">Đang tìm kiếm...</div>}

        {!loading && products.length > 0 && (
          <>
            <div className="results-info">
              Tìm thấy {pagination.total} sản phẩm
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id || product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h3 className="product-name">
                      {product.highlight?.name ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: product.highlight.name[0],
                          }}
                        />
                      ) : (
                        product.name
                      )}
                    </h3>
                    <p className="product-description">
                      {product.highlight?.description ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: product.highlight.description[0],
                          }}
                        />
                      ) : (
                        product.description
                      )}
                    </p>
                    <div className="product-meta">
                      <span className="price">${product.price}</span>
                      <span className="category">{product.category}</span>
                      {product.promotion && (
                        <span className="promotion">🏷️ Khuyến mãi</span>
                      )}
                      <span className="views">👁️ {product.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading More indicator */}
            {loadingMore && (
              <div className="loading">Đang tải thêm sản phẩm...</div>
            )}

            {/* Info về lazy loading */}
            {pagination.page >= pagination.totalPages &&
              products.length > 0 && (
                <div className="no-more-results">
                  🎉 Bạn đã xem hết tất cả sản phẩm!
                </div>
              )}
          </>
        )}

        {!loading &&
          products.length === 0 &&
          (searchQuery ||
            Object.values(filters).some(
              (val) => val !== '' && val !== 'relevance'
            )) && (
            <div className="no-results">
              Không tìm thấy sản phẩm nào phù hợp
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductSearch;

import React from 'react';
import { Typography } from 'antd';
import ProductSearch from '../components/ProductSearch';

const { Title, Paragraph } = Typography;

const Products = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>Tìm kiếm sản phẩm</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Tìm kiếm nâng cao với Elasticsearch - Fuzzy Search & Lọc đa điều kiện
        </Paragraph>
      </div>

      {/* Product Search với Elasticsearch và Lazy Loading */}
      <ProductSearch />
    </div>
  );
};

export default Products;

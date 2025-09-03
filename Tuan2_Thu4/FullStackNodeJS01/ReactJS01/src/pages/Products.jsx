import React, { useState, useEffect, useCallback } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Button, 
    Typography, 
    Spin, 
    Empty, 
    Alert, 
    Tag,
    Space,
    Divider,
    Image
} from 'antd';
import { ShoppingCartOutlined, ReloadOutlined } from '@ant-design/icons';
import { getProductsByCategoryApi, getCategoriesApi } from '../services/api';
import { CATEGORY_LABELS, MESSAGES } from '../constants';
import { PAGINATION } from '../constants/config';
import { formatPrice } from '../utils/formatters';

const { Title, Text, Paragraph } = Typography;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    // Load products function
    const loadProducts = useCallback(async (skip = 0, isReset = false, category = null) => {
        if (loading) return;
        
        setLoading(true);
        setError('');
        
        try {
            const cat = category || selectedCategory;
            const response = await getProductsByCategoryApi(cat, skip, PAGINATION.DEFAULT_PAGE_SIZE);
            
            if (response?.EC === 0) {
                const newProducts = response.DT.products || [];
                const hasMoreData = response.DT.hasMore || false;
                
                setProducts(prev => isReset ? newProducts : [...prev, ...newProducts]);
                setHasMore(hasMoreData);
            } else {
                setError(response?.EM || MESSAGES.ERROR);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [loading, selectedCategory]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await getCategoriesApi();
            if (response?.EC === 0) {
                setCategories(response.DT || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCategories();
        loadProducts(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Category change effect
    useEffect(() => {
        if (selectedCategory) {
            setProducts([]);
            setHasMore(true);
            setError('');
            setInitialLoading(true);
            
            const timer = setTimeout(() => {
                loadProducts(0, true, selectedCategory);
            }, 100);
            
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    // Scroll detection for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            // Check if we're near the bottom of the page
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // If user scrolled to within 100px of the bottom
            if (scrollTop + windowHeight >= documentHeight - 100) {
                if (!loading && hasMore && products.length > 0) {
                    loadProducts(products.length, false);
                }
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore, products.length, loadProducts]); // Dependencies for the effect

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleRetry = () => {
        setProducts([]);
        setHasMore(true);
        setError('');
        setInitialLoading(true);
        loadProducts(0, true);
    };

    const getCategoryLabel = (category) => {
        return CATEGORY_LABELS[category] || category;
    };

    if (initialLoading) {
        return (
            <div style={{ padding: '50px 24px', textAlign: 'center' }}>
                <Spin size="large">
                    <div style={{ padding: '50px' }}>
                        <Text>{MESSAGES.LOADING}</Text>
                    </div>
                </Spin>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={1}>Danh sách sản phẩm</Title>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                    Khám phá các sản phẩm chất lượng với giá tốt nhất
                </Paragraph>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ marginRight: '16px' }}>Danh mục:</Text>
                <Space wrap>
                    <Tag
                        color={selectedCategory === 'all' ? 'blue' : 'default'}
                        style={{ cursor: 'pointer', padding: '4px 12px' }}
                        onClick={() => handleCategoryChange('all')}
                    >
                        Tất cả
                    </Tag>
                    {categories.map(category => (
                        <Tag
                            key={category}
                            color={selectedCategory === category ? 'blue' : 'default'}
                            style={{ cursor: 'pointer', padding: '4px 12px' }}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {getCategoryLabel(category)}
                        </Tag>
                    ))}
                </Space>
            </div>

            <Divider />

            {error && (
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button 
                            size="small" 
                            icon={<ReloadOutlined />}
                            onClick={handleRetry}
                        >
                            Thử lại
                        </Button>
                    }
                    style={{ marginBottom: '24px' }}
                />
            )}

            {/* Products Section */}
            <div style={{ marginBottom: '16px' }}>
                <Title level={3}>{getCategoryLabel(selectedCategory)}</Title>
                {products.length > 0 && (
                    <Text type="secondary">Hiển thị {products.length} sản phẩm</Text>
                )}
            </div>

            {products.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                            <Image
                                                alt={product.name}
                                                src={product.image}
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover' 
                                                }}
                                                preview={false}
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L2zMzOjMjIzNpRGZSaLvMxDDMwMCmQjDCxJKESGDCJEhAb0AhJ4FoJyEjjAhGQpqpWGmr/jlVvVW99fpn1z4fmpm4dO5959Y5b2zeZ1/33j/VAAAgAElEQVR4nO2dd4yVVd6A382MIypuYbOJSZkjJqaSWbKCm+7Uir2kJxaEz"
                                            />
                                        </div>
                                    }
                                    actions={[
                                        <Button 
                                            type="primary" 
                                            icon={<ShoppingCartOutlined />}
                                            size="small"
                                            key="cart"
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                    ]}
                                >
                                    <Card.Meta
                                        title={
                                            <div style={{ height: '44px', overflow: 'hidden' }}>
                                                <Text strong>{product.name}</Text>
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <Paragraph 
                                                    ellipsis={{ rows: 2 }}
                                                    style={{ marginBottom: '8px', height: '40px' }}
                                                >
                                                    {product.description}
                                                </Paragraph>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text 
                                                        strong 
                                                        style={{ 
                                                            color: '#f50',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                    <Tag color="blue">
                                                        {getCategoryLabel(product.category)}
                                                    </Tag>
                                                </div>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Còn lại: {product.stock}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Loading indicator when scrolling */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '24px' }}>
                            <Spin size="large">
                                <div style={{ padding: '20px' }}>
                                    <Text>{MESSAGES.LOADING_MORE}</Text>
                                </div>
                            </Spin>
                        </div>
                    )}

                    {!hasMore && products.length > 0 && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '24px',
                            background: '#f5f5f5',
                            borderRadius: '8px',
                            marginTop: '24px'
                        }}>
                            <Text>🎉 Bạn đã xem hết tất cả sản phẩm trong danh mục này!</Text>
                        </div>
                    )}
                </>
            ) : (
                !loading && (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có sản phẩm nào trong danh mục này"
                    />
                )
            )}
        </div>
    );
};

export default Products;

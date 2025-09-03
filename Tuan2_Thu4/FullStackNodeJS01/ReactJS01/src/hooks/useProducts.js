import { useState, useCallback } from 'react';
import { getProductsByCategoryApi } from '../services/api';

export const useProducts = (initialCategory = 'all') => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const loadProducts = useCallback(async (skip = 0, isReset = false, category = null) => {
        if (loading) return;
        
        setLoading(true);
        setError('');
        
        try {
            const cat = category || selectedCategory;
            const response = await getProductsByCategoryApi(cat, skip, 12);
            
            if (response?.EC === 0) {
                const newProducts = response.DT.products || [];
                const hasMoreData = response.DT.hasMore || false;
                
                setProducts(prev => isReset ? newProducts : [...prev, ...newProducts]);
                setHasMore(hasMoreData);
            } else {
                setError(response?.EM || 'Có lỗi xảy ra khi tải sản phẩm');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [loading, selectedCategory]);

    const changeCategory = useCallback((category) => {
        setSelectedCategory(category);
        setProducts([]);
        setHasMore(true);
        setError('');
    }, []);

    const retry = useCallback(() => {
        setProducts([]);
        setHasMore(true);
        setError('');
        loadProducts(0, true);
    }, [loadProducts]);

    return {
        products,
        loading,
        hasMore,
        error,
        selectedCategory,
        loadProducts,
        changeCategory,
        retry
    };
};

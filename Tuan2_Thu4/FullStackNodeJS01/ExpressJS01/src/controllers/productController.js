const { 
    getProductsByCategoryService, 
    getCategoriesService
} = require("../services/productService");

// Lấy sản phẩm theo category với lazy loading
const getProductsByCategory = async (req, res) => {
    try {
        const { category = 'all', skip = 0, limit = 12 } = req.query;
        
        const data = await getProductsByCategoryService(category, skip, limit);
        return res.status(200).json(data);
    } catch (error) {
        console.log(">>> Error in getProductsByCategory: ", error);
        return res.status(500).json({
            EC: 1,
            EM: "Internal server error",
            DT: null
        });
    }
};

// Lấy danh sách categories
const getCategories = async (req, res) => {
    try {
        const data = await getCategoriesService();
        return res.status(200).json(data);
    } catch (error) {
        console.log(">>> Error in getCategories: ", error);
        return res.status(500).json({
            EC: 1,
            EM: "Internal server error",
            DT: null
        });
    }
};

module.exports = {
    getProductsByCategory,
    getCategories
};

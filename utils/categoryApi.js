import instance from "../axios";

const CATEGORY_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_URL;

export const categoryApi = {
    // Get all categories
    getAll: async () => {
        try {
            const response = await instance.get(`${CATEGORY_BASE_URL}/categories`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get category by ID
    getById: async (id) => {
        try {
            const response = await instance.get(`${CATEGORY_BASE_URL}/category/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get category by name
    getByName: async (name) => {
        try {
            const response = await instance.get(`${CATEGORY_BASE_URL}/categories/name/${encodeURIComponent(name)}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get categories by status
    getByStatus: async (status) => {
        try {
            const response = await instance.get(`${CATEGORY_BASE_URL}/categories/status/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new category
    create: async (formData) => {
        try {
            const response = await instance.post(`${CATEGORY_BASE_URL}/category`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update category
    update: async (id, formData) => {
        try {
            const response = await instance.post(`${CATEGORY_BASE_URL}/category/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete category
    delete: async (id) => {
        try {
            const response = await instance.delete(`${CATEGORY_BASE_URL}/category/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Bulk delete categories
    bulkDelete: async (ids) => {
        try {
            const promises = ids.map(id => instance.delete(`${CATEGORY_BASE_URL}/category/${id}`));
            const responses = await Promise.all(promises);
            return responses.map(response => response.data);
        } catch (error) {
            throw error;
        }
    },
};

export default categoryApi; 
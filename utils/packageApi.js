import instance from "../axios";

const PACKAGE_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_URL;

export const packageApi = {

  getAll: async () => {
    try {
      const response = await instance.get(`${PACKAGE_BASE_URL}/packages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

 
  getById: async (id) => {
    try {
      const response = await instance.get(`${PACKAGE_BASE_URL}/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getByName: async (name) => {
    try {
      const response = await instance.get(`${PACKAGE_BASE_URL}/package/${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getByCategory: async (categoryId) => {
    try {
      const response = await instance.get(`${PACKAGE_BASE_URL}/packages/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  create: async (formData) => {
    try {
      const response = await instance.post(`${PACKAGE_BASE_URL}/packages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  update: async (id, formData) => {
    try {
      const response = await instance.post(`${PACKAGE_BASE_URL}/packages/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  delete: async (id) => {
    try {
      const response = await instance.delete(`${PACKAGE_BASE_URL}/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  bulkDelete: async (ids) => {
    try {
      const promises = ids.map(id =>
        instance.delete(`${PACKAGE_BASE_URL}/packages/${id}`)
      );
      const responses = await Promise.all(promises);
      return responses.map(res => res.data);
    } catch (error) {
      throw error;
    }
  },
};

export default packageApi;

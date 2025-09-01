import instance from "../axios";

const USER_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_URL;

export const userApi = {
  getAll: async () => {
    try {
      const res = await instance.get(`${USER_BASE_URL}/users`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

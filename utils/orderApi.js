// utils/ordersApi.js
import instance from "../axios";

const ORDER_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_URL;

export const ordersApi = {
  getAll: async () => {
    const response = await instance.get(`${ORDER_BASE_URL}/orders`);
    return response.data;
  },
  getById: async (id) => {
    const response = await instance.get(`${ORDER_BASE_URL}/orders/${id}`);
    return response.data;
  },
  getUserOrders: async () => {
    const response = await instance.get(`${ORDER_BASE_URL}/user/orders`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await instance.post(`${ORDER_BASE_URL}/orders`, orderData);
    return response.data;
  },
  initiatePayment: async (orderId, currency) => {
    const response = await instance.post(`${ORDER_BASE_URL}/orders/${orderId}/payment`, {
      order_id: orderId,
      currency: currency
    });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await instance.patch(`${ORDER_BASE_URL}/orders/${id}`, {
      order_status: status,
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await instance.delete(`${ORDER_BASE_URL}/orders/${id}`);
    return response.data;
  },
  getPublicById: async (id) => {
    const response = await instance.get(`${ORDER_BASE_URL}/order/public/${id}`);
    return response.data;
  },
  addManualPayment: async (orderId, paymentData) => {
    const response = await instance.post(`${ORDER_BASE_URL}/orders/manual-payment/${orderId}`, {
      ...paymentData
    });
    return response.data;
  },
};

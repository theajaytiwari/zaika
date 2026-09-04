import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

function message(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}

export const api = {
  async listFood(params = {}) {
    try { return (await client.get("/food", { params })).data.foodItems || []; }
    catch (error) { throw new Error(message(error, "Zaika API is unavailable.")); }
  },
  async restaurant(id) {
    try { return (await client.get(`/food/partner/${id}`)).data.foodPartner; }
    catch (error) { throw new Error(message(error)); }
  },
  async auth(kind, payload) {
    try { return (await client.post(`/auth/${kind}`, payload)).data; }
    catch (error) { throw new Error(message(error)); }
  },
  async logout(role) {
    await client.get(`/auth/${role === "partner" ? "food-partner" : "user"}/logout`);
  },
  async userProfile() { return (await client.get("/auth/user/me")).data.user; },
  async partnerProfile() { return (await client.get("/food/me")).data.foodPartner; },
  async publishDish(payload) { return (await client.post("/food", payload)).data.food; },
  async removeDish(id) { await client.delete(`/food/${id}`); },
  async like(id) { return (await client.post(`/food/${id}/like`)).data; },
  async cart() { return (await client.get("/cart")).data; },
  async addCartItem(foodId, quantity = 1) { return (await client.post("/cart/items", { foodId, quantity })).data; },
  async changeCartItem(foodId, quantity) { return (await client.patch(`/cart/items/${foodId}`, { quantity })).data; },
  async removeCartItem(foodId) { return (await client.delete(`/cart/items/${foodId}`)).data; },
  async placeOrder(payload) { return (await client.post("/orders", payload)).data.order; },
  async myOrders() { return (await client.get("/orders/mine")).data.orders || []; },
  async partnerOrders() { return (await client.get("/orders/partner")).data.orders || []; },
  async setOrderStatus(id, status) { return (await client.patch(`/orders/${id}/status`, { status })).data.order; },
};

export function isDatabaseId(value) {
  return /^[a-f\d]{24}$/i.test(String(value));
}

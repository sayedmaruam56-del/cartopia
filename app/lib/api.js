import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

// بيضيف الـ token تلقائي في كل request لو المستخدم مسجل دخول
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.token = token;
  }
  return config;
});

export default api;
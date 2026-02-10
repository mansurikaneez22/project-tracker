// pmDashboardApi.js
import api from "./api"; // use your configured axios instance

const API_BASE = "/api/v1/pm"; // baseURL already handled in api.js

export const getPMDashboard = async () => {
  const response = await api.get(`${API_BASE}/dashboard/summary`);
  return response.data;
};

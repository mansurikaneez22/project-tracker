// pmDashboardApi.js
import api from "./api"; 

const API_BASE = "/api/v1/pm"; 

export const getPMDashboard = async () => {
  const response = await api.get(`${API_BASE}/dashboard/summary`);
  return response.data;
};

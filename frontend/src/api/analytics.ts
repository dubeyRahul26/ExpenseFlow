
import api from "./axios";

export const fetchPersonalAnalytics = async () => {
  const res = await api.get("/analytics/personal");
  return res.data;
};

export const fetchMonthlyAnalytics = async () => {
  const res = await api.get("/analytics/monthly");
  return res.data;
};

export const fetchCategoryAnalytics = async () => {
  const res = await api.get("/analytics/categories");
  return res.data;
};

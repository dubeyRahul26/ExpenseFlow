import api from "../api/axios";

export const searchUsers = async (query: string) => {
  const res = await api.get(`/users/search?q=${query}`);
  return res.data;
};

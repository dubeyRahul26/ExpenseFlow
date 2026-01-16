import api from "./axios";

export const settleUp = async (data: {
  groupId: string;
  receiverId: string;
  amount: number;
}) => {
  const res = await api.post("/groups/settle", data);
  return res.data;
};

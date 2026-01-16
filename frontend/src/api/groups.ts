import api from "./axios";

export interface Group {
  _id: string;
  name: string;
}

export interface GroupBalance {
  [userId: string]: number;
}

export const fetchGroups = async (): Promise<Group[]> => {
  const res = await api.get("/groups");
  return res.data;
};

export const fetchGroupBalances = async (
  groupId: string
): Promise<{ balances: GroupBalance }> => {
  const res = await api.get(`/groups/${groupId}/balances`);
  return res.data;
};

export const addGroupExpense = async (groupId: string, data: any) => {
  const res = await api.post(`/groups/${groupId}/expenses`, data);
  return res.data;
};

export const createGroup = async (data: {
  name: string;
  members: string[];
}) => {
  const res = await api.post("/groups", data);
  return res.data;
};

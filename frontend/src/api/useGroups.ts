import { useQuery } from "@tanstack/react-query";
import { fetchGroups, fetchGroupBalances } from "./groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGroupExpense, createGroup } from "./groups";
import { useAuth } from "../context/AuthContext";

/* ================= GROUPS ================= */

export const useGroups = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["groups", userId],   
    queryFn: fetchGroups,
    enabled: !!userId            
  });
};

/* ================= BALANCES ================= */

export const useGroupBalances = (groupId?: string) => {
  return useQuery({
    queryKey: ["group-balances", groupId],
    queryFn: () => fetchGroupBalances(groupId!),
    enabled: !!groupId
  });
};

/* ================= ADD EXPENSE ================= */

export const useAddGroupExpense = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addGroupExpense(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-balances", groupId]
      });
    }
  });
};

/* ================= CREATE GROUP ================= */

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  });
};

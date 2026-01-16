// import { useQuery } from "@tanstack/react-query";
// import { fetchGroups, fetchGroupBalances } from "./groups";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { addGroupExpense } from "./groups";
// import { createGroup } from "./groups";

// export const useGroups = () => {
//   return useQuery({
//     queryKey: ["groups"],
//     queryFn: fetchGroups
//   });
// };

// export const useGroupBalances = (groupId?: string) => {
//   return useQuery({
//     queryKey: ["group-balances", groupId],
//     queryFn: () => fetchGroupBalances(groupId!),
//     enabled: !!groupId
//   });
// };

// export const useAddGroupExpense = (groupId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: any) => addGroupExpense(groupId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["group-balances", groupId]
//       });
//     }
//   });
// };

// export const useCreateGroup = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createGroup,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["groups"] });
//     }
//   });
// };


import { useQuery } from "@tanstack/react-query";
import { fetchGroups, fetchGroupBalances } from "./groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGroupExpense, createGroup } from "./groups";
import { useAuth } from "../context/AuthContext";

/* ================= GROUPS ================= */

export const useGroups = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["groups", userId],   // 🔑 USER-SCOPED CACHE
    queryFn: fetchGroups,
    enabled: !!userId               // don’t run when logged out
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

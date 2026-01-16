import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settleUp } from "./settlements";

export const useSettleUp = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settleUp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-balances", groupId]
      });
    }
  });
};

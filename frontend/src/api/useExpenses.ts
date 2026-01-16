import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {
  fetchExpenses,
  createExpense
} from "./expenses";

export const useExpenses = () =>
  useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses
  });

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"]
      });
    }
  });
};

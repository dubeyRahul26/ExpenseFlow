import axios from "../api/axios";
import { useQuery } from "@tanstack/react-query";

const GroupTransactions = ({ groupId }: { groupId: string }) => {
  const { data } = useQuery({
    queryKey: ["group-transactions", groupId],
    queryFn: async () => {
      const res = await axios.get(`/transactions/group/${groupId}`);
      return res.data;
    },
  });

  return (
    <div className="rounded-xl bg-slate-900/70 backdrop-blur
                    border border-slate-800 p-4 shadow-lg">
      <h2 className="font-semibold mb-3 text-slate-100">
        Transaction History
      </h2>

      {!data || data.length === 0 ? (
        <p className="text-sm text-slate-400">
          No settlements yet
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 text-sm">
          {data.map((tx: any) => (
            <div
              key={tx._id}
              className="text-slate-100"
            >
              {tx.payer.name} → {tx.receiver.name} ₹{tx.amount}{" "}
              <span className="text-slate-400">
                ({tx.method})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupTransactions;

import axios from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { formatMoney } from "../utils/money";
import { useState, useEffect } from "react";

const PendingSettlements = ({ onUpdated }: { onUpdated: () => void }) => {
  const { data = [] } = useQuery({
    queryKey: ["pending-settlements"],
    queryFn: async () => {
      const res = await axios.get("/transactions/pending");
      return res.data;
    },
  });

  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    setHiddenIds([]);
  }, [data]);

  const visibleTxs = data.filter(
    (tx: any) => !hiddenIds.includes(tx._id)
  );

  if (visibleTxs.length === 0) return null;

  return (
    <div className="rounded-xl bg-slate-900/70 backdrop-blur
                    border border-slate-800 p-4 space-y-3 shadow-lg">
      <h2 className="font-semibold text-slate-100">
        Pending Settlements
      </h2>

      {visibleTxs.map((tx: any) => (
        <div
          key={tx._id}
          className="flex justify-between items-center text-sm"
        >
          <div>
            <p className="text-slate-100">
              <b>{tx.payer.name}</b> paid you ₹
              {formatMoney(tx.amount)}
            </p>
            <p className="text-xs text-slate-400">
              Group: {tx.group.name}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                setHiddenIds((prev) => [...prev, tx._id]);
                await axios.post("/transactions/confirm", {
                  transactionId: tx._id,
                });
                onUpdated();
              }}
              className="text-emerald-400 text-xs font-medium
                         hover:text-emerald-300 transition"
            >
              Confirm
            </button>

            <button
              onClick={async () => {
                setHiddenIds((prev) => [...prev, tx._id]);
                await axios.post("/transactions/reject", {
                  transactionId: tx._id,
                });
                onUpdated();
              }}
              className="text-rose-400 text-xs font-medium
                         hover:text-rose-300 transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingSettlements;

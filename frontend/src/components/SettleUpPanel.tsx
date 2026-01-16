import { useState } from "react";
import axios from "../api/axios";

interface BalanceUser {
  userId: string;
  name: string;
  amount: number;
}

interface Props {
  groupId: string;
  balances: BalanceUser[];
  currentUserId: string;
  onUpdated: () => void;
}

const SettleUpPanel = ({
  groupId,
  balances,
  currentUserId,
  onUpdated
}: Props) => {
  const [receiver, setReceiver] = useState<BalanceUser | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"UPI" | "CASH" | "BANK">("UPI");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!receiver || !amount) return;

    setLoading(true);
    try {
      await axios.post("/transactions/settle", {
        groupId,
        receiverId: receiver.userId,
        amount: Number(amount),
        method
      });

      setReceiver(null);
      setAmount("");
      onUpdated();
    } catch {
      alert("Failed to create settlement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/70 backdrop-blur
                    border border-slate-800 p-4 space-y-4 shadow-lg">
      <h2 className="font-semibold text-slate-100">
        Settle Up
      </h2>

      {/* OWE MESSAGE */}
      {balances.some(
        b => b.amount < 0 && b.userId === currentUserId
      ) && (
        <p className="text-sm text-slate-400">
          You owe money. Select a person below to pay.
        </p>
      )}

      {/* PAYABLE USERS */}
      <div className="space-y-2">
        {balances
          .filter(
            b => b.amount > 0 && currentUserId !== b.userId
          )
          .map(user => (
            <div
              key={user.userId}
              className="flex justify-between items-center
                         rounded-lg px-3 py-2
                         bg-slate-800/60"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">
                  Gets back ₹{user.amount}
                </p>
              </div>

              <button
                onClick={() => setReceiver(user)}
                className="text-sm font-medium
                           text-indigo-400 hover:text-indigo-300 transition"
              >
                Pay
              </button>
            </div>
          ))}
      </div>

      {/* PAYMENT PANEL */}
      {receiver && (
        <div className="mt-4 rounded-lg p-4 space-y-3
                        bg-slate-950 border border-slate-800">
          <p className="text-sm text-slate-100">
            Pay <strong>{receiver.name}</strong>
          </p>

          <input
            type="number"
            max={receiver.amount}
            placeholder="Amount"
            className="w-full rounded-lg p-2.5 text-sm
                       bg-slate-800 text-slate-100
                       border border-slate-700
                       placeholder-slate-400
                       focus:outline-none focus:ring-2
                       focus:ring-indigo-500"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <select
            className="w-full rounded-lg p-2.5 text-sm
                       bg-slate-800 text-slate-100
                       border border-slate-700
                       focus:outline-none focus:ring-2
                       focus:ring-indigo-500"
            value={method}
            onChange={e => setMethod(e.target.value as any)}
          >
            <option value="UPI" className="bg-slate-900">
              UPI
            </option>
            <option value="CASH" className="bg-slate-900">
              Cash
            </option>
            <option value="BANK" className="bg-slate-900">
              Bank Transfer
            </option>
          </select>

          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={handlePay}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         text-white bg-linear-to-r
                         from-indigo-500 to-violet-500
                         hover:from-indigo-600 hover:to-violet-600
                         disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "I’ve Paid"}
            </button>

            <button
              onClick={() => setReceiver(null)}
              className="px-4 py-2 rounded-lg text-sm
                         border border-slate-700
                         text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-slate-400">
             Mark only after paying externally.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettleUpPanel;

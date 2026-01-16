import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface BalanceUser {
  userId: string;
  name: string;
  amount: number;
}

interface Props {
  balances: BalanceUser[];
  groupId: string;
  onUpdated: () => void;
}

interface LocalPending {
  fromId: string;
  toId: string;
  amount: number;
}

const SettleSuggestions = ({ balances, groupId, onUpdated }: Props) => {
  const { userId } = useAuth();
  const [localPending, setLocalPending] = useState<LocalPending[]>([]);

  const balancesSignature = JSON.stringify(
    balances.map((b) => ({
      userId: b.userId,
      amount: b.amount,
    }))
  );

  const [prevSignature, setPrevSignature] = useState(balancesSignature);

  useEffect(() => {
    if (prevSignature !== balancesSignature) {
      setLocalPending([]);
      setPrevSignature(balancesSignature);
    }
  }, [balancesSignature, prevSignature]);

  const debtors = balances
    .filter((b) => b.amount < 0)
    .map((b) => ({
      userId: b.userId,
      name: b.name,
      amount: Math.abs(b.amount),
    }));

  const creditors = balances
    .filter((b) => b.amount > 0)
    .map((b) => ({
      userId: b.userId,
      name: b.name,
      amount: b.amount,
    }));

  const suggestions: any[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);

    suggestions.push({
      fromId: debtors[i].userId,
      from: debtors[i].name,
      toId: creditors[j].userId,
      to: creditors[j].name,
      amount: pay,
    });

    debtors[i].amount -= pay;
    creditors[j].amount -= pay;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900/70 backdrop-blur
                      border border-slate-800 p-4 shadow-lg">
        <h2 className="font-semibold text-slate-100 mb-2">
          Settle Suggestions
        </h2>
        <p className="text-sm text-slate-400">
          No settlements needed 
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900/70 backdrop-blur
                    border border-slate-800 p-4 space-y-3 shadow-lg">
      <h2 className="font-semibold text-slate-100">
        Settle Suggestions
      </h2>

      {suggestions.map((s, idx) => {
        const isMine = userId === s.fromId;
        const isLocallyPending = localPending.some(
          (p) =>
            p.fromId === s.fromId &&
            p.toId === s.toId &&
            p.amount === s.amount
        );

        return (
          <div
            key={idx}
            className="flex justify-between items-center text-sm"
          >
            <div>
              <p className="text-slate-100">
                <strong>{s.from}</strong> →{" "}
                <strong>{s.to}</strong>
              </p>
              <p className="text-xs text-slate-400">
                ₹{s.amount}
              </p>
            </div>

            {isMine &&
              (isLocallyPending ? (
                <span className="text-xs text-yellow-400 font-medium">
                   Waiting
                </span>
              ) : (
                <button
                  onClick={async () => {
                    setLocalPending((prev) => [
                      ...prev,
                      {
                        fromId: s.fromId,
                        toId: s.toId,
                        amount: s.amount,
                      },
                    ]);

                    try {
                      await axios.post("/transactions/create", {
                        groupId,
                        receiverId: s.toId,
                        amount: s.amount,
                        method: "UPI",
                      });

                      onUpdated();
                    } catch {
                      setLocalPending((prev) =>
                        prev.filter(
                          (p) =>
                            !(
                              p.fromId === s.fromId &&
                              p.toId === s.toId &&
                              p.amount === s.amount
                            )
                        )
                      );
                    }
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-medium
                             text-white bg-linear-to-r
                             from-indigo-500 to-violet-500
                             hover:from-indigo-600 hover:to-violet-600
                             transition"
                >
                  Mark as Paid
                </button>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default SettleSuggestions;

import { useEffect, useState } from "react";
import {
  useGroups,
  useGroupBalances,
  useAddGroupExpense,
  useCreateGroup,
} from "../api/useGroups";
import UserMultiSelect from "../components/UserMultiSelect";
import PendingSettlements from "../components/PendingSettlements";
import SettleSuggestions from "../components/SettleSuggestions";
import GroupTransactions from "../components/GroupTransactions";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

/* ================= TYPES ================= */

interface SelectedUser {
  _id: string;
  name: string;
  email: string;
}

interface BalanceUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  amount: number;
}

interface GroupBalanceData {
  balances: BalanceUser[];
}

/* ========================================= */

const Groups = () => {
  const { data: groups } = useGroups();
  const createGroup = useCreateGroup();

  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [showCreate, setShowCreate] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<SelectedUser[]>([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (groups?.length && !selectedGroupId) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId]);

  const { data: balanceData, refetch: refetchBalances } = useGroupBalances(
    selectedGroupId
  ) as { data?: GroupBalanceData; refetch: () => void };

  const addExpense = useAddGroupExpense(selectedGroupId || "");

  const handleCreateGroup = () => {
    if (!groupName) return;

    createGroup.mutate({
      name: groupName,
      members: members.map((u) => u.email),
    });

    setGroupName("");
    setMembers([]);
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-2xl font-bold text-slate-100">Groups</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT: GROUP LIST ================= */}
        <div
          className="rounded-xl bg-slate-900/70 backdrop-blur
                        border border-slate-800 shadow-lg"
        >
          <div
            className="p-4 border-b border-slate-800
                          flex justify-between items-center"
          >
            <span className="font-semibold text-slate-100">Your Groups</span>
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="text-sm font-medium
                         text-indigo-400 hover:text-indigo-300 transition"
            >
              + Create
            </button>
          </div>

          {showCreate && (
            <div className="p-4 space-y-3 border-b border-slate-800">
              <input
                className="w-full rounded-lg p-2.5 text-sm
                           bg-slate-800 text-slate-100
                           border border-slate-700
                           placeholder-slate-400
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <UserMultiSelect selected={members} onChange={setMembers} />

              <button
                onClick={handleCreateGroup}
                className="w-full py-2 rounded-lg text-sm font-medium
                           text-white bg-linear-to-r
                           from-indigo-500 to-violet-500
                           hover:from-indigo-600 hover:to-violet-600
                           transition"
              >
                Create Group
              </button>
            </div>
          )}

          <div className="max-h-105 overflow-y-auto">
            {groups?.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedGroupId(group._id)}
                className={`w-full text-left px-4 py-3 text-sm transition
                  ${
                    selectedGroupId === group._id
                      ? "bg-indigo-500/10 text-indigo-300 font-medium"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT: GROUP DETAILS ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* GROUP SUMMARY */}
          {balanceData && (
            <div
              className="rounded-xl bg-slate-900/70 backdrop-blur
                            border border-slate-800 p-4 shadow-lg"
            >
              <h3 className="font-semibold text-slate-100 mb-3">
                Group Summary
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Members</p>
                  <p className="font-medium text-slate-100">
                    {balanceData.balances.length}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Total Owed</p>
                  <p className="font-medium text-rose-400">
                    ₹
                    {balanceData.balances
                      .filter((b) => b.amount < 0)
                      .reduce((s, b) => s + Math.abs(b.amount), 0)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Total Receivable</p>
                  <p className="font-medium text-emerald-400">
                    ₹
                    {balanceData.balances
                      .filter((b) => b.amount > 0)
                      .reduce((s, b) => s + b.amount, 0)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Net Check</p>

                  {Math.abs(
                    balanceData.balances.reduce((s, b) => s + b.amount, 0)
                  ) < 0.01 ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={16} strokeWidth={2} />
                      <span className="font-medium">Balanced</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle size={16} strokeWidth={2} />
                      <span className="font-medium">Mismatch</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BALANCES */}
          <div
            className="rounded-xl bg-slate-900/70 backdrop-blur
                          border border-slate-800 p-4 shadow-lg"
          >
            <h2 className="font-semibold mb-3 text-slate-100">Balances</h2>

            {!balanceData && (
              <p className="text-slate-400 text-sm">
                Select a group to view balances
              </p>
            )}

            {balanceData &&
              balanceData.balances.map((user) => {
                const isOwed = user.amount > 0;
                const owes = user.amount < 0;

                return (
                  <div
                    key={user.userId}
                    className="flex justify-between items-center
                               py-2 text-sm border-b border-slate-800
                               last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-100">
                        {user.name}
                        {user.userId === user?.id && " (You)"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {isOwed ? "Gets back" : owes ? "Owes" : "Settled"}
                      </p>
                    </div>

                    <span
                      className={`font-semibold ${
                        isOwed
                          ? "text-emerald-400"
                          : owes
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {user.amount > 0 && "+"}₹{user.amount}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* PENDING SETTLEMENTS */}
          <PendingSettlements onUpdated={refetchBalances} />

          {balanceData && selectedGroupId && (
            <SettleSuggestions
              balances={balanceData.balances}
              groupId={selectedGroupId}
              onUpdated={refetchBalances}
            />
          )}

          {/* TRANSACTION HISTORY */}
          {selectedGroupId && <GroupTransactions groupId={selectedGroupId} />}

          {/* ADD GROUP EXPENSE */}
          {selectedGroupId && (
            <div
              className="rounded-xl bg-slate-900/70 backdrop-blur
                            border border-slate-800 p-4 space-y-3 shadow-lg"
            >
              <h2 className="font-semibold text-slate-100">
                Add Group Expense
              </h2>

              <input
                type="number"
                min="0"
                className="w-full rounded-lg p-3 text-sm
                           bg-slate-800 text-slate-100
                           border border-slate-700
                           placeholder-slate-400
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                onClick={() => {
                  addExpense.mutate({
                    amount: Number(amount),
                    splitType: "equal",
                  });
                  setAmount("");
                }}
                className="px-5 py-2 rounded-lg text-sm font-medium
                           text-white bg-linear-to-r
                           from-indigo-500 to-violet-500
                           hover:from-indigo-600 hover:to-violet-600
                           transition"
              >
                Add Expense (Equal Split)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;

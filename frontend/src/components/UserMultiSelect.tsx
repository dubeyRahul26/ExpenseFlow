import { useEffect, useRef, useState } from "react";
import { searchUsers } from "../api/users";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  selected: User[];
  onChange: (users: User[]) => void;
}

const DEBOUNCE_DELAY = 400;

const UserMultiSelect = ({ selected, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const users = await searchUsers(query.trim());
        setResults(users);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const addUser = (user: User) => {
    if (!selected.some((u) => u._id === user._id)) {
      onChange([...selected, user]);
    }
    setQuery("");
    setResults([]);
  };

  const removeUser = (id: string) => {
    onChange(selected.filter((u) => u._id !== id));
  };

  return (
    <div className="space-y-2">
      {/* Selected users */}
      <div className="flex flex-wrap gap-2">
        {selected.map((user) => (
          <span
            key={user._id}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm
                       bg-indigo-500/10 text-indigo-300
                       border border-indigo-500/20"
          >
            {user.name}
            <button
              onClick={() => removeUser(user._id)}
              className="text-xs text-slate-400 hover:text-rose-400 transition"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type name or email…"
        className="w-full rounded-lg p-3 text-sm
                   bg-slate-800 text-slate-100
                   border border-slate-700
                   placeholder-slate-400
                   focus:outline-none focus:ring-2
                   focus:ring-indigo-500"
      />

      {/* Dropdown */}
      {query && (
        <div className="rounded-lg bg-slate-900
                        border border-slate-800 shadow-lg
                        max-h-48 overflow-y-auto">
          {loading && (
            <p className="p-3 text-sm text-slate-400">
              Searching…
            </p>
          )}

          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-slate-400">
              No users found
            </p>
          )}

          {!loading &&
            results.map((user) => (
              <button
                key={user._id}
                onClick={() => addUser(user)}
                className="w-full text-left px-4 py-2
                           hover:bg-slate-800/60 transition"
              >
                <p className="font-medium text-slate-100">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserMultiSelect;

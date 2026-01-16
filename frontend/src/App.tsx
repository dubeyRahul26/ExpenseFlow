import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";

function App() {
  const { ready } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;


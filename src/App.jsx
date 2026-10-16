import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrompterView from "./components/PrompterView.jsx";

// Painel Administrativo temporário
const AdminPanel = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      <Link
        to="/prompter"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
      >
        Abrir Teleprompter →
      </Link>
    </div>
    <p className="text-gray-600 mb-4">Aqui entrará o Editor TipTap e a lista de roteiros.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Renderiza o PrompterView na tela principal para teste imediato e na rota dedicada */}
        <Route path="/" element={<PrompterView />} />
        <Route path="/prompter" element={<PrompterView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;

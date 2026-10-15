import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes temporários (vamos separá-los em pastas depois)
const AdminPanel = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
    <p>Aqui entrará o Editor TipTap e a lista de roteiros.</p>
  </div>
);

const PrompterScreen = () => (
  <div className="bg-black text-white min-h-screen flex items-center justify-center">
    <h1 className="text-4xl">Tela do Teleprompter (Alto Contraste)</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
        <Route path="/prompter" element={<PrompterScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

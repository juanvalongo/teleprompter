import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TeleprompterView from "./components/TeleprompterView"; // Certifique-se de que o arquivo está nesta pasta

// Componente temporário para o painel de administração
const AdminPanel = () => (
  <div className="p-8 bg-zinc-950 min-h-screen text-zinc-200">
    <h1 className="text-3xl font-bold mb-6 text-white">
      Painel Administrativo
    </h1>
    <p className="mb-8 text-zinc-400">
      Esta tela receberá o CRUD e o Editor TipTap em breve.
    </p>

    <Link
      to="/prompter"
      className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
    >
      Abrir Tela do Teleprompter
    </Link>
  </div>
);

// Rota do Prompter passando as funções base exigidas pelo componente
const PrompterRoute = () => {
  return (
    <TeleprompterView
      script={{}} // Passamos vazio para ele usar o texto de demonstração padrão
      onEndPresentation={() => (window.location.href = "/admin")}
      onOpenSecondScreen={() =>
        alert("Modo 2ª tela será implementado em breve!")
      }
    />
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/prompter" element={<PrompterRoute />} />
      </Routes>
    </Router>
  );
}

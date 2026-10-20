import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import TeleprompterView from './components/TeleprompterView';
import { ScriptEditorView } from './components/ScriptEditorView';
import { ScriptsListView } from './components/ScriptsListView';
import { SecondScreenModal } from './components/SecondScreenModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ScreenNavigatorModal } from './components/ScreenNavigatorModal';
import { AiMonitoringView } from './components/AiMonitoringView';
import { SettingsView } from './components/SettingsView';
import {
  fetchScripts,
  createScriptApi,
  updateScriptApi,
  deleteScriptApi,
} from './services/scriptsApi';
import { Check, Trash2, Edit3, Plus, AlertCircle } from 'lucide-react';

export default function App() {
  const [scripts, setScripts] = useState([]);
  const [activeScript, setActiveScript] = useState(null);

  const [activeScreen, setActiveScreen] = useState(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'editor') return 'editor';
    if (hash === 'roteiros' || hash === 'scripts') return 'scripts';
    if (hash === 'monitoramento' || hash === 'monitoring') return 'monitoring';
    if (hash === 'configuracoes' || hash === 'settings') return 'settings';
    return 'teleprompter';
  });

  const [isSecondScreenOpen, setIsSecondScreenOpen] = useState(() => {
    return window.location.hash.toLowerCase().includes('segunda-tela');
  });
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isScreenGalleryOpen, setIsScreenGalleryOpen] = useState(() => {
    return window.location.hash.toLowerCase().includes('navegador');
  });

  const [studioConfig, setStudioConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('orato_studio_config');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn(err);
    }
    return {
      microphone: 'Microfone Shure SM7B (Interface USB)',
      audioSampleRate: '48 kHz · SYNC',
      defaultWpm: 140,
      fontSize: 48,
      highContrast: true,
      operatorName: 'Operador Chefe',
      studioName: 'Estúdio Principal 01',
      mirrorMode: false,
      autoScrollEnabled: true,
    };
  });

  const [toast, setToast] = useState({
    visible: false,
    text: '',
    icon: 'check',
  });

  const showToast = useCallback((text, icon = 'check') => {
    setToast({ visible: true, text, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  }, []);

  useEffect(() => {
    let active = true;
    fetchScripts()
      .then((data) => {
        if (!active) return;
        setScripts(data);
        setActiveScript((prev) => prev || data[0] || null);
      })
      .catch((err) => {
        console.warn(err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'editor') setActiveScreen('editor');
      else if (hash === 'roteiros' || hash === 'scripts') setActiveScreen('scripts');
      else if (hash === 'monitoramento' || hash === 'monitoring') setActiveScreen('monitoring');
      else if (hash === 'configuracoes' || hash === 'settings') setActiveScreen('settings');
      else if (hash === 'apresentacao' || hash === 'teleprompter') setActiveScreen('teleprompter');
      else if (hash === 'segunda-tela') setIsSecondScreenOpen(true);
      else if (hash === 'navegador') setIsScreenGalleryOpen(true);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (screen) => {
    setActiveScreen(screen);
    const hashMap = {
      teleprompter: 'apresentacao',
      editor: 'editor',
      scripts: 'roteiros',
      monitoring: 'monitoramento',
      settings: 'configuracoes',
    };
    window.location.hash = hashMap[screen];
  };

  useEffect(() => {
    try {
      localStorage.setItem('orato_studio_config', JSON.stringify(studioConfig));
    } catch (err) {
      console.warn(err);
    }
  }, [studioConfig]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setIsSecondScreenOpen(false);
        setIsShortcutsOpen(false);
        setIsScreenGalleryOpen(false);
      } else if (e.key === '2') {
        setIsSecondScreenOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        navigateTo('editor');
      } else if (e.key === 'r' || e.key === 'R') {
        navigateTo('scripts');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveScript = async (updatedScript) => {
    try {
      let saved;
      if (updatedScript.isNew || !updatedScript.id) {
        saved = await createScriptApi({
          title: updatedScript.title,
          content: updatedScript.content,
        });
        setScripts((prev) => [saved, ...prev.filter((s) => s.id !== saved.id)]);
      } else {
        saved = await updateScriptApi(updatedScript.id, {
          title: updatedScript.title,
          content: updatedScript.content,
        });
        setScripts((prev) =>
          prev.some((s) => s.id === saved.id)
            ? prev.map((s) => (s.id === saved.id ? saved : s))
            : [saved, ...prev]
        );
      }

      const merged = {
        ...saved,
        plainText: updatedScript.plainText || saved.plainText,
        wordCount: updatedScript.wordCount ?? saved.wordCount,
        estimatedMinutes: updatedScript.estimatedMinutes ?? saved.estimatedMinutes,
        isNew: false,
      };

      setActiveScript(merged);
      showToast(`Roteiro "${merged.title}" salvo com sucesso`, 'check');
      return merged;
    } catch (err) {
      showToast(`Erro ao salvar: ${err.message}`, 'alert');
      return null;
    }
  };

  const handleDeleteScript = async (scriptId) => {
    try {
      if (scriptId) {
        await deleteScriptApi(scriptId);
      }
      setScripts((prev) => {
        const remaining = prev.filter((s) => s.id !== scriptId);
        if (activeScript?.id === scriptId) {
          setActiveScript(remaining[0] || null);
        }
        return remaining;
      });
      navigateTo('scripts');
      showToast('Roteiro excluído', 'trash');
    } catch (err) {
      showToast(`Erro ao excluir: ${err.message}`, 'alert');
    }
  };

  const handleCreateNewScript = async () => {
    try {
      const created = await createScriptApi({
        title: 'Novo Roteiro de Estúdio',
        content: `<p class="mb-4"><strong>Insira aqui a fala de abertura do apresentador.</strong> O algoritmo do Orato Estúdio acompanhará a sua fala em tempo real.</p><p>Digite os parágrafos subsequentes com clareza. Use o botão de destaque para termos chave.</p>`,
      });
      setScripts((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
      setActiveScript(created);
      navigateTo('editor');
      showToast('Novo roteiro criado no editor', 'plus');
    } catch (err) {
      showToast(`Erro ao criar roteiro: ${err.message}`, 'alert');
    }
  };

  const handleSelectScriptToPresent = (script) => {
    setActiveScript(script);
    navigateTo('teleprompter');
    showToast(`Iniciando teleprompter: ${script.title}`, 'check');
  };

  const handleEditScript = (script) => {
    setActiveScript(script);
    navigateTo('editor');
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-[#F8FAFC] font-sans antialiased selection:bg-[#EF4444] selection:text-[#FFFFFF]">
      <Header
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        onNewScript={handleCreateNewScript}
        onOpenSecondScreen={() => setIsSecondScreenOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenScreenGallery={() => setIsScreenGalleryOpen(true)}
        studioConfig={studioConfig}
        scriptsCount={scripts.length}
      />

      <main className="relative min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeScreen === 'teleprompter' && (
          <TeleprompterView
            key={activeScript?.id || 'empty'}
            script={activeScript || {}}
            onEndPresentation={() => navigateTo('scripts')}
            onOpenSecondScreen={() => setIsSecondScreenOpen(true)}
          />
        )}

        {activeScreen === 'editor' && (
          <ScriptEditorView
            key={activeScript?.id || 'draft'}
            script={
              activeScript || {
                title: 'Novo Roteiro de Estúdio',
                content: `<p class="mb-4"><strong>Insira aqui a fala de abertura do apresentador.</strong> O algoritmo do Orato Estúdio acompanhará a sua fala em tempo real.</p><p>Digite os parágrafos subsequentes com clareza. Use o botão de destaque para termos chave.</p>`,
                isNew: true,
              }
            }
            onSave={handleSaveScript}
            onDelete={handleDeleteScript}
            onCancel={() => navigateTo('scripts')}
            onStartPresentation={async (s) => {
              const saved = await handleSaveScript(s);
              setActiveScript(saved || s);
              navigateTo('teleprompter');
            }}
          />
        )}

        {activeScreen === 'scripts' && (
          <ScriptsListView
            scripts={scripts}
            onSelectScriptToPresent={handleSelectScriptToPresent}
            onEditScript={handleEditScript}
            onDeleteScript={handleDeleteScript}
            onNewScript={handleCreateNewScript}
            showToast={showToast}
          />
        )}

        {activeScreen === 'monitoring' && <AiMonitoringView />}

        {activeScreen === 'settings' && (
          <SettingsView
            config={studioConfig}
            onSaveConfig={(newConfig) => setStudioConfig(newConfig)}
            showToast={showToast}
          />
        )}
      </main>

      <SecondScreenModal
        isOpen={isSecondScreenOpen}
        onClose={() => setIsSecondScreenOpen(false)}
        script={activeScript}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ScreenNavigatorModal
        isOpen={isScreenGalleryOpen}
        onClose={() => setIsScreenGalleryOpen(false)}
        onNavigate={navigateTo}
        onOpenSecondScreen={() => setIsSecondScreenOpen(true)}
      />

      <div
        className={`fixed bottom-6 right-6 bg-[#181C26] text-[#F8FAFC] px-4 py-2.5 rounded-2xl shadow-2xl border border-[#2D3546] flex items-center gap-2.5 transition-all duration-300 z-50 ${
          toast.visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {toast.icon === 'trash' ? (
          <Trash2 className="w-4 h-4 text-[#EF4444]" />
        ) : toast.icon === 'alert' ? (
          <AlertCircle className="w-4 h-4 text-[#EF4444]" />
        ) : toast.icon === 'edit' ? (
          <Edit3 className="w-4 h-4 text-[#FACC15]" />
        ) : toast.icon === 'plus' ? (
          <Plus className="w-4 h-4 text-[#FACC15]" />
        ) : (
          <Check className="w-4 h-4 text-[#FACC15]" />
        )}
        <span className="text-xs font-semibold">{toast.text}</span>
      </div>
    </div>
  );
}

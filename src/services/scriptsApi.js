const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const USER_SCRIPTS_STORAGE_KEY = 'teleprompter_user_scripts_v1';

export function stripHtmlToPlainText(htmlOrText = '') {
  if (!htmlOrText) return '';
  return htmlOrText
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function calculateWordCount(text = '') {
  const clean = stripHtmlToPlainText(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

export function formatRelativeDate(isoOrLabel) {
  if (!isoOrLabel) return 'Agora mesmo';
  const parsed = Date.parse(isoOrLabel);
  if (Number.isNaN(parsed)) return isoOrLabel;
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(parsed));
  } catch {
    return isoOrLabel;
  }
}

export function normalizeScript(doc) {
  if (!doc) return null;
  const id = doc._id || doc.id;
  const title = doc.title || 'Roteiro Sem Título';
  const content = doc.content ?? '';
  const plainText = doc.plainText ?? stripHtmlToPlainText(content);
  const wordCount = doc.wordCount ?? calculateWordCount(plainText || content);
  const estimatedMinutes = doc.estimatedMinutes ?? Math.max(1, Math.ceil(wordCount / 130));

  return {
    id,
    _id: id,
    title,
    content,
    plainText,
    updatedAt: formatRelativeDate(doc.updatedAt),
    createdAt: formatRelativeDate(doc.createdAt),
    wordCount,
    estimatedMinutes,
  };
}

function getStoredUserScripts() {
  try {
    const raw = localStorage.getItem(USER_SCRIPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeScript).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveStoredUserScripts(scripts) {
  try {
    localStorage.setItem(USER_SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
  } catch (err) {
    console.warn(err);
  }
}

export async function fetchScripts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scripts`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data.map(normalizeScript).filter(Boolean) : [];
    saveStoredUserScripts(list);
    return list;
  } catch {
    return getStoredUserScripts();
  }
}

export async function fetchScriptById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scripts/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return normalizeScript(data);
  } catch {
    return getStoredUserScripts().find((s) => s.id === id) || null;
  }
}

export async function createScriptApi({ title, content }) {
  const safeTitle = (title || '').trim() || 'Novo Roteiro';
  const safeContent = (content || '').trim() || ' ';

  try {
    const response = await fetch(`${API_BASE_URL}/api/scripts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: safeTitle, content: safeContent }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const created = normalizeScript(await response.json());
    const current = getStoredUserScripts();
    saveStoredUserScripts([created, ...current.filter((s) => s.id !== created.id)]);
    return created;
  } catch {
    const nowIso = new Date().toISOString();
    const created = normalizeScript({
      _id: `local-${Date.now()}`,
      title: safeTitle,
      content: safeContent,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
    const current = getStoredUserScripts();
    saveStoredUserScripts([created, ...current]);
    return created;
  }
}

export async function updateScriptApi(id, { title, content }) {
  const safeTitle = (title || '').trim() || 'Roteiro Sem Título';
  const safeContent = (content || '').trim() || ' ';

  try {
    const response = await fetch(`${API_BASE_URL}/api/scripts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: safeTitle, content: safeContent }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const updated = normalizeScript(await response.json());
    const current = getStoredUserScripts();
    saveStoredUserScripts(current.map((s) => (s.id === id ? updated : s)));
    return updated;
  } catch {
    const nowIso = new Date().toISOString();
    const updated = normalizeScript({
      _id: id,
      title: safeTitle,
      content: safeContent,
      updatedAt: nowIso,
    });
    const current = getStoredUserScripts();
    const exists = current.some((s) => s.id === id);
    const next = exists
      ? current.map((s) => (s.id === id ? updated : s))
      : [updated, ...current];
    saveStoredUserScripts(next);
    return updated;
  }
}

export async function deleteScriptApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scripts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn(err);
  }
  const current = getStoredUserScripts();
  saveStoredUserScripts(current.filter((s) => s.id !== id));
  return true;
}

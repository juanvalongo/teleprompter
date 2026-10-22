import { useCallback, useEffect, useRef, useState } from "react";

const normalizeText = (text = "") =>
  text
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Reconhecimento de fala pt-BR. Mantém a transcrição acumulada da sessão,
 * registra a última fala reconhecida e reinicia o serviço quando o navegador
 * encerra o reconhecimento sozinho. O botão de desligar cancela a retomada.
 */
export const useSpeech = () => {
  const [transcript, setTranscript] = useState("");
  const [cleanTranscript, setCleanTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return null;
    const supported = window.SpeechRecognition || window.webkitSpeechRecognition;
    return supported ? null : "Seu navegador não suporta reconhecimento de fala. Use Chrome ou Edge.";
  });
  const [lastSpeechAt, setLastSpeechAt] = useState(0);
  const [listeningSince, setListeningSince] = useState(0);

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pt-BR";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setListeningSince((previous) => previous || Date.now());
    };

    recognition.onresult = (event) => {
      // Reconstrói toda a transcrição. Usar apenas resultIndex pode deixar
      // cleanTranscript contendo só o trecho mais recente, perdendo contexto.
      const fullTranscript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (!fullTranscript) return;

      setTranscript(fullTranscript);
      setCleanTranscript(normalizeText(fullTranscript));
      setLastSpeechAt(Date.now());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        shouldListenRef.current = false;
        setError("Permissão do microfone negada. Autorize o microfone no navegador.");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(`Erro no microfone: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!shouldListenRef.current) return;

      // Alguns navegadores encerram a sessão mesmo com continuous=true.
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = setTimeout(() => {
        if (!shouldListenRef.current || !recognitionRef.current) return;
        try {
          recognitionRef.current.start();
        } catch {
          // InvalidStateError significa que a sessão ainda está ativa;
          // o próximo onend poderá tentar novamente.
        }
      }, 300);
    };

    return () => {
      shouldListenRef.current = false;
      clearTimeout(restartTimerRef.current);
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // Ignora erro se o reconhecimento já estiver parado.
      }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || shouldListenRef.current) return;

    shouldListenRef.current = true;
    setError(null);
    setTranscript("");
    setCleanTranscript("");
    setLastSpeechAt(0);
    setListeningSince(Date.now());
    try {
      recognition.start();
    } catch (startError) {
      shouldListenRef.current = false;
      setError(startError.message || "Não foi possível iniciar o reconhecimento.");
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    clearTimeout(restartTimerRef.current);
    setIsListening(false);
    setListeningSince(0);
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignora erro se o reconhecimento já estiver parado.
    }
  }, []);

  return {
    transcript,
    cleanTranscript,
    isListening,
    error,
    lastSpeechAt,
    listeningSince,
    startListening,
    stopListening,
  };
};

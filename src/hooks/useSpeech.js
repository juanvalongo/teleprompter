import { useState, useEffect, useRef } from "react";

// Remove pontuações, acentos e transforma em minúsculas
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[.,!?;:]/g, "") // Remove pontuação
    .replace(/\s+/g, " ") // Remove espaços duplos
    .trim();
};

export const useSpeech = () => {
  const [transcript, setTranscript] = useState("");
  const [cleanTranscript, setCleanTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verifica compatibilidade (Chrome, Edge, Safari suportam com prefixos)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Seu navegador não suporta a Web Speech API. Use o Google Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continua escutando mesmo com pausas
    recognition.interimResults = true; // Retorna resultados parciais em tempo real
    recognition.lang = "pt-BR"; // Idioma padrão

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      setCleanTranscript(normalizeText(currentTranscript)); // Higieniza em tempo real
    };

    recognition.onerror = (event) => {
      setError(`Erro no microfone: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Opcional: reiniciar automaticamente se parar acidentalmente
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    transcript,
    cleanTranscript,
    isListening,
    error,
    startListening,
    stopListening,
  };
};

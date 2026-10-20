import { useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";

export const useTeleprompterSync = ({
  scriptId,
  sessionId,
  role,
  onCommandReceived,
}) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Só tenta conectar se tivermos as chaves e o socket estiver pronto
    if (!isConnected || !scriptId || !sessionId) return;

    // 1. Entra na sala (Room) informando quem somos (role: emitter ou receiver)
    socket.emit(
      "teleprompter:join",
      { scriptId, sessionId, role },
      (response) => {
        if (!response.ok) {
          console.error(
            "Erro ao conectar na sessão do prompter:",
            response.error,
          );
        }
      },
    );

    // 2. Se formos o Prompter (receiver), ficamos escutando os comandos do Painel
    if (role === "receiver" && onCommandReceived) {
      socket.on("teleprompter:command:received", onCommandReceived);
    }

    return () => {
      socket.off("teleprompter:command:received", onCommandReceived);
    };
  }, [socket, isConnected, scriptId, sessionId, role, onCommandReceived]);

  // 3. Função que o Painel (emitter) usará para disparar botões de Play/Pause/Velocidade
  const sendCommand = useCallback(
    (command, speed = null) => {
      if (role !== "emitter" || !isConnected) return;

      socket.emit(
        "teleprompter:command",
        {
          scriptId,
          sessionId,
          commandId: Date.now().toString(), // O backend exige um ID único para o comando
          command,
          speed,
        },
        (response) => {
          if (!response.ok) {
            console.error("Erro ao enviar comando:", response.error);
          }
        },
      );
    },
    [socket, isConnected, scriptId, sessionId, role],
  );

  return { sendCommand, isConnected };
};

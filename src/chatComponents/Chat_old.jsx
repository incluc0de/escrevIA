// Chat.jsx
import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './ifbbot.css';

import MarkdownMessage from './MarkdownMessage';

//==== Gera SessionId =======
function getTurno() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) return 'manha';
  if (hora >= 12 && hora < 18) return 'tarde';

  return 'noite';
}

// Função principal para gerar o sessionId
function generateSessionId() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');

  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');

  const data = `${ano}${mes}${dia}`;
  const horario = `${hora}${minuto}${segundo}`;

  const turno = getTurno();

  const browser = (() => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes('chrome') && !ua.includes('edge')) return 'chrome';
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    if (ua.includes('edge')) return 'edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'opera';

    return 'outro';
  })();

  return `${data}_${horario}_${turno}_${browser}`;
}

// Gera o sessionId
const sessionId = generateSessionId();

console.log('Session ID gerado:', sessionId);

//===== fim SessionId =======


// === Configuração do chatbot ===
const config = {
  botName: 'MentorIA - EaD',

  initialMessages: [
    {
      type: 'bot',
      id: '1',
      message:
        '👋 Olá! Eu sou o MentorIA EaD, seu assistente virtual para a Educação a Distância do IFB. ' +
        'Posso ajudar com dúvidas sobre normas, portarias, resoluções e orientações da DEaD, ' +
        'além de auxiliar no uso do AVA Institucional. Como posso ajudar você hoje? 💻📚',
    },
  ],

  customStyles: {
    botMessageBox: {
      backgroundColor: '#98A92C',
    },

    chatButton: {
      backgroundColor: '#509E2F',
    },
  },

  // === Avatares customizados ===
  customComponents: {
    botAvatar: () => (
      <img
        src={`${import.meta.env.BASE_URL}MentorIA_EaD_avatar.svg`}
        alt="MentorIA"
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #98A92C',
          padding: 3,
        }}
      />
    ),

    userAvatar: () => (
      <img
        src={`${import.meta.env.BASE_URL}ifb_estudante_avatar.svg`}
        alt="Estudante IFB"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #509E2F',
          padding: 3,
        }}
      />
    ),

    botChatMessage: (props) => (
      <MarkdownMessage {...props} />
    ),
  },
};


// === MessageParser ===
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    actions.handleUserMessage(message);
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { parse })
  );
};


// === ActionProvider ===
const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  setLoading,
}) => {
  const handleUserMessage = async (message) => {
    // Mostra o indicador de processamento
    setLoading(true);

    try {
      const response = await fetch(
        'https://n8n.incluc0de.com.br/webhook/mentoread',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
          },

          body: JSON.stringify({
            sessionId: sessionId,
            user_message: message,
          }),
        }
      );

      // Trata respostas HTTP com erro
      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(data[0]);

      const botReply =
        data?.[0]?.output ||
        'Não consegui entender sua solicitação.';

      const botMessage =
        createChatBotMessage(botReply);

      setState((prev) => ({
        ...prev,

        messages: [
          ...prev.messages,
          botMessage,
        ],
      }));
    } catch (error) {
      console.error(
        'Erro ao conectar com o webhook:',
        error
      );

      const botMessage = createChatBotMessage(
        'Erro ao conectar com o agente de IA 😢'
      );

      setState((prev) => ({
        ...prev,

        messages: [
          ...prev.messages,
          botMessage,
        ],
      }));
    } finally {
      // Remove o indicador de carregamento,
      // ocorrendo sucesso ou erro
      setLoading(false);
    }
  };

  return React.Children.map(
    children,
    (child) =>
      React.cloneElement(
        child,
        {
          actions: {
            handleUserMessage,
          },
        }
      )
  );
};


// === Componente principal ===
export default function Chat() {
  // Controla se o agente está processando a pergunta
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper para permitir passar setLoading ao ActionProvider
  const CustomActionProvider = (props) => (
    <ActionProvider
      {...props}
      setLoading={setIsLoading}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        paddingTop: '1px',
        boxSizing: 'border-box',
      }}
    >
      {/* Banner MentorIA */}
      <img
        src={`${import.meta.env.BASE_URL}MentorIA_EaD_300kb.svg`}
        alt="Banner MentorIA"
        style={{
          display: 'block',
          margin: '0 auto',
          width: '65%',
          maxWidth: '900px',
          height: 'auto',
        }}
      />

      {/* Wrapper do chatbot */}
      <div className="chat-wrapper">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={CustomActionProvider}
          headerText="Assistente Virtual - EaD"
          placeholderText="Digite sua dúvida..."
        />

        {/* Indicador de processamento */}
        {isLoading && (
          <div className="mentoria-loading">
            <span className="mentoria-loading-text">
              🔎 Consultando a base de conhecimento
            </span>

            <span className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
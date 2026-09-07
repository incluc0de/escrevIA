// Chat.jsx

import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './ifbbot.css';

import MarkdownMessage from './MarkdownMessage';
import chatConfig from './chatConfig';


// =====================================================
// SessionId
// =====================================================

function getTurno() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) return 'manha';
  if (hora >= 12 && hora < 18) return 'tarde';

  return 'noite';
}


function generateSessionId() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(
    agora.getMonth() + 1
  ).padStart(2, '0');

  const dia = String(
    agora.getDate()
  ).padStart(2, '0');

  const hora = String(
    agora.getHours()
  ).padStart(2, '0');

  const minuto = String(
    agora.getMinutes()
  ).padStart(2, '0');

  const segundo = String(
    agora.getSeconds()
  ).padStart(2, '0');

  const data = `${ano}${mes}${dia}`;

  const horario =
    `${hora}${minuto}${segundo}`;

  const turno = getTurno();


  // Identifica o navegador
  const browser = (() => {
    const ua =
      navigator.userAgent.toLowerCase();

    if (
      ua.includes('chrome') &&
      !ua.includes('edge')
    ) {
      return 'chrome';
    }

    if (ua.includes('firefox')) {
      return 'firefox';
    }

    if (
      ua.includes('safari') &&
      !ua.includes('chrome')
    ) {
      return 'safari';
    }

    if (ua.includes('edge')) {
      return 'edge';
    }

    if (
      ua.includes('opera') ||
      ua.includes('opr')
    ) {
      return 'opera';
    }

    return 'outro';
  })();


  // Pequeno identificador aleatório
  const randomId = Math.random()
    .toString(36)
    .substring(2, 8);


  return (
    `${data}_${horario}_` +
    `${turno}_${browser}_${randomId}`
  );
}


const sessionId =
  generateSessionId();

console.log(
  'Session ID gerado:',
  sessionId
);


// =====================================================
// Configuração do react-chatbot-kit
// =====================================================

const config = {
  botName: chatConfig.bot.name,

  initialMessages: [
    {
      type: 'bot',
      id: '1',
      message:
        chatConfig.bot.initialMessage,
    },
  ],

  customStyles: {
    botMessageBox: {
      backgroundColor:
        chatConfig.colors.botMessageBox,
    },

    chatButton: {
      backgroundColor:
        chatConfig.colors.chatButton,
    },
  },


  // ===================================================
  // Avatares
  // ===================================================

  customComponents: {
    botAvatar: () => (
      <img
        src={
          `${import.meta.env.BASE_URL}` +
          chatConfig.images.botAvatar
        }
        alt={chatConfig.bot.name}
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#fff',

          border:
            `2px solid ` +
            chatConfig.colors
              .botAvatarBorder,

          padding: 3,
        }}
      />
    ),


    userAvatar: () => (
      <img
        src={
          `${import.meta.env.BASE_URL}` +
          chatConfig.images.userAvatar
        }
        alt="Usuário"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#fff',

          border:
            `2px solid ` +
            chatConfig.colors
              .userAvatarBorder,

          padding: 3,
        }}
      />
    ),


    botChatMessage: (props) => (
      <MarkdownMessage
        {...props}
      />
    ),
  },
};


// =====================================================
// MessageParser
// =====================================================

const MessageParser = ({
  children,
  actions,
}) => {

  const parse = (message) => {
    actions.handleUserMessage(
      message
    );
  };


  return React.Children.map(
    children,

    (child) =>
      React.cloneElement(
        child,
        { parse }
      )
  );
};


// =====================================================
// ActionProvider
// =====================================================

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  setLoading,
}) => {

  const handleUserMessage =
    async (message) => {

      setLoading(true);


      try {

        const response =
          await fetch(
            chatConfig.backend
              .webhookUrl,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                'x-requested-with':
                  'XMLHttpRequest',
              },

              body: JSON.stringify({
                sessionId:
                  sessionId,

                user_message:
                  message,
              }),
            }
          );


        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status}`
          );
        }


        const data =
          await response.json();


        console.log(data[0]);


        const botReply =
          data?.[0]?.output ||
          'Não consegui entender sua solicitação.';


        const botMessage =
          createChatBotMessage(
            botReply
          );


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


        const botMessage =
          createChatBotMessage(
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


// =====================================================
// Componente principal
// =====================================================

export default function Chat() {

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const CustomActionProvider =
    (props) => (

      <ActionProvider
        {...props}

        setLoading={
          setIsLoading
        }
      />

    );


  return (

    <div
      style={{
        display: 'flex',

        flexDirection:
          'column',

        alignItems:
          'center',

        justifyContent:
          'flex-start',

        width: '100%',

        minHeight:
          '100vh',

        margin: 0,

        paddingTop:
          '1px',

        boxSizing:
          'border-box',
      }}
    >

      {/* Banner */}

      <img
  src={`${import.meta.env.BASE_URL}${chatConfig.images.banner}`}
  alt={chatConfig.bot.name}
  className="mentoria-banner"
/>


      {/* Chat */}

      <div
        className="chat-wrapper"
      >

        <Chatbot
          config={config}

          messageParser={
            MessageParser
          }

          actionProvider={
            CustomActionProvider
          }

          headerText={
            chatConfig
              .interface
              .headerText
          }

          placeholderText={
            chatConfig
              .interface
              .placeholderText
          }
        />


        {/* Loading */}

        {isLoading && (

          <div
            className=
              "mentoria-loading"
          >

            <span
              className=
                "mentoria-loading-text"
            >
              {
                chatConfig
                  .interface
                  .loadingText
              }
            </span>


            <span
              className=
                "loading-dots"
            >

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
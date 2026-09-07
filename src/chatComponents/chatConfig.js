// chatConfig.js

const chatConfig = {
  bot: {
    name: 'EscrevIA',

    initialMessage:
      '👋 Olá! Eu sou o **EscrevIA**, seu assistente para aprender e desenvolver a escrita. ✏️ Aqui, **você é o autor**! Eu posso ajudar você a organizar ideias, compreender dificuldades, revisar seus textos e descobrir maneiras de escrever cada vez melhor.💡 Vamos aprender no processo: **escreva, revise, compreenda, reescreva e evolua** Para começarmos, **como você gostaria que eu o chamasse?**',
  },

  interface: {
    headerText: 'Assistente Virtual - EscrevIA',
    placeholderText: 'Digite sua dúvida...',
    loadingText: '🔎 Consultando a base de conhecimento',
  },

  images: {
    botAvatar: 'EscrevIA_avatar.svg',
    userAvatar: 'ifb_estudante_avatar.svg',
    banner: 'EscrevIA_banner_clean.svg',
  },

  backend: {
    webhookUrl: 'https://n8n.incluc0de.com.br/webhook/escrevia',
  },

  colors: {
    botMessageBox: '#98A92C',
    chatButton: '#509E2F',
    botAvatarBorder: '#98A92C',
    userAvatarBorder: '#509E2F',
  },
};

export default chatConfig;

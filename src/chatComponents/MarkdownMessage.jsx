import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

export default function MarkdownMessage({ message }) {
     return (
         <div className="react-chatbot-kit-chat-bot-message mentoria-markdown">
         <ReactMarkdown remarkPlugins={[remarkGfm]}>
             {message}
         </ReactMarkdown> 
         <div className="react-chatbot-kit-chat-bot-message-arrow"> </div>
         </div>
          ); 
         }

// Importa a função para criar a raiz da aplicação React
import { createRoot } from 'react-dom/client'
// Importa o componente principal da aplicação
import App from './App.tsx'
// Importa o arquivo de estilos globais
import './index.css'
// Importa a configuração do i18next
import './i18n/i18n'

// Cria a raiz da aplicação React e renderiza o componente App dentro do elemento com id 'root'
createRoot(document.getElementById("root")!).render(<App />);

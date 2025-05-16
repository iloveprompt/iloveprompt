// Importa hooks do React Router
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Componente de página não encontrada (404)
const NotFound = () => {
  // Hook para obter a localização atual da rota
  const location = useLocation();

  // Efeito para logar no console quando a página não existe
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Renderização da mensagem de erro 404
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

// Exporta o componente de página não encontrada
export default NotFound;

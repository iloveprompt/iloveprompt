
// Script auxiliar para animações da landing page

/**
 * Detecta quando elementos entram na viewport
 * @param selectors String de seletores CSS para observar
 * @param callback Função a ser chamada quando elementos entrarem na viewport
 */
export function observeElementsInViewport(selectors: string, callback: (el: Element) => void) {
  const elements = document.querySelectorAll(selectors);
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        // Opcional: Para parar de observar após primeira aparição
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Elemento é considerado visível quando 10% dele está visível
  });
  
  elements.forEach(el => {
    observer.observe(el);
  });
  
  return observer;
}

/**
 * Adiciona classe aos elementos quando entram na viewport
 * @param selectors String de seletores CSS para observar
 * @param className Classe a ser adicionada
 */
export function addClassOnScroll(selectors: string, className: string) {
  return observeElementsInViewport(selectors, (el) => {
    el.classList.add(className);
  });
}

/**
 * Aplica efeito parallax em elementos
 * @param selectors String de seletores CSS para os elementos
 * @param intensity Intensidade do efeito (valor maior = mais movimento)
 */
export function createParallaxEffect(selectors: string, intensity: number = 0.2) {
  const elements = document.querySelectorAll(selectors);
  
  if (!elements.length) return;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    elements.forEach((el) => {
      const element = el as HTMLElement;
      const offset = scrollY * intensity;
      
      element.style.transform = `translateY(${offset}px)`;
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Chamar inicialmente
  handleScroll();
  
  return {
    destroy: () => window.removeEventListener('scroll', handleScroll)
  };
}

/**
 * Aplicar efeito de menu que muda ao rolar
 * @param selector Seletor do menu
 * @param thresholdPx Número de pixels a rolar antes de aplicar a classe
 * @param className Classe a ser adicionada/removida
 */
export function createScrollingHeaderEffect(
  selector: string, 
  thresholdPx: number = 100, 
  className: string = 'scrolled'
) {
  const header = document.querySelector(selector);
  
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > thresholdPx) {
      header.classList.add(className);
    } else {
      header.classList.remove(className);
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Chamar inicialmente
  handleScroll();
  
  return {
    destroy: () => window.removeEventListener('scroll', handleScroll)
  };
}

/**
 * Inicializar todas as animações
 */
export function initializeAnimations() {
  // Detectar e revelar elementos ao scrollar
  addClassOnScroll('.scroll-reveal', 'visible');
  
  // Aplicar efeito no cabeçalho
  createScrollingHeaderEffect('.sticky-menu', 20, 'scrolled');
  
  // Adicionar efeito parallax aos backgrounds
  createParallaxEffect('.parallax-bg', 0.1);
}

// Executar quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeAnimations);
}

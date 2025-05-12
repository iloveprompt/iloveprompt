import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SimpleButton } from '@/components/ui/SimpleButton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import { Code, Shield, Zap, Terminal, Sparkles, GitBranch, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
const Index = () => {
  const {
    t
  } = useLanguage();
  const {
    isAuthenticated
  } = useAuth();
  const isMobile = useIsMobile();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  // Refs para cada seção
  const sectionsRef = useRef<{
    [key: string]: React.RefObject<HTMLElement>;
  }>({
    hero: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    socialProof: useRef<HTMLElement>(null),
    pricing: useRef<HTMLElement>(null),
    cta: useRef<HTMLElement>(null)
  });

  // Efeito para detectar seções visíveis durante a rolagem
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => {
            if (!prev.includes(entry.target.id)) {
              return [...prev, entry.target.id];
            }
            return prev;
          });
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionsRef.current).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  console.log('Index page rendered, authentication status:', isAuthenticated);
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" ref={sectionsRef.current.hero as React.RefObject<HTMLDivElement>} className={`relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-darkBg to-electricBlue/30 overflow-hidden bg-cover bg-center bg-no-repeat section-transition ${visibleSections.includes('hero') ? 'slide-in' : 'opacity-0'}`} style={{
      backgroundImage: "url('/img-fundo-landingpage/hero-component/fundo_4.jpg')"
    }}>
        {/* Efeito de partículas */}
        <div className="absolute inset-0 z-0 pointer-events-none"> 
          <div className="absolute w-[500px] h-[500px] bg-neonPurple/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-aquaGreen/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000" />
        </div>
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pureWhite mb-6 leading-tight drop-shadow-[0_5px_15px_rgba(58,134,255,0.5)]">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg font-medium text-aquaGreen">
                A ferramenta ideal para desenvolvedores que utilizam plataformas de vibe coding como Bolt, Lovable, MGX, Replit, V0 e Tempo Labs. Potencialize seu fluxo de trabalho com nossa solução integrada.
              </p>
              <div className="flex flex-wrap gap-4">
                  <Link to="/register">
                    <Button className="bg-electricBlue hover:bg-neonPurple text-pureWhite text-lg h-auto px-[50px] py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-neonPurple/40">
                      {t('hero.ctaStart')}
                    </Button>
                  </Link>
                <a href="#features-section">
                  <Button variant="outline" className="border-electricBlue text-electricBlue hover:bg-electricBlue/10 hover:text-pureWhite h-auto px-[50px] py-3 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-electricBlue/30">
                    {t('common.learnMore')}
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="p-6 shadow-xl bg-darkBg/50 backdrop-blur-md border border-electricBlue/30 hover-glow rounded-2xl px-[12px] py-[13px]">
                <div className="bg-darkBg/70 rounded-lg p-4 border border-electricBlue/20 mb-4 py-[45px] px-[22px] mx-0 my-0">
                  <pre className="text-sm text-aquaGreen/90 font-mono">
                    <code>{t('hero.codeExample')}</code>
                    <br />
                    <code className="text-neonPink">{t('hero.promptComponents.intro')}</code>
                    <br />
                    <code>{t('hero.promptComponents.item1')}</code>
                    <br />
                    <code>{t('hero.promptComponents.item2')}</code>
                    <br />
                    <code>{t('hero.promptComponents.item3')}</code>
                    <br />
                    <code>{t('hero.promptComponents.item4')}</code>
                  </pre>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <img src="/lovable-uploads/20092c86-225f-455b-92ca-d97ee10aaf4c.png" alt="Bolt" className="h-8 rounded-md bg-darkBg/70 p-1" />
                  <img src="/lovable-uploads/ac34c931-55fa-4fba-bc3e-c8dab9291e88.png" alt="Lovable" className="h-8 rounded-md bg-darkBg/70 p-1" />
                  <img src="/lovable-uploads/68c0e542-e1a6-499a-a296-9481c70beb2b.png" alt="MGX" className="h-8 rounded-md bg-darkBg/70 p-1" />
                  <img src="/lovable-uploads/e10dd602-80ca-499f-bebe-ad7e1153fd32.png" alt="Replit" className="h-8 rounded-md bg-darkBg/70 p-1" />
                  <img src="/lovable-uploads/47ae4d33-e1f8-46b1-8440-dd47cbbe6066.png" alt="V0" className="h-8 rounded-md bg-darkBg/70 p-1" />
                  <img src="/lovable-uploads/6cf898a6-b403-4db6-98bd-46a072bb6217.png" alt="Tempo Labs" className="h-8 rounded-md bg-darkBg/70 p-1" />
                </div>
                <p className="text-aquaGreen/80 text-sm italic mt-4">{t('hero.promptDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works-section" ref={sectionsRef.current.howItWorks as React.RefObject<HTMLDivElement>} className={`py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 scroll-mt-24 shadow-lg-electric-blue section-transition section-transition-top ${visibleSections.includes('how-it-works-section') ? 'slide-in' : ''}`}>
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('howItWorks.title')}</h2>
            <p className="text-aquaGreen/80 max-w-2xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-electricBlue/20 hover:border-neonPurple transition-all duration-300 shadow-lg hover:shadow-neonPurple/20 hover-glow">
              <div className="mx-auto w-16 h-16 bg-electricBlue/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-electricBlue/20">
                <Terminal className="h-8 w-8 text-electricBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step1.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step1.description')}</p>
            </div>
            
            {/* Card 2 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-neonPurple/20 hover:border-aquaGreen transition-all duration-300 shadow-lg hover:shadow-aquaGreen/20 hover-glow">
              <div className="mx-auto w-16 h-16 bg-neonPurple/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-neonPurple/20">
                <Sparkles className="h-8 w-8 text-neonPurple" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step2.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step2.description')}</p>
            </div>
            
            {/* Card 3 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-aquaGreen/20 hover:border-neonPink transition-all duration-300 shadow-lg hover:shadow-neonPink/20 hover-glow">
              <div className="mx-auto w-16 h-16 bg-aquaGreen/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-aquaGreen/20">
                <GitBranch className="h-8 w-8 text-aquaGreen" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step3.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features-section" ref={sectionsRef.current.features as React.RefObject<HTMLDivElement>} className={`py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 scroll-mt-24 shadow-lg-electric-blue section-transition section-transition-top ${visibleSections.includes('features-section') ? 'slide-in' : ''}`}>
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('features.title')}</h2>
            <p className="text-aquaGreen/80 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title={t('features.feature1.title')} description={t('features.feature1.description')} icon={<Code className="h-6 w-6" />} delay="delay-100" />
            <FeatureCard title={t('features.feature2.title')} description={t('features.feature2.description')} icon={<Shield className="h-6 w-6" />} delay="delay-200" />
            <FeatureCard title={t('features.feature3.title')} description={t('features.feature3.description')} icon={<Zap className="h-6 w-6" />} delay="delay-300" />
          </div>
          
          {/* Links para plataformas de vibe coding */}
          <div className="mt-16 bg-darkBg/50 p-6 rounded-xl border border-electricBlue/20 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-4 text-pureWhite text-center">Compatível com as melhores plataformas de vibe coding</h3>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/20092c86-225f-455b-92ca-d97ee10aaf4c.png" alt="Bolt" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">Bolt</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/ac34c931-55fa-4fba-bc3e-c8dab9291e88.png" alt="Lovable" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">Lovable</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/68c0e542-e1a6-499a-a296-9481c70beb2b.png" alt="MGX" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">MGX</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/e10dd602-80ca-499f-bebe-ad7e1153fd32.png" alt="Replit" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">Replit</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/47ae4d33-e1f8-46b1-8440-dd47cbbe6066.png" alt="V0" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">V0</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/lovable-uploads/6cf898a6-b403-4db6-98bd-46a072bb6217.png" alt="Tempo Labs" className="h-10 mb-2" />
                <span className="text-aquaGreen text-sm">Tempo Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section id="social-proof-section" ref={sectionsRef.current.socialProof as React.RefObject<HTMLDivElement>} className={`py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 scroll-mt-24 shadow-lg-electric-blue section-transition section-transition-top ${visibleSections.includes('social-proof-section') ? 'slide-in' : ''}`}>
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('socialProof.title')}</h2>
            <p className="text-aquaGreen/80 max-w-2xl mx-auto">
              {t('socialProof.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-electricBlue/10 p-6 rounded-xl border border-electricBlue/20 hover:border-neonPurple transition-all duration-300 group shadow-lg hover:shadow-neonPurple/20 hover-glow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-electricBlue/10 flex items-center justify-center mr-4 border border-electricBlue/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/4c0e25c9-7a84-42ff-92f3-643522f86121.png" className="w-full h-full rounded-full object-cover" alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">John Doe</h4>
                  <p className="text-sm text-aquaGreen/80">Senior Developer em <span className="text-neonPink">Lovable</span></p>
                </div>
              </div>
              <p className="text-aquaGreen/90 italic">
                  {t('socialProof.testimonial1')}
                </p>
            </div>
            
            {/* Testimonial Card 2 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-neonPurple/10 p-6 rounded-xl border border-neonPurple/20 hover:border-aquaGreen transition-all duration-300 group shadow-lg hover:shadow-aquaGreen/20 hover-glow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-neonPurple/10 flex items-center justify-center mr-4 border border-neonPurple/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" className="w-full h-full rounded-full object-cover" alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">Ana Silva</h4>
                  <p className="text-sm text-aquaGreen/80">CTO em <span className="text-aquaGreen">Replit</span></p>
                </div>
              </div>
              <p className="text-aquaGreen/90 italic">
                  {t('socialProof.testimonial2')}
                </p>
            </div>
            
            {/* Testimonial Card 3 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-aquaGreen/10 p-6 rounded-xl border border-aquaGreen/20 hover:border-neonPink transition-all duration-300 group shadow-lg hover:shadow-neonPink/20 hover-glow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-aquaGreen/10 flex items-center justify-center mr-4 border border-aquaGreen/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/eecd25b5-caab-48fd-88bb-c6a40aa68e93.png" className="w-full h-full rounded-full object-cover" alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">Mike Kim</h4>
                  <p className="text-sm text-neonPurple/80">Lead Engineer em <span className="text-electricBlue">V0</span></p>
                </div>
              </div>
              <p className="text-neonPurple/90 italic">
                  {t('socialProof.testimonial3')}
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Preview */}
      <section id="pricing-section" ref={sectionsRef.current.pricing as React.RefObject<HTMLDivElement>} className={`py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 scroll-mt-24 shadow-lg-electric-blue section-transition section-transition-top ${visibleSections.includes('pricing-section') ? 'slide-in' : ''}`}>
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('pricing.title')}</h2>
            <p className="text-aquaGreen/80 max-w-2xl mx-auto mb-6">
              {t('pricing.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard title={t('pricing.free.title')} price={t('pricing.free.price')} description={t('pricing.free.description')} features={[{
            text: `5 ${t('pricing.features.promptsPerMonth')}`,
            included: true
          }, {
            text: t('pricing.features.basicQuestionnaire'),
            included: true
          }, {
            text: t('pricing.features.gpt35Integration'),
            included: true
          }, {
            text: t('pricing.features.promptHistory'),
            included: true
          }, {
            text: t('pricing.features.useOwnApiKeys'),
            included: false
          }, {
            text: t('pricing.features.advancedSecuritySection'),
            included: false
          }]} ctaText={t('common.startFree')} />
            
            <PricingCard title={t('pricing.pro.title')} price={t('pricing.pro.price')} description={t('pricing.pro.description')} features={[{
            text: `50 ${t('pricing.features.promptsPerMonth')}`,
            included: true
          }, {
            text: t('pricing.features.fullQuestionnaire'),
            included: true
          }, {
            text: t('pricing.features.aiModelIntegrations'),
            included: true
          }, {
            text: t('pricing.features.promptHistoryTemplates'),
            included: true
          }, {
            text: t('pricing.features.useOwnApiKeys'),
            included: true
          }, {
            text: t('pricing.features.advancedSecuritySections'),
            included: true
          }]} ctaText="Upgrade to Pro" popular={true} apiOption={true} />
            
            <PricingCard title={t('pricing.team.title')} price={t('pricing.team.price')} description={t('pricing.team.description')} features={[{
            text: t('pricing.features.unlimitedPrompts'),
            included: true
          }, {
            text: t('pricing.features.fullQuestionnaire'),
            included: true
          }, {
            text: t('pricing.features.aiModelIntegrations'),
            included: true
          }, {
            text: t('pricing.features.promptLibrarySharing'),
            included: true
          }, {
            text: t('pricing.features.useOwnApiKeys'),
            included: true
          }, {
            text: t('pricing.features.prioritySupport'),
            included: true
          }]} ctaText="Choose Team" apiOption={true} />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section id="cta-section" ref={sectionsRef.current.cta as React.RefObject<HTMLDivElement>} className={`py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 scroll-mt-24 section-transition section-transition-top ${visibleSections.includes('cta-section') ? 'slide-in' : ''}`}>
        <div className="container px-4 mx-auto text-center">
          <div className="relative pt-12 bg-gradient-to-br from-darkBg/90 to-neonPurple/10 p-8 rounded-3xl border border-neonPurple/20 shadow-lg hover:shadow-neonPurple/30 transition-all duration-300">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-darkBg/50 shadow-lg rounded-full px-4 py-2 flex items-center border border-aquaGreen/30 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-aquaGreen mr-2" />
              <span className="text-sm font-medium text-pureWhite">{t('cta.guarantee')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pureWhite animated-gradient bg-gradient-to-r from-aquaGreen via-electricBlue to-neonPurple bg-clip-text text-transparent">{t('cta.title')}</h2>
            <p className="text-xl text-pureWhite/90 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col items-center gap-4 mt-6">
              <p className="text-neonPink font-semibold text-center text-sm tracking-wider">{t('cta.limitedOffer')}</p>
              <Link to="/prompt-generator">
                <SimpleButton className="bg-neonPink hover:bg-opacity-80 text-pureWhite text-lg px-8 py-4 h-auto rounded-lg shadow-lg hover:shadow-neonPink/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 group">
                  {t('cta.button')} - {t('cta.getStartedNow')}
                  <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </SimpleButton>
              </Link>
              
              {/* Logos das plataformas como rodapé do CTA */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-8 border-t border-neonPurple/20">
                <div className="flex items-center gap-2">
                  <span className="text-aquaGreen/80 text-sm">Compatível com:</span>
                  <img src="/lovable-uploads/20092c86-225f-455b-92ca-d97ee10aaf4c.png" alt="Bolt" className="h-6" />
                  <img src="/lovable-uploads/ac34c931-55fa-4fba-bc3e-c8dab9291e88.png" alt="Lovable" className="h-6" />
                  <img src="/lovable-uploads/68c0e542-e1a6-499a-a296-9481c70beb2b.png" alt="MGX" className="h-6" />
                  <img src="/lovable-uploads/e10dd602-80ca-499f-bebe-ad7e1153fd32.png" alt="Replit" className="h-6" />
                  <img src="/lovable-uploads/47ae4d33-e1f8-46b1-8440-dd47cbbe6066.png" alt="V0" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Script para animações de scroll */}
      <script dangerouslySetInnerHTML={{
      __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Função para revelar elementos ao rolar
            function checkScrollReveal() {
              const revealElements = document.querySelectorAll('.scroll-reveal');
              
              revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                  element.classList.add('visible');
                }
              });
            }
            
            // Inicializar verificação
            checkScrollReveal();
            
            // Ouvinte de rolagem
            window.addEventListener('scroll', checkScrollReveal);
          });
        `
    }} />
    </div>;
};
export default Index;
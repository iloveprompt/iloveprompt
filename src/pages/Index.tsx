import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import { Code, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  console.log('Index page rendered, authentication status:', isAuthenticated);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-darkBg to-electricBlue/30 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img-fundo-landingpage/hero-component/fundo_4.jpg')" }}
      >
        {/* Efeito de partículas */}
        <div className="absolute inset-0 z-0 pointer-events-none"> {/* Adicionado pointer-events-none */}
          <div className="absolute w-[500px] h-[500px] bg-neonPurple/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-aquaGreen/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000" />
        </div>
        <div className="container px-4 mx-auto"> {/* Removido z-10 e relative */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pureWhite mb-6 leading-tight drop-shadow-[0_5px_15px_rgba(58,134,255,0.5)]">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg font-medium text-aquaGreen">
                {t('hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                  <Link to="/register">
                    <Button className="bg-electricBlue hover:bg-neonPurple text-pureWhite text-lg h-auto px-[50px] py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-neonPurple/40">
                      {t('hero.ctaStart')}
                    </Button>
                  </Link>
                <a href="#features-section">
                  <Button 
                    variant="outline"
                    className="border-electricBlue text-electricBlue hover:bg-electricBlue/10 hover:text-pureWhite h-auto px-[50px] py-3 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-electricBlue/30"
                  >
                    {t('common.learnMore')}
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="rounded-2xl p-6 shadow-xl bg-darkBg/50 backdrop-blur-md border border-electricBlue/30">
                <div className="bg-darkBg/70 rounded-lg p-4 border border-electricBlue/20 mb-4">
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
                <p className="text-aquaGreen/80 text-sm italic">{t('hero.promptDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works-section" className="py-16 md:py-24 bg-darkBg backdrop-blur-lg slide-in opacity-0 scroll-mt-24 shadow-lg-electric-blue">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('howItWorks.title')}</h2> {/* Cor do texto revertida */}
            <p className="text-aquaGreen/80 max-w-2xl mx-auto"> {/* Cor do texto revertida */}
              {t('howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-electricBlue/20 hover:border-neonPurple transition-all duration-300 shadow-lg hover:shadow-neonPurple/20">
              <div className="mx-auto w-16 h-16 bg-electricBlue/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-electricBlue/20">
                <Code className="h-8 w-8 text-electricBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step1.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step1.description')}</p>
            </div>
            
            {/* Card 2 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-neonPurple/20 hover:border-aquaGreen transition-all duration-300 shadow-lg hover:shadow-aquaGreen/20">
              <div className="mx-auto w-16 h-16 bg-neonPurple/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-neonPurple/20">
                <Zap className="h-8 w-8 text-neonPurple" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step2.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step2.description')}</p>
            </div>
            
            {/* Card 3 - How it Works */}
            <div className="text-center p-6 group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-aquaGreen/20 hover:border-neonPink transition-all duration-300 shadow-lg hover:shadow-neonPink/20">
              <div className="mx-auto w-16 h-16 bg-aquaGreen/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-aquaGreen/20">
                <Shield className="h-8 w-8 text-aquaGreen" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pureWhite">{t('howItWorks.step3.title')}</h3>
              <p className="text-pureWhite/90 mb-4">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features-section" className="py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 slide-in scroll-mt-24 shadow-lg-electric-blue">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('features.title')}</h2> {/* Cor do texto revertida */}
            <p className="text-aquaGreen/80 max-w-2xl mx-auto"> {/* Cor do texto revertida */}
              {t('features.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title={t('features.feature1.title')} description={t('features.feature1.description')} icon={<Code className="h-6 w-6" />} delay="delay-100" />
            <FeatureCard title={t('features.feature2.title')} description={t('features.feature2.description')} icon={<Shield className="h-6 w-6" />} delay="delay-200" />
            <FeatureCard title={t('features.feature3.title')} description={t('features.feature3.description')} icon={<Zap className="h-6 w-6" />} delay="delay-300" />
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section id="social-proof-section" className="py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 slide-in scroll-mt-24 shadow-lg-electric-blue">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('socialProof.title')}</h2>
            <p className="text-aquaGreen/80 max-w-2xl mx-auto">
              {t('socialProof.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-electricBlue/10 p-6 rounded-xl border border-electricBlue/20 hover:border-neonPurple transition-all duration-300 group shadow-lg hover:shadow-neonPurple/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-electricBlue/10 flex items-center justify-center mr-4 border border-electricBlue/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/4c0e25c9-7a84-42ff-92f3-643522f86121.png" 
                       className="w-full h-full rounded-full object-cover"
                       alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">John Doe</h4>
                  <p className="text-sm text-aquaGreen/80">Senior Developer</p>
                </div>
              </div>
              <p className="text-aquaGreen/90 italic">
                  {t('socialProof.testimonial1')}
                </p>
            </div>
            
            {/* Testimonial Card 2 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-neonPurple/10 p-6 rounded-xl border border-neonPurple/20 hover:border-aquaGreen transition-all duration-300 group shadow-lg hover:shadow-aquaGreen/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-neonPurple/10 flex items-center justify-center mr-4 border border-neonPurple/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" 
                       className="w-full h-full rounded-full object-cover"
                       alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">Ana Silva</h4>
                  <p className="text-sm text-aquaGreen/80">CTO</p>
                </div>
              </div>
              <p className="text-aquaGreen/90 italic">
                  {t('socialProof.testimonial2')}
                </p>
            </div>
            
            {/* Testimonial Card 3 */}
            <div className="bg-gradient-to-b from-darkBg/70 to-aquaGreen/10 p-6 rounded-xl border border-aquaGreen/20 hover:border-neonPink transition-all duration-300 group shadow-lg hover:shadow-neonPink/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-aquaGreen/10 flex items-center justify-center mr-4 border border-aquaGreen/20 backdrop-blur-sm">
                  <img src="/public/lovable-uploads/eecd25b5-caab-48fd-88bb-c6a40aa68e93.png" 
                       className="w-full h-full rounded-full object-cover"
                       alt="User avatar" />
                </div>
                <div>
                  <h4 className="font-semibold text-pureWhite">Mike Kim</h4>
                  <p className="text-sm text-neonPurple/80">Lead Engineer</p>
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
      <section id="pricing-section" className="py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 slide-in scroll-mt-24 shadow-lg-electric-blue">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pureWhite">{t('pricing.title')}</h2> {/* Cor do texto revertida */}
            <p className="text-aquaGreen/80 max-w-2xl mx-auto mb-6"> {/* Cor do texto revertida */}
              {t('pricing.description')}
            </p>
            {/* pricing.annualDiscount removido */}
            {/* Calculadora de ROI removida */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              title={t('pricing.free.title')} 
              price={t('pricing.free.price')} 
              description={t('pricing.free.description')} 
              features={[
                {
                  text: `5 ${t('pricing.features.promptsPerMonth')}`,
                  included: true
                },
                {
                  text: t('pricing.features.basicQuestionnaire'),
                  included: true
                },
                {
                  text: t('pricing.features.gpt35Integration'),
                  included: true
                },
                {
                  text: t('pricing.features.promptHistory'),
                  included: true
                },
                {
                  text: t('pricing.features.useOwnApiKeys'),
                  included: false
                },
                {
                  text: t('pricing.features.advancedSecuritySection'),
                  included: false
                }
              ]} 
              ctaText={t('common.startFree')} 
            />
            
            <PricingCard 
              title={t('pricing.pro.title')} 
              price={t('pricing.pro.price')} 
              description={t('pricing.pro.description')} 
              features={[
                {
                  text: `50 ${t('pricing.features.promptsPerMonth')}`,
                  included: true
                },
                {
                  text: t('pricing.features.fullQuestionnaire'),
                  included: true
                },
                {
                  text: t('pricing.features.aiModelIntegrations'),
                  included: true
                },
                {
                  text: t('pricing.features.promptHistoryTemplates'),
                  included: true
                },
                {
                  text: t('pricing.features.useOwnApiKeys'),
                  included: true
                },
                {
                  text: t('pricing.features.advancedSecuritySections'),
                  included: true
                }
              ]} 
              ctaText="Upgrade to Pro" 
              popular={true} 
              apiOption={true} 
            />
            
            <PricingCard 
              title={t('pricing.team.title')} 
              price={t('pricing.team.price')} 
              description={t('pricing.team.description')} 
              features={[
                {
                  text: t('pricing.features.unlimitedPrompts'),
                  included: true
                },
                {
                  text: t('pricing.features.fullQuestionnaire'),
                  included: true
                },
                {
                  text: t('pricing.features.aiModelIntegrations'),
                  included: true
                },
                {
                  text: t('pricing.features.promptLibrarySharing'),
                  included: true
                },
                {
                  text: t('pricing.features.useOwnApiKeys'),
                  included: true
                },
                {
                  text: t('pricing.features.prioritySupport'),
                  included: true
                }
              ]} 
              ctaText="Choose Team" 
              apiOption={true} 
            />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section id="cta-section" className="py-16 md:py-24 bg-darkBg backdrop-blur-lg opacity-0 slide-in scroll-mt-24"> {/* Sem sombra inferior aqui, pois é a última antes do footer */}
        <div className="container px-4 mx-auto text-center">
          <div className="relative pt-12"> {/* Adicionado pt-12 para dar espaço ao badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-darkBg/50 shadow-lg rounded-full px-4 py-2 flex items-center border border-aquaGreen/30 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-aquaGreen mr-2" />
              <span className="text-sm font-medium text-pureWhite">{t('cta.guarantee')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pureWhite">{t('cta.title')}</h2>
            <p className="text-xl text-pureWhite/90 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col items-center gap-4 mt-6"> {/* Adicionado container flex */}
              <p className="text-neonPink font-semibold text-center text-sm tracking-wider">{t('cta.limitedOffer')}</p>
              <Link to="/prompt-generator">
                <Button className="bg-neonPink hover:bg-opacity-80 text-pureWhite text-lg px-8 py-4 h-auto rounded-lg shadow-lg hover:shadow-neonPink/50 hover:scale-105 transition-all duration-300">
                  {t('cta.button')} - {t('cta.getStartedNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

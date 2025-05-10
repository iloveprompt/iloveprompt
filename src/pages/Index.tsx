
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { isAuthenticated, redirectAfterLogin, user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Efeito para redirecionar usuários autenticados após retorno de autenticação social
  useEffect(() => {
    // Verificamos se o usuário está autenticado e estamos na página inicial
    // Apenas redirecionamos se não estiver em processo de carregamento
    if (isAuthenticated && !loading && user) {
      console.log('Usuário autenticado na página inicial, redirecionando automaticamente');
      // Usar setTimeout para evitar problemas de estado
      setTimeout(() => {
        redirectAfterLogin(user.id);
      }, 100);
    }
  }, [isAuthenticated, user, loading, redirectAfterLogin]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="pt-24 pb-16 md:pt-32 md:pb-24 bg-cover bg-center" 
        style={{
          backgroundImage: 'url("/lovable-uploads/eecd25b5-caab-48fd-88bb-c6a40aa68e93.png")'
        }}
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg font-bold text-slate-50 background-color:white">
                {t('hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/prompt-generator">
                  <Button className="bg-white hover:bg-gray-100 text-lg h-auto text-slate-900 px-[50px] py-[7px] font-medium rounded-xl">
                    {t('hero.ctaStart')}
                  </Button>
                </Link>
                <Link to="/features">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-slate-900 h-auto px-[50px] py-[7px] font-bold text-lg rounded-xl"
                  >
                    {t('common.learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="glass-card rounded-2xl p-6 shadow-xl bg-black/30 backdrop-blur-sm">
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm text-gray-800 font-mono">
                    <code>{t('hero.codeExample')}</code>
                    <br />
                    <code className="text-brand-700">{t('hero.promptComponents.intro')}</code>
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
                <p className="text-gray-200 text-sm italic">{t('hero.promptDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step1.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step1.description')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step2.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step2.description')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('howItWorks.step3.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
      
      {/* Pricing Section Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricing.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('pricing.description')}
            </p>
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
      <section className="py-16 md:py-24 bg-brand-50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Link to="/prompt-generator">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-6 h-auto rounded-lg">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import { Code, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 hero-gradient">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Craft Perfect AI Prompts for Developers
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Generate highly effective prompts tailored for software development through our guided questionnaire system.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/prompt-generator">
                  <Button className="bg-white text-brand-700 hover:bg-gray-100 hover:text-brand-800 text-lg px-6 py-6 h-auto">
                    Start Creating Now
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-6 py-6 h-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm text-gray-800 font-mono">
                    <code>// Generated AI Prompt Example</code>
                    <br />
                    <code className="text-brand-700">Create a React component that:</code>
                    <br />
                    <code>1. Fetches data from an API</code>
                    <br />
                    <code>2. Implements proper error handling</code>
                    <br />
                    <code>3. Uses TypeScript interfaces for type safety</code>
                    <br />
                    <code>4. Follows SOLID principles...</code>
                  </pre>
                </div>
                <p className="text-gray-600 text-sm italic">Our system creates detailed, optimized prompts tailored for your specific development needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How iloveprompt Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our guided questionnaire system helps you create the perfect prompt for your development needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Answer Questions</h3>
              <p className="text-gray-600">Complete our guided questionnaire about your development requirements.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Prompt</h3>
              <p className="text-gray-600">Our system crafts a detailed prompt optimized for AI code generation.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-brand-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">Use the prompt with your favorite AI to receive high-quality code solutions.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed specifically for developers, our platform offers everything you need to create effective AI prompts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Comprehensive Questionnaire" 
              description="Our guided question system covers all aspects of software development requirements."
              icon={<Code className="h-6 w-6" />}
              delay="delay-100"
            />
            <FeatureCard 
              title="Security Focus" 
              description="Includes specialized sections for security considerations and best practices."
              icon={<Shield className="h-6 w-6" />}
              delay="delay-200"
            />
            <FeatureCard 
              title="Multiple AI Integration" 
              description="Execute your prompts with various AI models directly in our platform."
              icon={<Zap className="h-6 w-6" />}
              delay="delay-300"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your development needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              title="Free"
              price="$0"
              description="Perfect for trying out our platform"
              features={[
                { text: "5 prompts per month", included: true },
                { text: "Basic questionnaire", included: true },
                { text: "GPT-3.5 integration", included: true },
                { text: "Prompt history (limited)", included: true },
                { text: "Use your own API keys", included: false },
                { text: "Advanced security section", included: false },
              ]}
              ctaText="Start Free"
            />
            
            <PricingCard 
              title="Pro"
              price="$19"
              description="For professional developers"
              features={[
                { text: "50 prompts per month", included: true },
                { text: "Full questionnaire access", included: true },
                { text: "All AI model integrations", included: true },
                { text: "Prompt history & templates", included: true },
                { text: "Use your own API keys", included: true },
                { text: "Advanced security sections", included: true },
              ]}
              ctaText="Upgrade to Pro"
              popular={true}
              apiOption={true}
            />
            
            <PricingCard 
              title="Team"
              price="$49"
              description="For development teams"
              features={[
                { text: "Unlimited prompts", included: true },
                { text: "Full questionnaire access", included: true },
                { text: "All AI model integrations", included: true },
                { text: "Prompt library & sharing", included: true },
                { text: "Use your own API keys", included: true },
                { text: "Priority support", included: true },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to create better prompts?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start generating optimized prompts for your development needs today.
          </p>
          <Link to="/prompt-generator">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-6 h-auto rounded-lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

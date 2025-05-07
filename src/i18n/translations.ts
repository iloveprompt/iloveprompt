type Translation = {
  [key: string]: string | Record<string, string | Record<string, string>>;
};

export const translations: Record<string, Translation> = {
  en: {
    common: {
      home: "Home",
      pricing: "Pricing",
      features: "Features",
      login: "Log in",
      startFree: "Start Free",
      learnMore: "Learn More",
    },
    hero: {
      title: "Craft Perfect AI Prompts for Developers",
      description: "Generate highly effective prompts tailored for software development through our guided questionnaire system.",
      ctaStart: "Start Creating Now",
      codeExample: "// Generated AI Prompt Example",
      promptComponents: {
        intro: "Create a React component that:",
        item1: "1. Fetches data from an API",
        item2: "2. Implements proper error handling",
        item3: "3. Uses TypeScript interfaces for type safety",
        item4: "4. Follows SOLID principles...",
      },
      promptDescription: "Our system creates detailed, optimized prompts tailored for your specific development needs."
    },
    howItWorks: {
      title: "How iloveprompt Works",
      description: "Our guided questionnaire system helps you create the perfect prompt for your development needs.",
      step1: {
        title: "Answer Questions",
        description: "Complete our guided questionnaire about your development requirements."
      },
      step2: {
        title: "Generate Prompt",
        description: "Our system crafts a detailed prompt optimized for AI code generation."
      },
      step3: {
        title: "Get Results",
        description: "Use the prompt with your favorite AI to receive high-quality code solutions."
      }
    },
    features: {
      title: "Key Features",
      description: "Designed specifically for developers, our platform offers everything you need to create effective AI prompts.",
      feature1: {
        title: "Comprehensive Questionnaire",
        description: "Our guided question system covers all aspects of software development requirements."
      },
      feature2: {
        title: "Security Focus",
        description: "Includes specialized sections for security considerations and best practices."
      },
      feature3: {
        title: "Multiple AI Integration",
        description: "Execute your prompts with various AI models directly in our platform."
      }
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      description: "Choose the plan that fits your development needs.",
      free: {
        title: "Free",
        price: "$0",
        description: "Perfect for trying out our platform"
      },
      pro: {
        title: "Pro",
        price: "$19",
        description: "For professional developers"
      },
      team: {
        title: "Team",
        price: "$49",
        description: "For development teams"
      },
      features: {
        promptsPerMonth: "prompts per month",
        basicQuestionnaire: "Basic questionnaire",
        gpt35Integration: "GPT-3.5 integration",
        promptHistory: "Prompt history (limited)",
        useOwnApiKeys: "Use your own API keys",
        advancedSecuritySection: "Advanced security section",
        fullQuestionnaire: "Full questionnaire access",
        aiModelIntegrations: "All AI model integrations",
        promptHistoryTemplates: "Prompt history & templates",
        advancedSecuritySections: "Advanced security sections",
        unlimitedPrompts: "Unlimited prompts",
        promptLibrarySharing: "Prompt library & sharing",
        prioritySupport: "Priority support",
      }
    },
    cta: {
      title: "Ready to create better prompts?",
      description: "Start generating optimized prompts for your development needs today.",
      button: "Get Started for Free"
    },
    footer: {
      description: "Craft perfect AI prompts for software development with our guided questionnaire system.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      aboutUs: "About Us",
      contact: "Contact",
      blog: "Blog",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "All rights reserved."
    },
    languageSwitcher: {
      en: "English",
      pt: "Português"
    },
    auth: {
      loginTitle: "Sign in to your account",
      loginSubtitle: "Enter your credentials to access your account",
      registerTitle: "Create an account",
      registerSubtitle: "Sign up to get started with iloveprompt",
      forgotPasswordTitle: "Forgot your password?",
      forgotPasswordSubtitle: "Enter your email and we'll send you a reset link",
      resetPasswordTitle: "Reset your password",
      resetPasswordSubtitle: "Enter your new password",
      emailLabel: "Email",
      emailPlaceholder: "name@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "••••••••",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "••••••••",
      login: "Sign in",
      loggingIn: "Signing in...",
      register: "Create account",
      registering: "Creating account...",
      orContinueWith: "Or continue with",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      alreadyHaveAccount: "Already have an account?",
      forgotPassword: "Forgot your password?",
      sendResetLink: "Send reset link",
      sending: "Sending...",
      backToLogin: "Back to login",
      updatePassword: "Update password",
      updating: "Updating...",
      invalidEmail: "Invalid email address",
      passwordMinLength: "Password must be at least 6 characters",
      passwordsDoNotMatch: "Passwords do not match",
      loginSuccess: "Login successful",
      loginFailed: "Login failed",
      welcomeBack: "Welcome back!",
      tryAgain: "Please try again",
      registrationSuccess: "Registration successful",
      registrationFailed: "Registration failed",
      checkEmail: "Please check your email to verify your account",
      resetEmailSent: "Reset email sent",
      resetRequestFailed: "Password reset request failed",
      checkEmailForReset: "Please check your email for password reset instructions",
      passwordUpdated: "Password updated",
      passwordResetFailed: "Password reset failed",
      loginWithNewPassword: "You can now login with your new password",
      signedIn: "Signed in",
      signedOut: "Signed out",
      welcomeMessage: "Welcome to iloveprompt",
      comeBackSoon: "Come back soon!"
    }
  },
  pt: {
    common: {
      home: "Início",
      pricing: "Preços",
      features: "Funcionalidades",
      login: "Entrar",
      startFree: "Começar Grátis",
      learnMore: "Saiba Mais",
    },
    hero: {
      title: "Crie Prompts de IA Perfeitos para Desenvolvedores",
      description: "Gere prompts altamente eficazes adaptados para desenvolvimento de software através do nosso sistema de questionário guiado.",
      ctaStart: "Comece a Criar Agora",
      codeExample: "// Exemplo de Prompt de IA Gerado",
      promptComponents: {
        intro: "Crie um componente React que:",
        item1: "1. Busque dados de uma API",
        item2: "2. Implemente tratamento adequado de erros",
        item3: "3. Use interfaces TypeScript para segurança de tipos",
        item4: "4. Siga os princípios SOLID...",
      },
      promptDescription: "Nosso sistema cria prompts detalhados e otimizados adaptados para suas necessidades específicas de desenvolvimento."
    },
    howItWorks: {
      title: "Como o iloveprompt Funciona",
      description: "Nosso sistema de questionário guiado ajuda você a criar o prompt perfeito para suas necessidades de desenvolvimento.",
      step1: {
        title: "Responda Perguntas",
        description: "Complete nosso questionário guiado sobre seus requisitos de desenvolvimento."
      },
      step2: {
        title: "Gere o Prompt",
        description: "Nosso sistema cria um prompt detalhado otimizado para geração de código com IA."
      },
      step3: {
        title: "Obtenha Resultados",
        description: "Use o prompt com sua IA favorita para receber soluções de código de alta qualidade."
      }
    },
    features: {
      title: "Principais Funcionalidades",
      description: "Projetado especificamente para desenvolvedores, nossa plataforma oferece tudo o que você precisa para criar prompts de IA eficazes.",
      feature1: {
        title: "Questionário Abrangente",
        description: "Nosso sistema de perguntas guiadas cobre todos os aspectos dos requisitos de desenvolvimento de software."
      },
      feature2: {
        title: "Foco em Segurança",
        description: "Inclui seções especializadas para considerações de segurança e melhores práticas."
      },
      feature3: {
        title: "Integração com Múltiplas IAs",
        description: "Execute seus prompts com vários modelos de IA diretamente em nossa plataforma."
      }
    },
    pricing: {
      title: "Preços Simples e Transparentes",
      description: "Escolha o plano que se adapta às suas necessidades de desenvolvimento.",
      free: {
        title: "Gratuito",
        price: "R$0",
        description: "Perfeito para experimentar nossa plataforma"
      },
      pro: {
        title: "Pro",
        price: "R$99",
        description: "Para desenvolvedores profissionais"
      },
      team: {
        title: "Equipe",
        price: "R$249",
        description: "Para equipes de desenvolvimento"
      },
      features: {
        promptsPerMonth: "prompts por mês",
        basicQuestionnaire: "Questionário básico",
        gpt35Integration: "Integração com GPT-3.5",
        promptHistory: "Histórico de prompts (limitado)",
        useOwnApiKeys: "Use suas próprias chaves de API",
        advancedSecuritySection: "Seção de segurança avançada",
        fullQuestionnaire: "Acesso completo ao questionário",
        aiModelIntegrations: "Integração com todos os modelos de IA",
        promptHistoryTemplates: "Histórico e modelos de prompts",
        advancedSecuritySections: "Seções de segurança avançadas",
        unlimitedPrompts: "Prompts ilimitados",
        promptLibrarySharing: "Biblioteca e compartilhamento de prompts",
        prioritySupport: "Suporte prioritário",
      }
    },
    cta: {
      title: "Pronto para criar melhores prompts?",
      description: "Comece a gerar prompts otimizados para suas necessidades de desenvolvimento hoje.",
      button: "Comece Gratuitamente"
    },
    footer: {
      description: "Crie prompts perfeitos de IA para desenvolvimento de software com nosso sistema de questionário guiado.",
      product: "Produto",
      company: "Empresa",
      legal: "Legal",
      aboutUs: "Sobre Nós",
      contact: "Contato",
      blog: "Blog",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      copyright: "Todos os direitos reservados."
    },
    languageSwitcher: {
      en: "English",
      pt: "Português"
    },
    auth: {
      loginTitle: "Entre na sua conta",
      loginSubtitle: "Digite suas credenciais para acessar sua conta",
      registerTitle: "Crie uma conta",
      registerSubtitle: "Registre-se para começar a usar o iloveprompt",
      forgotPasswordTitle: "Esqueceu sua senha?",
      forgotPasswordSubtitle: "Digite seu email e enviaremos um link de redefinição",
      resetPasswordTitle: "Redefina sua senha",
      resetPasswordSubtitle: "Digite sua nova senha",
      emailLabel: "Email",
      emailPlaceholder: "nome@exemplo.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "••••••••",
      newPasswordLabel: "Nova senha",
      newPasswordPlaceholder: "••••••••",
      confirmPasswordLabel: "Confirme a senha",
      confirmPasswordPlaceholder: "••••••••",
      login: "Entrar",
      loggingIn: "Entrando...",
      register: "Criar conta",
      registering: "Criando conta...",
      orContinueWith: "Ou continue com",
      noAccount: "Não tem uma conta?",
      signUp: "Registre-se",
      alreadyHaveAccount: "Já tem uma conta?",
      forgotPassword: "Esqueceu sua senha?",
      sendResetLink: "Enviar link de redefinição",
      sending: "Enviando...",
      backToLogin: "Voltar para o login",
      updatePassword: "Atualizar senha",
      updating: "Atualizando...",
      invalidEmail: "Endereço de email inválido",
      passwordMinLength: "A senha deve ter pelo menos 6 caracteres",
      passwordsDoNotMatch: "As senhas não coincidem",
      loginSuccess: "Login bem-sucedido",
      loginFailed: "Falha no login",
      welcomeBack: "Bem-vindo de volta!",
      tryAgain: "Por favor, tente novamente",
      registrationSuccess: "Registro bem-sucedido",
      registrationFailed: "Falha no registro",
      checkEmail: "Por favor, verifique seu email para confirmar sua conta",
      resetEmailSent: "Email de redefinição enviado",
      resetRequestFailed: "Falha na solicitação de redefinição de senha",
      checkEmailForReset: "Por favor, verifique seu email para instruções de redefinição de senha",
      passwordUpdated: "Senha atualizada",
      passwordResetFailed: "Falha na redefinição de senha",
      loginWithNewPassword: "Agora você pode fazer login com sua nova senha",
      signedIn: "Conectado",
      signedOut: "Desconectado",
      welcomeMessage: "Bem-vindo ao iloveprompt",
      comeBackSoon: "Volte logo!"
    }
  }
};

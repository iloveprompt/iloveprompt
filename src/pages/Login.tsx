
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Github, Mail } from 'lucide-react';
import { colors } from '@/styles/colors';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { redirectAfterLogin, isAuthenticated } = useAuth();
  
  // Check if user is already logged in and redirect if necessary
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting');
      redirectAfterLogin(undefined);
    }
  }, [isAuthenticated, redirectAfterLogin]);

  // Define the form schema
  const formSchema = z.object({
    email: z.string().email({
      message: t('auth.invalidEmail'),
    }),
    password: z.string().min(6, {
      message: t('auth.passwordMinLength'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle login form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoggingIn(true);
      console.log('Logging in with email/password');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      console.log('Login successful, redirecting');
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
      
      // Manually handle redirect after login
      if (data.user) {
        console.log('Manually redirecting after successful login');
        redirectAfterLogin(data.user.email);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
    } finally {
      // Important: Always reset loading state 
      setIsLoggingIn(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      console.log('Attempting Google login');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
      setIsLoggingIn(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoggingIn(true);
      console.log('Attempting GitHub login');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('GitHub login error:', error);
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <img 
              src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" 
              alt="iloveprompt logo" 
              className="h-12 mx-auto" 
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('auth.loginSubtitle')}</p>
        </div>
        
        <div className="space-y-4">
          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              className="w-full border border-gray-300 bg-white hover:bg-gray-50"
              disabled={isLoggingIn}
            >
              <Mail className="mr-2 h-5 w-5 text-red-500" />
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGithubLogin} 
              className="w-full border border-gray-300 bg-white hover:bg-gray-50"
              disabled={isLoggingIn}
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
            </div>
          </div>
          
          {/* Email/Password login form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('auth.emailPlaceholder')} 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.passwordLabel')}</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder={t('auth.passwordPlaceholder')}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                style={{ backgroundColor: colors.blue[600] }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? t('auth.loggingIn') : t('auth.login')}
              </Button>
            </form>
          </Form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500"
                style={{ color: colors.blue[600] }}
                onClick={() => navigate('/register')}
              >
                {t('auth.signUp')}
              </Button>
            </p>
            <Button 
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-900 mt-2"
              onClick={() => navigate('/forgot-password')}
            >
              {t('auth.forgotPassword')}
            </Button>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-500">
              {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

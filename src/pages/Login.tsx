
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Mail, Github, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { colors } from '@/styles/colors';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
      
      navigate('/prompt-generator');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/prompt-generator`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/prompt-generator`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message || t('auth.tryAgain'),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
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
              >
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGithubLogin} 
                className="w-full border border-gray-300 bg-white hover:bg-gray-50"
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
                        <Input 
                          placeholder={t('auth.passwordPlaceholder')}
                          type="password"
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
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? t('auth.loggingIn') : t('auth.login')}
                </Button>
              </form>
            </Form>
          </div>
          
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;

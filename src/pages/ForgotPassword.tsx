
import React from 'react';
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
import { colors } from '@/styles/colors';

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define the form schema
  const formSchema = z.object({
    email: z.string().email({
      message: t('auth.invalidEmail'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: t('auth.resetEmailSent'),
        description: t('auth.checkEmailForReset'),
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.resetRequestFailed'),
        description: error.message || t('auth.tryAgain'),
      });
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
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.forgotPasswordTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('auth.forgotPasswordSubtitle')}</p>
        </div>
        
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
            <Button 
              type="submit" 
              className="w-full text-white"
              style={{ backgroundColor: colors.blue[600] }}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? t('auth.sending') : t('auth.sendResetLink')}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            className="p-0 h-auto font-medium hover:text-blue-500"
            style={{ color: colors.blue[600] }}
            onClick={() => navigate('/login')}
          >
            {t('auth.backToLogin')}
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-blue-500">
            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

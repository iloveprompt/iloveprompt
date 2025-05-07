
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { colors } from '@/styles/colors';

const ResetPasswordPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define the form schema
  const formSchema = z.object({
    password: z.string().min(6, {
      message: t('auth.passwordMinLength'),
    }),
    confirmPassword: z.string().min(6, {
      message: t('auth.passwordMinLength'),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;
      
      toast({
        title: t('auth.passwordUpdated'),
        description: t('auth.loginWithNewPassword'),
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordResetFailed'),
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
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.resetPasswordTitle')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('auth.resetPasswordSubtitle')}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.newPasswordLabel')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('auth.newPasswordPlaceholder')}
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPasswordLabel')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('auth.confirmPasswordPlaceholder')}
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
                className="w-full text-white"
                style={{ backgroundColor: colors.blue[600] }}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t('auth.updating') : t('auth.updatePassword')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;

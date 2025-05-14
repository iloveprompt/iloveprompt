
import { useToast as useToastOriginal, toast as toastOriginal } from "@/hooks/use-toast";

type ToastOptions = Parameters<typeof toastOriginal>[0];

// Create wrapper functions to ensure type safety
export const useToast = () => {
  const original = useToastOriginal();
  
  return {
    ...original,
    toast: (options: ToastOptions) => original.toast(options)
  };
};

export const toast = (options: ToastOptions) => toastOriginal(options);

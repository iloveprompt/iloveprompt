
import { useToast as useToastOriginal, toast as toastOriginal, ToastProps } from "@/hooks/use-toast";

// Re-export the types to make them available from both paths
export type { ToastProps };

// Create wrapper functions to ensure type safety
export const useToast = () => {
  const original = useToastOriginal();
  
  return {
    ...original,
    toast: (options: ToastProps) => original.toast(options)
  };
};

export const toast = (options: ToastProps) => toastOriginal(options);

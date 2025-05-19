
import { useToast as useToastOriginal, toast as toastOriginal, ToastProps } from "@/hooks/use-toast";

// Re-export the types to make them available from both paths
export type { ToastProps };

// Create wrapper functions to ensure type safety
export const useToast = () => {
  return useToastOriginal();
};

export const toast = (options: ToastProps) => toastOriginal(options);

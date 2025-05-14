
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

// Define a proper type for toast options
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
  [key: string]: any;
};

export const toast = (props: ToastProps) => sonnerToast(props);

export { SonnerToaster as Toaster };

export const useToast = () => {
  return {
    toast: (props: ToastProps) => sonnerToast(props),
  };
};

export default useToast;

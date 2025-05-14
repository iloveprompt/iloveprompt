import { toast as sonnerToast, Toaster as SonnerToaster, ToastOptions } from "sonner";

export type ToastProps = ToastOptions & {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
};

export const toast = (props: ToastProps) => {
  const { title, description, ...options } = props;
  return sonnerToast(title || "", { description, ...options });
};

export { SonnerToaster as Toaster };

// Add a storage array to keep track of toasts for compatibility with shadcn Toast component
type Toast = ToastProps & {
  id: string | number;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const toastStore: Toast[] = [];

export const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      const id = toast(props);
      const newToast = { id, ...props };
      toastStore.push(newToast);
      return id;
    },
    toasts: toastStore
  };
};

export default useToast;

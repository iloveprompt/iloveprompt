
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

export const toast = sonnerToast;

export { SonnerToaster as Toaster };

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};

export default useToast;

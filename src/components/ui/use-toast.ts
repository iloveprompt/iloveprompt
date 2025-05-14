
import { useToast as useShadcnToast } from "@/hooks/use-toast";
import { toast as shadowToast } from "@/hooks/use-toast";

export const useToast = useShadcnToast;
export const toast = shadowToast;

export default { useToast, toast };


import * as React from "react";
import { cn } from "@/lib/utils";

export interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SimpleButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300", 
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", 
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SimpleButton.displayName = "SimpleButton";

export { SimpleButton };


import React, { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input 
          type={showPassword ? 'text' : 'password'} 
          className={`pr-10 ${className || ''}`}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-0 bg-transparent hover:bg-transparent text-gray-500"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  }
);

// Add displayName for improved debugging experience
PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

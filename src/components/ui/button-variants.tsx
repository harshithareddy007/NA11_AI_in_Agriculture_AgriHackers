import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";

interface CameraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const CameraButton: React.FC<CameraButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button
      className={cn(
        "w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground",
        "camera-pulse shadow-lg hover:shadow-xl transition-all duration-300",
        "text-lg font-semibold border-4 border-primary-foreground/20",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

interface LanguageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({ 
  children, 
  className, 
  isSelected = false,
  ...props 
}) => {
  return (
    <Button
      className={cn(
        "h-20 text-lg font-semibold rounded-2xl transition-all duration-300",
        "border-2 hover:scale-105 gentle-fade-in",
        isSelected 
          ? "bg-primary text-primary-foreground border-primary shadow-lg" 
          : "bg-card text-card-foreground border-border hover:border-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'organic' | 'chemical' | 'warning';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  className,
  variant = 'organic',
  ...props 
}) => {
  const variantClasses = {
    organic: 'bg-organic hover:bg-organic/90 text-organic-foreground',
    chemical: 'bg-chemical hover:bg-chemical/90 text-chemical-foreground',
    warning: 'bg-warning hover:bg-warning/90 text-warning-foreground'
  };

  return (
    <Button
      className={cn(
        "rounded-xl font-medium transition-all duration-300 hover:scale-105",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
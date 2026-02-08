import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl p-1.5",
        variant === "default" 
          ? "bg-gradient-to-br from-primary to-secondary" 
          : "bg-white/20 backdrop-blur-sm"
      )}>
        <Leaf className={cn(
          iconSizes[size],
          variant === "default" ? "text-white" : "text-white"
        )} />
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "font-bold tracking-tight leading-none",
          sizes[size],
          variant === "default" ? "text-foreground" : "text-white"
        )}>
          AFAQ
        </span>
        <span className={cn(
          "text-[0.6em] font-medium tracking-widest uppercase opacity-70",
          variant === "default" ? "text-muted-foreground" : "text-white/80"
        )}>
          آفاق
        </span>
      </div>
    </div>
  );
}

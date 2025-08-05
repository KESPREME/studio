import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton";
import { AlertTriangle, Clock, CheckCircle, BarChart3 } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  variant?: 'default' | 'new' | 'inProgress' | 'resolved';
  isLoading?: boolean;
};

export function StatCard({ title, value, variant = 'default', isLoading = false }: StatCardProps) {
  const getVariantConfig = (variant: string) => {
    switch (variant) {
      case 'new':
        return {
          gradient: "from-blue-500/20 via-blue-600/10 to-blue-700/5",
          border: "border-blue-500/30",
          glow: "shadow-blue-500/25",
          icon: AlertTriangle,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-500/20",
          textGradient: "from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200",
          pulse: "animate-pulse",
          particles: "bg-blue-400/30"
        };
      case 'inProgress':
        return {
          gradient: "from-orange-500/20 via-orange-600/10 to-orange-700/5",
          border: "border-orange-500/30",
          glow: "shadow-orange-500/25",
          icon: Clock,
          iconColor: "text-orange-600 dark:text-orange-400",
          iconBg: "bg-orange-500/20",
          textGradient: "from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-200",
          pulse: "animate-spin",
          particles: "bg-orange-400/30"
        };
      case 'resolved':
        return {
          gradient: "from-green-500/20 via-green-600/10 to-green-700/5",
          border: "border-green-500/30",
          glow: "shadow-green-500/25",
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          iconBg: "bg-green-500/20",
          textGradient: "from-green-600 to-green-800 dark:from-green-400 dark:to-green-200",
          pulse: "",
          particles: "bg-green-400/30"
        };
      default:
        return {
          gradient: "from-slate-500/20 via-slate-600/10 to-slate-700/5",
          border: "border-slate-500/30",
          glow: "shadow-slate-500/25",
          icon: BarChart3,
          iconColor: "text-slate-600 dark:text-slate-400",
          iconBg: "bg-slate-500/20",
          textGradient: "from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-200",
          pulse: "",
          particles: "bg-slate-400/30"
        };
    }
  };

  const config = getVariantConfig(variant);
  const IconComponent = config.icon;

  return (
    <div className="group relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className={`absolute top-2 left-4 w-1 h-1 ${config.particles} rounded-full animate-ping delay-100`}></div>
        <div className={`absolute top-6 right-8 w-1.5 h-1.5 ${config.particles} rounded-full animate-ping delay-300`}></div>
        <div className={`absolute bottom-4 left-8 w-1 h-1 ${config.particles} rounded-full animate-ping delay-500`}></div>
        <div className={`absolute bottom-8 right-4 w-0.5 h-0.5 ${config.particles} rounded-full animate-ping delay-700`}></div>
      </div>

      <Card className={cn(
        "relative overflow-hidden transition-all duration-700 transform-gpu",
        "hover:scale-105 hover:-translate-y-2 hover:rotate-1",
        "bg-gradient-to-br", config.gradient,
        "border-2", config.border,
        "shadow-2xl hover:shadow-3xl", config.glow,
        "backdrop-blur-xl rounded-3xl",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5",
        "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/5 after:via-transparent after:to-white/10"
      )}>
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

        {/* 3D depth layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>

        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            {title}
          </CardTitle>
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-500 transform-gpu",
            config.iconBg,
            "group-hover:scale-110 group-hover:rotate-12",
            config.pulse
          )}>
            <IconComponent className={cn("h-5 w-5", config.iconColor)} />
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pb-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-20 rounded-xl" />
              <div className="flex gap-1">
                <Skeleton className="h-1 w-8 rounded-full" />
                <Skeleton className="h-1 w-6 rounded-full" />
                <Skeleton className="h-1 w-4 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className={cn(
                "text-5xl font-black tracking-tight transition-all duration-500",
                "bg-gradient-to-r bg-clip-text text-transparent",
                config.textGradient,
                "group-hover:scale-110 transform-gpu"
              )}>
                {value}
              </div>

              {/* Animated progress bar */}
              <div className="flex gap-1 mt-3">
                <div className={cn("h-1 rounded-full transition-all duration-700 delay-100",
                  variant === 'resolved' ? 'w-8 bg-green-400' : 'w-6 bg-slate-300 dark:bg-slate-600'
                )}></div>
                <div className={cn("h-1 rounded-full transition-all duration-700 delay-200",
                  variant === 'inProgress' || variant === 'resolved' ? 'w-6 bg-orange-400' : 'w-4 bg-slate-300 dark:bg-slate-600'
                )}></div>
                <div className={cn("h-1 rounded-full transition-all duration-700 delay-300",
                  variant === 'new' || variant === 'inProgress' || variant === 'resolved' ? 'w-4 bg-blue-400' : 'w-2 bg-slate-300 dark:bg-slate-600'
                )}></div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Floating orb effect */}
        <div className={cn(
          "absolute -top-2 -right-2 w-4 h-4 rounded-full opacity-60",
          "bg-gradient-to-r", config.gradient,
          "animate-pulse group-hover:animate-bounce"
        )}></div>
      </Card>
    </div>
  )
}

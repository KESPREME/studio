import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton";

type StatCardProps = {
  title: string;
  value: number | string;
  variant?: 'default' | 'new' | 'inProgress' | 'resolved';
  isLoading?: boolean;
};

export function StatCard({ title, value, variant = 'default', isLoading = false }: StatCardProps) {
  const variantClasses = {
    default: "bg-card",
    new: "bg-primary/10 border-primary",
    inProgress: "bg-accent/20 border-accent",
    resolved: "bg-green-500/10 border-green-500",
  }

  return (
    <Card className={cn("shadow-md transition-colors duration-300", variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-1/2" />
        ) : (
          <div className="text-4xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string;
  value: number | string;
  variant?: 'default' | 'new' | 'inProgress' | 'resolved';
};

export function StatCard({ title, value, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: "bg-card",
    new: "bg-blue-100 dark:bg-blue-900/50 border-primary",
    inProgress: "bg-orange-100 dark:bg-orange-900/50 border-accent",
    resolved: "bg-green-100 dark:bg-green-900/50 border-green-500",
  }

  return (
    <Card className={cn("shadow-md", variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

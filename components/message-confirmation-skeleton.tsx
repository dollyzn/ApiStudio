import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export function MessageConfirmationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 bg-muted rounded-md w-2/5" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-3 bg-muted rounded-md w-2/6" />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Phone Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 bg-muted rounded-md w-1/4" />
              <Skeleton className="h-10 bg-muted rounded-md w-full" />
            </div>

            {/* Inbox Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 bg-muted rounded-md w-1/5" />
              <Skeleton className="h-10 bg-muted rounded-md w-2/6" />
            </div>

            {/* Código / Senha Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 bg-muted rounded-md w-1/4" />
                <Skeleton className="h-10 bg-muted rounded-md w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 bg-muted rounded-md w-1/4" />
                <Skeleton className="h-10 bg-muted rounded-md w-full" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Skeleton className="h-10 bg-muted rounded-md flex-1" />
              <Skeleton className="h-10 bg-muted rounded-md flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

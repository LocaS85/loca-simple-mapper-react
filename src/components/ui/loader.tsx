
import { Skeleton } from "@/components/ui/skeleton";

export interface LoaderProps {
  className?: string;
}

export function Loader({ className = "h-8 w-full" }: LoaderProps) {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className={className} />
      <Skeleton className={className} />
      <Skeleton className={className} />
    </div>
  );
}

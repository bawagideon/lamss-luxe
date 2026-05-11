import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column: Image Skeleton */}
          <div className="flex flex-col space-y-4">
            <Skeleton className="w-full aspect-[3/4] md:aspect-[4/5] rounded-xl" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="w-full aspect-square rounded-md" />
            </div>
          </div>

          {/* Right Column: Details Skeleton */}
          <div className="flex flex-col mt-4 md:mt-0 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-6 w-1/4 rounded-md" />
            </div>
            
            <Skeleton className="h-20 w-full rounded-md" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

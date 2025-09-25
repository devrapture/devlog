"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeletonLoader = () => {
  return (
    <Card className="mt-10">
      <CardHeader>
        <div className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="mx-auto h-24 w-24 rounded-full md:mx-0" />

          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Skeleton className="mb-2 h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <Skeleton className="mb-4 h-4 w-full max-w-md" />

            <div className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="mt-4 flex justify-center gap-2 md:justify-start">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileSkeletonLoader;

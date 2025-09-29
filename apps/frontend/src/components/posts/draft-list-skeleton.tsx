import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const DraftListSkeleton = () => {
    return (
        <div className="space-y-4" aria-busy="true" aria-live="polite">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            {/* Left */}
                            <div className="flex-1">
                                {/* Title */}
                                <Skeleton className="mb-2 h-5 w-56" />
                                {/* Categories (3 pills) */}
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                                {/* Date line */}
                                <Skeleton className="h-4 w-40" />
                            </div>

                            {/* Right: action buttons row */}
                            <div className="ml-4 flex shrink-0 gap-2">
                                <Skeleton className="h-8 w-20 rounded-md" /> {/* Edit */}
                                <Skeleton className="h-8 w-24 rounded-md" /> {/* Publish */}
                                <Skeleton className="h-8 w-8 rounded-md" /> {/* Trash */}
                                <Skeleton className="h-8 w-24 rounded-md" />{" "}
                                {/* Continue/Delete confirm */}
                            </div>
                        </div>
                    </CardHeader>

                    {/* Body preview */}
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[92%]" />
                            <Skeleton className="h-4 w-[85%]" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DraftListSkeleton;

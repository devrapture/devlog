import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

const NoDrafts = () => {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          <FilePlus2 className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">No drafts yet</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            You haven’t created any draft. Start your first one now.
          </p>
        </div>
        <Link
          href={""}
          // href={routes.editor}
        >
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Draft
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NoDrafts;

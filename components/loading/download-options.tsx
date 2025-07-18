import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DownloadOptionsSkeleton() {
  return (
    <Card className="bg-card animate-pulse">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-200" />
          <div className="h-6 w-32 rounded bg-gray-200" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index}>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <div className="h-5 w-5 rounded bg-gray-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-16 rounded bg-gray-100" />
                  </div>
                  <div className="mt-2 h-4 w-20 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-10 w-28 rounded bg-gray-200" />
            </div>
            {index < 2 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

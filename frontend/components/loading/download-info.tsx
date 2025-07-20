import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DownloadInfoSkeleton() {
  return (
    <Card className="bg-card animate-pulse">
      <CardHeader>
        <CardTitle className="text-foreground">Download Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-100" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-100" />
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="mb-1 h-3 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  );
}

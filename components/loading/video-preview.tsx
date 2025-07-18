import { Card, CardContent } from "@/components/ui/card";

export default function VideoPreviewSkeleton() {
  return (
    <Card className="bg-card animate-pulse">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-video w-full rounded-t-lg bg-gray-200" />
          <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-t-lg">
            <div className="h-16 w-16 rounded-full bg-gray-300 opacity-80" />
          </div>
          <div className="absolute right-2 bottom-2 h-6 w-16 rounded bg-gray-300" />
        </div>
        <div className="p-6">
          <div className="mb-4 h-7 w-2/3 rounded bg-gray-200" />
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-4 w-12 rounded bg-gray-200" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-12 rounded bg-gray-200" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  );
}

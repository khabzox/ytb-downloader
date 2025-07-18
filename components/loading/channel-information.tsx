import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ChannelInformationSkeleton() {
  return (
    <Card className="bg-card animate-pulse">
      <CardHeader>
        <CardTitle className="text-foreground">Channel Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-[60px] w-[60px] rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-5 w-12 rounded bg-gray-100" />
            </div>
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
        </div>
        <Separator />
        <div>
          <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
        <Separator />
        <div>
          <div className="mb-3 h-4 w-24 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-gray-100" />
            <div className="h-4 w-32 rounded bg-gray-100" />
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

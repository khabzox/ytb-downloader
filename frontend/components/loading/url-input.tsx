export default function UrlInputLoading() {
  return (
    <div className="mx-auto mb-8 max-w-2xl">
      <div className="animate-pulse rounded-lg bg-gray-200 p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-12 flex-1 rounded-md bg-gray-300" />
          <div className="h-12 w-32 rounded-md bg-gray-300" />
        </div>
        <div className="mt-3 h-4 w-1/2 rounded bg-gray-300" />
      </div>
    </div>
  );
}

// app/components/loading.tsx
export default function Loading() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* You can use any loading animation here */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
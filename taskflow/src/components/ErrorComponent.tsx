import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            reset();
            router.invalidate();
          }}
        >
          Try again
        </Button>
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && error instanceof Error && (
        <pre className="mt-4 max-w-full overflow-auto rounded bg-muted p-4 text-xs">
          {error.stack}
        </pre>
      )}
    </div>
  );
}

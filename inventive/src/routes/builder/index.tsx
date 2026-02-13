import { createFileRoute } from "@tanstack/react-router";

import { Field } from "@/components/ui/"

export const Route = createFileRoute("/builder/")({
  component: Builder,
});

function Builder() {
  return <div>Hello "/builder/"!</div>;
}

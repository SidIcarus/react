import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/campaigns/$campaignId")({
  // In a loader
  // loader: ({ params }) => fetchPost(params.campaignId),
  // Or in a component
  component,
});

function component() {
  // In a component!
  const { campaignId } = Route.useParams();
  return <div>Campaign ID: {campaignId}</div>;
}

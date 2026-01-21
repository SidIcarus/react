import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/campaigns/')({
  component,
})

function component() {
  return <div>Hello "/campaigns"!</div>
}

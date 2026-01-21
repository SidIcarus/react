import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builder/video')({
  component,
})

function component() {
  return <div>Hello "/builder/video"!</div>
}

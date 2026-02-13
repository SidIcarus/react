import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/advertisers')({
  server: {
    handlers: {
      GET: () => json(data),
    },
  },
})


type Advertiser = {
  id: number,
  name: string,
}

const data: Advertiser[] = [
  { name: "Adventive Testing", id: 13328 },
  { name: "Amateur Golf", id: 15018 },
  { name: "Apple", id: 160 },
  { name: "beep w", id: 8814 },
  { name: "Beginnings", id: 15697 },
  { name: "Burger King", id: 161 },
  { name: "Default Advertiser", id: 79 },
  { name: "Designz", id: 15836 },
  { name: "Flickr", id: 15464 },
  { name: "Groundswell", id: 181 },
  { name: "Her Campus", id: 14281 },
  { name: "InTouch", id: 12030 },
  { name: "Jodel", id: 11683 },
  { name: "Johns Advertising", id: 8518 },
  { name: "Mansueto", id: 14197 },
  { name: "MRAID", id: 13212 },
  { name: "new test advertiser", id: 2983 },
  { name: "Parallax Examples", id: 9885 },
  { name: "Plugshare", id: 15153 },
  { name: "Prep Network", id: 15968 },
  { name: "Save Testing", id: 519 },
  { name: "smartframe", id: 11731 },
  { name: "T mobile", id: 11703 },
  { name: "Tabs and Slideshow", id: 13116 },
  { name: "Test adv 000", id: 5382 },
  { name: "Test Principal", id: 15427 },
  { name: "Titel", id: 14830 },
  { name: "TNT TEST 1", id: 3636 },
  { name: "Two Circles Test Ads", id: 10400 },
  { name: "VServ", id: 10878 },
  { name: "Wine", id: 15937 },
  { name: "Xapads", id: 11963 },
]

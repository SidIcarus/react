import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/demo/api/users')({
  server: {
    handlers: {
      GET: () => json(users),
    },
  },
})

type User = {
  isAdmin: boolean,
  isAnalyst: boolean,
  isBuilder: boolean,
  isGlobalAdmin: boolean,
  isTrafficker: boolean,
  lastLoginDate: string,
  name: string,
}

const users: User[] = [
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "07/24/19 9:39am",
    name: "Muhammad Chowdhury"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "08/25/17 11:48am",
    name: "sharkl las"
  },
  {
    isAdmin: false,
    isAnalyst: false,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: false,
    lastLoginDate: "12/31/69 7:00pm",
    name: "DatTest MeedTest"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: true,
    isTrafficker: true,
    lastLoginDate: "01/05/26 3:12pm",
    name: "Datrick Meed"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "11/12/18 4:51pm",
    name: "Dat TempTest"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "05/26/17 10:03pm",
    name: "MrDat Testing"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "02/12/20 5:14pm",
    name: "Ron Modeeguez"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "12/19/25 1:12pm",
    name: "Johnathan Rogletti"
  },
  {
    isAdmin: true,
    isAnalyst: false,
    isBuilder: false,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "12/31/69 7:00pm",
    name: "Invited User"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "02/26/25 12:40pm",
    name: "Paul PL"
  },
  {
    isAdmin: true,
    isAnalyst: true,
    isBuilder: true,
    isGlobalAdmin: false,
    isTrafficker: true,
    lastLoginDate: "01/07/26 10:43am",
    name: "Inventive Engineer"
  }
]

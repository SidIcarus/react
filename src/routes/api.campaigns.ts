import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/campaigns')({
  server: {
    handlers: {
      GET: () => json(data),
    },
  },
})

export type Campaign = {
  adCount: number,
  flightDate: [string, string],
  id: number,
  impressions: number,
  lastUpdatedDate: string,
  name: string,
  status: 'Active' | 'Archived' | 'In Development'
}

const data: Campaign[] = [
  {
    adCount: 5,
    flightDate: [
      '04/22/24',
      '06/29/24'
    ],
    id: 74609,
    impressions: 31,
    lastUpdatedDate: '09/16/25 04:10pm',
    name: 'Report Testing',
    status: 'Active'
  },
  {
    adCount: 6,
    flightDate: [
      '02/16/24',
      '07/06/24'
    ],
    id: 73797,
    impressions: 77,
    lastUpdatedDate: '10/02/25 03:19pm',
    name: 'Campaign of John',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '02/17/23',
      '06/30/23'
    ],
    id: 68720,
    impressions: 218,
    lastUpdatedDate: '12/14/23 06:48pm',
    name: 'TEST Wallpaper',
    status: 'Active'
  },
  {
    adCount: 22,
    flightDate: [
      '07/02/21',
      '07/31/21'
    ],
    id: 59438,
    impressions: 324,
    lastUpdatedDate: '07/21/25 02:26pm',
    name: 'Empty Campaign',
    status: 'Active'
  },
  {
    adCount: 11,
    flightDate: [
      '06/02/21',
      '06/30/21'
    ],
    id: 58831,
    impressions: 259,
    lastUpdatedDate: '12/14/23 06:55pm',
    name: 'essence testing',
    status: 'Active'
  },
  {
    adCount: 0,
    flightDate: [
      '03/23/21',
      '08/28/21'
    ],
    id: 57547,
    impressions: 0,
    lastUpdatedDate: '03/23/21 03:31pm',
    name: 'Animation Bugs',
    status: 'Active'
  },
  {
    adCount: 9,
    flightDate: [
      '02/11/21',
      '06/26/21'
    ],
    id: 56903,
    impressions: 35,
    lastUpdatedDate: '11/16/22 11:28am',
    name: 'Cityside Test Ads',
    status: 'Active'
  },
  {
    adCount: 9,
    flightDate: [
      '12/14/20',
      '05/31/21'
    ],
    id: 56095,
    impressions: 626,
    lastUpdatedDate: '11/30/23 04:49pm',
    name: 'Auto Slideshow',
    status: 'Active'
  },
  {
    adCount: 32,
    flightDate: [
      '04/13/19',
      '04/27/19'
    ],
    id: 43982,
    impressions: 1,
    lastUpdatedDate: '11/01/23 07:04pm',
    name: 'New Tes campaign',
    status: 'Active'
  },
  {
    adCount: 0,
    flightDate: [
      '02/15/19',
      '07/26/19'
    ],
    id: 42186,
    impressions: 0,
    lastUpdatedDate: '02/15/19 02:37pm',
    name: 'testestestes',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '01/15/19',
      '01/17/19'
    ],
    id: 41282,
    impressions: 199,
    lastUpdatedDate: '07/02/21 04:10pm',
    name: 'ViewabilityTesting',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '11/02/18',
      '02/23/19'
    ],
    id: 37936,
    impressions: 229,
    lastUpdatedDate: '11/02/18 10:31am',
    name: 'Mraid',
    status: 'Active'
  },
  {
    adCount: 21,
    flightDate: [
      '08/06/18',
      '09/15/18'
    ],
    id: 33303,
    impressions: 686,
    lastUpdatedDate: '12/17/25 06:12am',
    name: 'Test Campaign DB Update',
    status: 'Active'
  },
  {
    adCount: 0,
    flightDate: [
      '04/12/18',
      '04/30/18'
    ],
    id: 27909,
    impressions: 0,
    lastUpdatedDate: '06/26/18 02:54pm',
    name: 'Test 3_0_44_1_2',
    status: 'Active'
  },
  {
    adCount: 16,
    flightDate: [
      '03/29/18',
      '08/25/18'
    ],
    id: 27272,
    impressions: 355,
    lastUpdatedDate: '04/04/18 11:26am',
    name: 'Video Header Testing',
    status: 'Active'
  },
  {
    adCount: 10,
    flightDate: [
      '03/06/18',
      '03/31/18'
    ],
    id: 26065,
    impressions: 1,
    lastUpdatedDate: '08/11/23 10:13am',
    name: 'Test 3_0_43',
    status: 'Active'
  },
  {
    adCount: 13,
    flightDate: [
      '07/31/17',
      '08/05/17'
    ],
    id: 16821,
    impressions: 12,
    lastUpdatedDate: '07/31/17 07:07pm',
    name: 'DV tags',
    status: 'Active'
  },
  {
    adCount: 2,
    flightDate: [
      '07/19/17',
      '08/04/17'
    ],
    id: 16396,
    impressions: 3,
    lastUpdatedDate: '07/19/17 11:39am',
    name: '3_0_37',
    status: 'Active'
  },
  {
    adCount: 10,
    flightDate: [
      '03/22/17',
      '05/26/17'
    ],
    id: 11863,
    impressions: 40,
    lastUpdatedDate: '03/21/17 09:26am',
    name: '3_0_34d',
    status: 'Active'
  },
  {
    adCount: 3,
    flightDate: [
      '12/28/16',
      '03/17/17'
    ],
    id: 10089,
    impressions: 16,
    lastUpdatedDate: '04/20/22 06:48pm',
    name: 'Release 3_0_30',
    status: 'Active'
  },
  {
    adCount: 7,
    flightDate: [
      '06/20/16',
      '06/23/16'
    ],
    id: 5962,
    impressions: 49,
    lastUpdatedDate: '02/11/21 11:47am',
    name: 'Release 3.0.26',
    status: 'Active'
  },
  {
    adCount: 22,
    flightDate: [
      '04/04/16',
      '07/30/16'
    ],
    id: 4589,
    impressions: 463,
    lastUpdatedDate: '04/04/16 05:30pm',
    name: 'feat_release_v3.0.23',
    status: 'Active'
  },
  {
    adCount: 13,
    flightDate: [
      '11/10/15',
      '11/28/15'
    ],
    id: 2746,
    impressions: 50,
    lastUpdatedDate: '11/10/15 04:59pm',
    name: 'Feat_release_v3.0.17',
    status: 'Active'
  },
  {
    adCount: 11,
    flightDate: [
      '09/18/14',
      '11/08/14'
    ],
    id: 444,
    impressions: 351,
    lastUpdatedDate: '12/10/14 11:23pm',
    name: 'From Template',
    status: 'Active'
  },
  {
    adCount: 16,
    flightDate: [
      '08/01/14',
      '09/26/14'
    ],
    id: 340,
    impressions: 757,
    lastUpdatedDate: '03/12/21 05:10pm',
    name: 'test 44',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '08/01/14',
      '08/22/14'
    ],
    id: 339,
    impressions: 367,
    lastUpdatedDate: '09/07/14 02:36pm',
    name: 'test 3',
    status: 'Active'
  },
  {
    adCount: 1,
    flightDate: [
      '08/01/14',
      '12/26/14'
    ],
    id: 333,
    impressions: 143,
    lastUpdatedDate: '07/31/14 10:31pm',
    name: 'Billing Test',
    status: 'In Development'
  },
  {
    adCount: 10,
    flightDate: [
      '02/26/14',
      '09/27/14'
    ],
    id: 145,
    impressions: 399,
    lastUpdatedDate: '06/30/14 05:51pm',
    name: '20140226',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '08/24/76',
      '08/07/14'
    ],
    id: 91,
    impressions: 7,
    lastUpdatedDate: '04/29/14 10:47pm',
    name: '100000 test',
    status: 'Active'
  },
  {
    adCount: 21,
    flightDate: [
      '11/04/13',
      '06/30/14'
    ],
    id: 63,
    impressions: 7,
    lastUpdatedDate: '04/02/15 09:32pm',
    name: 'Ad Loading',
    status: 'Active'
  },
  {
    adCount: 8,
    flightDate: [
      '10/25/13',
      '01/31/14'
    ],
    id: 53,
    impressions: 28,
    lastUpdatedDate: '04/10/14 02:25pm',
    name: 'Johns Tex Mex',
    status: 'Active'
  }
]

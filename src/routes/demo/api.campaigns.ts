import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/demo/api/campaigns')({
  server: {
    handlers: {
      GET: () => json(campaigns),
    },
  },
})


type Campaign = {
  adCount: number,
  flightDate: [string, string],
  id: number,
  impressions: number,
  lastUpdated: string,
  name: string,
  status: 'Active' | 'Inactive' | 'Completed'
}

const campaigns: Campaign[] = [
  { name: "Report Testing", id: 74609, adCount: 5, status: 'Active', impressions: 31, lastUpdated: '09/16/25 04:10pm', flightDate: ['04/22/24', '06/29/24'] },
  { name: "Campaign of John", id: 73797, adCount: 6, status: 'Active', impressions: 77, lastUpdated: '10/02/25 03:19pm', flightDate: ['02/16/24', '07/06/24'] },
  { name: "TEST Wallpaper", id: 68720, adCount: 8, status: 'Active', impressions: 218, lastUpdated: '12/14/23 06:48pm', flightDate: ['02/17/23', '06/30/23'] },
  { name: "Empty Campaign", id: 59438, adCount: 22, status: 'Active', impressions: 324, lastUpdated: '07/21/25 02:26pm', flightDate: ['07/02/21', '07/31/21'] },
  { name: "essence testing", id: 58831, adCount: 11, status: 'Active', impressions: 259, lastUpdated: '12/14/23 06:55pm', flightDate: ['06/02/21', '06/30/21'] },
  { name: "Animation Bugs", id: 57547, adCount: 0, status: 'Active', impressions: 0, lastUpdated: '03/23/21 03:31pm', flightDate: ['03/23/21', '08/28/21'] },
  { name: "Cityside Test Ads", id: 56903, adCount: 9, status: 'Active', impressions: 35, lastUpdated: '11/16/22 11:28am', flightDate: ['02/11/21', '06/26/21'] },
  { name: "Auto Slideshow", id: 56095, adCount: 9, status: 'Active', impressions: 626, lastUpdated: '11/30/23 04:49pm', flightDate: ['12/14/20', '05/31/21'] },
  { name: "New Tes campaign", id: 43982, adCount: 32, status: 'Active', impressions: 1, lastUpdated: '11/01/23 07:04pm', flightDate: ['04/13/19', '04/27/19'] },
  { name: "testestestes", id: 42186, adCount: 0, status: 'Active', impressions: 0, lastUpdated: '02/15/19 02:37pm', flightDate: ['02/15/19', '07/26/19'] },
  { name: "ViewabilityTesting", id: 41282, adCount: 8, status: 'Active', impressions: 199, lastUpdated: '07/02/21 04:10pm', flightDate: ['01/15/19', '01/17/19'] },
  { name: "Mraid", id: 37936, adCount: 8, status: 'Active', impressions: 229, lastUpdated: '11/02/18 10:31am', flightDate: ['11/02/18', '02/23/19'] },
  { name: "Test Campaign DB Update", id: 33303, adCount: 21, status: 'Active', impressions: 686, lastUpdated: '12/17/25 06:12am', flightDate: ['08/06/18', '09/15/18'] },
  { name: "Test 3_0_44_1_2", id: 27909, adCount: 0, status: 'Active', impressions: 0, lastUpdated: '06/26/18 02:54pm', flightDate: ['04/12/18', '04/30/18'] },
  { name: "Video Header Testing", id: 27272, adCount: 16, status: 'Active', impressions: 355, lastUpdated: '04/04/18 11:26am', flightDate: ['03/29/18', '08/25/18'] },
  { name: "Test 3_0_43", id: 26065, adCount: 10, status: 'Active', impressions: 1, lastUpdated: '08/11/23 10:13am', flightDate: ['03/06/18', '03/31/18'] },
  { name: "DV tags", id: 16821, adCount: 13, status: 'Active', impressions: 12, lastUpdated: '07/31/17 07:07pm', flightDate: ['07/31/17', '08/05/17'] },
  { name: "3_0_37", id: 16396, adCount: 2, status: 'Active', impressions: 3, lastUpdated: '07/19/17 11:39am', flightDate: ['07/19/17', '08/04/17'] },
  { name: "3_0_34d", id: 11863, adCount: 10, status: 'Active', impressions: 40, lastUpdated: '03/21/17 09:26am', flightDate: ['03/22/17', '05/26/17'] },
  { name: "Release 3_0_30", id: 10089, adCount: 3, status: 'Active', impressions: 16, lastUpdated: '04/20/22 06:48pm', flightDate: ['12/28/16', '03/17/17'] },
  { name: "Release 3.0.26", id: 5962, adCount: 7, status: 'Active', impressions: 49, lastUpdated: '02/11/21 11:47am', flightDate: ['06/20/16', '06/23/16'] },
  { name: "feat_release_v3.0.23", id: 4589, adCount: 22, status: 'Active', impressions: 463, lastUpdated: '04/04/16 05:30pm', flightDate: ['04/04/16', '07/30/16'] },
  { name: "Feat_release_v3.0.17", id: 2746, adCount: 13, status: 'Active', impressions: 50, lastUpdated: '11/10/15 04:59pm', flightDate: ['11/10/15', '11/28/15'] },
  { name: "From Template", id: 444, adCount: 11, status: 'Active', impressions: 351, lastUpdated: '12/10/14 11:23pm', flightDate: ['09/18/14', '11/08/14'] },
  { name: "test 44", id: 340, adCount: 16, status: 'Active', impressions: 757, lastUpdated: '03/12/21 05:10pm', flightDate: ['08/01/14', '09/26/14'] },
  { name: "test 3", id: 339, adCount: 8, status: 'Active', impressions: 367, lastUpdated: '09/07/14 02:36pm', flightDate: ['08/01/14', '08/22/14'] },
  { name: "Billing Test", id: 333, adCount: 1, status: 'Active', impressions: 143, lastUpdated: '07/31/14 10:31pm', flightDate: ['08/01/14', '12/26/14'] },
  { name: "20140226", id: 145, adCount: 10, status: 'Active', impressions: 399, lastUpdated: '06/30/14 05:51pm', flightDate: ['02/26/14', '09/27/14'] },
  { name: "100000 test", id: 91, adCount: 8, status: 'Active', impressions: 7, lastUpdated: '04/29/14 10:47pm', flightDate: ['08/24/76', '08/07/14'] },
  { name: "Ad Loading", id: 63, adCount: 21, status: 'Active', impressions: 7, lastUpdated: '04/02/15 09:32pm', flightDate: ['11/04/13', '06/30/14'] },
  { name: "Johns Tex Mex", id: 53, adCount: 8, status: 'Active', impressions: 28, lastUpdated: '04/10/14 02:25pm', flightDate: ['10/25/13', '01/31/14'] },
]

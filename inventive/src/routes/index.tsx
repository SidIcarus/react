import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CampaignRangeSelect } from "@/components/campaigns/CampaignRangeSelect";
import { CampaignsTable } from "@/components/campaigns/CampaignsTable";
import { CampaignsTableColumns } from "@/components/campaigns/CampaignsTableColumn";
import { TeamTable } from "@/components/dashboard/TeamTable";
import { TeamTableColumns } from "@/components/dashboard/TeamTableColumns";
import { ExampleChart } from "@/components/exampleChart";
import { Button } from "@/components/ui/button";
// import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Campaign } from "./api/campaigns";
import type { DashboardChartData } from "./api/dashboardCharts";
import type { TeamMember } from "./api/teamMembers";

// import { ExampleCard } from '@/components/exampleCard'

async function getDashboardChartsData() {
  const res = await fetch("/api/dashboardCharts");
  return await (res.json() as Promise<DashboardChartData>);
}

async function getCampaigns() {
  const res = await fetch("/api/campaigns");
  return await (res.json() as Promise<Campaign[]>);
}

async function getTeamMembers() {
  const res = await fetch("/api/teamMembers");
  return await (res.json() as Promise<TeamMember[]>);
}

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const [teamMembers, setTeamMembers] = useState<Array<TeamMember>>([]);
  const [campaigns, setCampaigns] = useState<Array<Campaign>>([]);
  const [dashboardChartsData, setDashboardChartsData] =
    useState<DashboardChartData>({
      clickThroughRate: { percent: 0, total: 0 },
      engagementRate: { percent: 0, total: 0 },
      impressions: { total: 0, unique: 0 },
    });

  const [isLoading, setIsLoading] = useState(true);

  /**
   * This could be refactored to use tanstack query to add in
   * - built-in loading/error states
   * - caching / deduplication catches?
   * - avoid race conditions if the component unmounts mid-fetch
   * - automatic refetching on window focus?
   *
   * it could also be retrieved in the route loader for SSR since its needed immediately
   */
  useEffect(() => {
    Promise.all([
      getDashboardChartsData().then(setDashboardChartsData),
      getCampaigns().then(setCampaigns),
      getTeamMembers().then(setTeamMembers),
    ])
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto flex flex-col justify-start min-h-screen px-10 text-white w-full">
      <div className="w-full flex justify-between items-center py-3">
        ADVERTISER OVERVIEW
        <div className="flex">
          <CampaignRangeSelect />
          <Button variant="secondary">New Campaign</Button>
        </div>
      </div>
      <div className="grid dashboard-grids">
        <ExampleChart />
        <ExampleChart />
        <ExampleChart />
      </div>
      <Tabs defaultValue="campaigns" className="w-full py-10">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns">
          <CampaignsTable columns={CampaignsTableColumns} data={campaigns} />
        </TabsContent>
        <TabsContent value="team">
          <TeamTable columns={TeamTableColumns} data={teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

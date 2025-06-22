import { Users, BarChart, Percent, Vote } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { KenyaMap } from "@/components/dashboard/kenya-map";
import { LiveResultsChart } from "@/components/dashboard/live-results-chart";
import { AlertsFeed } from "@/components/dashboard/alerts-feed";
import { countyResults } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Votes Cast"
            value="8.4M"
            icon={Users}
            description="Across all 47 counties"
          />
          <StatCard
            title="National Turnout"
            value="72.5%"
            icon={Percent}
            description="+2.1% from this time in 2022"
          />
          <StatCard
            title="Stations Reported"
            value="65%"
            icon={BarChart}
            description="30,050 of 46,229 stations"
          />
          <StatCard
            title="Leading Candidate"
            value="Candidate B"
            icon={Vote}
            description="Margin of 200,000 votes"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <KenyaMap data={countyResults} />
            </div>
            <div className="flex flex-col gap-4 md:gap-8">
                <AlertsFeed />
            </div>
        </div>
        <div>
            <LiveResultsChart />
        </div>
      </main>
    </>
  );
}

import { Header } from "@/components/layout/header";
import { HistoricalChart } from "@/components/historical/historical-chart";

export default function HistoricalPage() {
  return (
    <>
      <Header title="Historical Analysis" />
      <main className="flex-1 p-4 md:p-6">
        <HistoricalChart />
      </main>
    </>
  );
}

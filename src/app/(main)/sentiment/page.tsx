import { Header } from "@/components/layout/header";
import { SentimentAnalyzer } from "./sentiment-analyzer";

export default function SentimentPage() {
  return (
    <>
      <Header title="Sentiment Analysis" />
      <main className="flex-1 p-4 md:p-6">
        <SentimentAnalyzer />
      </main>
    </>
  );
}

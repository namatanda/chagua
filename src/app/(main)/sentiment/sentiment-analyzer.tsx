"use client";

import { useActionState, useFormStatus } from "react";
import { getSentimentAnalysis } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SentimentResult } from "@/lib/types";

const initialState = {
  result: null,
  error: null,
  loading: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Analyze Sentiment
    </Button>
  );
}

function SentimentResultCard({ title, sentiment }: { title: string, sentiment: string }) {
  const renderIcon = () => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="h-8 w-8 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-8 w-8 text-red-500" />;
      default:
        return <Minus className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-semibold capitalize">{sentiment}</span>
        {renderIcon()}
      </CardContent>
    </Card>
  );
}

export function SentimentAnalyzer() {
  const [state, formAction] = useActionState(getSentimentAnalysis, initialState);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis Tool</CardTitle>
          <CardDescription>
            Enter a news headline and a social media post to analyze election sentiment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newsHeadline">News Headline</Label>
              <Textarea
                id="newsHeadline"
                name="newsHeadline"
                placeholder="e.g., 'Record turnout expected in major cities as polls open.'"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMediaPost">Social Media Post</Label>
              <Textarea
                id="socialMediaPost"
                name="socialMediaPost"
                placeholder="e.g., 'Long queues at my polling station! Great to see so many people exercising their right. #KenyaDecides'"
                rows={5}
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4 text-2xl font-semibold tracking-tight">Analysis Results</h3>
        <div className="space-y-4">
          {state.loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {typeof state.error === 'string' && <p className="text-destructive">{state.error}</p>}
          {state.result && (
            <>
              <SentimentResultCard title="Overall Sentiment" sentiment={state.result.overallSentiment} />
              <SentimentResultCard title="News Headline Sentiment" sentiment={state.result.newsSentiment} />
              <SentimentResultCard title="Social Media Sentiment" sentiment={state.result.socialMediaSentiment} />
            </>
          )}
          {!state.result && !state.loading && (
            <Card className="flex h-64 items-center justify-center border-dashed">
                <p className="text-muted-foreground">Results will be displayed here.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

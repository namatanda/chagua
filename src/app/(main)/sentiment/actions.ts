"use server";

import { analyzeElectionSentiment } from "@/ai/flows/analyze-election-sentiment";
import type { SentimentAnalysisState } from "@/lib/types";
import { z } from "zod";

const formSchema = z.object({
  newsHeadline: z.string().min(10, "Please enter a longer headline."),
  socialMediaPost: z.string().min(10, "Please enter a longer post."),
});

export async function getSentimentAnalysis(
  prevState: SentimentAnalysisState,
  formData: FormData
): Promise<SentimentAnalysisState> {
  const validatedFields = formSchema.safeParse({
    newsHeadline: formData.get("newsHeadline"),
    socialMediaPost: formData.get("socialMediaPost"),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      loading: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeElectionSentiment(validatedFields.data);
    return { result, error: null, loading: false };
  } catch (e) {
    return {
      result: null,
      loading: false,
      error: "Failed to analyze sentiment. Please try again.",
    };
  }
}

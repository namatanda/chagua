'use server';

/**
 * @fileOverview An AI agent that analyzes election sentiment from social media and news sources.
 *
 * - analyzeElectionSentiment - A function that handles the sentiment analysis process.
 * - AnalyzeElectionSentimentInput - The input type for the analyzeElectionSentiment function.
 * - AnalyzeElectionSentimentOutput - The return type for the analyzeElectionSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeElectionSentimentInputSchema = z.object({
  newsHeadline: z.string().describe('News headline about the election'),
  socialMediaPost: z.string().describe('Social media post about the election'),
});
export type AnalyzeElectionSentimentInput = z.infer<
  typeof AnalyzeElectionSentimentInputSchema
>;

const AnalyzeElectionSentimentOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe(
      'Overall sentiment towards the election based on the news headline and social media post.'
    ),
  newsSentiment: z
    .string()
    .describe('Sentiment expressed in the news headline.'),
  socialMediaSentiment: z
    .string()
    .describe('Sentiment expressed in the social media post.'),
});
export type AnalyzeElectionSentimentOutput = z.infer<
  typeof AnalyzeElectionSentimentOutputSchema
>;

export async function analyzeElectionSentiment(
  input: AnalyzeElectionSentimentInput
): Promise<AnalyzeElectionSentimentOutput> {
  return analyzeElectionSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeElectionSentimentPrompt',
  input: {schema: AnalyzeElectionSentimentInputSchema},
  output: {schema: AnalyzeElectionSentimentOutputSchema},
  prompt: `You are an expert in analyzing sentiment related to elections.

You are provided with a news headline and a social media post related to the Kenyan presidential election.
Analyze the sentiment expressed in each, and then provide an overall sentiment.

News Headline: {{{newsHeadline}}}
Social Media Post: {{{socialMediaPost}}}

Respond in a brief and concise manner.
`,
});

const analyzeElectionSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeElectionSentimentFlow',
    inputSchema: AnalyzeElectionSentimentInputSchema,
    outputSchema: AnalyzeElectionSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

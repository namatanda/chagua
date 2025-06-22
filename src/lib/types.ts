export type Candidate = {
  name: string;
  party: string;
  color: string;
  avatar: string;
};

export type CountyResult = {
  name: string;
  totalVotes: number;
  turnout: number;
  results: {
    [candidateName: string]: number;
  };
};

export type Alert = {
  id: number;
  time: string;
  message: string;
};

export type HistoricalDataPoint = {
  year: string;
  "Candidate A": number;
  "Candidate B": number;
  "Candidate C": number;
};

export type SentimentResult = {
  overallSentiment: string;
  newsSentiment: string;
  socialMediaSentiment: string;
};

export type SentimentAnalysisState = {
  result: SentimentResult | null;
  error: string | null;
  loading: boolean;
};

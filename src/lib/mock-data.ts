import type { Candidate, CountyResult, Alert, HistoricalDataPoint } from './types';

export const candidates: Candidate[] = [
  { name: 'Candidate A', party: 'Purple Alliance', color: 'hsl(var(--chart-1))', avatar: 'https://placehold.co/40x40' },
  { name: 'Candidate B', party: 'Orange Movement', color: 'hsl(var(--chart-2))', avatar: 'https://placehold.co/40x40' },
  { name: 'Candidate C', party: 'Unity Party', color: 'hsl(var(--chart-3))', avatar: 'https://placehold.co/40x40' },
];

export const countyResults: CountyResult[] = [
  { name: 'Nairobi', totalVotes: 1200000, turnout: 65, results: { 'Candidate A': 600000, 'Candidate B': 550000, 'Candidate C': 50000 } },
  { name: 'Mombasa', totalVotes: 500000, turnout: 72, results: { 'Candidate A': 200000, 'Candidate B': 280000, 'Candidate C': 20000 } },
  { name: 'Kisumu', totalVotes: 450000, turnout: 78, results: { 'Candidate A': 150000, 'Candidate B': 290000, 'Candidate C': 10000 } },
  { name: 'Nakuru', totalVotes: 700000, turnout: 68, results: { 'Candidate A': 400000, 'Candidate B': 280000, 'Candidate C': 20000 } },
  { name: 'Uasin Gishu', totalVotes: 400000, turnout: 80, results: { 'Candidate A': 300000, 'Candidate B': 90000, 'Candidate C': 10000 } },
];

export const liveVoteData = [
  { time: '08:00', 'Candidate A': 1000, 'Candidate B': 800, 'Candidate C': 100 },
  { time: '09:00', 'Candidate A': 5000, 'Candidate B': 4500, 'Candidate C': 500 },
  { time: '10:00', 'Candidate A': 25000, 'Candidate B': 28000, 'Candidate C': 2000 },
  { time: '11:00', 'Candidate A': 80000, 'Candidate B': 95000, 'Candidate C': 6000 },
  { time: '12:00', 'Candidate A': 200000, 'Candidate B': 240000, 'Candidate C': 15000 },
  { time: '13:00', 'Candidate A': 500000, 'Candidate B': 580000, 'Candidate C': 30000 },
  { time: '14:00', 'Candidate A': 900000, 'Candidate B': 1100000, 'Candidate C': 50000 },
];

export const alerts: Alert[] = [
  { id: 1, time: '14:02', message: 'Candidate B crosses 1M vote threshold.' },
  { id: 2, time: '13:45', message: 'Nairobi county reports over 50% of polling stations.' },
  { id: 3, time: '12:10', message: 'Turnout in Mombasa county exceeds 70%.' },
  { id: 4, time: '10:30', message: 'Significant sentiment shift detected on social media.' },
];

export const historicalTurnout: HistoricalDataPoint[] = [
    { year: '2013', "Candidate A": 43, "Candidate B": 51, "Candidate C": 6 },
    { year: '2017', "Candidate A": 48, "Candidate B": 49, "Candidate C": 3 },
    { year: '2022', "Candidate A": 51, "Candidate B": 48, "Candidate C": 1 },
];

export const historicalVoteShare: HistoricalDataPoint[] = [
    { year: '2013', "Candidate A": 44.7, "Candidate B": 50.3, "Candidate C": 5 },
    { year: '2017', "Candidate A": 49.1, "Candidate B": 49.9, "Candidate C": 1 },
    { year: '2022', "Candidate A": 50.5, "Candidate B": 48.8, "Candidate C": 0.7 },
];

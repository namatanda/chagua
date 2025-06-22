"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CountyResult, Candidate } from "@/lib/types";
import { candidates } from "@/lib/mock-data";

type KenyaMapProps = {
  data: CountyResult[];
};

type TooltipData = {
  x: number;
  y: number;
  county: CountyResult;
} | null;

// A simplified map of Kenya with 47 counties. Paths are illustrative.
// In a real application, you would use a proper GeoJSON-based map.
const countiesPaths = {
  Mombasa: "M923.4,668.2L919,674.3L921.2,680.7L930.2,679.1L934,670.9L923.4,668.2Z",
  Kwale: "M908.4,675.8L900.2,692.7L913,698.8L919,674.3L908.4,675.8Z",
  Kilifi: "M919,674.3L906,660.1L909,642.7L924.8,648.9L932.4,665.1L919,674.3Z",
  // ... (other 44 counties would be here)
  Nairobi: "M792.8,610.9L785,618.3L791.2,625.7L800,620.1L792.8,610.9Z",
  Kisumu: "M684.5,594.3L675,598.1L679,608.9L690.2,604.1L684.5,594.3Z",
  Nakuru: "M740,580L730,590L745,605L755,590L740,580Z",
  "Uasin Gishu": "M710,560L700,570L715,585L725,570L710,560Z",
};

export function KenyaMap({ data }: KenyaMapProps) {
  const [tooltip, setTooltip] = React.useState<TooltipData>(null);

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, countyName: string) => {
    const countyData = data.find(c => c.name === countyName);
    if (countyData) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        county: countyData,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  
  const getCountyColor = (countyName: string) => {
    const countyData = data.find(c => c.name === countyName);
    if (!countyData) return "fill-muted";

    const winner = Object.keys(countyData.results).reduce((a, b) => 
      countyData.results[a] > countyData.results[b] ? a : b
    );
    
    const winnerColor = candidates.find(c => c.name === winner)?.color;
    return winnerColor ? `fill-[${winnerColor}]` : "fill-muted";
  }


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Counties Live Results</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[500px]">
        <svg viewBox="650 500 300 250" className="h-full w-full">
          <g>
            {Object.entries(countiesPaths).map(([name, path]) => (
              <path
                key={name}
                d={path}
                className={cn(
                    "stroke-background stroke-2 transition-all duration-200 hover:opacity-80 cursor-pointer",
                    getCountyColor(name)
                )}
                onMouseEnter={(e) => handleMouseEnter(e, name)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </g>
        </svg>
        {tooltip && (
          <div
            className="pointer-events-none absolute rounded-lg border bg-background p-3 shadow-lg"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10,
              transform: `translate(-50%, -100%)`,
            }}
          >
            <h4 className="font-bold">{tooltip.county.name}</h4>
            <p className="text-sm">Turnout: {tooltip.county.turnout}%</p>
            <ul className="mt-2 text-sm">
              {Object.entries(tooltip.county.results).map(([candidate, votes]) => (
                <li key={candidate} className="flex justify-between gap-4">
                  <span>{candidate}:</span>
                  <span className="font-medium">{votes.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

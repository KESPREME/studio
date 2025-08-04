'use server';

// src/ai/flows/analyze-community-reports.ts
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for community report analysis
const CommunityAnalysisInputSchema = z.object({
  reports: z.array(z.object({
    id: z.string(),
    description: z.string(),
    urgency: z.enum(['Low', 'Moderate', 'High']),
    status: z.enum(['New', 'In Progress', 'Resolved']),
    latitude: z.number(),
    longitude: z.number(),
    createdAt: z.string(),
    reportedBy: z.string(),
    imageUrl: z.string().nullable().optional(),
  })),
  timeframe: z.string().optional().default('last 30 days'),
  location: z.string().optional().default('community area'),
});

// Output schema for community insights
const CommunityInsightsSchema = z.object({
  summary: z.object({
    totalReports: z.number(),
    highPriorityCount: z.number(),
    resolvedCount: z.number(),
    averageResponseTime: z.string(),
    mostCommonIssues: z.array(z.string()),
  }),
  trends: z.object({
    emergingPatterns: z.array(z.string()),
    seasonalTrends: z.array(z.string()),
    geographicHotspots: z.array(z.object({
      area: z.string(),
      issueType: z.string(),
      frequency: z.number(),
    })),
  }),
  guidelines: z.array(z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['High', 'Medium', 'Low']),
    actionItems: z.array(z.string()),
  })),
  safetyTips: z.array(z.object({
    category: z.string(),
    tip: z.string(),
    reasoning: z.string(),
    applicability: z.enum(['Universal', 'Seasonal', 'Location-specific']),
  })),
  preventionStrategies: z.array(z.object({
    strategy: z.string(),
    description: z.string(),
    targetAudience: z.string(),
    expectedImpact: z.string(),
  })),
  communityActions: z.array(z.object({
    action: z.string(),
    description: z.string(),
    difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
    timeframe: z.string(),
    benefits: z.array(z.string()),
  })),
});

export async function analyzeCommunityReports(input: CommunityAnalysisInput): Promise<CommunityInsights> {
  return analyzeCommunityReportsFlow(input);
}

const analyzeCommunityReportsPrompt = ai.definePrompt({
  name: 'analyzeCommunityReportsPrompt',
  input: { schema: CommunityAnalysisInputSchema },
  output: { schema: CommunityInsightsSchema },
  prompt: `You are an expert emergency management analyst tasked with analyzing community incident reports to generate actionable insights, guidelines, and safety tips.

REPORT DATA:
{{reports}}

ANALYSIS CONTEXT:
- Timeframe: {{timeframe}}
- Location: {{location}}
- Total Reports: {{reports.length}}

ANALYSIS REQUIREMENTS:

1. SUMMARY ANALYSIS:
   - Calculate key metrics (total reports, high priority count, resolved count)
   - Identify most common issues and patterns
   - Estimate average response time trends

2. TREND IDENTIFICATION:
   - Identify emerging patterns in incident types
   - Detect seasonal trends if applicable
   - Pinpoint geographic hotspots with specific issue types

3. ACTIONABLE GUIDELINES:
   - Create specific, actionable guidelines based on report patterns
   - Prioritize guidelines by potential impact
   - Include concrete action items for each guideline

4. SAFETY TIPS:
   - Generate practical safety tips based on actual incidents
   - Explain the reasoning behind each tip
   - Categorize by applicability (universal, seasonal, location-specific)

5. PREVENTION STRATEGIES:
   - Develop proactive strategies to prevent recurring issues
   - Target different community audiences (residents, businesses, officials)
   - Estimate expected impact of each strategy

6. COMMUNITY ACTIONS:
   - Suggest specific actions the community can take
   - Rate difficulty level and provide realistic timeframes
   - Highlight benefits of each action

GUIDELINES FOR ANALYSIS:
- Be specific and actionable, not generic
- Base recommendations on actual report data patterns
- Consider geographic and temporal factors
- Focus on prevention and community empowerment
- Use clear, accessible language
- Prioritize high-impact, feasible solutions

Generate comprehensive community insights that will help prevent future incidents and improve emergency preparedness.`,
});

const analyzeCommunityReportsFlow = ai.defineFlow(
  {
    name: 'analyzeCommunityReportsFlow',
    inputSchema: CommunityAnalysisInputSchema,
    outputSchema: CommunityInsightsSchema,
  },
  async (input) => {
    const { output } = await analyzeCommunityReportsPrompt(input);
    return output!;
  }
);

// Type exports
export type CommunityAnalysisInput = z.infer<typeof CommunityAnalysisInputSchema>;
export type CommunityInsights = z.infer<typeof CommunityInsightsSchema>;

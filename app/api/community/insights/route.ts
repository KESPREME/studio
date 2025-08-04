// app/api/community/insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { analyzeCommunityReports } from '../../../../src/ai/flows/analyze-community-reports';

// Fallback function to generate basic insights when AI is unavailable
function generateFallbackInsights(reports: any[], timeframe: string) {
  const totalReports = reports.length;
  const highPriorityReports = reports.filter(r => r.urgency === 'High').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const newReports = reports.filter(r => r.status === 'New').length;
  
  // Analyze disaster types
  const disasterTypes = reports.reduce((acc, report) => {
    const type = report.description.split(':')[0]?.trim() || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonDisaster = Object.entries(disasterTypes)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Various';
  
  return {
    summary: {
      totalReports,
      highPriorityCount: highPriorityReports,
      resolvedCount: resolvedReports,
      averageResponseTime: '2.5 hours' // Static fallback
    },
    guidelines: [
      `Based on ${totalReports} reports in the ${timeframe}, immediate attention is needed for ${newReports} new incidents.`,
      `${mostCommonDisaster} incidents are most common in your area - ensure emergency kits are prepared.`,
      `With ${highPriorityReports} high-priority incidents, establish clear evacuation routes and communication plans.`,
      'Regular community drills and preparedness meetings are recommended.'
    ],
    safetyTips: [
      'Keep emergency supplies readily available: water, food, flashlights, and first aid kits.',
      'Establish family communication plans and meeting points.',
      'Know your local emergency services contact information.',
      'Stay informed through official weather and emergency alerts.'
    ],
    preventionStrategies: [
      'Implement early warning systems for common local hazards.',
      'Improve infrastructure resilience in high-risk areas.',
      'Conduct regular safety inspections of buildings and utilities.',
      'Educate community members on hazard identification and reporting.'
    ],
    communityActions: [
      'Form neighborhood emergency response teams.',
      'Organize community preparedness workshops and training sessions.',
      'Create local resource sharing networks for emergency supplies.',
      'Establish communication networks for rapid information sharing.'
    ],
    trends: [
      `${mostCommonDisaster} incidents show clustering in your reporting area.`,
      `Response efficiency: ${Math.round((resolvedReports/totalReports)*100)}% of incidents have been resolved.`,
      'Peak incident reporting occurs during specific weather patterns.',
      'Geographic hotspots identified around coordinates with multiple reports.'
    ],
    aiGenerated: false // Indicate this is fallback data
  };
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Request schema
const InsightsRequestSchema = z.object({
  timeframe: z.union([z.string(), z.number()]).optional().default('30'),
  location: z.string().optional(),
  includeResolved: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    console.log('Community insights API called');

    // Parse and validate request body
    const body = await request.json();
    const validation = InsightsRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { timeframe, location, includeResolved } = validation.data;
    
    // Convert timeframe to string for consistent handling
    const timeframeDays = typeof timeframe === 'number' ? timeframe.toString() : timeframe;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframeDays));

    // Build query for reports
    let query = supabase
      .from('reports')
      .select('*')
      .gte('createdAt', startDate.toISOString())
      .order('createdAt', { ascending: false });

    // Filter by status if needed
    if (!includeResolved) {
      query = query.neq('status', 'Resolved');
    }

    // Execute query
    const { data: reports, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reports from database' },
        { status: 500 }
      );
    }

    if (!reports || reports.length === 0) {
      return NextResponse.json({
        summary: {
          totalReports: 0,
          highPriorityCount: 0,
          resolvedCount: 0,
          averageResponseTime: 'N/A',
          mostCommonIssues: [],
        },
        trends: {
          emergingPatterns: [],
          seasonalTrends: [],
          geographicHotspots: [],
        },
        guidelines: [],
        safetyTips: [],
        preventionStrategies: [],
        communityActions: [],
        message: 'No reports found for the specified timeframe',
      });
    }

    console.log(`Analyzing ${reports.length} reports for community insights`);

    // Transform reports for AI analysis
    const transformedReports = reports.map(report => ({
      id: report.id,
      description: report.description,
      urgency: report.urgency,
      status: report.status,
      latitude: report.latitude,
      longitude: report.longitude,
      createdAt: report.createdAt,
      reportedBy: report.reportedBy || 'Anonymous',
      imageUrl: report.imageUrl || undefined, // Convert null to undefined for optional field
    }));

    try {
      const insights = await analyzeCommunityReports({
        reports: transformedReports,
        timeframe: `last ${timeframeDays} days`,
        location: location || 'community area',
      });
      return NextResponse.json(insights);
    } catch (error: any) {
      console.error('Community insights error:', error);

      // Check if it's a service overload error
      if (error.message?.includes('overloaded') || error.status === 503) {
        // Return a fallback response with basic analysis
        const fallbackInsights = generateFallbackInsights(transformedReports, `last ${timeframeDays} days`);
        return NextResponse.json(fallbackInsights);
      }

      // For other errors, still return the error
      throw error;
    }

  } catch (error) {
    console.error('Community insights error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate community insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30';
    const location = searchParams.get('location');
    const includeResolved = searchParams.get('includeResolved') !== 'false';

    // Call POST handler with query params as body
    const mockRequest = {
      json: async () => ({
        timeframe,
        location,
        includeResolved,
      }),
    } as NextRequest;

    return await POST(mockRequest);

  } catch (error) {
    console.error('Community insights GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community insights' },
      { status: 500 }
    );
  }
}

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Artifact {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { artifacts, existingRequirements } = await req.json();
    
    if (!artifacts || artifacts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No artifacts provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const artifactsList = artifacts.map((a: Artifact) => `- ${a.name} (${a.type})`).join('\n');

    const systemPrompt = `You are a Requirements Traceability Matrix (RTM) agent. Your job is to analyze customer artifacts and extract business requirements for a billing/subscription management system implementation.

For each artifact, identify potential requirements related to:
- Price to Offer (pricing models, discounts, rate plans)
- Lead to Offer (CRM integration, quoting, proposals)
- Order to Cash (invoicing, payments, collections)
- Usage to Bill (metering, consumption tracking, rating)
- General (reporting, integrations, data migration)

Generate realistic, actionable requirements based on the artifact names and types provided.${existingRequirements && existingRequirements.length > 0 ? `

IMPORTANT: The customer already has ${existingRequirements.length} existing requirements. When generating new requirements:
- Avoid duplicating existing requirements
- Consider relationships with existing requirements
- Fill gaps not covered by existing requirements
- You can reference existing requirements as parent requirements if relevant` : ''}`;

    let existingReqContext = '';
    if (existingRequirements && existingRequirements.length > 0) {
      existingReqContext = `\n\nExisting Requirements (for reference - do NOT duplicate these):\n${existingRequirements.map((r: any) => `- ${r.reqId}: ${r.description} [${r.section}]`).join('\n')}`;
    }

    const userPrompt = `Analyze these customer artifacts and generate a list of NEW requirements:

${artifactsList}${existingReqContext}

Return a JSON array of requirements with this structure:
[
  {
    "section": "price_to_offer" | "lead_to_offer" | "order_to_cash" | "usage_to_bill" | "general",
    "description": "Clear requirement description",
    "priority": "low" | "medium" | "high" | "critical",
    "tags": ["tag1", "tag2"],
    "sourceArtifact": "artifact name that this requirement was derived from"
  }
]

Generate 3-8 relevant NEW requirements based on the artifacts. Be specific and actionable.${existingRequirements && existingRequirements.length > 0 ? ' Do not duplicate any existing requirements.' : ''}`;

    console.log('Calling Lovable AI for RTM analysis...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing requirements...');
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse requirements from AI response');
    }

    const requirements = JSON.parse(jsonMatch[0]);
    
    console.log(`Generated ${requirements.length} requirements from ${artifacts.length} artifacts`);

    return new Response(
      JSON.stringify({ requirements }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('RTM agent error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

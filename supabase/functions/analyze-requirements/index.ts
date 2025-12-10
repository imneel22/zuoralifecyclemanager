import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Requirement {
  reqId: string;
  section: string;
  description: string;
  status: string;
  classification: string;
  owner: string;
  tags: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requirements, analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (analysisType === "fitgap") {
      systemPrompt = `You are a Salesforce implementation expert analyzing requirements for FIT/GAP analysis. 
For each requirement, determine if it's a FIT (can be implemented with standard Salesforce features) or GAP (requires customization).
Provide a score from 0-100 where 100 means perfect fit and 0 means complete gap.
Include a brief rationale for each assessment.`;
      
      userPrompt = `Analyze these requirements for FIT/GAP:
${JSON.stringify(requirements, null, 2)}

Return a JSON array with objects containing: reqId, classification (fit/gap), fitGapScore (0-100), rationale`;

    } else if (analysisType === "aoc") {
      systemPrompt = `You are a Salesforce implementation expert identifying Areas of Complexity (AOC).
AOCs are aspects of Salesforce implementations that require special attention due to technical complexity, business impact, or integration challenges.
Common Salesforce AOCs include: Pricing & Billing, Data Migration, Integration, Security & Compliance, User Adoption, Reporting & Analytics, Workflow Automation.`;
      
      userPrompt = `Identify Salesforce Areas of Complexity (AOC) for these requirements:
${JSON.stringify(requirements, null, 2)}

Return a JSON array with objects containing: reqId, aoc (area name), aocDescription, complexityLevel (low/medium/high)`;
    }

    console.log(`Processing ${analysisType} analysis for ${requirements.length} requirements`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    let analysisResults = [];
    
    if (jsonMatch) {
      try {
        analysisResults = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        analysisResults = [];
      }
    }

    console.log(`Analysis complete: ${analysisResults.length} results`);

    return new Response(JSON.stringify({ results: analysisResults, type: analysisType }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

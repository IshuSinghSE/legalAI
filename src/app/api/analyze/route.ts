// POST: call Gemini API, return highlights, summary
export async function POST() {
  // TODO: Implement Gemini analysis logic
  return new Response(JSON.stringify({ summary: "AI summary here", highlights: [] }), { status: 200 });
}

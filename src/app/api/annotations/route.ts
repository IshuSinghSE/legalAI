// CRUD for highlights/notes
export async function GET() {
  // TODO: Fetch annotations
  return new Response(JSON.stringify({ annotations: [] }), { status: 200 });
}

export async function POST() {
  // TODO: Save annotation
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

// BUILD_ID is set once when the server starts.
// On a new deployment, the server restarts and generates a new ID.
const BUILD_ID = Date.now().toString();

export function GET() {
  return Response.json({ buildId: BUILD_ID });
}

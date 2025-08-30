const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST!;
const PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID!;
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;

if (!POSTHOG_HOST || !PROJECT_ID || !API_KEY) {
  throw new Error("Missing PostHog environment variables");
}

export async function runHogqlQuery(query: string) {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
  });
  return res.json();
}
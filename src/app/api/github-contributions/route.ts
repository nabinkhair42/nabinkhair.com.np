import { NextResponse } from "next/server";
import { DeveloperDetails } from "@/dev-constants/details";
import { apiError, apiMethodNotAllowed } from "@/lib/api/errors";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const USERNAME = DeveloperDetails.socialLinks.find((l) => l.name === "GitHub")?.handle ?? "";

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
};

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: ContributionDay[];
          }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return apiError(
      500,
      "misconfigured",
      "GITHUB_TOKEN is not configured on the server.",
      "Set GITHUB_TOKEN in the deployment environment, then retry."
    );
  }

  if (!USERNAME) {
    return apiError(
      500,
      "misconfigured",
      "GitHub username is not configured.",
      "Check DeveloperDetails.socialLinks for a GitHub handle."
    );
  }

  const now = new Date();
  const from = new Date(now);
  from.setFullYear(from.getFullYear() - 1);

  const query = `
    query {
      user(login: "${USERNAME}") {
        contributionsCollection(from: "${from.toISOString()}", to: "${now.toISOString()}") {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // GitHub requires a User-Agent (403 without one); set it explicitly.
        "User-Agent": "nabinkhair.com.np",
      },
      body: JSON.stringify({ query }),
    });
  } catch {
    return apiError(
      502,
      "upstream_error",
      "Failed to reach the GitHub GraphQL API.",
      "Retry shortly. If the problem persists, check GitHub status."
    );
  }

  if (!res.ok) {
    return apiError(
      502,
      "upstream_error",
      `GitHub API returned HTTP ${res.status}.`,
      "Verify GITHUB_TOKEN scopes include public repository read access."
    );
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    return apiError(
      502,
      "upstream_error",
      json.errors[0]?.message ?? "GitHub GraphQL returned errors.",
      "Confirm the configured GitHub username exists and the token is valid."
    );
  }

  const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks;
  if (!weeks) {
    return apiError(
      502,
      "upstream_error",
      "GitHub contribution calendar was missing from the response.",
      "Confirm the GitHub username in DeveloperDetails matches a real account."
    );
  }

  let total = 0;
  const data: { date: string; count: number; level: number }[] = [];

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      total += day.contributionCount;
      data.push({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] ?? 0,
      });
    }
  }

  return NextResponse.json(
    { data, total },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

export function POST() {
  return apiMethodNotAllowed("POST", ["GET"]);
}

export function PUT() {
  return apiMethodNotAllowed("PUT", ["GET"]);
}

export function PATCH() {
  return apiMethodNotAllowed("PATCH", ["GET"]);
}

export function DELETE() {
  return apiMethodNotAllowed("DELETE", ["GET"]);
}

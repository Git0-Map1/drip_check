import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { PageHeader } from "@/components/drip/PageHeader";
import { getLiveLeaderboard } from "@/lib/live-check.functions";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Daily Leaderboard — DripCheck" },
      {
        name: "description",
        content:
          "See today's highest Drip Scores from real Live Fit Checks and how your fit stacks up against the community.",
      },
      { property: "og:title", content: "Daily Leaderboard — DripCheck" },
      { property: "og:description", content: "Today's highest scoring fits." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["live-leaderboard"],
    queryFn: () => getLiveLeaderboard(),
  });
  const entries = data?.entries ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Leaderboard"
        title="Today's Drip"
        subtitle="Rankings reset every 24 hours. Only real Live Fit Checks from the last day show up here."
      />
      <ol className="space-y-3">
        {isLoading &&
          [0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        {!isLoading && entries.length === 0 && (
          <li className="drip-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
            <Camera className="h-6 w-6 text-accent" />
            <p className="text-sm text-muted-foreground">
              No fits scored yet today. The board fills up as people take a Live Fit Check — be the
              first one on it.
            </p>
            <Link to="/live" className="drip-btn-primary">
              Start Live Fit Check
            </Link>
          </li>
        )}
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="drip-card flex items-center gap-4 rounded-2xl p-3 transition-colors hover:border-accent/50"
          >
            <span className="w-8 text-center font-display text-lg font-bold text-muted-foreground">
              {entry.rank}
            </span>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand font-display text-sm font-bold uppercase text-accent">
              {entry.displayName.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{entry.displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                @{entry.username} · {entry.styleLabel}
              </p>
            </div>
            <span className="font-display text-2xl font-extrabold text-accent">
              {entry.dripScore.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

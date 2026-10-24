import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOBZ.BAR — F&B careers & at-the-bar networking" },
      { name: "description", content: "Find gig shifts and long-term F&B jobs, discuss the industry and explore partner-venue networking." },
      { property: "og:title", content: "JOBZ.BAR — F&B careers & at-the-bar networking" },
      { property: "og:description", content: "Your industry online. Your people at the bar. F&B jobs, discussions and venue networking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// The whole app lives in a single standalone HTML file (public/jobzbar.html)
// so it can be shared on GitHub as-is.
function Index() {
  return (
    <iframe
      src="/jobzbar.html"
      title="JOBZ.BAR"
      className="fixed inset-0 h-screen w-screen border-0 bg-background"
    />
  );
}

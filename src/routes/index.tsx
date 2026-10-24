import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
// so it can be shared on GitHub as-is. The HTML runs in an iframe; this bridge
// performs Google sign-in here (where the Lovable auth helper is available)
// and hands the session to the iframe, whose own database client shares the
// same origin storage.
function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const postSession = async () => {
      const { data } = await supabase.auth.getSession();
      frameRef.current?.contentWindow?.postMessage(
        { jobzbar: "session", session: data.session },
        window.location.origin,
      );
    };

    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const msg = event.data as { jobzbar?: string } | null;
      if (!msg || typeof msg !== "object") return;

      if (msg.jobzbar === "google-signin") {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        if (result.error || result.redirected) return;
        await postSession();
      }
      if (msg.jobzbar === "session-request") await postSession();
      if (msg.jobzbar === "sign-out") {
        await supabase.auth.signOut();
        await postSession();
      }
    };

    window.addEventListener("message", onMessage);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void postSession();
      }
    });
    return () => {
      window.removeEventListener("message", onMessage);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      src="/jobzbar.html"
      title="JOBZ.BAR"
      className="fixed inset-0 h-screen w-screen border-0 bg-background"
    />
  );
}

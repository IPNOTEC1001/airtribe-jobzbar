<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the hackathon experience in the standalone public HTML served by the index route so the same source can run on GitHub Pages.
- Venue access in the standalone prototype is explicit, in-memory emulation only; production access must use router-issued, server-validated venue sessions and revocation, because browsers cannot prove captive-portal membership.
- BAR MODE learning lives in the standalone HTML and calls the `/api/coach` server route for AI; keep the route's prompts server-side and keep offline explanations so the HTML still works without the server.

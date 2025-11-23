# StudyFlow — AI-Powered Study Assistant (Landing Page)

This is a small static prototype of the StudyFlow landing page. It demonstrates:

- Hero with the headline “Turn chaos into A+ clarity.”
- Live AI-in-action typing animation that turns messy notes into a clean summary.
- Sticky feature timeline (CSS position: sticky).
- Dark / light theme toggle with localStorage persistence.
- Testimonials styled like notebook scraps.

How to run
1. Open `index.html` in your browser (double-click or use the browser "Open File" option).
2. The demo runs locally — the AI animation is simulated in the browser.

Run a local server (optional)
1. Open a terminal in the project root `c:\projects\Ui designs`.
2. Server is provided in the `server/` folder. Install dependencies and start it (PowerShell example):

```powershell
cd "c:\projects\Ui designs\server"
npm install
npm start
```

3. With the server running, the landing page will call `POST /api/summarize` when you paste notes and click "Summarize". The included server returns a local simulated summary so you can test the UI without any API keys.

Security & notes
- This server is a minimal example. For production, add authentication, rate limiting, logging, and secret management.
- If you don't start the server, the UI will still fall back to a local simulated summary for demo purposes.

Notes & next steps
- Accessibility: add focus styles, keyboard controls for the demo, and improved aria attributes.
- Performance: replace heavy fonts with system stacks or preload critical assets.
- Deploy: drop these files on any static host (Netlify, GitHub Pages, Vercel).

Enjoy! — small prototype created for interactive UI/UX demo purposes.

# 30-Day ECE Interview Prep Tracker

Static, single-page web app to track a 30-day, 2-hours-per-day interview preparation
plan for final-year B.Tech ECE students targeting placement drives.

## Files

- `index.html` – Main page with progress summary and day-by-day checklist UI.
- `styles.css` – Basic responsive styles.
- `app.js` – Vanilla JS data structure and logic (rendering, localStorage, export/import).
- `README.md` – This setup guide.

## How to run

There is no build step and no server required.

- Option 1: Open `index.html` directly in your browser (double-click).
- Option 2: Serve the folder via a simple local server:
  - Python 3: `python -m http.server 8000` and open `http://localhost:8000/`.
- Option 3: Host on GitHub Pages, Netlify, or any static hosting.

## How to update tasks or plan data

At the top of `app.js`, there is a `planData` array. Each element represents one day
of the 30-day plan:

```js
{
  id: 1,
  week: 1,
  coreRoleTag: "embedded",
  title: "Day 1 – Aptitude + Programming + ECE basics",
  focus: "Percentages, C/Python refresher, Ohm’s law",
  goals: [/* ... */],
  timeAllocation: [/* each with label + minutes (must sum to 120) */],
  resources: [/* strings describing specific resources */],
  tasks: [/* practice tasks */],
  assessment: "Mini-assessment description"
}
```

To change:

- Edit `focus`, `goals`, `timeAllocation`, `resources`, `tasks`, or `assessment` in `planData`.
- Ensure `timeAllocation` minutes add up to 120 for each day.
- Use specific resource names or URLs (e.g., GeeksforGeeks pages, NPTEL course names).

## LocalStorage

Your progress (completion, partial progress, notes) is stored in `localStorage` under
key `ece30_plan_progress`. Clearing browser storage or using incognito will reset it.

## Export/Import

- `Export JSON`: Saves progress as `ece30_progress.json`.
- `Export CSV`: Saves progress as `ece30_progress.csv`.
- `Import JSON`: Click the button, choose a JSON or CSV file previously exported
  from this app.

## Accessibility

- Day headers are focusable and can be toggled with Enter/Space.
- Labels are associated with controls for screen readers.
- Colors use moderate contrast.

## Justification for no external libraries

This app uses only vanilla JavaScript, standard HTML, and CSS:

- Easy to understand for beginners.
- No build tools, no frameworks, and no external dependencies.
- Works offline once the files are downloaded.

## SAT Hack – AI‑Powered Digital SAT Practice

An interactive, AI‑driven practice tool for the **Digital SAT Reading & Writing** section.  
Students get fresh, high‑quality questions every time they play, with instant feedback on their answers.

**Created by Rahul Vinoth.**

---

## What this project does

- **Generates SAT‑style questions on demand**  
  The app uses curated classic passages (Douglass, Darwin, Du Bois, and more) plus an LLM to create questions that look and feel like the real Digital SAT.

- **Covers multiple SAT question types**  
  Questions can be:
  - Word choice / precision
  - Transitions
  - Central idea & purpose
  - Inference
  - Vocab‑in‑context
  - Text structure & author’s choices
  - Grammar & conventions

- **Gives instant feedback**  
  After you answer, the app asks the model to act as a concise SAT tutor and explain:
  - Whether you were correct
  - Why the right answer is right
  - What trap you may have fallen for

- **Runs fully in the browser with serverless APIs**  
  The UI is a Vite + React SPA, and question/feedback generation is handled by Vercel serverless API routes powered by `groq-sdk`.

---

## Tech stack

- **Frontend:** React 19 + Vite
- **Styling:** CSS (with Tailwind 4 tooling available)
- **Backend / APIs:** Vercel serverless functions in `frontend/api/`
  - `api/question.js` – generates a single SAT‑style question from a random passage
  - `api/feedback.js` – gives short strategy‑focused feedback on the student’s answer
- **AI Model:** Groq LLM via `groq-sdk`
- **Hosting:** Vercel (static frontend + serverless functions)

---

## Project structure (high level)

- `frontend/`
  - `src/`
    - `main.jsx` – Vite/React entry point
    - `App.jsx` – main app shell and routing between quiz states
    - `components/`
      - `Start.jsx` – start screen and call‑to‑action
      - `Quiz.jsx` – core quiz UI (question, choices, answer handling)
      - `Results.jsx` – results and review experience
    - `App.css`, `index.css` – layout and visual styling
  - `api/`
    - `question.js` – question generation endpoint
    - `feedback.js` – feedback/explanation endpoint
  - `vercel.json` – basic rewrite rules for `/api/*`

---

## Running the app locally

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**

   Create a `.env.local` file inside `frontend/`:

   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Then open the printed `http://localhost:XXXX` URL in your browser.

---

## Deployment (Vercel)

This project is designed to be deployed to **Vercel** from the GitHub repo.

- **Root Directory:** `SATHack/frontend` (or the folder that contains `package.json` and `src/`)
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `GROQ_API_KEY` – required for question generation and feedback

Vercel automatically exposes:

- `GET /api/question` – returns `{ passage, question }`
- `POST /api/feedback` – returns `{ feedback }` for a given question and student answer

---

## How to extend or customize

- **Add more passages**  
  Edit `frontend/api/question.js` and append new entries to the `passages` array. Each passage should have an `id`, `title`, `author`, `year`, `genre`, and `text`.

- **Change question style or difficulty**  
  Tweak the `SYSTEM_PROMPT` in `question.js` to adjust:
  - Which question types are allowed
  - The balance between trap answers and straightforward ones
  - The level of difficulty or reading level

- **Adjust feedback tone**  
  Modify the system prompt in `feedback.js` to make explanations:
  - Shorter or more detailed
  - More encouraging or more blunt
  - Focused on certain SAT strategies (elimination, evidence, etc.)

- **Update the UI**  
  Use the components under `frontend/src/components/` and the CSS files to:
  - Refine layout and typography
  - Add progress indicators, timers, or difficulty labels
  - Create additional views (e.g., a review history screen)

---

## Attribution

This project, **SAT Hack**, was designed and built by **Rahul Vinoth**.


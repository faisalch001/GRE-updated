# GRE Practice — Tests 01 and 06

Two full-length, browser-based practice tests recreated from the supplied `GRE 1.pdf` and `Gre 6.pdf`. The question bodies are WebP images of the supplied screenshots, with native interactive controls over the original choices. Graphs, mathematical notation, passages, and answer formatting are retained without OCR transcription errors. GRE 6 retains the photographed source pages, including their perspective and original screen chrome.

## Update: GRE 6 added

Choose **GRE 1** or **GRE 6** from **Choose your exam** on the home page. Each includes its own essay prompt, 54 scored questions, five timed sections, answer key, and results review. Both support full-length attempts and standalone sections. GRE 6 uses the key on page 56 of the supplied PDF.

Each exam has a separate browser-local save. GRE 1 continues using the existing `gre-practice-v1` key, so previous progress remains compatible. Switching exams preserves both attempts; a running timer continues while an exam is away. Reports and essay downloads identify the selected exam. Use **Choose another exam** on the results page, or reload to return to the home page.

Redeploy the updated project with the same settings as before: build command `node build.cjs`, output directory `dist`. Include `questions-gre6.js`, `exams.js`, and all of `assets/gre6/` when uploading source files. The generated `dist/` contains both exams and is ready for static hosting.

## Update: section selection and estimated scores

Use **Start any section** on the home page or results page to choose Analytical Writing, Verbal 1, Quant 1, Verbal 2 (Hard), or Quant 2 (Hard). Each runs independently with its normal timer and goes directly to its own results when submitted or timed out. You can still begin the original full-length test. Starting another attempt asks for confirmation before replacing saved progress. Existing browser saves remain compatible.

The report now shows a **rough practice estimate on the 130–170 scale**, plus the raw score. The formula is `round(130 + 40 × correct / total questions in completed sections)`. For example, 9/12 produces approximately 160. This is an uncalibrated heuristic, not a validated GRE-score prediction or official ETS conversion. It does not model question difficulty, section adaptation, or equating. Standalone-section estimates are explicitly labeled single-section projections. No estimate is shown for a measure with no submitted sections or no entered responses.

Unanswered questions in a submitted section count as incorrect. Sections you did not take are excluded, rather than scored as zero. The combined estimate out of 340 appears only when both Verbal and both Quantitative sections have been completed in the full-length attempt. Essays are not automatically graded. JSON exports include the estimates, methodology, and responses from submitted sections only.

See [ETS’s explanation of official score calculation](https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html) for how actual scores use adaptation and equating.

## Included

- Two exams, each with one 30-minute issue essay, editor and local draft saving.
- Verbal sections: 12 questions / 18 minutes and 15 questions / 23 minutes.
- Quant sections: 12 questions / 21 minutes and 15 questions / 26 minutes.
- Five sections, 54 scored questions, 118 minutes per exam (108 scored questions total).
- Clickable single choices, multi-blank completion, multiple-answer controls, numeric and fraction entry.
- Forward/back navigation, marking, question review, unanswered warning, section submission and locking.
- Wall-clock timers that persist through reloads and closed tabs; automatic submission on expiry.
- Quant calculator with memory, square root, sign change, percent, and transfer to an answer box.
- Browser-local progress saving, raw scores and rough score estimates, individual answer review, JSON report and essay export.
- A section picker for all five sections, with immediate standalone results.
- No dependencies, external fonts, CDN assets, accounts, API keys, or backend.

## Run locally

Extract this ZIP. In the `gre-practice` folder, run:

```sh
node server.cjs
```

Open http://localhost:3000. Node.js 20+ is recommended. There is no `npm install` step.

Alternatively, open `index.html` directly. A local server is preferred because browser storage and clipboard access can behave differently for `file:` URLs.

## Deploy to Vercel

1. Create a GitHub repository and upload **the contents of `gre-practice`** to the repository root. Include the `assets` folder and the `.github` folder.
2. Import the repository in Vercel.
3. Select **Other** for Framework Preset. Keep Root Directory at the repository root.
4. Build command: `node build.cjs`. Output directory: `dist`. Leave Install Command empty; there are no dependencies.
5. Deploy. The included `vercel.json` supplies the build and output settings.

## Deploy to GitHub Pages

1. Push the project contents to the `main` branch of your repository.
2. Open **Settings → Pages → Build and deployment → Source**, then choose **GitHub Actions**.
3. Open **Actions → Deploy static practice test → Run workflow** if the initial push happened before Pages was enabled.
4. The included workflow validates the test, builds `dist`, and deploys it. Open the Pages URL shown in the deployment.

All asset paths are relative, so project URLs such as `https://yourname.github.io/your-repository/` work without a base-path change. If using a different branch, change `branches: [main]` in `.github/workflows/pages.yml`.

For a manual Pages setup, select **Deploy from a branch**, choose `main` and `/ (root)`, and commit an empty `.nojekyll` file (already included). The root `index.html` runs without a build. Choose one deployment method.

## Test and build

```sh
node tests.cjs
node build.cjs
```

The tests check the 118-minute section structure, all 54 answer-key mappings, all choice hotspot bounds, complete multiselect/blank scoring, equivalent numeric/fraction responses, rejected zero denominators, calculator parsing, and timer expiry. Additional regression tests cover all five standalone start/completion/timeout paths, correct section durations, legacy saves, full-test progression, estimation boundaries, untaken/no-response measures, and report scope. Browser QA additionally checked essay input, blank choices, multiselect, marking/review, reload persistence, section locking, calculator transfer, numeric/fraction fields, final scoring, report download, and restart.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App entry point |
| `app.js` | Test flow, persistence, timers, calculator, scoring, review and export |
| `style.css` | Screenshot-matched desktop test workspace and responsive layout |
| `questions.js` | GRE 1 sections, answer keys, and answer-control coordinates |
| `questions-gre6.js` | GRE 6 sections, answer keys, and answer-control coordinates |
| `exams.js` | Exam registry, essay prompts, and save identifiers |
| `assets/` | GRE 1 question images plus 54 GRE 6 images in `assets/gre6/` |
| `server.cjs` | Dependency-free local preview server |
| `tests.cjs` | Structural and scoring checks |
| `build.cjs` | Copies the static app to `dist/` |
| `vercel.json` | Vercel deployment configuration |
| `.github/workflows/pages.yml` | GitHub Pages deployment workflow |

## How the exam behaves

In full-length mode, the order is Essay → Verbal 1 → Quant 1 → Verbal 2 (Hard) → Quant 2 (Hard), matching the supplied PDF. Standalone mode starts directly at your selected section and ends after that section. Section instructions are untimed. Starting a section begins its timer; opening Help, Review, or Calculator does not pause it. On reload, select Resume saved test. If a running section has expired, it submits automatically, then the next section waits at its instructions.

Submitted sections cannot be reopened during an attempt. After the final submission, questions from the completed sections can be reviewed with correct choices outlined in green. Scoring awards one point for each fully correct question, with no partial credit. Equivalent fractions and numeric forms are accepted. The report includes the essay and individual answers.

## Scope and limits

This is an independent visual recreation, not the official ETS application or a claim that the supplied PDF is an authenticated exam. The header uses independent practice branding. It closely follows the supplied screenshots; it is not a pixel-identical copy of every official screen or platform behavior.

The PDF supplies fixed **harder second sections**. There are no medium/easy alternative sections, adaptive routing, equating tables, or official 130–170 score conversion. Raw scores use the answer key on the final PDF page and include only completed sections (27 questions per measure in a full-length attempt). Rough 130–170 practice estimates use the transparent heuristic described above and are not official scaled scores. The essay is saved but not automatically graded. Answer-key accuracy has not been independently certified; no worked solutions are included.

Question content is image-based, so it is not fully accessible to screen readers and cannot be selected as text. Buttons and answer fields support keyboard focus and descriptive labels. Desktop/laptop use is recommended; small screens preserve question size with horizontal scrolling. The calculator is a practice implementation; its expression parsing and some operations may differ from ETS software.

Progress is saved only in the browser's local storage for this origin. Private browsing, blocked storage, clearing site data, changing device/browser, or moving between local and hosted URLs can remove or separate progress. A new attempt replaces the previous browser-local attempt for the selected exam; export completed reports to retain them. Do not run the same attempt in multiple tabs. No student data is sent to a server by this app.

The answer keys and images are shipped to the browser and are inspectable in the source. This app is intended for self-practice, not secure proctoring or high-stakes assessment.

## Content rights

GRE and ETS are trademarks of their respective owners. The uploaded exam's question images, essay prompt, and supplied answer key retain their original rights. This package does not grant redistribution rights to that content. Ensure you have permission before making the supplied test content public. There is no claim of ETS affiliation, endorsement, or official scoring.

Update browser QA confirmed that Quant 2 can be launched directly, submission opens standalone results immediately, an unpracticed Verbal measure remains unscored, the numeric estimate matches the displayed formula, and replacing a saved attempt requires confirmation.

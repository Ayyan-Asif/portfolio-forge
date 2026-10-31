# PortfolioForge

Web Technologies project built across three assignments:

| Assignment | Focus |
|---|---|
| 01 | HTML, CSS, Tailwind CSS, five-page layout, dark mode |
| 02 | Semantic HTML tags |
| 03 | JavaScript CRUD + Local Storage, search/filter, Axios API |

## Pages

- `index.html` — Home
- `src/pages/about.html` — About, **CRUD dashboard** and **GitHub API section** (Assignment 03)
- `src/pages/contact.html` — Contact
- `src/pages/signin.html` — Sign In
- `src/pages/signup.html` — Sign Up

## Assignment 03

### Task 1 — CRUD with Local Storage (About page → "Manage Your Projects")

- **Create:** form adds a project object to an array.
- **Read:** records are rendered as cards with `map()`.
- **Update:** *Edit* loads the record into the form; *Save Changes* updates it.
- **Delete:** removes one record (`filter()`), or *Delete All* clears storage (`removeItem()`).
- **Local Storage:** the array is saved under the key `portfolioforge_project_records` with `setItem()` and read back with `getItem()`, so data survives a refresh.
- **Search / filter:** live text search plus a category filter, built with `filter()`.
- **Array methods used:** `filter()`, `find()`, `map()`, `some()` (duplicate-title check), `every()` (form validation), `reduce()` (API star total), `sort()`.

### Task 2 — Axios + public API (About page → "PortfolioForge on GitHub")

- API: **GitHub REST API** — free, JSON, no API key.
- Endpoint: `GET https://api.github.com/users/{username}/repos`
- Axios is loaded by CDN in `about.html` and called with `axios.get()` in `src/js/app.js`.
- Data is shown as cards with a **loading skeleton**, **error messages** (404, rate limit, timeout, offline) and a language filter.
- Change the username in one place: `GITHUB_USERNAME` near the bottom of `src/js/app.js`.

> GitHub allows 60 unauthenticated requests per hour per IP. No token is used, so nothing secret is stored in the repository.

## Other features

Dark mode (saved in Local Storage), profile editor after sign-in (photo upload, projects, skills, education), password strength meter, responsive layout.

Demo login: `demo@portfolio.dev` / `Portfolio123!`

## Contact form

Replace `YOUR_FORMSPREE_ID` in the form action inside `src/pages/contact.html` with your own Formspree endpoint.

## Deploy to GitHub Pages (auto-updates on every push)

1. Push this folder to your existing repository (`main` branch).
2. Repo → **Settings → Pages**.
3. Source: **Deploy from a branch** → `main` → `/ (root)` → Save.
4. Your live link will be `https://<username>.github.io/<repository>/`.
5. Every later `git push` to `main` redeploys the same link automatically (about 1 minute).

```bash
git add .
git commit -m "Assignment 03: CRUD, Local Storage and Axios API"
git push origin main
```

## Folder structure

```
PortfolioForge_Assignment01/
├── index.html
├── README.md
├── project-manifest.json
├── assets/
│   ├── avatar-placeholder.svg
│   └── favicon.svg
└── src/
    ├── css/style.css
    ├── js/app.js
    └── pages/
        ├── about.html
        ├── contact.html
        ├── signin.html
        └── signup.html
```

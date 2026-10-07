# PortfolioForge — Assignment 01

This project is rebuilt around the supplied Web Technologies Assignment 01 instructions.

## Exactly five main pages

- `index.html` — Home
- `src/pages/about.html` — About
- `src/pages/contact.html` — Contact
- `src/pages/signin.html` — Sign In
- `src/pages/signup.html` — Sign Up

## Requirement coverage

- Consistent navbar + footer across all five pages
- Tailwind CSS used on every page
- 10+ UI elements/components per page through cards, badges, forms, buttons, timelines, accordions, stats, navigation, footer blocks, etc.
- Unique browser title for every page
- Favicon on every page
- Responsive layout for desktop/tablet/mobile
- Dark mode with LocalStorage persistence
- Portfolio maker profile editor after sign-in
- Update / delete profile
- Photo upload + preview
- Projects: completed / in progress / next idea
- Skills wall
- Education / schooling / college / current study timeline
- Password visibility + password strength interaction
- Multiple transitions/animations: reveal, hover lift, floating cards, shimmer, pulse, spin, bob, tilt, magnetic button, icon rotation, nav transitions, focus transitions and more

## Contact form — required manual activation

The form is configured for Formspree but intentionally contains a placeholder endpoint:

`https://formspree.io/f/YOUR_FORMSPREE_ID`

To make it fully functional for submission:

1. Create a Formspree form at https://formspree.io/
2. Copy your endpoint.
3. Open `src/pages/contact.html`.
4. Replace `YOUR_FORMSPREE_ID` in the form `action` URL.
5. Commit and push the change to GitHub.
6. Test the live Contact page.

This is the only step that requires your own external account because an actual Formspree endpoint cannot be invented safely.

## Demo login

Email: `demo@portfolio.dev`
Password: `Portfolio123!`

## Demo limitation

This is intentionally a front-end assignment demo. Profile data is stored in LocalStorage. It is not secure production authentication.

## Suggested GitHub Pages deployment

Use GitHub Pages with the `main` branch. The root `index.html` is already in the repository root.

## Suggested submission PDF screenshots

The assignment asks for a live website link, GitHub repository link, expanded VS Code folder structure, and initial/hero screenshots for Home, About, Contact, Sign In and Sign Up.

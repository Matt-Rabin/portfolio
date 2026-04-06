# Design Spec

## Typography
- Font: Inter
- Display/Hero: Inter Black or ExtraBold, ~96pt
- Section labels (rotated): Inter Bold
- Body: Inter ExtraLight, ~36pt (adjust per section)
- Metadata tags: Inter Light, small

## Colors
- Background: #FFFFFF (pure white)
- Primary text: #000000
- No accent colors — color comes from images only

## Design Philosophy
- High-end art book / editorial aesthetic
- Black and white UI, imagery provides all color
- Generous white space
- Left-aligned text blocks

## Layout
- Single scrolling homepage with project grid
- Individual project pages at /projects/[slug]
- Projects expand with accordion on project pages
- Rotated vertical section labels (e.g. "Concept") on project pages
- Metadata line at bottom of hero: e.g. "Fall 2024 • Individual Project • Design Processes"
- Featured flag controls homepage visibility

## Sections per project page
1. Hero (full width image + title + subtitle + tags)
2. Concept
3. Results
4. Technical Appendix (optional, shown if has_appendix: true)

## Site Structure
- / (homepage): Hero, featured projects grid, condensed timeline, contact
- /projects (archive): All projects including non-featured, filterable
- /resume: Full timeline, downloadable PDF link
- /contact: Simple form + social links

## Homepage Sections (in order)
1. Hero — stylized portrait, name, title, one-liner
2. Featured Projects — grid, click through to /projects/[slug]
3. Timeline — condensed 3-4 key roles/milestones
4. Contact — minimal, links + form

## Future-proofing
- Nav should accommodate adding new top-level pages
- Projects are data-driven via .md files — adding a project = adding one file
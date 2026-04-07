---
# ─── METADATA ──────────────────────────────────────────
title: "Procession"
subtitle: "AR/XR Design Client Project"

# Set to true to show on homepage, false to archive
featured: true
featured_order: 2

# Your bottom metadata line e.g. ["Fall 2024", "Individual Project", "Design Processes"]
tags: [Spring 2025, Group Project, Hsin Wang, Steyn Knollema, Sofia Elamrani]

# ─── IMAGES ────────────────────────────────────────────
# Filename only — put files in src/assets/images/your-project-name/
hero: "SPHero@2x.webp"
logo: "SpatialPixelxIPDLOGO@2x.webp"

# Images for each section — add as many as needed
concept_images: [image25 3@2x.webp, image 54@2x.webp, image 47@2x.webp, image 48@2x.webp, image 49@2x.webp, image 51@2x.webp, image 52@2x.webp, image 53@2x-1.webp]
results_images: [image42 2@2x.webp, image43 2@2x.webp, image40 3@2x.webp, image 44@2x.webp]
appendix_images: [image 45@2x.webp, HandOCRview@2x.webp]

# ─── SECTIONS ──────────────────────────────────────────
# Delete sections that don't apply
# has_appendix controls whether the Technical Appendix tab shows
has_appendix: true
video_embed: "https://www.youtube.com/embed/bcZ-I_aZp5M?autoplay=1&mute=1&loop=1&playlist=bcZ-I_aZp5M"

---

## Hero

This project was a collaboration with Spatial Pixel, exploring how AI and spatial computing could be applied in creative workspaces. Our team was tasked with identifying the “killer use cases” for their prototype system, Procession; a projection-based interface that responds to voice, gesture, and real-world context. I focused on user testing, design visualization, and proposing technical improvements to the interface.

## Concept

Our goal was to understand how people might use Procession in real work sessions. We expected users to struggle with how to engage with its functionality, but they actually struggled with what to prompt. Even informed participants used outside tools to decide what needed to be added to the canvas, rather than staying within the projected workspace.

## Results

User testing and iteration led to a redesigned interface that made Procession feel more like a tool and less like a demo. We introduced a Spatial Library, a set of pre-built templates for brainstorming, mapping, and collaboration. The library let users share complete, ready-to-use modules, giving regular users a clear starting point and making the system easier to approach.
To help users decide what to create rather than how to prompt, we mocked up a visualization feature. These transformed sketches and text into visual scenes instantly, helping teams explore variations, summarize ideas, and make decisions faster together.

## Appendix


To support smarter interactions, I offered a number of technical improvements to Spatial Pixel:

Live OCR: Used Tesseract plus a CLAHE + Otsu binarization pipeline to capture handwritten content from the workspace more reliably.
System Feedback: Proposed a simple o3-style feedback panel so users could see what the system was doing without cluttering the canvas.
Dynamic Generation: Used AI prompts to create timelines, maps, and summaries directly on the table so users could update content in real time.
Calibration: Designed a startup calibration flow with fiducial tags to keep the projector and camera aligned.

---
version: 1
slug: "blog-passkeys-index-html"
primary_target: "blog/passkeys/index.html"
related_targets: ["blog.html","assets/css/passkeys.css","assets/js/passkeys.js","tests/passkeys-test.js"]
---

Scope: blog/passkeys/index.html and its dedicated CSS, JavaScript, blog registration, and browser tests.
Mode: Read.
Audience: Technology readers who know passwords but need public-key cryptography and WebAuthn explained without assuming protocol background.
Job: Understand what a passkey is, where each key lives, how registration and authentication work, why phishing/replay/stuffing fail, how sync and recovery differ, and what risks remain.
Proof: W3C WebAuthn Level 3, FIDO2/CTAP specifications, NIST SP 800-63B-4, and current Apple/Google/Microsoft platform guidance.
Constraints: Static GitHub Pages; no build step or animation library; full text remains readable without JavaScript; animation has manual numbered steps, autoplay, keyboard access, and reduced-motion behavior; synced passkeys must not be described as never leaving the original device; phishing resistance must not be described as immunity to all takeover.
Direction: A linear split-key explanation in the Technology editorial identity. Prose, definitions, protocol steps, comparisons, and risks read in one uninterrupted central column. A narrow sticky side table of contents provides optional desktop shortcuts without becoming a second content path. Device, browser, and server remain stable spatial actors only inside the explanatory flow diagram.
Memorable moment: Registration and sign-in each show seven distinct stages—authenticator → browser → website—while a persistent marker states that the private key remains under authenticator control.
Required views: Compact article opening, desktop side table of contents, key-pair boundary, terminology map, animated flow, seven registration steps, seven authentication steps, signed payload, password comparison, attack walkthrough, synced/device-bound comparison, cross-device flow, risk register, takeaway, glossary, and standards.
Implementation inventory: One central reading column with a concise sticky shortcut rail on wide screens only; compact title-first opening; semantic HTML/SVG/CSS split vault placed with the key-pair explanation; dedicated non-overlapping packet lane; seven manually selectable stages; explicit browser-relay stage; registration/sign-in toggle; 2.4-second autoplay/pause/replay; challenge explainer; single explanatory live caption; visual-only mobile position tracker; reasoning questions; paragraph glossary popovers; SPA lifecycle cleanup; mobile stacked diagram; no-JavaScript text fallback; reduced motion.
Unresolved decisions: None.

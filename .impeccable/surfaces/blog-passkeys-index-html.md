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
Direction: A split-key vault in the Technology editorial identity. Device, browser, and server are stable spatial actors; public keys, challenges, and signatures cross the boundary while the private-key marker remains with the authenticator.
Memorable moment: Switching from registration to sign-in changes the moving artifact from a public key to a signature while the private key visibly stays in the device vault.
Required views: Key-pair boundary, terminology map, animated ceremony, six registration steps, six authentication steps, signed payload, password comparison, attack walkthrough, synced/device-bound comparison, cross-device flow, risk register, takeaway, glossary, and standards.
Implementation inventory: Semantic HTML/SVG/CSS split vault; transform-based packets; six manually selectable stages; registration/sign-in toggle; autoplay/pause/replay; explanatory live caption; reasoning questions; paragraph glossary popovers; active-section navigation; SPA lifecycle cleanup; mobile stacked diagram; no-JavaScript text fallback; reduced motion.
Unresolved decisions: None.

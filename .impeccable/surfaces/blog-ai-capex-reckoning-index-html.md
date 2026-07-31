---
version: 1
slug: "blog-ai-capex-reckoning-index-html"
primary_target: "blog/ai-capex-reckoning/index.html"
related_targets: ["blog.html","assets/css/finance.css","assets/js/finance.js"]
---

Scope: blog/ai-capex-reckoning/index.html and its finance-specific CSS/JavaScript.
Mode: Read.
Audience: Curious technology professionals comparing AI-era financial performance.
Job: Understand how Microsoft, Meta, Alphabet, and Amazon differ in growth, earnings quality, cloud economics, capital intensity, and free cash flow.
Proof: Q2 2026 company earnings data, normalized caveats, direct primary-source links, and transparent methodology.
Constraints: Static GitHub Pages site; no build step or chart library; responsive, keyboard accessible, reduced-motion safe, and compatible with existing SPA navigation.
Direction: Capital allocation scanner in a distinct Financial Research Desk identity: warm paper, navy ink, blue structure, green positive flows, and red negative flows.
Approved composition: Composition C from .impeccable/mocks/finance-compositions.html.
Memorable moment: Selecting a comparison row expands it into four company-specific visual tracks; every mark reveals its exact value and interpretation on hover or keyboard focus.
Required views: Overview scanner, operating-cash-to-capex flow map, earnings-adjustment comparison, cloud comparison, verdict, methodology, and sources.
Implementation inventory:
- Sticky chapter rail: semantic anchor navigation with active section state.
- Scanner matrix: semantic table plus buttons; JavaScript controls expanded four-company bars.
- Expanded metric tracks: semantic HTML/CSS bars with focusable value marks and tooltips; positive values move right in green and negative values move left in red.
- Cash flow map: inline SVG generated from the same data model, with focusable paths, reversed red negative paths, and text fallback.
- Earnings quality: semantic comparison rows showing reported and approximate adjusted values.
- Source evidence: numbered primary-source links adjacent to claims and in a final source register.
- Motion: one scanning-beam transition when the selected metric changes; reduced motion renders final state.
- No raster assets are required; all data graphics remain semantic HTML/CSS/SVG.
Unresolved decisions: None.

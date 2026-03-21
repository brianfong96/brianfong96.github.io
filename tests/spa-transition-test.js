/**
 * Automated SPA transition test
 * Navigates between all pages 30 times, verifying:
 * 1. Text resolves to real content (no glyph gibberish)
 * 2. Hamburger menu button is visible and rendered
 * 3. Pages with graphs (about, recipes) have proper graph elements
 */
const puppeteer = require('puppeteer');

const BASE = 'http://localhost:8000';
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴΞΨΩΦΣΛΠΔ';

const PAGES = [
    { path: '/index.html', name: 'Home' },
    { path: '/about.html', name: 'About', hasGraph: true },
    { path: '/projects.html', name: 'Projects' },
    { path: '/blog.html', name: 'Blog' },
    { path: '/recipes.html', name: 'Recipes' },
    { path: '/music.html', name: 'Music' },
    { path: '/recipes/cumin-mega-hamburg-steaks/index.html', name: 'Hamburg Recipe', hasGraph: true },
    { path: '/recipes/cantonese-soy-ginger-chicken/index.html', name: 'Chicken Recipe', hasGraph: true },
];

const TOTAL_TRANSITIONS = 30;
const TRANSITION_SETTLE_MS = 2500;

async function run() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`  [browser error] ${msg.text()}`);
    });
    page.on('pageerror', err => console.log(`  [page error] ${err.message}`));

    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.content', { timeout: 5000 });

    let passed = 0;
    let failed = 0;
    let lastPageIdx = 0;

    for (let i = 0; i < TOTAL_TRANSITIONS; i++) {
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * PAGES.length);
        } while (nextIdx === lastPageIdx);

        const target = PAGES[nextIdx];
        const label = `[${i + 1}/${TOTAL_TRANSITIONS}] → ${target.name}`;

        try {
            // Navigate via SPA click
            const navigated = await page.evaluate((targetPath) => {
                // Find matching link in sidebar or content
                var links = document.querySelectorAll('a[href]');
                for (var k = 0; k < links.length; k++) {
                    var href = links[k].getAttribute('href');
                    if (!href) continue;
                    try {
                        var resolved = new URL(href, window.location.href).pathname;
                        if (resolved === targetPath) {
                            links[k].click();
                            return 'clicked';
                        }
                    } catch(e) {}
                }
                return 'not_found';
            }, target.path);

            if (navigated === 'not_found') {
                // Use direct JS transition
                await page.evaluate((href) => {
                    window.location.href = href;
                }, BASE + target.path);
                await page.waitForSelector('.content', { timeout: 5000 });
            }

            // Wait for transition to fully complete
            await new Promise(r => setTimeout(r, TRANSITION_SETTLE_MS));

            // Run all checks
            const results = await page.evaluate((glyphs, targetPath, hasGraph) => {
                var errors = [];

                // 1. Hamburger menu
                var toggle = document.getElementById('sidebar-toggle');
                if (!toggle) {
                    errors.push('Hamburger menu button not found in DOM');
                } else {
                    var rect = toggle.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0) {
                        errors.push('Hamburger button has zero dimensions: ' + rect.width + 'x' + rect.height);
                    }
                    var svg = toggle.querySelector('svg');
                    if (!svg) {
                        errors.push('Hamburger button SVG icon missing');
                    }
                    var style = window.getComputedStyle(toggle);
                    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                        errors.push('Hamburger button is hidden (display:' + style.display + ', visibility:' + style.visibility + ', opacity:' + style.opacity + ')');
                    }
                }

                // 2. Check text is not gibberish
                var content = document.querySelector('.content');
                if (!content) {
                    errors.push('.content element not found');
                } else {
                    var textContent = content.innerText || '';
                    var glyphCount = 0;
                    var totalChars = 0;
                    for (var j = 0; j < textContent.length; j++) {
                        var ch = textContent[j];
                        if (ch.trim() === '') continue;
                        totalChars++;
                        if (glyphs.indexOf(ch) !== -1) glyphCount++;
                    }
                    var glyphRatio = totalChars > 0 ? glyphCount / totalChars : 0;
                    if (glyphRatio > 0.1) {
                        var sample = textContent.substring(0, 200).replace(/\n/g, ' ');
                        errors.push('Text is gibberish (' + Math.round(glyphRatio * 100) + '% glyphs). Sample: "' + sample + '"');
                    }
                    if (totalChars < 5) {
                        errors.push('Content appears empty (only ' + totalChars + ' chars)');
                    }
                }

                // 3. Graph page checks
                if (hasGraph) {
                    if (targetPath.includes('about')) {
                        if (!document.getElementById('graph-viewport')) errors.push('Missing #graph-viewport');
                        if (!document.getElementById('graph-world')) errors.push('Missing #graph-world');
                        if (!document.getElementById('graph-lines')) errors.push('Missing #graph-lines canvas');
                        var nodes = document.querySelectorAll('.graph-node');
                        if (nodes.length < 2) errors.push('About graph: only ' + nodes.length + ' nodes found');
                    }
                    if (targetPath.includes('recipes/')) {
                        var recipeNodes = document.querySelectorAll('.recipe-node');
                        if (recipeNodes.length < 2) errors.push('Recipe: only ' + recipeNodes.length + ' recipe-node elements');
                        var edges = document.querySelectorAll('.edge-line');
                        if (edges.length < 1) errors.push('Recipe: no edge-line elements found');
                    }
                }

                // 4. Title check
                if (!document.title || document.title.indexOf('Brian Fong') === -1) {
                    errors.push('Bad title: "' + document.title + '"');
                }

                return { errors: errors, title: document.title, url: window.location.href };
            }, GLYPHS, target.path, target.hasGraph);

            if (results.errors.length > 0) {
                console.log(`❌ ${label} FAILED:`);
                results.errors.forEach(e => console.log(`   ${e}`));
                failed++;
            } else {
                console.log(`✅ ${label} OK`);
                passed++;
            }

            lastPageIdx = nextIdx;
        } catch (err) {
            console.log(`❌ ${label} ERROR: ${err.message}`);
            failed++;
            try {
                await page.waitForSelector('.content', { timeout: 5000 });
            } catch (e) {
                console.log('   Recovering...');
                await page.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
                lastPageIdx = 0;
            }
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Results: ${passed} passed, ${failed} failed out of ${TOTAL_TRANSITIONS}`);
    console.log(`${'='.repeat(50)}`);

    await browser.close();
    process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
    console.error('Test runner crashed:', err);
    process.exit(1);
});

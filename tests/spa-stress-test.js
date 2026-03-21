/**
 * Rapid-fire SPA transition stress test
 * Navigates quickly (500ms between clicks) to stress cancellation logic.
 * Then waits and verifies final state is clean.
 */
const puppeteer = require('puppeteer');

const BASE = 'http://localhost:8000';
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴΞΨΩΦΣΛΠΔ';

const PAGES = [
    '/index.html', '/about.html', '/projects.html', '/blog.html',
    '/recipes.html', '/music.html',
    '/recipes/cumin-mega-hamburg-steaks/index.html',
    '/recipes/cantonese-soy-ginger-chicken/index.html',
];

async function run() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    let errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });

    // Rapid-fire: click 10 links in quick succession (500ms apart)
    console.log('=== Rapid-fire stress test (10 quick transitions) ===');
    for (let i = 0; i < 10; i++) {
        const target = PAGES[Math.floor(Math.random() * PAGES.length)];
        await page.evaluate((href) => {
            var links = document.querySelectorAll('a[href]');
            for (var k = 0; k < links.length; k++) {
                try {
                    var resolved = new URL(links[k].getAttribute('href'), window.location.href).pathname;
                    if (resolved === href) { links[k].click(); return; }
                } catch(e) {}
            }
        }, target);
        await new Promise(r => setTimeout(r, 500));
    }

    // Wait for everything to settle
    console.log('Waiting for final transition to settle...');
    await new Promise(r => setTimeout(r, 4000));

    // Verify final state
    const result = await page.evaluate((glyphs) => {
        var errs = [];

        // Hamburger
        var toggle = document.getElementById('sidebar-toggle');
        if (!toggle) errs.push('No hamburger button');
        else {
            var rect = toggle.getBoundingClientRect();
            if (rect.width === 0) errs.push('Hamburger zero width');
            if (!toggle.querySelector('svg')) errs.push('Hamburger SVG missing');
        }

        // Text not gibberish
        var content = document.querySelector('.content');
        if (content) {
            var text = content.innerText || '';
            var gc = 0, tc = 0;
            for (var j = 0; j < text.length; j++) {
                if (text[j].trim() === '') continue;
                tc++;
                if (glyphs.indexOf(text[j]) !== -1) gc++;
            }
            if (tc > 0 && gc / tc > 0.1) {
                errs.push('Final text is gibberish (' + Math.round(gc/tc*100) + '% glyphs)');
            }
        } else {
            errs.push('No .content element');
        }

        // Sidebar links present
        var navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length < 3) errs.push('Nav links missing (' + navLinks.length + ')');

        return { errors: errs, title: document.title, url: window.location.href };
    }, GLYPHS);

    if (result.errors.length > 0) {
        console.log('❌ Rapid-fire test FAILED:');
        result.errors.forEach(e => console.log('   ' + e));
    } else {
        console.log('✅ Rapid-fire test PASSED (final: ' + result.title + ')');
    }

    if (errors.length > 0) {
        console.log('\n⚠️  Page errors during test:');
        errors.forEach(e => console.log('   ' + e));
    }

    console.log('\n=== Sequential 30-transition test ===');

    // Reset to home
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
    let passed = 0, failed = 0, lastIdx = 0;

    for (let i = 0; i < 30; i++) {
        let nextIdx;
        do { nextIdx = Math.floor(Math.random() * PAGES.length); } while (nextIdx === lastIdx);
        const target = PAGES[nextIdx];
        const name = target.split('/').pop().replace('.html','') || 'index';
        const label = `[${i+1}/30] → ${name}`;

        await page.evaluate((href) => {
            var links = document.querySelectorAll('a[href]');
            for (var k = 0; k < links.length; k++) {
                try {
                    var resolved = new URL(links[k].getAttribute('href'), window.location.href).pathname;
                    if (resolved === href) { links[k].click(); return 'clicked'; }
                } catch(e) {}
            }
            window.location.href = href;
            return 'navigated';
        }, target);

        await new Promise(r => setTimeout(r, 2500));

        const check = await page.evaluate((glyphs) => {
            var errs = [];
            var toggle = document.getElementById('sidebar-toggle');
            if (!toggle || toggle.getBoundingClientRect().width === 0) errs.push('hamburger');
            var content = document.querySelector('.content');
            if (content) {
                var t = content.innerText || '', gc=0, tc=0;
                for (var j=0; j<t.length; j++) { if(t[j].trim()==='') continue; tc++; if(glyphs.indexOf(t[j])!==-1) gc++; }
                if (tc > 0 && gc/tc > 0.1) errs.push('gibberish(' + Math.round(gc/tc*100) + '%)');
            } else errs.push('no-content');
            return errs;
        }, GLYPHS);

        if (check.length > 0) {
            console.log(`❌ ${label} FAILED: ${check.join(', ')}`);
            failed++;
        } else {
            console.log(`✅ ${label} OK`);
            passed++;
        }
        lastIdx = nextIdx;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Results: ${passed}/30 passed, ${failed}/30 failed`);
    console.log(`Rapid-fire: ${result.errors.length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`${'='.repeat(50)}`);

    await browser.close();
    process.exit(failed > 0 || result.errors.length > 0 ? 1 : 0);
}

run().catch(err => { console.error('Crashed:', err); process.exit(1); });

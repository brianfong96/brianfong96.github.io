const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const browserExecutable = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find((candidate) => candidate && fs.existsSync(candidate));
const mimeTypes = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function startServer() {
    const server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const requested = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
        const filePath = path.resolve(root, '.' + requested);

        if (!filePath.startsWith(root + path.sep)) {
            response.writeHead(403).end('Forbidden');
            return;
        }

        fs.readFile(filePath, (error, data) => {
            if (error) {
                response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
                return;
            }
            response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
            response.end(data);
        });
    });

    return new Promise((resolve) => {
        server.listen(0, '127.0.0.1', () => {
            resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
        });
    });
}

async function assertNoClippedHeadings(page, label) {
    const clipped = await page.$$eval('h1, h2, h3', (nodes) => nodes
        .filter((node) => !node.closest('.fiber-glossary'))
        .filter((node) => node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1)
        .map((node) => node.textContent.trim()));
    assert.deepEqual(clipped, [], `${label} has clipped headings: ${JSON.stringify(clipped)}`);
}

async function run() {
    const { server, origin } = await startServer();
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: browserExecutable,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
        const browserErrors = [];
        page.on('pageerror', (error) => browserErrors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') browserErrors.push(message.text());
        });

        await page.goto(`${origin}/index.html`, { waitUntil: 'networkidle0' });
        await page.$eval('.nav-links a[href$="blog.html"]', (link) => link.click());
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForSelector('#blog-topic-select');
        await page.select('#blog-topic-select', 'Technology');
        await page.waitForSelector('#blogs-list a[href*="fiber-to-the-home"]');
        assert.equal(await page.$$eval('#blogs-list > li', (nodes) => nodes.length), 2);
        assert.match(await page.$eval('#blogs-list a[href*="fiber-to-the-home"]', (node) => node.innerText), /technology/i);
        assert.match(await page.$eval('#blogs-list a[href*="fiber-to-the-home"]', (node) => node.innerText), /august 13, 2026/i);

        await page.$eval('#blogs-list a[href*="fiber-to-the-home"]', (link) => link.click());
        await page.waitForFunction(() => window.location.pathname.includes('/blog/fiber-to-the-home/'));
        await page.waitForSelector('.fiber-article[data-fiber-initialized="true"]');
        await page.waitForSelector('.fiber-topology');

        assert.equal(await page.$eval('h1', (node) => node.textContent.trim()), 'Your fiber is a shared beam');
        assert.equal(await page.$$eval('[data-flow-direction]', (nodes) => nodes.length), 2);
        assert.equal(await page.$$eval('[data-scenario]', (nodes) => nodes.length), 4);
        assert.equal(await page.$$eval('[data-scope]', (nodes) => nodes.length), 4);
        assert.ok(await page.$$eval('.term[data-term]', (nodes) => nodes.length) >= 12);
        assert.equal(await page.$$eval('[data-glossary-term]', (nodes) => nodes.length), 12);
        assert.equal(await page.$eval('.term[data-term="gpon"]', (node) => node.getAttribute('aria-describedby')), 'term-def-gpon');
        assert.match(await page.$eval('#term-def-gpon', (node) => node.textContent), /passive optical distribution tree/i);
        assert.equal(await page.$eval('.term[data-term="gpon"]', (node) => node.getAttribute('aria-expanded')), null);
        assert.deepEqual(
            await page.$$eval('.owner-chip', (nodes) => nodes.map((node) => node.textContent.trim())),
            ['You', 'You', 'ISP', 'ISP', 'ISP']
        );
        assert.match(await page.$eval('#attacker-understands', (node) => node.textContent), /assigned traffic/i);
        assert.ok(await page.$eval('.fiber-meta a', (node) => node.getBoundingClientRect().height) >= 24);
        await assertNoClippedHeadings(page, 'Fiber desktop');

        await page.$eval('.blog-home-link', (link) => link.click());
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForFunction(() => typeof window.__fiberSecurityCleanup === 'undefined');
        await page.waitForSelector('#blogs-list a[href*="fiber-to-the-home"]');
        await page.click('#blogs-list a[href*="fiber-to-the-home"]');
        await page.waitForFunction(() => window.location.pathname.includes('/blog/fiber-to-the-home/'));
        await page.waitForSelector('.fiber-article[data-fiber-initialized="true"]');
        assert.equal(await page.evaluate(() => typeof window.__fiberSecurityCleanup), 'function');

        await page.click('[data-flow-direction="upstream"]');
        assert.equal(await page.$eval('[data-flow-direction="upstream"]', (node) => node.getAttribute('aria-pressed')), 'true');
        assert.match(await page.$eval('#flow-readout', (node) => node.textContent), /time slots/i);

        await page.click('[data-scenario="rogue"]');
        assert.match(await page.$eval('#attacker-understands', (node) => node.textContent), /encrypted payloads/i);
        assert.equal(await page.$eval('.layer-filter', (node) => node.classList.contains('is-bypassed')), true);

        await page.click('[data-scenario="weak-pon"]');
        assert.match(await page.$eval('#attacker-understands', (node) => node.textContent), /tls ciphertext/i);
        assert.equal(await page.$eval('.layer-gpon', (node) => node.classList.contains('is-absent')), true);

        await page.click('[data-scenario="plaintext"]');
        assert.match(await page.$eval('#attacker-understands', (node) => node.textContent), /plaintext/i);
        assert.equal(await page.$eval('.layer-tls', (node) => node.classList.contains('is-absent')), true);

        const scopeHeights = [];
        for (const scope of ['onu', 'tap', 'olt', 'ems']) {
            await page.click(`[data-scope="${scope}"]`);
            scopeHeights.push(await page.$eval('.scope-grid', (node) => node.getBoundingClientRect().height));
        }
        assert.ok(Math.max(...scopeHeights) - Math.min(...scopeHeights) <= 1, `Scope layout jumps: ${scopeHeights.join(', ')}`);

        await page.click('[data-scope="tap"]');
        const tapMap = await page.evaluate(() => ({
            highlighted: Array.from(document.querySelectorAll('.tree-a1 i'))
                .filter((node) => getComputedStyle(node).backgroundColor !== 'rgb(255, 255, 255)').length,
            marker: getComputedStyle(document.querySelector('.tree-a1'), '::after').content
        }));
        assert.equal(tapMap.highlighted, 2);
        assert.match(tapMap.marker, /Tap/);

        await page.click('[data-scope="olt"]');
        assert.notEqual(
            await page.$eval('.olt-a .scope-olt', (node) => getComputedStyle(node).backgroundColor),
            await page.$eval('.olt-b .scope-olt', (node) => getComputedStyle(node).backgroundColor)
        );

        await page.click('[data-scope="ems"]');
        assert.match(await page.$eval('#scope-scale', (node) => node.textContent), /multiple OLTs/i);
        assert.match(await page.$eval('#scope-concern', (node) => node.textContent), /systemic/i);
        assert.equal(
            await page.$eval('.olt-a .scope-olt', (node) => getComputedStyle(node).backgroundColor),
            await page.$eval('.olt-b .scope-olt', (node) => getComputedStyle(node).backgroundColor)
        );

        const gponTerm = await page.$('.term[data-term="gpon"]');
        await gponTerm.hover();
        await page.waitForSelector('#fiber-term-popover:not([hidden])');
        assert.match(await page.$eval('#term-popover-title', (node) => node.textContent), /Gigabit-capable Passive Optical Network/i);
        assert.equal(await page.$eval('.term[data-term="gpon"]', (node) => node.classList.contains('is-active')), true);

        await page.focus('.packet-xray .term[data-term="gem"]');
        const focusContrast = await page.$eval('.packet-xray .term[data-term="gem"]', (node) => ({
            outline: getComputedStyle(node).outlineColor,
            panel: getComputedStyle(node.closest('.packet-xray')).backgroundColor
        }));
        assert.notEqual(focusContrast.outline, focusContrast.panel);

        await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
        await page.reload({ waitUntil: 'networkidle0' });
        const laptopHero = await page.evaluate(() => ({
            readoutBottom: document.querySelector('.signal-readout').getBoundingClientRect().bottom,
            viewportHeight: window.innerHeight
        }));
        assert.ok(
            laptopHero.readoutBottom <= laptopHero.viewportHeight + 1,
            `Laptop signal readout is below the fold: ${laptopHero.readoutBottom}px > ${laptopHero.viewportHeight}px`
        );

        await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1 });
        await page.reload({ waitUntil: 'networkidle0' });
        const mobile = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            railDisplay: getComputedStyle(document.querySelector('.fiber-rail')).display,
            routeColumns: getComputedStyle(document.querySelector('.fiber-route')).gridTemplateColumns.split(' ').length,
            desktopTopology: getComputedStyle(document.querySelector('.fiber-topology')).display,
            mobileTopology: getComputedStyle(document.querySelector('.mobile-topology')).display,
            heroLabTop: document.querySelector('.fiber-hero-lab').getBoundingClientRect().top,
            viewportHeight: window.innerHeight
        }));
        assert.ok(mobile.scrollWidth <= mobile.clientWidth, `Fiber mobile overflow: ${mobile.scrollWidth}px > ${mobile.clientWidth}px`);
        assert.equal(mobile.railDisplay, 'none');
        assert.equal(mobile.routeColumns, 3);
        assert.equal(mobile.desktopTopology, 'none');
        assert.equal(mobile.mobileTopology, 'grid');
        assert.ok(mobile.heroLabTop < mobile.viewportHeight, `Mobile topology starts below the fold: ${mobile.heroLabTop}px`);
        await assertNoClippedHeadings(page, 'Fiber mobile');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval('.signal-packets', (node) => getComputedStyle(node).display), 'none');

        const noJsPage = await browser.newPage();
        await noJsPage.setJavaScriptEnabled(false);
        await noJsPage.goto(`${origin}/blog/fiber-to-the-home/`, { waitUntil: 'networkidle0' });
        const fallbackGlossary = await noJsPage.$eval('.fiber-glossary', (node) => ({
            position: getComputedStyle(node).position,
            height: node.getBoundingClientRect().height
        }));
        assert.equal(fallbackGlossary.position, 'static');
        assert.ok(fallbackGlossary.height > 100);
        await noJsPage.close();

        assert.deepEqual(browserErrors, []);
    } finally {
        if (browser) await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

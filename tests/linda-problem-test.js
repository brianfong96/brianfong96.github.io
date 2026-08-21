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
    const clipped = await page.$$eval('h1, h2', (nodes) => nodes
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

        await page.goto(`${origin}/blog.html`, { waitUntil: 'networkidle0' });
        await page.select('#blog-topic-select', 'Personal Systems');
        await page.waitForSelector('#blogs-list a[href*="linda-problem"]');
        assert.equal(await page.$$eval('#blogs-list > li', (nodes) => nodes.length), 2);
        assert.match(await page.$eval('#blogs-list a[href*="linda-problem"]', (link) => link.innerText), /august 20, 2026/i);
        assert.match(await page.$eval('#blogs-list a[href*="linda-problem"]', (link) => link.innerText), /personal systems/i);

        await page.$eval('#blogs-list a[href*="linda-problem"]', (link) => link.click());
        await page.waitForFunction(() => window.location.pathname.includes('/blog/linda-problem/'));
        await page.waitForSelector('.linda-article[data-linda-initialized="true"]');

        const articleShape = await page.evaluate(() => {
            const sections = Array.from(document.querySelectorAll('[data-linda-section]'));
            return {
                sections: sections.length,
                paragraphs: document.querySelectorAll('.linda-article p').length,
                h2s: document.querySelectorAll('.linda-article h2').length,
                h3s: document.querySelectorAll('.linda-article h3').length,
                applicationIds: ['debugging', 'investing', 'architecture', 'product', 'health']
                    .every((id) => document.getElementById(id)),
                routeLinks: document.querySelectorAll('[data-linda-route]').length,
                sourceLinks: document.querySelectorAll('.linda-sources a').length,
                bodyText: document.querySelector('.linda-article').textContent,
                setRadius: getComputedStyle(document.querySelector('.set--b')).borderRadius
            };
        });

        assert.equal(articleShape.sections, 6);
        assert.ok(articleShape.paragraphs >= 28);
        assert.ok(articleShape.h2s <= 5);
        assert.equal(articleShape.h3s, 5);
        assert.ok(articleShape.paragraphs > (articleShape.h2s + articleShape.h3s) * 2);
        assert.equal(articleShape.applicationIds, true);
        assert.equal(articleShape.routeLinks, 5);
        assert.equal(articleShape.sourceLinks, 2);
        assert.equal(articleShape.setRadius, '16px');
        assert.match(articleShape.bodyText, /P\(B/);
        assert.match(articleShape.bodyText, /Narrative coherence is not evidential strength/i);
        assert.match(articleShape.bodyText, /base rate/i);
        assert.match(articleShape.bodyText, /competing hypotheses/i);
        assert.match(articleShape.bodyText, /simpler explanations/i);

        assert.ok(await page.$eval('.linda-hero', (node) => node.getBoundingClientRect().height >= window.innerHeight - 61));
        await assertNoClippedHeadings(page, 'Linda desktop');

        await page.click('[data-linda-choice="bf"]');
        assert.equal(await page.$eval('[data-linda-choice="bf"]', (node) => node.getAttribute('aria-pressed')), 'true');
        assert.equal(await page.$eval('.choice-block', (node) => node.dataset.choiceResult), 'bf');
        assert.match(await page.$eval('#choice-readout', (node) => node.textContent), /tempting conjunction/i);

        await page.click('[data-linda-choice="b"]');
        assert.equal(await page.$eval('[data-linda-choice="b"]', (node) => node.getAttribute('aria-pressed')), 'true');
        assert.match(await page.$eval('#choice-readout', (node) => node.textContent), /broad event contains/i);

        await page.$eval('#applications', (node) => node.scrollIntoView());
        await page.waitForFunction(() => document.getElementById('applications').classList.contains('is-active'));
        assert.equal(await page.$eval('[data-linda-route="applications"]', (node) => node.getAttribute('aria-current')), 'true');
        assert.ok(await page.$eval('.linda-progress', (node) => Number(getComputedStyle(node).getPropertyValue('--linda-progress')) > 0.3));

        await page.click('.blog-home-link');
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForFunction(() => typeof window.__lindaProblemCleanup === 'undefined');
        await page.waitForSelector('#blogs-list a[href*="linda-problem"]');
        await page.$eval('#blogs-list a[href*="linda-problem"]', (link) => link.click());
        await page.waitForSelector('.linda-article[data-linda-initialized="true"]');
        assert.equal(await page.evaluate(() => typeof window.__lindaProblemCleanup), 'function');

        const directPage = await browser.newPage();
        await directPage.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
        await directPage.goto(`${origin}/index.html`, { waitUntil: 'networkidle0' });
        const baselineHomeHeading = await directPage.$eval('.section-heading h2', (node) => {
            const style = getComputedStyle(node);
            return [style.fontSize, style.letterSpacing, style.paddingTop, style.paddingBottom];
        });
        await directPage.goto(`${origin}/blog/linda-problem/`, { waitUntil: 'networkidle0' });
        await directPage.waitForSelector('.linda-article[data-linda-initialized="true"]');
        await directPage.click('.home-link');
        await directPage.waitForFunction(() => window.location.pathname.endsWith('/index.html'));
        const returnedHomeHeading = await directPage.$eval('.section-heading h2', (node) => {
            const style = getComputedStyle(node);
            return [style.fontSize, style.letterSpacing, style.paddingTop, style.paddingBottom];
        });
        assert.deepEqual(returnedHomeHeading, baselineHomeHeading);
        await directPage.click('a[href="blog.html"]');
        await directPage.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await directPage.waitForSelector('#blogs-list a[href*="linda-problem"]');
        await directPage.$eval('#blogs-list a[href*="linda-problem"]', (link) => link.click());
        await directPage.waitForSelector('.linda-article[data-linda-initialized="true"]');
        assert.equal(await directPage.evaluate(() => typeof window.__lindaProblemCleanup), 'function');
        await directPage.close();

        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector('.linda-article[data-linda-initialized="true"]');
        const mobile = await page.evaluate(() => {
            const outer = document.querySelector('.set-stage--proof > .set').getBoundingClientRect();
            const inner = document.querySelector('.set-stage--proof .set--bf').getBoundingClientRect();
            return {
                clientWidth: document.documentElement.clientWidth,
                scrollWidth: document.documentElement.scrollWidth,
                choiceColumns: getComputedStyle(document.querySelector('.linda-choices')).gridTemplateColumns.split(' ').length,
                railDisplay: getComputedStyle(document.querySelector('.linda-rail')).display,
                innerContained: inner.left >= outer.left - 1
                    && inner.right <= outer.right + 1
                    && inner.top >= outer.top - 1
                    && inner.bottom <= outer.bottom + 1
            };
        });

        assert.ok(mobile.scrollWidth <= mobile.clientWidth, `Linda mobile overflow: ${mobile.scrollWidth}px > ${mobile.clientWidth}px`);
        assert.equal(mobile.choiceColumns, 1);
        assert.equal(mobile.railDisplay, 'none');
        assert.equal(mobile.innerContained, true);
        await assertNoClippedHeadings(page, 'Linda mobile');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval('.set--bf', (node) => getComputedStyle(node).transitionDuration), '0s');

        const noJsPage = await browser.newPage();
        await noJsPage.setJavaScriptEnabled(false);
        await noJsPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        await noJsPage.goto(`${origin}/blog/linda-problem/`, { waitUntil: 'networkidle0' });
        assert.equal(await noJsPage.$$eval('[data-linda-section]', (nodes) => nodes.length), 6);
        assert.equal(await noJsPage.$eval('.linda-hero', (node) => node.getBoundingClientRect().height >= window.innerHeight - 61), true);
        assert.equal(await noJsPage.$eval('.set--bf', (node) => getComputedStyle(node).transform), 'none');
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

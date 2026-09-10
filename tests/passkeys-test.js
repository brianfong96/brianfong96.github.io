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
        server.listen(0, '127.0.0.1', () => resolve({
            server,
            origin: `http://127.0.0.1:${server.address().port}`
        }));
    });
}

async function assertNoClippedHeadings(page, label) {
    const clipped = await page.$$eval('h1, h2, h3', (nodes) => nodes
        .filter((node) => !node.closest('.passkey-glossary'))
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
        await page.select('#blog-topic-select', 'Technology');
        assert.equal(await page.$$eval('#blogs-list > li', (nodes) => nodes.length), 3);
        const listing = await page.$eval('#blogs-list a[href*="passkeys"]', (node) => node.textContent);
        assert.match(listing, /Passkeys: The Key That Never Reaches the Website/);
        assert.match(listing, /September 9, 2026/i);
        await page.click('#blogs-list a[href*="passkeys"]');
        await page.waitForSelector('#passkey-article[data-passkey-initialized="true"]');
        await page.waitForFunction(() => window.__spaTransition === false);

        assert.equal(await page.$eval('h1', (node) => node.textContent.trim()), 'How passkeys work');
        assert.equal(await page.$$eval('[data-ceremony-mode]', (nodes) => nodes.length), 2);
        assert.equal(await page.$$eval('[data-ceremony-step]', (nodes) => nodes.length), 7);
        assert.equal(await page.$$eval('.protocol-walk', (nodes) => nodes.length), 2);
        assert.equal(await page.$$eval('.protocol-walk li', (nodes) => nodes.length), 12);
        assert.equal(await page.$$eval('.comparison-table tbody tr', (nodes) => nodes.length), 6);
        assert.equal(await page.$$eval('.risk-register article', (nodes) => nodes.length), 8);
        assert.equal(await page.$$eval('[data-glossary-term]', (nodes) => nodes.length), 14);
        assert.ok(await page.$$eval('.term[data-term]', (nodes) => nodes.length) >= 25);
        assert.equal(await page.$$eval('.passkey-route', (nodes) => nodes.length), 0);
        assert.equal(await page.$$eval('.passkey-rail', (nodes) => nodes.length), 1);
        const desktopLayout = await page.evaluate(() => ({
            railDisplay: getComputedStyle(document.querySelector('.passkey-rail')).display,
            railPosition: getComputedStyle(document.querySelector('.passkey-rail')).position,
            heroHeight: document.querySelector('.passkey-hero').getBoundingClientRect().height,
            titleSize: parseFloat(getComputedStyle(document.querySelector('.passkey-hero h1')).fontSize)
        }));
        assert.equal(desktopLayout.railDisplay, 'grid');
        assert.equal(desktopLayout.railPosition, 'sticky');
        assert.ok(desktopLayout.heroHeight < 190, `Passkey desktop hero is too tall: ${desktopLayout.heroHeight}px`);
        assert.ok(desktopLayout.titleSize <= 68, `Passkey desktop title is too large: ${desktopLayout.titleSize}px`);
        await page.$eval('#registration', (node) => node.scrollIntoView());
        await page.waitForFunction(() => document.querySelector('[data-section-link="registration"]').getAttribute('aria-current') === 'true');

        const bodyText = await page.$eval('#passkey-article', (node) => node.textContent);
        assert.match(bodyText, /navigator\.credentials\.create/);
        assert.match(bodyText, /navigator\.credentials\.get/);
        assert.match(bodyText, /authenticatorData \|\| SHA-256\(clientDataJSON\)/);
        assert.match(bodyText, /website never needs the private key and never receives it/i);
        assert.match(bodyText, /synced passkeys copy encrypted key material/i);
        assert.match(bodyText, /clientDataJSON\.type === "webauthn\.create"/);
        assert.match(bodyText, /device-bound.+does not prove hardware isolation or AAL3/is);
        assert.match(bodyText, /phishing-resistant authentication, not a force field/i);
        assert.match(bodyText, /counter regression is a risk signal/i);
        assert.match(bodyText, /at least 16 bytes of cryptographically unpredictable random data/i);
        assert.match(bodyText, /requires an exact match before accepting the response/i);
        assert.doesNotMatch(bodyText, /\bceremony\b/i);

        const flowLayout = await page.evaluate(() => {
            const steps = document.querySelector('.ceremony-steps');
            const figure = document.querySelector('.ceremony-figure');
            const lab = document.querySelector('.ceremony-lab');
            return {
                stepColumns: getComputedStyle(steps).gridTemplateColumns.split(' ').length,
                stepsBeforeFigure: Boolean(steps.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING),
                labHeight: lab.getBoundingClientRect().height
            };
        });
        assert.equal(flowLayout.stepColumns, 7);
        assert.equal(flowLayout.stepsBeforeFigure, true);
        assert.ok(flowLayout.labHeight < 560, `Passkey desktop flow is too tall: ${flowLayout.labHeight}px`);

        await page.$eval('[data-ceremony-step="4"]', (node) => node.click());
        assert.equal(await page.$eval('.ceremony-lab', (node) => node.dataset.stage), '4');
        assert.match(await page.$eval('#ceremony-title', (node) => node.textContent), /creates the key pair/i);
        assert.equal(await page.$eval('.ceremony-caption', (node) => node.getAttribute('aria-live')), 'polite');
        assert.equal(await page.$eval('.mobile-ceremony-state', (node) => node.getAttribute('aria-hidden')), 'true');
        await new Promise((resolve) => setTimeout(resolve, 250));
        assert.equal(await page.$eval('.private-key-state', (node) => getComputedStyle(node).opacity), '1');

        await page.$eval('[data-ceremony-mode="signin"]', (node) => node.click());
        assert.equal(await page.$eval('.ceremony-lab', (node) => node.dataset.ceremony), 'signin');
        assert.equal(await page.$eval('.ceremony-lab', (node) => node.dataset.stage), '0');
        assert.match(await page.$eval('#ceremony-play', (node) => node.textContent), /Play sign-in/);
        assert.match(await page.$eval('[data-ceremony-step="2"] small', (node) => node.textContent), /Fake domains/i);
        await page.$eval('[data-ceremony-step="5"]', (node) => node.click());
        assert.match(await page.$eval('#ceremony-title', (node) => node.textContent), /returns through the browser/i);
        assert.match(await page.$eval('#ceremony-description', (node) => node.textContent), /Page code sends it to the website over HTTPS/i);
        await page.$eval('[data-ceremony-step="6"]', (node) => node.click());
        assert.match(await page.$eval('#ceremony-title', (node) => node.textContent), /verifies and creates a session/i);
        await new Promise((resolve) => setTimeout(resolve, 250));
        assert.equal(await page.$eval('.packet-signature', (node) => getComputedStyle(node).opacity), '1');

        await page.$eval('[data-ceremony-mode="register"]', (node) => node.click());
        await page.click('#ceremony-play');
        await page.waitForFunction(() => Number(document.querySelector('.ceremony-lab').dataset.stage) >= 1, { timeout: 3000 });
        await page.click('#ceremony-play');

        await page.$eval('#authentication [data-choice="visual"]', (node) => node.click());
        assert.match(await page.$eval('#authentication .quiz-feedback', (node) => node.textContent), /visual appearance/i);
        await page.$eval('#authentication [data-choice="origin"]', (node) => node.click());
        assert.match(await page.$eval('#authentication .quiz-feedback', (node) => node.textContent), /Correct/i);
        await page.$eval('#risks [data-choice="recovery"]', (node) => node.click());
        assert.match(await page.$eval('#risks .quiz-feedback', (node) => node.textContent), /Correct/i);

        await page.$eval('.passkey-section .term', (node) => {
            node.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        });
        await page.waitForSelector('#passkey-term-popover:not([hidden])');
        assert.ok(await page.$eval('#passkey-term-definition', (node) => node.textContent.length) > 20);
        await page.keyboard.press('Escape');
        assert.equal(await page.$eval('#passkey-term-popover', (node) => node.hidden), true);
        await assertNoClippedHeadings(page, 'Passkey desktop');

        await page.click('.blog-home-link');
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForFunction(() => typeof window.__passkeyArticleCleanup === 'undefined');
        await page.click('#blogs-list a[href*="passkeys"]');
        await page.waitForSelector('#passkey-article[data-passkey-initialized="true"]');

        await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1 });
        await page.reload({ waitUntil: 'networkidle0' });
        const mobile = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            heroColumns: getComputedStyle(document.querySelector('.passkey-hero-grid')).gridTemplateColumns.split(' ').length,
            planeColumns: getComputedStyle(document.querySelector('.ceremony-plane')).gridTemplateColumns.split(' ').length,
            planeDisplay: getComputedStyle(document.querySelector('.ceremony-plane')).display,
            packets: getComputedStyle(document.querySelector('.packet')).display,
            stepScrollWidth: document.querySelector('.ceremony-steps').scrollWidth,
            stepClientWidth: document.querySelector('.ceremony-steps').clientWidth,
            labHeight: document.querySelector('.ceremony-lab').getBoundingClientRect().height,
            railDisplay: getComputedStyle(document.querySelector('.passkey-rail')).display,
            heroHeight: document.querySelector('.passkey-hero').getBoundingClientRect().height,
            titleSize: parseFloat(getComputedStyle(document.querySelector('.passkey-hero h1')).fontSize),
            mobileState: getComputedStyle(document.querySelector('.mobile-ceremony-state')).display,
            privateMessage: document.querySelector('.mobile-ceremony-state').textContent
        }));
        assert.ok(mobile.scrollWidth <= mobile.clientWidth, `Passkey mobile overflow: ${mobile.scrollWidth}px > ${mobile.clientWidth}px`);
        assert.equal(mobile.heroColumns, 1);
        assert.equal(mobile.planeDisplay, 'none');
        assert.equal(mobile.packets, 'none');
        assert.equal(mobile.stepScrollWidth, mobile.stepClientWidth);
        assert.ok(mobile.labHeight < 520, `Passkey mobile flow is too tall: ${mobile.labHeight}px`);
        assert.equal(mobile.railDisplay, 'none');
        assert.ok(mobile.heroHeight < 230, `Passkey mobile hero is too tall: ${mobile.heroHeight}px`);
        assert.ok(mobile.titleSize <= 53, `Passkey mobile title is too large: ${mobile.titleSize}px`);
        assert.equal(mobile.mobileState, 'block');
        assert.match(mobile.privateMessage, /Private key.+remains under authenticator control/s);
        assert.equal(await page.$$eval('.ceremony-lab [aria-live="polite"]', (nodes) => nodes.filter((node) => getComputedStyle(node).display !== 'none').length), 1);
        await page.$eval('[data-ceremony-mode="signin"]', (node) => node.click());
        await page.$eval('[data-ceremony-step="5"]', (node) => node.click());
        assert.equal(await page.$eval('[data-mobile-position="1"]', (node) => node.getAttribute('aria-current')), 'step');
        assert.match(await page.$eval('#mobile-stage-artifact', (node) => node.textContent), /returns to the browser/i);
        await assertNoClippedHeadings(page, 'Passkey mobile');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval('.actor', (node) => getComputedStyle(node).transitionDuration), '0s');

        const noJsPage = await browser.newPage();
        await noJsPage.setJavaScriptEnabled(false);
        await noJsPage.goto(`${origin}/blog/passkeys/`, { waitUntil: 'networkidle0' });
        assert.equal(await noJsPage.$$eval('.protocol-walk li', (nodes) => nodes.length), 12);
        assert.equal(await noJsPage.$$eval('[data-ceremony-step]', (nodes) => nodes.length), 7);
        assert.equal(await noJsPage.$$eval('[data-glossary-term]', (nodes) => nodes.length), 14);
        assert.match(await noJsPage.$eval('.ceremony-figure', (node) => node.textContent), /Registration begins/);
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

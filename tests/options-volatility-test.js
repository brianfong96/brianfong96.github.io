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
    '.json': 'application/json',
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
    const clipped = await page.$$eval('h1, h2, h3, h4', (nodes) => nodes
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
        await page.select('#blog-topic-select', 'Finance');
        const listing = await page.$eval('#blogs-list a[href*="pricing-the-move"]', (node) => node.textContent);
        assert.match(listing, /Options, Calls, Puts, and Greeks/);
        await page.click('#blogs-list a[href*="pricing-the-move"]');
        await page.waitForSelector('#options-guide[data-options-initialized="true"]');
        await page.waitForFunction(() => window.__spaTransition === false);
        await page.waitForSelector('#msft-history-chart[data-rendered="true"]');
        await page.waitForSelector('#msft-greek-history-chart[data-rendered="true"]');

        assert.equal(await page.$eval('h1', (node) => node.textContent.trim()), 'Options: calls, puts, and Greeks');
        assert.equal(await page.$$eval('.guide-section', (nodes) => nodes.length), 8);
        assert.equal(await page.$$eval('.guide-roadmap li', (nodes) => nodes.length), 7);
        assert.equal(await page.$$eval('details, #options-guide input, #options-guide select', (nodes) => nodes.length), 0);
        assert.equal(await page.$$eval('[data-quiz]', (nodes) => nodes.length), 7);
        assert.equal(await page.$$eval('.guide-section[hidden]', (nodes) => nodes.length), 0);

        assert.match(await page.$eval('#options', (node) => node.textContent), /100 shares/);
        assert.match(await page.$eval('#calls', (node) => node.textContent), /\$507\.09/);
        assert.match(await page.$eval('#puts', (node) => node.textContent), /\$477\.15/);
        assert.match(await page.$eval('#iv', (node) => node.textContent), /25\.522% IV/);
        assert.match(await page.$eval('#iv', (node) => node.textContent), /about \$36\.0/);
        assert.match(await page.$eval('#iv', (node) => node.textContent), /one-standard-deviation move/);
        assert.match(await page.$eval('#iv', (node) => node.textContent), /Vega converts an IV change/i);
        assert.deepEqual(
            await page.$$eval('.greek-grid h3', (nodes) => nodes.map((node) => node.textContent.trim())),
            ['Delta', 'Gamma', 'Theta', 'Vega', 'Rho']
        );
        assert.match(await page.$eval('.greek-equation', (node) => node.textContent), /½Γ × move²/);
        assert.match(await page.$eval('.greek-scenarios', (node) => node.textContent), /\$19\.98/);
        assert.match(await page.$eval('.greek-scenarios', (node) => node.textContent), /\$18\.60/);
        assert.match(await page.$eval('.greek-use-table', (node) => node.textContent), /55 shares/);
        assert.match(await page.$eval('.greek-use-table', (node) => node.textContent), /−\$278/);

        const snapshot = await page.$$eval('.chain-table tbody tr', (rows) => rows.map((row) => row.innerText));
        assert.equal(snapshot.length, 10);
        assert.match(snapshot[0], /\$17\.09/);
        assert.match(snapshot[0], /\$12\.85/);
        assert.match(snapshot[2], /25\.522%/);
        assert.match(snapshot[3], /\+0\.550/);
        assert.match(snapshot[3], /−0\.453/);
        assert.match(snapshot[5], /−0\.267/);
        assert.match(snapshot[6], /0\.557/);
        assert.match(snapshot[7], /\+0\.208/);
        assert.match(snapshot[7], /−0\.164/);
        assert.match(await page.$eval('.snapshot-note', (node) => node.textContent), /25\.522%.+1:38 p\.m\..+26\.650%.+daily K-line/s);

        assert.equal(await page.$$eval('#msft-history-body tr', (nodes) => nodes.length), 9);
        assert.equal(await page.$$eval('#msft-history-chart polyline', (nodes) => nodes.length), 4);
        assert.equal(await page.$$eval('#msft-history-chart circle', (nodes) => nodes.length), 36);
        assert.equal(await page.$$eval('#msft-history-chart circle[tabindex], #msft-greek-history-chart circle[tabindex]', (nodes) => nodes.length), 0);
        assert.equal(await page.$$eval('#msft-greek-history-chart polyline', (nodes) => nodes.length), 5);
        assert.equal(await page.$$eval('#msft-greek-history-chart circle', (nodes) => nodes.length), 45);
        assert.equal(await page.$$eval('#msft-greek-history-body tr', (nodes) => nodes.length), 9);
        assert.match(await page.$eval('.greek-history-intro', (node) => node.textContent), /Black-Scholes approximation/);
        assert.match(await page.$eval('.greek-history-intro', (node) => node.textContent), /European Black-Scholes.+American-style/s);
        assert.match(await page.$eval('.greek-history-lessons', (node) => node.textContent), /Delta reached 0\.729.+Gamma.+0\.01054.+Theta.+−0\.270.+Vega.+0\.558.+Rho.+0\.207/s);
        assert.match(await page.$eval('#msft-greek-history-body tr:last-child', (node) => node.textContent), /0\.5464.*0\.01054.*−0\.2702.*0\.5581.*0\.2073/s);
        assert.match(await page.$eval('#over-time', (node) => node.textContent), /35\.9%/);
        assert.match(await page.$eval('#over-time', (node) => node.textContent), /53\.2%/);
        assert.match(await page.$eval('#over-time', (node) => node.textContent), /26\.662%/);
        assert.equal(await page.$$eval('.history-hit-zone', (nodes) => nodes.length), 18);
        assert.equal(await page.$$eval('[data-history-crosshair]', (nodes) => nodes.length), 2);
        assert.equal(await page.$eval('#msft-history-chart', (node) => node.getAttribute('aria-describedby')), 'history-chart-instructions history-cross-readout');
        assert.equal(await page.$$eval('circle.is-selected', (nodes) => nodes.length), 9);
        await page.focus('#msft-history-chart');
        await page.keyboard.press('ArrowLeft');
        assert.match(await page.$eval('#cross-date', (node) => node.textContent), /September 8, 2026/);
        assert.match(await page.$eval('#cross-observed', (node) => node.textContent), /MSFT \$493\.95.+Call \$17\.67.+IV 26\.444%/s);
        assert.match(await page.$eval('#cross-greeks', (node) => node.textContent), /Delta 0\.5706.+Theta −0\.2643/s);
        assert.equal(await page.$$eval('circle.is-selected', (nodes) => nodes.length), 9);

        await page.$eval('#calls [data-quiz-choice="profit"]', (node) => node.click());
        assert.match(await page.$eval('#calls .quiz-answer', (node) => node.textContent), /buyer paid \$17\.09/i);
        await page.$eval('#greeks [data-quiz-choice="combined"]', (node) => node.click());
        assert.match(await page.$eval('#greeks .quiz-answer', (node) => node.textContent), /Vega and Theta/i);
        await page.$eval('#over-time [data-quiz-choice="combined"]', (node) => node.click());
        assert.match(await page.$eval('#over-time .quiz-answer', (node) => node.textContent), /13 fewer days/i);

        assert.ok(await page.$$eval('.term', (nodes) => nodes.length) >= 35);
        assert.equal(await page.$$eval('.term', (nodes) => nodes.every((node) => Boolean(node.closest('p')))), true);
        assert.equal(await page.$$eval('h1 .term, h2 .term, h3 .term, h4 .term, button .term, nav .term', (nodes) => nodes.length), 0);
        await page.$eval('.guide-section .term', (node) => {
            node.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        });
        await page.waitForSelector('#options-term-popover:not([hidden])');
        assert.ok(await page.$eval('#options-term-definition', (node) => node.textContent.length) > 20);
        await page.keyboard.press('Escape');
        assert.equal(await page.$eval('#options-term-popover', (node) => node.hidden), true);

        await page.$eval('#over-time', (node) => node.scrollIntoView());
        await page.waitForFunction(() => document.querySelector('[data-section-link="over-time"]').getAttribute('aria-current') === 'true');
        await assertNoClippedHeadings(page, 'Options desktop');

        await page.click('.blog-home-link');
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForFunction(() => typeof window.__optionsVolatilityCleanup === 'undefined');

        await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1 });
        await page.goto(`${origin}/blog/pricing-the-move/`, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#msft-history-chart[data-rendered="true"]');
        const mobile = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            railDisplay: getComputedStyle(document.querySelector('.guide-rail')).display,
            sections: document.querySelectorAll('.guide-section').length,
            inputs: document.querySelectorAll('#options-guide input').length,
            chartDisplay: getComputedStyle(document.querySelector('#msft-history-chart')).display,
            greekChartDisplay: getComputedStyle(document.querySelector('#msft-greek-history-chart')).display,
            historyWidth: document.querySelector('.history-table').getBoundingClientRect().width,
            firstLessonTop: document.querySelector('#options').offsetTop,
            historyHeadDisplay: getComputedStyle(document.querySelector('.history-table thead')).display
        }));
        assert.ok(mobile.scrollWidth <= mobile.clientWidth, `Options mobile overflow: ${mobile.scrollWidth}px > ${mobile.clientWidth}px`);
        assert.equal(mobile.railDisplay, 'none');
        assert.equal(mobile.sections, 8);
        assert.equal(mobile.inputs, 0);
        assert.equal(mobile.chartDisplay, 'none');
        assert.equal(mobile.greekChartDisplay, 'none');
        assert.ok(mobile.historyWidth <= mobile.clientWidth);
        assert.ok(mobile.firstLessonTop < 1250, `First lesson starts too late on mobile: ${mobile.firstLessonTop}px`);
        assert.notEqual(mobile.historyHeadDisplay, 'none');
        await assertNoClippedHeadings(page, 'Options mobile');

        const noJsPage = await browser.newPage();
        await noJsPage.setJavaScriptEnabled(false);
        await noJsPage.goto(`${origin}/blog/pricing-the-move/`, { waitUntil: 'networkidle0' });
        assert.equal(await noJsPage.$$eval('.guide-section', (nodes) => nodes.length), 8);
        assert.equal(await noJsPage.$$eval('#msft-history-body tr', (nodes) => nodes.length), 9);
        assert.equal(await noJsPage.$$eval('#msft-greek-history-body tr', (nodes) => nodes.length), 9);
        assert.ok(await noJsPage.$$eval('[data-glossary-term]', (nodes) => nodes.length) >= 19);
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

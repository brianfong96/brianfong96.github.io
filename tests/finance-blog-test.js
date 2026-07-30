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
        const browserErrors = [];
        page.on('pageerror', (error) => browserErrors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') browserErrors.push(message.text());
        });

        await page.goto(`${origin}/blog.html`, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#blogs-list a[href*="ai-capex-reckoning"]');

        const blogEntry = await page.$eval('#blogs-list a[href*="ai-capex-reckoning"]', (link) => link.innerText);
        assert.match(blogEntry, /finance/i);
        assert.match(blogEntry, /july 30, 2026/i);
        assert.equal(await page.$$eval('.topic-index a', (nodes) => nodes.length), 2);
        assert.match(await page.$eval('.hero-copy', (node) => node.textContent), /interests i want to understand better/i);

        assert.equal(await page.$eval('#sidebar-toggle', (button) => button.getAttribute('aria-label')), 'Open navigation');
        await page.click('#sidebar-toggle');
        assert.equal(await page.$eval('#sidebar-toggle', (button) => button.getAttribute('aria-expanded')), 'true');
        assert.equal(await page.$eval('#sidebar-toggle', (button) => button.getAttribute('aria-label')), 'Close navigation');
        assert.equal(await page.$eval('#sidebar', (nav) => getComputedStyle(nav).pointerEvents), 'auto');
        assert.equal(await page.$$eval('#sidebar a', (nodes) => nodes.some((node) => /blog/i.test(node.textContent))), true);
        await page.click('#sidebar-toggle');
        assert.equal(await page.$eval('#sidebar-toggle', (button) => button.getAttribute('aria-expanded')), 'false');

        await page.click('#blogs-list a[href*="ai-capex-reckoning"]');
        await page.waitForFunction(() => window.location.pathname.includes('/blog/ai-capex-reckoning/'));
        await page.waitForSelector('#company-tracks .company-track');

        assert.equal(await page.$$eval('#company-tracks .company-track', (nodes) => nodes.length), 4);
        assert.equal(await page.$$eval('#cash-flow-map .flow-group', (nodes) => nodes.length), 4);
        assert.equal(await page.$$eval('.value-mark .metric-tooltip', (nodes) => nodes.length), 4);
        assert.equal(await page.$$eval('.profit-bridge', (nodes) => nodes.length), 4);
        assert.ok(await page.$$eval('.rank-badge', (nodes) => nodes.length) >= 16);
        assert.equal(await page.$$eval('.market-table tbody tr', (nodes) => nodes.length), 4);
        assert.match(await page.$eval('.market-readthrough', (node) => node.textContent), /investment gains/i);

        await page.click('[data-metric="revenueGrowth"]');
        await page.waitForFunction(() => document.getElementById('expanded-title').textContent === 'Revenue growth');

        const values = await page.$$eval('.value-mark', (nodes) => nodes.map((node) => node.childNodes[0].textContent));
        assert.deepEqual(values, ['+17.7%', '+28.0%', '+24.2%', '+19.6%']);

        await page.click('[data-metric="marketMove"]');
        await page.waitForFunction(() => document.getElementById('expanded-title').textContent === 'Post-earnings stock move');
        const marketMoves = await page.$$eval('.value-mark', (nodes) => nodes.map((node) => node.childNodes[0].textContent));
        assert.deepEqual(marketMoves, ['+15.5%', '−8.0%', '−0.9%', '+3.9%']);

        await page.click('[data-metric="freeCashFlow"]');
        const signedDirection = await page.evaluate(() => {
            const shell = document.querySelector('.track-shell.is-signed');
            const positive = document.querySelector('.track-bar.is-positive');
            const negative = document.querySelector('.track-bar.is-negative');
            const shellBox = shell.getBoundingClientRect();
            const positiveBox = positive.getBoundingClientRect();
            const negativeBox = negative.getBoundingClientRect();
            return {
                bodyClass: document.body.className,
                positiveColor: getComputedStyle(positive).backgroundColor,
                negativeColor: getComputedStyle(negative).backgroundColor,
                positiveStartsAtMidpoint: positiveBox.left >= shellBox.left + shellBox.width / 2 - 1,
                negativeEndsAtMidpoint: negativeBox.right <= shellBox.left + shellBox.width / 2 + 1
            };
        });
        assert.equal(signedDirection.bodyClass, 'finance-page');
        assert.equal(signedDirection.positiveColor, 'rgb(36, 122, 77)');
        assert.equal(signedDirection.negativeColor, 'rgb(180, 58, 63)');
        assert.equal(signedDirection.positiveStartsAtMidpoint, true);
        assert.equal(signedDirection.negativeEndsAtMidpoint, true);

        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        const dimensions = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth
        }));
        assert.ok(dimensions.scrollWidth <= dimensions.clientWidth, `Mobile overflow: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
        assert.deepEqual(browserErrors, []);
    } finally {
        if (browser) await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }

    console.log('Finance blog interaction test passed.');
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

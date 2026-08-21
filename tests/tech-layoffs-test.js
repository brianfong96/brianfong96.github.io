const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');
const layoffData = require('../assets/js/tech-layoffs-data.js');

const root = path.resolve(__dirname, '..');
const articlePath = path.join(root, 'blog', 'tech-layoffs', 'index.html');
const articleHtml = fs.readFileSync(articlePath, 'utf8');
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

function eventTotal(companyId, startQuarter = '2021-Q1', endQuarter = '2026-Q3') {
    const start = layoffData.quarters.indexOf(startQuarter);
    const end = layoffData.quarters.indexOf(endQuarter);
    return layoffData.events
        .filter((event) => event.company === companyId)
        .filter((event) => event.countable !== false && !event.excluded && typeof event.count === 'number')
        .filter((event) => {
            const quarter = layoffData.quarters.indexOf(event.quarter);
            return quarter >= start && quarter <= end;
        })
        .reduce((sum, event) => sum + event.count, 0);
}

function assertDatasetMath() {
    assert.equal(layoffData.asOf, '2026-08-21');
    assert.equal(layoffData.quarters.length, 23);
    assert.equal(new Set(layoffData.quarters).size, 23);
    assert.equal(layoffData.companies.length, 7);
    assert.equal(new Set(layoffData.companies.map((company) => company.id)).size, 7);
    assert.equal(new Set(layoffData.events.map((event) => event.id)).size, layoffData.events.length);

    assert.deepEqual(
        Object.fromEntries(layoffData.companies.map((company) => [company.id, eventTotal(company.id)])),
        {
            amazon: 58810,
            microsoft: 38025,
            meta: 35060,
            tesla: 14229,
            google: 13392,
            apple: 914,
            nvidia: 0
        }
    );

    assert.deepEqual(
        {
            amazonEarly: eventTotal('amazon', '2021-Q1', '2023-Q4'),
            amazonRecent: eventTotal('amazon', '2024-Q1', '2026-Q3'),
            microsoftEarly: eventTotal('microsoft', '2021-Q1', '2023-Q4'),
            microsoftRecent: eventTotal('microsoft', '2024-Q1', '2026-Q3'),
            metaEarly: eventTotal('meta', '2021-Q1', '2023-Q4'),
            metaRecent: eventTotal('meta', '2024-Q1', '2026-Q3'),
            googleEarly: eventTotal('google', '2021-Q1', '2023-Q4'),
            googleRecent: eventTotal('google', '2024-Q1', '2026-Q3')
        },
        {
            amazonEarly: 27000,
            amazonRecent: 31810,
            microsoftEarly: 11800,
            microsoftRecent: 26225,
            metaEarly: 21000,
            metaRecent: 14060,
            googleEarly: 12040,
            googleRecent: 1352
        }
    );

    const amazonReset = layoffData.events
        .filter((event) => event.programId === 'amazon-2022-2023')
        .reduce((sum, event) => sum + event.count, 0);
    assert.equal(amazonReset, 27000);
    assert.equal(layoffData.events.filter((event) => event.id === 'meta-2023').length, 1);
    assert.equal(layoffData.events.find((event) => event.id === 'microsoft-2025-june-warn').countable, false);
    assert.equal(layoffData.events.find((event) => event.id === 'apple-2026-retail').countable, false);

    layoffData.events
        .filter((event) => /WARN/.test(event.scope))
        .forEach((event) => {
            assert.equal(event.percentLabel, undefined, `${event.id} must not divide a state WARN count by global headcount`);
        });

    const sourceIds = new Set([...articleHtml.matchAll(/\bid="(source-[^"]+)"/g)].map((match) => match[1]));
    layoffData.events.flatMap((event) => event.sourceIds || []).forEach((sourceId) => {
        assert.ok(sourceIds.has(sourceId), `Missing article source anchor: ${sourceId}`);
    });

    const sourceUrls = [...articleHtml.matchAll(/<ol class="source-list">([\s\S]*?)<\/ol>/g)]
        .flatMap((match) => [...match[1].matchAll(/href="([^"]+)"/g)].map((urlMatch) => urlMatch[1]));
    assert.ok(sourceUrls.length >= 35);
    sourceUrls.forEach((url) => {
        assert.match(url, /^https:\/\//);
        assert.equal(/utm_|queryly=|chatgpt/i.test(url), false, `Tracking parameter found: ${url}`);
    });
}

async function assertNoClippedHeadings(page, label) {
    const clipped = await page.$$eval('h1, h2, h3', (nodes) => nodes
        .filter((node) => node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1)
        .map((node) => node.textContent.trim()));
    assert.deepEqual(clipped, [], `${label} has clipped headings: ${JSON.stringify(clipped)}`);
}

async function run() {
    assertDatasetMath();
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
        await page.waitForSelector('#blogs-list a[href*="tech-layoffs"]');
        assert.equal(await page.$$eval('#blogs-list > li', (nodes) => nodes.length), 2);
        assert.match(await page.$eval('#blogs-list a[href*="tech-layoffs"]', (link) => link.innerText), /august 21, 2026/i);
        assert.match(await page.$eval('#blogs-list a[href*="tech-layoffs"]', (link) => link.innerText), /technology/i);

        await page.click('#blogs-list a[href*="tech-layoffs"]');
        await page.waitForFunction(() => window.location.pathname.includes('/blog/tech-layoffs/'));
        await page.waitForSelector('.layoffs-article[data-layoffs-state="ready"]');

        const articleShape = await page.evaluate(() => ({
            companies: document.querySelectorAll('[data-comparison-chart] .comparison-row').length,
            quarters: document.querySelectorAll('[data-timeline-chart] .timeline-cell').length,
            comparisonTicks: document.querySelectorAll('[data-comparison-axis] > div > span').length,
            timelineTicks: document.querySelectorAll('[data-timeline-axis] .axis-tick').length,
            sources: document.querySelectorAll('.source-list > li').length,
            summaryRows: document.querySelectorAll('#scale .layoffs-table tbody tr').length,
            h2s: document.querySelectorAll('.layoffs-article h2').length,
            h3s: document.querySelectorAll('.layoffs-article h3').length,
            paragraphs: document.querySelectorAll('.layoffs-article p').length,
            heroHeight: document.querySelector('.layoffs-hero').getBoundingClientRect().height,
            bodyText: document.querySelector('.layoffs-article').textContent
        }));
        assert.equal(articleShape.companies, 7);
        assert.equal(articleShape.quarters, 23);
        assert.equal(articleShape.comparisonTicks, 3);
        assert.equal(articleShape.timelineTicks, 3);
        assert.ok(articleShape.sources >= 35);
        assert.equal(articleShape.summaryRows, 7);
        assert.ok(articleShape.paragraphs > (articleShape.h2s + articleShape.h3s) * 2);
        assert.ok(articleShape.heroHeight >= 700);
        assert.match(articleShape.bodyText, /58,810/);
        assert.match(articleShape.bodyText, /state WARN count is never divided by global headcount/i);
        assert.match(articleShape.bodyText, /AI is an accelerant, not a complete cause/i);
        assert.equal(await page.$eval('[data-hero-ranking] [data-company="amazon"] output', (node) => node.textContent.trim()), '≥58,810 + U');
        assert.equal(await page.$eval('[data-hero-ranking] [data-company="meta"] output', (node) => node.textContent.trim()), '≥35,060 + U');
        assert.equal(await page.$eval('[data-comparison-axis] .axis-title', (node) => node.textContent.trim()), 'Employees affected');
        assert.equal(await page.$eval('[data-comparison-axis] > div > span:last-child', (node) => node.textContent.trim()), '58.8k');
        assert.equal(await page.$eval('[data-timeline-axis] .axis-title', (node) => node.textContent.trim()), 'Employees affected (square-root scale)');
        assert.equal(await page.$eval('[data-timeline-axis] .is-max span', (node) => node.textContent.trim()), '17k');
        const axisGeometry = await page.evaluate(() => {
            const mark = document.querySelector('.timeline-mark').getBoundingClientRect();
            const maximum = document.querySelector('[data-timeline-axis] .is-max').getBoundingClientRect();
            const midpoint = document.querySelector('[data-timeline-axis] .is-mid').getBoundingClientRect();
            const zero = document.querySelector('[data-timeline-axis] .is-zero').getBoundingClientRect();
            return {
                maxGap: Math.abs(maximum.top - mark.top),
                midGap: Math.abs(midpoint.top - (mark.top + mark.bottom) / 2),
                zeroGap: Math.abs(zero.top - mark.bottom)
            };
        });
        assert.ok(axisGeometry.maxGap <= 1, `Timeline max tick is misaligned by ${axisGeometry.maxGap}px`);
        assert.ok(axisGeometry.midGap <= 1, `Timeline midpoint tick is misaligned by ${axisGeometry.midGap}px`);
        assert.ok(axisGeometry.zeroGap <= 1, `Timeline zero tick is misaligned by ${axisGeometry.zeroGap}px`);

        const divergenceAlignment = await page.evaluate(() => {
            const rail = document.querySelector('.divergence-rail').getBoundingClientRect();
            const branchCoordinates = [18, 63, 108, 152, 197, 242];
            return Array.from(document.querySelectorAll('.divergence-outcomes > div')).map((row, index) => {
                const rect = row.getBoundingClientRect();
                const branchY = rail.top + (branchCoordinates[index] / 260) * rail.height;
                return Math.abs(branchY - (rect.top + rect.bottom) / 2);
            });
        });
        assert.ok(Math.max(...divergenceAlignment) <= 2, `Divergence branches miss rows: ${divergenceAlignment.join(', ')}`);
        await assertNoClippedHeadings(page, 'Layoffs desktop');

        await page.hover('[data-comparison-chart] [data-company="amazon"] .comparison-track');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-comparison-chart] [data-company="amazon"] .comparison-tooltip')).opacity === '1');
        assert.equal(await page.$eval('[data-comparison-chart] [data-company="amazon"] .comparison-tooltip', (node) => getComputedStyle(node).opacity), '1');
        assert.match(await page.$eval('[data-comparison-chart] [data-company="amazon"] .comparison-tooltip', (node) => node.textContent), /58,810/);
        await page.hover('[data-timeline-chart] .timeline-cell[tabindex="0"]');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-timeline-chart] .timeline-cell[tabindex="0"] .timeline-tooltip')).opacity === '1');
        assert.equal(await page.$eval('[data-timeline-chart] .timeline-cell[tabindex="0"] .timeline-tooltip', (node) => getComputedStyle(node).opacity), '1');

        await page.click('[data-window="reset"]');
        await page.waitForFunction(() => document.querySelector('[data-comparison-title]').textContent.includes('2021-2023'));
        assert.match(
            await page.$eval('[data-comparison-chart] [data-company="amazon"] .comparison-value', (node) => node.textContent),
            /27k/
        );
        assert.match(
            await page.$eval('[data-comparison-chart] [data-company="microsoft"] .comparison-value', (node) => node.textContent),
            /11\.8k/
        );
        assert.match(
            await page.$eval('[data-comparison-chart] [data-company="google"] .comparison-value', (node) => node.textContent),
            /12\.0k/
        );
        assert.match(await page.$eval('[data-comparison-summary]', (node) => node.textContent), /Select a company row/i);
        assert.equal(await page.$eval('[data-comparison-axis] > div > span:last-child', (node) => node.textContent.trim()), '27k');
        await page.hover('[data-comparison-chart] [data-company="amazon"] .comparison-track');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-comparison-chart] [data-company="amazon"] .comparison-tooltip')).opacity === '1');
        assert.match(await page.$eval('[data-comparison-chart] [data-company="amazon"] .comparison-tooltip', (node) => node.textContent), /27,000/);
        await page.hover('[data-comparison-chart] [data-company="google"] .comparison-track');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-comparison-chart] [data-company="google"] .comparison-tooltip')).opacity === '1');
        assert.match(await page.$eval('[data-comparison-chart] [data-company="google"] .comparison-tooltip', (node) => node.textContent), /12,040/);

        await page.click('[data-metric="cadence"]');
        await page.waitForFunction(() => document.querySelector('[data-comparison-title]').textContent.includes('Quarters'));
        assert.equal(await page.$eval('[data-comparison-axis] .axis-title', (node) => node.textContent.trim()), 'Quarters with public evidence');
        assert.match(
            await page.$eval('[data-comparison-chart] [data-company="microsoft"] .comparison-value', (node) => node.textContent),
            /quarter/
        );

        await page.click('.company-selector [data-company-choice="meta"]');
        await page.waitForFunction(() => document.querySelector('[data-timeline-title]').textContent.startsWith('Meta'));
        assert.equal(await page.$eval('.company-selector [data-company-choice="meta"]', (node) => node.getAttribute('aria-pressed')), 'true');
        assert.ok(await page.$$eval('[data-timeline-events] > li', (nodes) => nodes.length) >= 10);
        assert.match(await page.$eval('[data-portrait-title]', (node) => node.textContent), /aggressive cutter/i);
        assert.equal(await page.$eval('[data-timeline-axis] .is-max span', (node) => node.textContent.trim()), '11k');
        assert.equal(await page.$eval('[data-timeline-events]', (node) => node.textContent.includes('>=')), false);

        await page.click('.company-selector [data-company-choice="apple"]');
        await page.waitForFunction(() => document.querySelector('[data-timeline-title]').textContent.startsWith('Apple'));
        assert.equal(await page.$eval('[data-timeline-axis] .is-mid span', (node) => node.textContent.trim()), '154');

        await page.click('.company-selector [data-company-choice="nvidia"]');
        await page.waitForFunction(() => document.querySelector('[data-timeline-title]').textContent.startsWith('Nvidia'));
        assert.equal(await page.$$eval('[data-timeline-events] > li', (nodes) => nodes.length), 1);
        assert.equal(await page.$$eval('[data-timeline-axis] .axis-tick', (nodes) => nodes.length), 0);
        assert.match(await page.$eval('[data-timeline-axis]', (node) => node.textContent), /No quantified events/i);
        assert.match(await page.$eval('[data-timeline-events]', (node) => node.textContent), /No substantiated mass-layoff program found/i);

        await page.$eval('#roles', (node) => node.scrollIntoView());
        await page.waitForFunction(() => document.querySelector('[data-layoffs-route="roles"]').getAttribute('aria-current') === 'true');
        assert.ok(await page.$eval('.layoffs-progress', () => Number(getComputedStyle(document.documentElement).getPropertyValue('--layoffs-progress')) > 0.3));

        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector('.layoffs-article[data-layoffs-state="ready"]');
        const mobile = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            heroColumns: getComputedStyle(document.querySelector('.layoffs-hero-grid')).gridTemplateColumns.split(' ').length,
            portraitColumns: getComputedStyle(document.querySelector('.company-lens')).gridTemplateColumns.split(' ').length,
            timelineScrollable: document.querySelector('.timeline-viewport').scrollWidth > document.querySelector('.timeline-viewport').clientWidth,
            timelineScrollLeft: document.querySelector('.timeline-viewport').scrollLeft,
            railDisplay: getComputedStyle(document.querySelector('.layoffs-rail')).display,
            mobileNavDisplay: getComputedStyle(document.querySelector('.layoffs-mobile-nav')).display,
            rankingBottom: document.querySelector('.hero-ranking').getBoundingClientRect().bottom,
            viewportHeight: window.innerHeight,
            controlHeight: document.querySelector('[data-window="full"]').getBoundingClientRect().height,
            lensButtonHeight: document.querySelector('.company-lens-index button').getBoundingClientRect().height
        }));
        assert.ok(mobile.scrollWidth <= mobile.clientWidth, `Layoffs mobile overflow: ${mobile.scrollWidth}px > ${mobile.clientWidth}px`);
        assert.equal(mobile.heroColumns, 1);
        assert.equal(mobile.portraitColumns, 1);
        assert.equal(mobile.timelineScrollable, true);
        assert.ok(mobile.timelineScrollLeft > 0, 'Mobile timeline should open near the first documented event');
        assert.equal(mobile.railDisplay, 'none');
        assert.equal(mobile.mobileNavDisplay, 'grid');
        assert.ok(mobile.rankingBottom <= mobile.viewportHeight + 1, `Mobile ranking is below the first viewport: ${mobile.rankingBottom}px`);
        assert.ok(mobile.controlHeight >= 44);
        assert.ok(mobile.lensButtonHeight >= 44);
        await assertNoClippedHeadings(page, 'Layoffs mobile');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval('.comparison-bar', (node) => getComputedStyle(node).transitionDuration), '0s');
        assert.equal(await page.$eval('.timeline-bar', (node) => getComputedStyle(node).transitionDuration), '0s');

        await page.click('.blog-home-link');
        await page.waitForFunction(() => window.location.pathname.endsWith('/blog.html'));
        await page.waitForFunction(() => typeof window.__techLayoffsCleanup === 'undefined');
        await page.select('#blog-topic-select', 'Technology');
        await page.click('#blogs-list a[href*="tech-layoffs"]');
        await page.waitForSelector('.layoffs-article[data-layoffs-state="ready"]');
        assert.equal(await page.evaluate(() => typeof window.__techLayoffsCleanup), 'function');

        const noJsPage = await browser.newPage();
        await noJsPage.setJavaScriptEnabled(false);
        await noJsPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        await noJsPage.goto(`${origin}/blog/tech-layoffs/`, { waitUntil: 'networkidle0' });
        assert.equal(await noJsPage.$$eval('[data-hero-ranking] .hero-rank-row', (nodes) => nodes.length), 7);
        assert.equal(await noJsPage.$$eval('[data-comparison-chart] .comparison-row', (nodes) => nodes.length), 7);
        assert.ok(await noJsPage.$$eval('.layoffs-table tbody tr', (nodes) => nodes.length) >= 21);
        assert.match(await noJsPage.$eval('#methodology', (node) => node.textContent), /Undisclosed rounds remain U/i);
        const noJsDimensions = await noJsPage.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth
        }));
        assert.ok(noJsDimensions.scrollWidth <= noJsDimensions.clientWidth);
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

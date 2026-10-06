const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, data) => {
        if (error) return res.writeHead(404).end();
        res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(data);
    });
});
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(file => file && fs.existsSync(file));
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, executablePath });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const origin = `http://127.0.0.1:${server.address().port}`;
        await page.goto(origin + '/index.html', { waitUntil: 'networkidle0' });
        assert.equal(await page.$('a[href="recipes.html"]'), null);
        await page.click('.explore-topics a[href="blog.html#recipes"]');
        await page.waitForSelector('#blogs-list a');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.$eval('#blog-topic-select', el => el.value), 'Recipes');
        assert.equal(await page.$eval('#posts-heading', el => el.textContent), 'Latest recipes');
        assert.equal(await page.$$eval('#blogs-list a', links => links.length), 1);
        assert.doesNotMatch(await page.$eval('body', el => el.innerText), /Cumin-Spiced|Cantonese-Style/);
        assert.equal(fs.existsSync(path.join(root, 'recipes/cumin-mega-hamburg-steaks/index.html')), false);
        assert.equal(fs.existsSync(path.join(root, 'recipes/cantonese-soy-ginger-chicken/index.html')), false);
        await page.click('#blogs-list a[href*="aurora-over-alaska"]');
        await page.waitForSelector('.aurora-article');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.title(), 'Aurora Over Alaska - Brian Fong');
        assert.equal(await page.$eval('.blog-home-link', el => el.textContent), 'More recipes');
        assert.equal(await page.$eval('.blog-home-link', el => new URL(el.href).pathname + new URL(el.href).hash), '/blog.html#recipes');
        assert.equal(await page.$eval('body', el => getComputedStyle(el).fontFamily), '"Segoe UI", Arial, sans-serif');
        assert.equal(await page.$$eval('.aurora-article a[href^="#"]', links => links.filter(link => !document.getElementById(link.hash.slice(1))).length), 0);
        assert.equal(await page.$$eval('.aurora-article a[href^="https://www.amazon.ca/dp/"]', links => links.length), 6);
        assert.equal(await page.$eval('.aurora-guide img', el => el.complete && el.naturalWidth > 0), true);
        for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 568]]) {
            await page.setViewport({ width, height });
            const layout = await page.evaluate(() => ({
                overflow: document.documentElement.scrollWidth > innerWidth,
                clipped: [...document.querySelectorAll('.aurora-article *')].filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).display !== 'inline').map(el => el.className)
            }));
            assert.equal(layout.overflow, false, `${width}px overflow`);
            assert.deepEqual(layout.clipped, [], `${width}px clipping`);

        }
        await page.setViewport({ width: 1440, height: 900 });
        await page.click('.blog-home-link');
        await page.waitForSelector('#blogs-list');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.$eval('#blog-topic-select', el => el.value), 'Recipes');
        assert.equal(await page.$('.blog-home-link'), null);
        await page.goBack();
        await page.waitForSelector('.aurora-article');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.$eval('.blog-home-link', el => el.textContent), 'More recipes');
        await page.click('.home-link');
        await page.waitForSelector('.section-buttons');
        await page.waitForFunction(() => window.__spaTransition === false);
        await page.click('.section-buttons a[href="blog.html"]');
        await page.waitForSelector('#blogs-list a');
        await page.waitForFunction(() => window.__spaTransition === false);
        await page.click('#blogs-list a[href*="how-to-tell-whats-true"]');
        await page.waitForSelector('.truth-article');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.$eval('.blog-home-link', el => el.textContent), 'All blogs');
        assert.equal(await page.$eval('.blog-home-link', el => new URL(el.href).pathname), '/blog.html');
        await page.setJavaScriptEnabled(false);
        await page.goto(origin + '/blog/aurora-over-alaska/', { waitUntil: 'networkidle0' });
        assert.equal(await page.$$eval('.aurora-chapter', els => els.length), 7);
        assert.equal(await page.$eval('.aurora-guide img', el => el.complete && el.naturalWidth > 0), true);
        assert.deepEqual(errors, []);
        console.log('Aurora passed: 4 responsive widths, assets, links, homepage discovery, SPA navigation and back, correct recipe/blog navigation, and no-JS reading.');
    } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(file => file && fs.existsSync(file));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };

async function run() {
    const server = http.createServer((req, res) => {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
        if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
        fs.readFile(file, (error, data) => {
            if (error) return res.writeHead(404).end();
            res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(data);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        await page.goto(`${origin}/blog.html#personal-systems`, { waitUntil: 'networkidle0' });
        assert.equal(await page.$eval('#blog-topic-select', el => el.value), 'Personal Systems');
        await page.click('a[href="blog/how-to-tell-whats-true/index.html"]');
        await page.waitForSelector('.truth-article');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.title(), 'How to Tell What’s True - Brian Fong');
        await page.waitForSelector('.truth-article[data-truth-initialized="true"]');
        assert.equal(await page.$('.truth-byline'), null);

        for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 568]]) {
            await page.setViewport({ width, height });
            const layout = await page.evaluate(() => {
                const article = document.querySelector('.truth-article');
                const all = [...article.querySelectorAll('*')];
                return {
                    overflow: document.documentElement.scrollWidth > innerWidth,
                    nestedScroll: all.filter(el => /auto|scroll/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1).map(el => el.className),
                    clipped: all.filter(el => el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && getComputedStyle(el).display !== 'inline').map(el => el.className),
                    floating: all.filter(el => !el.closest('.truth-rail') && ['fixed', 'sticky'].includes(getComputedStyle(el).position)).map(el => el.className),
                    railDisplay: getComputedStyle(article.querySelector('.truth-rail')).display,
                    overlappingChapters: [...article.querySelectorAll('.truth-chapter')].some((el, i, sections) => i && el.getBoundingClientRect().top < sections[i - 1].getBoundingClientRect().bottom - 1),
                    minimumChapterHeight: Math.min(...[...article.querySelectorAll('.truth-chapter')].map(el => el.getBoundingClientRect().height))
                };
            });
            assert.equal(layout.overflow, false, `${width}px page overflow`);
            assert.deepEqual(layout.nestedScroll, [], `${width}px nested scrolling`);
            assert.deepEqual(layout.clipped, [], `${width}px clipped diagrams or headings`);
            assert.deepEqual(layout.floating, [], `${width}px competing floating content`);
            assert.equal(layout.railDisplay, width >= 1100 ? 'grid' : 'none');
            assert.equal(layout.overlappingChapters, false);
            assert.ok(layout.minimumChapterHeight >= height - 61, 'Sections reserve space for one concept at a time');
        }

        const brokenAnchors = await page.$$eval('.truth-article a[href^="#"]', links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
        assert.deepEqual(brokenAnchors, []);
        await page.setViewport({ width: 1440, height: 900 });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await page.$eval('#claim', el => el.scrollIntoView({ behavior: 'instant' }));
        await page.click('.truth-rail a[href="#causation"]');
        await page.waitForFunction(() => document.querySelector('.truth-rail a[aria-current="location"]').hash === '#causation');
        assert.equal(await page.$$eval('.truth-rail a[aria-current]', els => els.length), 1);
        const rail = await page.$eval('.truth-rail', el => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom }));
        assert.ok(rail.top >= 60 && rail.bottom < 900, 'Sticky TOC remains fully visible without its own scrollbar');
        await page.$eval('#context', el => el.scrollIntoView({ behavior: 'instant' }));
        await page.waitForFunction(() => document.querySelector('.truth-rail a[aria-current="location"]').hash === '#context');
        await page.click('.truth-sources a[href*="blog.html"]');
        await page.waitForSelector('#blog-topic-select');
        await page.waitForFunction(() => window.__spaTransition === false);
        assert.equal(await page.$eval('#blog-topic-select', el => el.value), 'Personal Systems');
        assert.equal(await page.evaluate(() => typeof window.__truthArticleCleanup), 'undefined');
        await page.click('a[href="blog/how-to-tell-whats-true/index.html"]');
        await page.waitForSelector('.truth-article');
        await page.waitForFunction(() => window.__spaTransition === false);
        await page.waitForSelector('.truth-article[data-truth-initialized="true"]');
        await page.$eval('#consistency', el => el.scrollIntoView({ behavior: 'instant' }));
        await page.waitForFunction(() => document.querySelector('.truth-rail a[aria-current="location"]').hash === '#consistency');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval('.truth-chapter', el => getComputedStyle(el).animationName), 'none');
        await page.setJavaScriptEnabled(false);
        await page.goto(`${origin}/blog/how-to-tell-whats-true/index.html`, { waitUntil: 'networkidle0' });
        assert.equal(await page.$$eval('.truth-diagram', els => els.filter(el => el.getBoundingClientRect().height > 0).length), 3);
        assert.match(await page.$eval('#consistency', el => el.innerText), /what evidence would resolve it/);
        assert.deepEqual(errors, [], `Browser errors: ${errors.join(', ')}`);
        console.log('Truth blog passed: responsive layout, single document scroll, sticky TOC navigation and active section, SPA cleanup and return, reduced motion, and no-JS reading.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
run().catch(error => { console.error(error); process.exitCode = 1; });

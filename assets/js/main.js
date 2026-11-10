(function () {
    'use strict';

    // ── Year ──
    var yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    var body = document.body;
    var sidebar = document.getElementById('sidebar');
    var toggleBtn = document.getElementById('sidebar-toggle');
    var contentEl = document.querySelector('.content');
    var topbar = document.querySelector('.topbar');
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function reducedMotion() { return motionQuery.matches; }

    // Code-like characters: the same family as the source field.
    var GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*#%&$';

    function randomGlyph() {
        return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
    }

    function assetIdentity(src, pageUrl) {
        var url = new URL(src, pageUrl);
        return url.origin + url.pathname;
    }

    document.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach(function (resource) {
        resource.setAttribute('data-spa-identity', assetIdentity(
            resource.getAttribute(resource.tagName === 'SCRIPT' ? 'src' : 'href'),
            window.location.href
        ));
    });
    document.querySelectorAll('link[rel~="icon"][href]').forEach(function (icon) {
        icon.href = new URL(icon.getAttribute('href'), window.location.href).href;
    });

    function isArticlePage(className) {
        return /(^|\s)(blog-article|finance-page)(\s|$)/.test(className || '');
    }

    // ────────────────────────────────────────────────────────────
    // Source field — the matrix motif, made of this page's own words.
    // A dense, dim grid of mono characters written out from the page's
    // title and copy (a printout of its source). A few slow signal
    // streams light those real characters as they pass down a column;
    // only each stream's head flickers. Near the pointer the field
    // brightens into readable text. One persistent canvas, time-based,
    // capped DPR, paused offscreen / in hidden tabs / by the user.
    // ────────────────────────────────────────────────────────────
    var Field = (function () {
        var canvas = document.createElement('canvas');
        canvas.className = 'signal-field';
        canvas.setAttribute('aria-hidden', 'true');
        body.insertBefore(canvas, body.firstChild);
        var ctx = canvas.getContext('2d');
        var noop = { seed: function () {}, surge: function () {}, toggle: function () { return false; } };
        if (!ctx) return noop;

        var base = document.createElement('canvas');
        var bctx = base.getContext('2d');
        var FONT_PX = 12, ROW = 17;
        var FONT = '400 ' + FONT_PX + 'px "Geist Mono", "Cascadia Code", Consolas, monospace';
        var cellW = 7.2;
        var cols = 0, rows = 0, width = 0, height = 0, dpr = 1;
        var grid = [];
        var streams = [];
        var rafId = 0, lastTime = 0;
        var speedMul = 1, speedTarget = 1;
        var paused = false;
        var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        var lens = { x: -9999, y: -9999, tx: -9999, ty: -9999, a: 0, ta: 0 };
        var corpus = 'brian fong  ';

        function readCorpus() {
            var root = contentEl || body;
            var parts = [];
            root.querySelectorAll('h1, .hero-copy, .hero-role, h2, h3, p, li strong, .item-desc').forEach(function (el, i) {
                if (i < 60) parts.push(el.textContent);
            });
            var text = parts.join('  /  ').replace(/\s+/g, ' ').trim().toLowerCase();
            return text.length > 40 ? text + '  /  ' : 'brian fong  /  projects  /  learnings  /  blog  /  ';
        }

        function measure() {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            width = document.documentElement.clientWidth;
            height = Math.round(Math.min(760, Math.max(460, window.innerHeight * 0.85)));
            canvas.width = base.width = Math.round(width * dpr);
            canvas.height = base.height = Math.round(height * dpr);
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = bctx.font = FONT;
            ctx.textBaseline = bctx.textBaseline = 'top';
            cellW = Math.max(6, ctx.measureText('m').width + 0.6);
            cols = Math.ceil(width / cellW);
            rows = Math.ceil(height / ROW);
        }

        function buildGrid() {
            grid = new Array(cols * rows);
            var offset = Math.floor(Math.random() * corpus.length);
            for (var i = 0; i < grid.length; i++) grid[i] = corpus.charAt((offset + i) % corpus.length);
            bctx.clearRect(0, 0, width, height);
            bctx.fillStyle = 'rgba(92, 240, 143, 0.06)';
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    var ch = grid[r * cols + c];
                    if (ch !== ' ') bctx.fillText(ch, c * cellW, r * ROW);
                }
            }
        }

        function makeStream(initial) {
            return {
                col: Math.floor(Math.random() * cols),
                y: initial ? Math.random() * rows : -Math.random() * 10,
                speed: 3 + Math.random() * 5,             // rows per second: slow
                len: 8 + Math.floor(Math.random() * 14),
                glyph: randomGlyph(),
                swap: 0
            };
        }

        function seedStreams() {
            var n = Math.max(4, Math.round(cols / (finePointer ? 16 : 22)));
            streams = [];
            for (var i = 0; i < n; i++) streams.push(makeStream(true));
        }

        function charAt(c, r) { return grid[r * cols + c] || ' '; }

        function draw(dt) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(base, 0, 0, width, height);

            for (var s = 0; s < streams.length; s++) {
                var st = streams[s];
                st.y += st.speed * speedMul * dt;
                st.swap -= dt;
                if (st.swap <= 0) { st.glyph = randomGlyph(); st.swap = 0.07 + Math.random() * 0.08; }
                var head = Math.floor(st.y);
                var x = st.col * cellW;
                for (var i = 0; i < st.len; i++) {
                    var r = head - i;
                    if (r < 0 || r >= rows) continue;
                    if (i === 0) {
                        ctx.fillStyle = 'rgba(200, 255, 220, 0.9)';
                        ctx.fillText(st.glyph, x, r * ROW);
                    } else {
                        var ch = charAt(st.col, r);
                        if (ch === ' ') continue;
                        ctx.fillStyle = 'rgba(92, 240, 143, ' + (0.5 * (1 - i / st.len)).toFixed(3) + ')';
                        ctx.fillText(ch, x, r * ROW);
                    }
                }
                if (head - st.len > rows) streams[s] = makeStream(false);
            }

            lens.x += (lens.tx - lens.x) * Math.min(1, dt * 10);
            lens.y += (lens.ty - lens.y) * Math.min(1, dt * 10);
            lens.a += (lens.ta - lens.a) * Math.min(1, dt * 6);
            if (lens.a > 0.01) {
                var R = 130;
                var c0 = Math.max(0, Math.floor((lens.x - R) / cellW)), c1 = Math.min(cols - 1, Math.ceil((lens.x + R) / cellW));
                var r0 = Math.max(0, Math.floor((lens.y - R) / ROW)), r1 = Math.min(rows - 1, Math.ceil((lens.y + R) / ROW));
                for (var rr = r0; rr <= r1; rr++) {
                    for (var cc = c0; cc <= c1; cc++) {
                        var ch2 = charAt(cc, rr);
                        if (ch2 === ' ') continue;
                        var dx = cc * cellW + cellW / 2 - lens.x, dy = rr * ROW + ROW / 2 - lens.y;
                        var d = Math.sqrt(dx * dx + dy * dy) / R;
                        if (d >= 1) continue;
                        var k = (1 - d) * (1 - d) * 0.42 * lens.a;
                        ctx.fillStyle = 'rgba(227, 234, 229, ' + k.toFixed(3) + ')';
                        ctx.fillText(ch2, cc * cellW, rr * ROW);
                    }
                }
            }
        }

        function still() {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(base, 0, 0, width, height);
        }

        function visible() {
            return !document.hidden && window.scrollY < height;
        }

        function frame(now) {
            rafId = 0;
            if (!visible() || paused) return;
            var dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
            lastTime = now;
            speedMul += (speedTarget - speedMul) * Math.min(1, dt * 4);
            draw(dt);
            rafId = requestAnimationFrame(frame);
        }

        function start() {
            if (reducedMotion() || paused) {
                cancelAnimationFrame(rafId);
                rafId = 0;
                if (reducedMotion()) still();
                return;
            }
            if (rafId || !visible()) return;
            lastTime = 0;
            rafId = requestAnimationFrame(frame);
        }

        function rebuild() {
            measure();
            buildGrid();
            seedStreams();
            still();
            start();
        }

        function seed() {
            corpus = readCorpus();
            rebuild();
        }

        function surge(on) {
            speedTarget = on && !reducedMotion() ? 3.5 : 1;
            start();
        }

        function toggle() {
            paused = !paused;
            start();
            return paused;
        }

        if (finePointer) {
            window.addEventListener('pointermove', function (e) {
                lens.tx = e.pageX;
                lens.ty = e.pageY;
                if (lens.x < -999) { lens.x = lens.tx; lens.y = lens.ty; }
                lens.ta = e.pageY < height ? 1 : 0;
                start();
            }, { passive: true });
            document.documentElement.addEventListener('pointerleave', function () { lens.ta = 0; });
        }

        var resizeTimer = 0;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(rebuild, 150);
        });
        window.addEventListener('scroll', start, { passive: true });
        document.addEventListener('visibilitychange', start);
        if (motionQuery.addEventListener) motionQuery.addEventListener('change', start);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);

        return { seed: seed, surge: surge, toggle: toggle };
    })();

    // ────────────────────────────────────────────────────────────
    // Text decode — headings resolve out of the same glyphs that
    // fall in the rain. Only headings in the viewport, rAF + time
    // based, always restores the original text.
    // ────────────────────────────────────────────────────────────
    // The real text is never modified: the scramble is painted on an
    // aria-hidden layer over the heading while the heading's own glyphs are
    // transparent. Screen readers and page scripts always see real words.
    var DECODE_SELECTOR = 'h1, h2, h3, .eyebrow, .hero-role, .item-meta > *';
    var activeDecodes = [];

    function collectDecodeTargets(root) {
        var targets = [];
        if (!root) return targets;
        var viewH = window.innerHeight;
        var nodes = root.querySelectorAll(DECODE_SELECTOR);
        for (var i = 0; i < nodes.length && targets.length < 18; i++) {
            var el = nodes[i];
            if (el.querySelector('.decode-layer')) continue;
            var rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > viewH || rect.width === 0) continue;
            var text = el.textContent.replace(/\s+/g, ' ').trim();
            if (!text || text.length > 160) continue;
            targets.push({ el: el, text: text, layer: null });
        }
        return targets;
    }

    function restoreDecode(targets) {
        targets.forEach(function (t) {
            if (t.layer && t.layer.parentNode) t.layer.parentNode.removeChild(t.layer);
            t.layer = null;
            t.el.classList.remove('is-decoding');
        });
    }

    function cancelDecodes() {
        activeDecodes.forEach(function (job) { job.cancel(); });
        activeDecodes = [];
    }

    // Layers are positioned for the current layout; a resize invalidates them.
    window.addEventListener('resize', cancelDecodes);

    var COPY_PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontStretch', 'lineHeight',
        'letterSpacing', 'wordSpacing', 'textTransform', 'textAlign', 'fontFeatureSettings', 'color'];

    // All layers live in one clipped root so they can never widen the page.
    var decodeRoot = document.createElement('div');
    decodeRoot.className = 'decode-root';
    decodeRoot.setAttribute('aria-hidden', 'true');
    body.appendChild(decodeRoot);

    function mountLayer(t, direction) {
        var el = t.el;
        var cs = getComputedStyle(el);
        var rect = el.getBoundingClientRect();
        var padL = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
        var padT = parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
        var padR = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
        var layer = document.createElement('span');
        layer.className = 'decode-layer';
        layer.setAttribute('aria-hidden', 'true');
        COPY_PROPS.forEach(function (prop) { layer.style[prop] = cs[prop]; });
        layer.style.left = (rect.left + window.scrollX + padL) + 'px';
        layer.style.top = (rect.top + window.scrollY + padT) + 'px';
        layer.style.width = Math.max(0, rect.width - padL - padR) + 'px';
        el.classList.add('is-decoding');
        decodeRoot.appendChild(layer);
        t.layer = layer;
        if (layer.animate && direction === 'out') {
            layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
        }
    }

    // direction 'in': glyphs → text, sweeping left to right with jitter.
    // direction 'out': text → glyphs (layer stays until the page swaps).
    function decode(targets, direction, duration, stagger) {
        if (!targets.length || reducedMotion()) return Promise.resolve();
        var job = { done: false };
        var plan = targets.map(function (t, ti) {
            var len = t.text.length;
            var chars = [];
            for (var i = 0; i < len; i++) {
                var ch = t.text.charAt(i);
                var pos = len > 1 ? i / (len - 1) : 0;
                chars.push({
                    ch: ch,
                    skip: /\s|[.,:;'"’“”()\-–—/&!?]/.test(ch),
                    at: ti * stagger + (pos * 0.65 + Math.random() * 0.35) * duration,
                    glyph: randomGlyph(),
                    next: 0
                });
            }
            mountLayer(t, direction);
            return { target: t, chars: chars, last: '' };
        });

        var total = duration + stagger * (targets.length - 1);
        var startTime = 0;

        function render(t) {
            for (var p = 0; p < plan.length; p++) {
                var item = plan[p];
                if (!item.target.layer) continue;
                var out = '';
                for (var c = 0; c < item.chars.length; c++) {
                    var cell = item.chars[c];
                    if (cell.skip) { out += cell.ch; continue; }
                    var resolved = direction === 'in' ? t >= cell.at : t < cell.at;
                    if (resolved) { out += cell.ch; continue; }
                    if (t >= cell.next) {          // swap glyphs at ~16Hz, not every frame
                        cell.glyph = randomGlyph();
                        cell.next = t + 55 + Math.random() * 40;
                    }
                    out += cell.glyph;
                }
                if (out !== item.last) { item.target.layer.textContent = out; item.last = out; }
            }
        }

        return new Promise(function (resolve) {
            function finish() {
                if (job.done) return;
                job.done = true;
                if (direction === 'in') restoreDecode(targets);
                resolve();
            }
            job.cancel = function () {
                restoreDecode(targets);
                job.done = true;
                resolve();
            };
            activeDecodes.push(job);

            function tick(now) {
                if (job.done) return;
                if (!startTime) startTime = now;
                var t = now - startTime;
                render(t);
                if (t >= total) finish();
                else requestAnimationFrame(tick);
            }

            render(direction === 'in' ? -1 : 0);   // first frame painted synchronously: no flash
            requestAnimationFrame(tick);
            // If frames are throttled, still land on the real text on time.
            setTimeout(finish, total + 250);
        });
    }

    // ── Route progress line (lives in the top bar) ──
    var progressEl = null;
    var progressAnim = null;
    if (topbar) {
        progressEl = document.createElement('span');
        progressEl.className = 'route-progress';
        progressEl.setAttribute('aria-hidden', 'true');
        topbar.appendChild(progressEl);
    }

    function progressStart() {
        if (!progressEl || !progressEl.animate) return;
        if (progressAnim) progressAnim.cancel();
        progressAnim = progressEl.animate([
            { transform: 'scaleX(0)', opacity: 1 },
            { transform: 'scaleX(0.35)', opacity: 1, offset: 0.2 },
            { transform: 'scaleX(0.85)', opacity: 1 }
        ], { duration: 2400, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    }

    function progressDone() {
        if (!progressEl || !progressEl.animate) return;
        var from = progressEl.getAnimations ? getComputedStyle(progressEl).transform : 'scaleX(0.85)';
        if (progressAnim) progressAnim.cancel();
        progressAnim = progressEl.animate([
            { transform: from === 'none' ? 'scaleX(0.85)' : from, opacity: 1 },
            { transform: 'scaleX(1)', opacity: 1, offset: 0.5 },
            { transform: 'scaleX(1)', opacity: 0 }
        ], { duration: 420, easing: 'ease-out', fill: 'forwards' });
    }

    // ────────────────────────────────────────────────────────────
    // SPA-style page transition
    // exit: headings scramble out + content fades up (≈200ms)
    // swap: fetch, inject assets, scroll to top
    // enter: content settles + headings decode in (≈450ms)
    // ────────────────────────────────────────────────────────────
    var navToken = 0;
    var contentAnim = null;

    // Animation is decoration: never let navigation wait on painted frames
    // (background tabs and busy main threads throttle rAF and WAAPI).
    function settleWithin(promise, ms) {
        return Promise.race([promise, new Promise(function (resolve) { setTimeout(resolve, ms); })]);
    }

    function animateContent(keyframes, options) {
        if (!contentEl || !contentEl.animate || reducedMotion()) return Promise.resolve();
        if (contentAnim) contentAnim.cancel();
        contentAnim = contentEl.animate(keyframes, options);
        var anim = contentAnim;
        return anim.finished.catch(function () {}).then(function () { return anim; });
    }

    function clearContentAnim() {
        if (contentAnim) { contentAnim.cancel(); contentAnim = null; }
    }

    function syncBlogHomeLink(className) {
        if (!topbar) return;
        var link = topbar.querySelector('.blog-home-link');
        var shouldShow = isArticlePage(className);
        if (shouldShow && !link) {
            link = document.createElement('a');
            link.className = 'blog-home-link';
            link.href = '/blog.html';
            link.textContent = 'All blogs';
            topbar.insertBefore(link, toggleBtn);
            attachLinkHandlers(topbar);
        } else if (!shouldShow && link) {
            link.remove();
        }
        if (shouldShow && link) {
            var isRecipe = /(^|\s)aurora-page(\s|$)/.test(className || '');
            link.href = isRecipe ? '/blog.html#recipes' : '/blog.html';
            link.textContent = isRecipe ? 'More recipes' : 'All blogs';
        }
    }

    function syncPersistentNavigation(newDoc, baseUrl) {
        ['.topbar .home-link', '.sidebar .nav-links a'].forEach(function (selector) {
            var currentLinks = Array.from(document.querySelectorAll(selector));
            var incomingLinks = Array.from(newDoc.querySelectorAll(selector));
            currentLinks.forEach(function (link, index) {
                var incoming = incomingLinks[index];
                if (!incoming) return;
                link.href = new URL(incoming.getAttribute('href'), baseUrl).href;
            });
        });
    }

    function scrollToTarget(href) {
        var hash = '';
        try { hash = new URL(href, window.location.href).hash; } catch (e) {}
        var target = null;
        if (hash.length > 1) {
            try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) {}
        }
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }

    function loadScripts(srcs, i) {
        if (i >= srcs.length) return Promise.resolve();
        return new Promise(function (resolve) {
            var script = document.createElement('script');
            script.src = srcs[i];
            script.setAttribute('data-spa-injected', 'true');
            script.setAttribute('data-spa-identity', assetIdentity(srcs[i], window.location.href));
            script.onload = resolve;
            script.onerror = resolve;
            document.body.appendChild(script);
        }).then(function () { return loadScripts(srcs, i + 1); });
    }

    function doPageTransition(href, skipPushState) {
        var token = ++navToken;
        cancelDecodes();
        window.__spaTransition = true;
        body.classList.add('is-routing');
        if (contentEl) contentEl.setAttribute('aria-busy', 'true');
        Field.surge(true);
        progressStart();

        var fetchPromise = fetch(href).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        });

        var exitTargets = collectDecodeTargets(contentEl);
        var exitPromise = settleWithin(Promise.all([
            decode(exitTargets, 'out', 180, 0),
            animateContent([
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-6px)' }
            ], { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' })
        ]), 320);

        Promise.all([exitPromise, fetchPromise]).then(function (results) {
            if (token !== navToken) return;
            restoreDecode(exitTargets);
            var html = results[1];
            var newDoc = new DOMParser().parseFromString(html, 'text/html');
            var baseUrl = new URL(href, window.location.href);

            document.querySelectorAll('[data-spa-injected]').forEach(function (el) {
                el.parentNode.removeChild(el);
            });

            var currentSheets = new Set(
                Array.from(document.querySelectorAll('link[rel="stylesheet"]:not([data-spa-injected])'))
                    .map(function (l) { return l.getAttribute('data-spa-identity'); })
            );
            var sheetLoads = [];
            newDoc.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
                var resolvedHref = new URL(l.getAttribute('href'), baseUrl).href;
                var identity = assetIdentity(resolvedHref, baseUrl);
                if (currentSheets.has(identity)) return;
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = resolvedHref;
                link.setAttribute('data-spa-injected', 'true');
                link.setAttribute('data-spa-identity', identity);
                sheetLoads.push(new Promise(function (resolve) {
                    link.onload = resolve;
                    link.onerror = resolve;
                    setTimeout(resolve, 1500);
                }));
                document.head.appendChild(link);
            });

            newDoc.querySelectorAll('head style').forEach(function (s) {
                var style = document.createElement('style');
                style.textContent = s.textContent;
                style.setAttribute('data-spa-injected', 'true');
                document.head.appendChild(style);
            });

            var currentScripts = new Set(
                Array.from(document.querySelectorAll('script[src]:not([data-spa-injected])'))
                    .map(function (s) { return s.getAttribute('data-spa-identity'); })
            );
            var scriptsToLoad = [];
            newDoc.querySelectorAll('script[src]').forEach(function (s) {
                var resolvedSrc = new URL(s.getAttribute('src'), baseUrl).href;
                if (!currentScripts.has(assetIdentity(resolvedSrc, baseUrl))) scriptsToLoad.push(resolvedSrc);
            });

            var newBody = newDoc.querySelector('body');
            var inlineScripts = [];
            if (newBody) {
                newBody.querySelectorAll('script:not([src])').forEach(function (s) {
                    inlineScripts.push(s.textContent);
                });
            }

            // Wait for new stylesheets so the page never paints unstyled.
            return Promise.all(sheetLoads).then(function () {
                if (token !== navToken) return;
                var newContent = newDoc.querySelector('.content');
                var newTitle = newDoc.querySelector('title');
                if (newContent) contentEl.innerHTML = newContent.innerHTML;
                syncPersistentNavigation(newDoc, baseUrl);
                if (newBody) {
                    body.className = newBody.className + ' is-routing';
                    syncBlogHomeLink(newBody.className);
                }
                if (newTitle) document.title = newTitle.textContent;
                Field.seed();
                if (!skipPushState) history.pushState(null, '', href);
                loadedPath = window.location.pathname;
                scrollToTarget(href);
                reinitPage();

                return loadScripts(scriptsToLoad, 0).then(function () {
                    inlineScripts.forEach(function (code) {
                        var script = document.createElement('script');
                        script.textContent = code;
                        script.setAttribute('data-spa-injected', 'true');
                        document.body.appendChild(script);
                    });
                });
            }).then(function () {
                if (token !== navToken) return;
                body.classList.remove('is-routing');
                Field.surge(false);
                progressDone();
                var enterTargets = collectDecodeTargets(contentEl);
                var enter = animateContent([
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
                return settleWithin(Promise.all([enter, decode(enterTargets, 'in', 460, 45)]), 1100);
            });
        }).then(function () {
            if (token !== navToken) return;
            cancelDecodes();
            clearContentAnim();
            if (contentEl) contentEl.removeAttribute('aria-busy');
            window.__spaTransition = false;
        }).catch(function () {
            if (token !== navToken) return;
            window.location.href = href;
        });
    }

    // ── Re-initialize page features after SPA swap ──
    function markCurrentNav() {
        var currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.classList.remove('is-current');
            try {
                var u = new URL(link.getAttribute('href'), window.location.href);
                if (u.pathname === currentPath) link.classList.add('is-current');
            } catch (e) {}
        });
    }

    function bindSearch() {
        var tocSearch = document.getElementById('contents-search');
        if (!tocSearch || tocSearch._searchBound) return;
        tocSearch._searchBound = true;
        tocSearch.addEventListener('input', function () {
            var q = tocSearch.value.toLowerCase();
            document.querySelectorAll('#toc-list li').forEach(function (li) {
                li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }

    function populateAll() {
        if (typeof siteData === 'undefined') return;
        populateList('projects-list', siteData.projects || []);
        populateList('learnings-list', siteData.learnings || []);
        initBlogTopicFilter();
        populateLearningsToc();
        var all = [].concat(siteData.projects || [], siteData.learnings || []);
        populateList('toc-list', all);
    }

    function reinitPage() {
        var yr = document.getElementById('year');
        if (yr) yr.textContent = new Date().getFullYear();
        populateAll();
        if (typeof window.initFinanceArticle === 'function') window.initFinanceArticle();
        if (typeof window.initTrumpDisclosure === 'function') window.initTrumpDisclosure();
        if (typeof window.initLindaProblem === 'function') window.initLindaProblem();
        if (typeof window.initOptionsVolatility === 'function') window.initOptionsVolatility();
        if (typeof window.initPasskeyArticle === 'function') window.initPasskeyArticle();
        if (typeof window.initSiteMap === 'function') window.initSiteMap();
        if (typeof window.initAboutGraph === 'function') window.initAboutGraph();
        if (typeof window.initNumesthesia === 'function') window.initNumesthesia();
        Palette.bindTriggers(contentEl);
        markCurrentNav();
        attachLinkHandlers(contentEl);
        bindSearch();
    }

    var loadedPath = window.location.pathname;

    window.addEventListener('popstate', function () {
        // Hash-only history entries (topic filters, in-page anchors) stay on this page.
        if (window.location.pathname === loadedPath) {
            populateAll();
            return;
        }
        doPageTransition(window.location.href, true);
    });

    // ── Menu scrim ──
    var scrim = document.createElement('button');
    scrim.type = 'button';
    scrim.className = 'menu-scrim';
    scrim.hidden = true;
    scrim.setAttribute('aria-label', 'Close navigation');
    body.appendChild(scrim);

    // ── Sidebar ──
    function openSidebar() {
        if (!sidebar || !toggleBtn) return;
        body.classList.add('sidebar-open');
        sidebar.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-label', 'Close navigation');
        scrim.hidden = false;
        requestAnimationFrame(function () { scrim.classList.add('visible'); });
    }

    function closeSidebar() {
        if (!sidebar || !toggleBtn) return;
        body.classList.remove('sidebar-open');
        sidebar.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open navigation');
        scrim.classList.remove('visible');
        setTimeout(function () {
            if (!body.classList.contains('sidebar-open')) scrim.hidden = true;
        }, 220);
    }

    if (sidebar && toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open navigation');
        toggleBtn.addEventListener('click', function () {
            body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
        });
    }
    scrim.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
            closeSidebar();
            if (toggleBtn) toggleBtn.focus();
        }
    });

    // ── Populate lists ──
    function populateList(id, items) {
        var ul = document.getElementById(id);
        if (!ul || !items) return;
        ul.innerHTML = '';
        ul.classList.add('list-buttons');
        if (!items.length) {
            var msg = ul.dataset.emptyMessage;
            if (msg) {
                var li = document.createElement('li');
                li.className = 'empty-state-item';
                var state = document.createElement('div');
                state.className = 'empty-state';
                state.textContent = msg;
                li.appendChild(state);
                ul.appendChild(li);
            }
            return;
        }
        items.forEach(function (item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            var title = document.createElement('strong');
            a.href = item.url;
            title.textContent = item.title;
            a.appendChild(title);
            if (item.category || item.date) {
                var meta = document.createElement('span');
                meta.className = 'item-meta';
                if (item.category) {
                    var category = document.createElement('span');
                    category.textContent = item.category;
                    meta.appendChild(category);
                }
                if (item.date) {
                    var date = document.createElement('time');
                    date.dateTime = item.date;
                    date.textContent = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    meta.appendChild(date);
                }
                a.appendChild(meta);
            } else if (item.section) {
                var section = document.createElement('span');
                section.className = 'item-meta';
                section.textContent = item.section;
                a.appendChild(section);
            }
            if (item.description) {
                var desc = document.createElement('p');
                desc.className = 'item-desc';
                desc.textContent = item.description;
                a.appendChild(desc);
            }
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    function initBlogTopicFilter() {
        var selector = document.getElementById('blog-topic-select');
        var blogs = siteData.blogs || [];
        if (!selector) {
            populateList('blogs-list', blogs);
            return;
        }

        var hashTopic = decodeURIComponent(window.location.hash.slice(1)).replace(/-/g, ' ').toLowerCase();
        var matchingOption = Array.from(selector.options).find(function (option) {
            return option.value.toLowerCase() === hashTopic;
        });
        selector.value = matchingOption ? matchingOption.value : 'all';

        function applyTopic() {
            var topic = selector.value;
            var selectedOption = selector.options[selector.selectedIndex];
            var filtered = topic === 'all' ? blogs : blogs.filter(function (item) {
                return item.category === topic;
            });
            var list = document.getElementById('blogs-list');
            var heading = document.getElementById('posts-heading');
            var summary = document.getElementById('topic-summary');

            if (list) {
                list.dataset.emptyMessage = topic === 'all'
                    ? 'No posts yet — check back soon.'
                    : 'No ' + topic.toLowerCase() + ' posts yet — check back soon.';
            }
            if (heading) heading.textContent = topic === 'all' ? 'Latest posts' : (topic === 'Recipes' ? 'Latest recipes' : 'Latest ' + topic + ' posts');
            if (summary) summary.textContent = selectedOption.dataset.description || '';
            populateList('blogs-list', filtered);
            if (list) attachLinkHandlers(list);
        }

        if (!selector._topicHandled) {
            selector._topicHandled = true;
            selector.addEventListener('change', function () {
                var slug = selector.value === 'all' ? '' : '#' + selector.value.toLowerCase().replace(/\s+/g, '-');
                window.history.replaceState(null, '', window.location.pathname + window.location.search + slug);
                applyTopic();
            });
        }
        applyTopic();
    }

    function populateLearningsToc() {
        var container = document.getElementById('toc-cs');
        if (!container || typeof siteData === 'undefined') return;
        container.innerHTML = '';
        var items = (siteData.learnings || []).filter(function (item) {
            return item.category === 'Computer Science';
        });
        items.forEach(function (item) {
            var file = document.createElement('a');
            file.href = item.url;
            file.className = 'toc-file';
            file.innerHTML =
                '<svg class="toc-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>' +
                '<span class="toc-file-name"></span>' +
                '<span class="toc-file-desc"></span>';
            file.querySelector('.toc-file-name').textContent = item.title;
            file.querySelector('.toc-file-desc').textContent = item.description || '';
            container.appendChild(file);
        });
    }

    // ── Link handling ──
    function ensureBlogNavigation() {
        if (!sidebar || sidebar.querySelector('a[href$="blog.html"]')) return;
        var list = sidebar.querySelector('.nav-links');
        if (!list) return;
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = '/blog.html';
        link.textContent = 'Blog';
        item.appendChild(link);
        list.appendChild(item);
    }

    function shouldAnimate(link, url) {
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;
        if (link.hasAttribute('data-no-spa')) return false;
        if (url.origin !== window.location.origin) return false;
        if (!/(\.html|\/)$/.test(url.pathname)) return false; // only HTML pages
        return true;
    }

    function attachLinkHandlers(root) {
        (root || document).querySelectorAll('a[href]').forEach(function (link) {
            if (link._glyphHandled) return;
            link._glyphHandled = true;

            var url;
            try { url = new URL(link.href, window.location.href); } catch (e) { return; }
            if (!shouldAnimate(link, url)) return;

            link.addEventListener('click', function (event) {
                if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                var currentUrl;
                try { currentUrl = new URL(link.href, window.location.href); } catch (e) { return; }
                if (!shouldAnimate(link, currentUrl)) return;
                // Same page, different hash: let the browser scroll.
                if (currentUrl.pathname === window.location.pathname && currentUrl.hash && currentUrl.search === window.location.search) return;
                event.preventDefault();
                closeSidebar();
                doPageTransition(currentUrl.href);
            });
        });
    }

    // ────────────────────────────────────────────────────────────
    // Command palette — jump anywhere. Ctrl/⌘+K or "/" opens it; the
    // search button in the top bar opens it on touch. Opening is instant
    // (keyboard-initiated, so no animation). Subsequence matching with
    // the matched characters highlighted; arrows + Enter navigate.
    // ────────────────────────────────────────────────────────────
    var Palette = (function () {
        var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
        var el = document.createElement('div');
        el.className = 'palette';
        el.hidden = true;
        el.innerHTML =
            '<div class="palette-scrim" data-close></div>' +
            '<div class="palette-panel" role="dialog" aria-modal="true" aria-label="Jump to a page">' +
            '<div class="palette-input-row"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>' +
            '<input class="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" placeholder="Jump to a page, post, or tutorial" autocomplete="off" spellcheck="false">' +
            '<kbd>Esc</kbd></div>' +
            '<ul class="palette-list" id="palette-list" role="listbox"></ul>' +
            '<p class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span></p>' +
            '</div>';
        body.appendChild(el);
        var input = el.querySelector('.palette-input');
        var list = el.querySelector('.palette-list');
        var items = [], shown = [], index = 0, returnFocus = null;

        function collect() {
            var base = [
                { title: 'Home', kind: 'Page', url: '/index.html' },
                { title: 'About', kind: 'Page', url: '/about.html', hint: 'career graph' },
                { title: 'Projects', kind: 'Page', url: '/projects.html' },
                { title: 'Learnings', kind: 'Page', url: '/learnings.html' },
                { title: 'Blog', kind: 'Page', url: '/blog.html' },
                { title: 'Music', kind: 'Page', url: '/music.html' }
            ];
            if (typeof siteData !== 'undefined') {
                var topics = {};
                (siteData.blogs || []).forEach(function (b) {
                    base.push({ title: b.title, kind: b.category || 'Post', url: '/' + b.url, hint: b.description });
                    if (b.category) topics[b.category] = true;
                });
                Object.keys(topics).forEach(function (t) {
                    base.push({ title: t, kind: 'Topic', url: '/blog.html#' + t.toLowerCase().replace(/\s+/g, '-') });
                });
                (siteData.learnings || []).forEach(function (l) { base.push({ title: l.title, kind: 'Learning', url: '/' + l.url, hint: l.description }); });
                (siteData.projects || []).forEach(function (p) { base.push({ title: p.title, kind: 'Project', url: '/' + p.url, hint: p.description }); });
            }
            return base;
        }

        // Subsequence match on the title (scored), falling back to the description.
        function score(item, q) {
            if (!q) return { s: 0, marks: [] };
            var t = item.title.toLowerCase(), marks = [], ti = 0, s = 0, run = 0;
            for (var qi = 0; qi < q.length; qi++) {
                var ch = q.charAt(qi);
                if (ch === ' ') continue;
                var found = t.indexOf(ch, ti);
                if (found === -1) {
                    var hay = (item.kind + ' ' + (item.hint || '')).toLowerCase();
                    return hay.indexOf(q) !== -1 ? { s: 500, marks: [] } : null;
                }
                run = found === ti ? run + 1 : 0;
                s += (found - ti) - run * 2 + (found === 0 || t.charAt(found - 1) === ' ' ? -6 : 0);
                marks.push(found);
                ti = found + 1;
            }
            return { s: s, marks: marks };
        }

        function render() {
            var q = input.value.trim().toLowerCase();
            shown = [];
            items.forEach(function (it, i) {
                var r = score(it, q);
                if (r) shown.push({ it: it, s: r.s, marks: r.marks, i: i });
            });
            if (q) shown.sort(function (a, b) { return a.s - b.s || a.i - b.i; });
            shown = shown.slice(0, 12);
            index = Math.min(index, Math.max(0, shown.length - 1));
            list.innerHTML = '';
            if (!shown.length) {
                var empty = document.createElement('li');
                empty.className = 'palette-empty';
                empty.textContent = 'Nothing matches “' + input.value.trim() + '”. Try a topic like finance or a word from a title.';
                list.appendChild(empty);
                input.removeAttribute('aria-activedescendant');
                return;
            }
            shown.forEach(function (r, i) {
                var li = document.createElement('li');
                li.id = 'palette-opt-' + i;
                li.setAttribute('role', 'option');
                li.setAttribute('aria-selected', String(i === index));
                var title = document.createElement('span');
                title.className = 'palette-title';
                var marks = new Set(r.marks);
                for (var c = 0; c < r.it.title.length; c++) {
                    if (marks.has(c)) {
                        var m = document.createElement('mark');
                        m.textContent = r.it.title.charAt(c);
                        title.appendChild(m);
                    } else {
                        title.appendChild(document.createTextNode(r.it.title.charAt(c)));
                    }
                }
                var kind = document.createElement('span');
                kind.className = 'palette-kind';
                kind.textContent = r.it.kind;
                li.appendChild(title);
                li.appendChild(kind);
                li.addEventListener('pointermove', function () { if (index !== i) { index = i; highlight(); } });
                li.addEventListener('click', function () { go(i); });
                list.appendChild(li);
            });
            highlight();
        }

        function highlight() {
            Array.prototype.forEach.call(list.children, function (li, i) {
                li.setAttribute('aria-selected', String(i === index));
            });
            var cur = list.children[index];
            if (cur && cur.id) {
                input.setAttribute('aria-activedescendant', cur.id);
                cur.scrollIntoView({ block: 'nearest' });
            }
        }

        function go(i) {
            var r = shown[i];
            if (!r) return;
            close(false);
            var url = new URL(r.it.url, window.location.origin).href;
            if (new URL(url).pathname === window.location.pathname) {
                window.location.hash = new URL(url).hash;
                populateAll();
                return;
            }
            doPageTransition(url);
        }

        function open() {
            if (!el.hidden) return;
            returnFocus = document.activeElement;
            items = collect();
            input.value = '';
            index = 0;
            el.hidden = false;
            body.classList.add('palette-open');
            render();
            input.focus();
        }

        function close(restore) {
            if (el.hidden) return;
            el.hidden = true;
            body.classList.remove('palette-open');
            if (restore !== false && returnFocus && returnFocus.focus) returnFocus.focus();
        }

        input.addEventListener('input', function () { index = 0; render(); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); index = (index + 1) % Math.max(1, shown.length); highlight(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); index = (index - 1 + shown.length) % Math.max(1, shown.length); highlight(); }
            else if (e.key === 'Enter') { e.preventDefault(); go(index); }
            else if (e.key === 'Escape') { e.preventDefault(); close(); }
            else if (e.key === 'Tab') { e.preventDefault(); }
        });
        el.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });

        document.addEventListener('keydown', function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName) || (document.activeElement && document.activeElement.isContentEditable);
            if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                el.hidden ? open() : close();
            } else if (e.key === '/' && !typing && el.hidden) {
                e.preventDefault();
                open();
            }
        });

        // Top-bar trigger (the way in on touch screens).
        if (topbar && toggleBtn) {
            var trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'palette-trigger';
            trigger.setAttribute('aria-label', 'Jump to a page');
            trigger.setAttribute('aria-keyshortcuts', isMac ? 'Meta+K' : 'Control+K');
            trigger.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg><span class="palette-trigger-label">Jump to</span><kbd>' + (isMac ? '⌘K' : 'Ctrl K') + '</kbd>';
            trigger.addEventListener('click', open);
            topbar.insertBefore(trigger, toggleBtn);
        }

        function bindTriggers(root) {
            (root || document).querySelectorAll('[data-open-palette]').forEach(function (b) {
                if (b._paletteBound) return;
                b._paletteBound = true;
                b.addEventListener('click', open);
                var k = b.querySelector('.kbd-hint');
                if (k) k.textContent = isMac ? '⌘K' : 'Ctrl K';
            });
        }

        return { open: open, close: close, bindTriggers: bindTriggers };
    })();

    // ── Boot ──
    window.spaNavigate = function (href) { closeSidebar(); doPageTransition(href); };
    window.__spaTransition = false;
    Palette.bindTriggers(document);
    ensureBlogNavigation();
    syncBlogHomeLink(body.className);
    Field.seed();
    markCurrentNav();
    attachLinkHandlers();
    populateAll();
    bindSearch();

    // First paint: the page's title resolves once, nothing else moves.
    var heroTargets = collectDecodeTargets(contentEl).filter(function (t) {
        return t.el.tagName === 'H1' || t.el.classList.contains('hero-role');
    });
    decode(heroTargets, 'in', 620, 90);
})();

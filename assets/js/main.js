(function () {
    'use strict';

    // ── Year ──
    var yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    var body = document.body;
    var sidebar = document.getElementById('sidebar');
    var toggleBtn = document.getElementById('sidebar-toggle');
    var contentEl = document.querySelector('.content');

    var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴΞΨΩΦΣΛΠΔ0123456789@#$%&*<>{}[];:';

    // ── Collect every visible text node under a root ──
    function collectTextNodes(root) {
        var items = [];
        var skip = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
        var walk = document.createTreeWalker(root || body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var p = node.parentElement;
                if (p && skip[p.tagName]) return NodeFilter.FILTER_REJECT;
                if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var n;
        while ((n = walk.nextNode())) items.push({ node: n, original: n.textContent });
        return items;
    }

    function randomGlyph() {
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    function isWhitespace(ch) {
        return ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t';
    }

    // ── Scramble OUT: real text → all glyphs ──
    function scrambleOut(items) {
        return new Promise(function (resolve) {
            var frame = 0, total = 14;
            var id = setInterval(function () {
                frame++;
                var p = frame / total;
                items.forEach(function (t) {
                    var s = '';
                    for (var i = 0; i < t.original.length; i++) {
                        s += isWhitespace(t.original[i]) ? t.original[i]
                            : (Math.random() < p) ? randomGlyph() : t.original[i];
                    }
                    t.node.textContent = s;
                });
                if (frame >= total) { clearInterval(id); resolve(); }
            }, 28);
        });
    }

    // ── Scramble IN: glyphs → real text (always restores originals) ──
    function scrambleIn(items) {
        // Start fully glyphed
        items.forEach(function (t) {
            var s = '';
            for (var i = 0; i < t.original.length; i++) {
                s += isWhitespace(t.original[i]) ? t.original[i] : randomGlyph();
            }
            t.node.textContent = s;
        });

        return new Promise(function (resolve) {
            var frame = 0, total = 16;
            var locked = items.map(function (t) { return new Array(t.original.length).fill(false); });

            var id = setInterval(function () {
                frame++;
                var p = frame / total;
                items.forEach(function (t, ti) {
                    var s = '';
                    for (var i = 0; i < t.original.length; i++) {
                        if (isWhitespace(t.original[i])) { s += t.original[i]; }
                        else if (locked[ti][i]) { s += t.original[i]; }
                        else if (Math.random() < p * p) { locked[ti][i] = true; s += t.original[i]; }
                        else { s += randomGlyph(); }
                    }
                    t.node.textContent = s;
                });

                if (frame >= total) {
                    clearInterval(id);
                    items.forEach(function (t) { t.node.textContent = t.original; });
                    resolve();
                }
            }, 32);
        });
    }

    // ── SPA-style page transition ──
    var isTransitioning = false;
    var currentScrambleId = 0;
    var lastOriginalItems = null;

    function cancelCurrentTransition() {
        // Bump the scramble ID so any in-progress animations stop
        currentScrambleId++;
        // Restore any garbled text from a previous scramble
        if (lastOriginalItems) {
            lastOriginalItems.forEach(function (t) {
                try { t.node.textContent = t.original; } catch (e) {}
            });
            lastOriginalItems = null;
        }
        isTransitioning = false;
    }

    function doPageTransition(href, skipPushState) {
        // Cancel any in-progress transition and restore text
        if (isTransitioning) {
            cancelCurrentTransition();
        }
        isTransitioning = true;
        var myId = ++currentScrambleId;

        var oldItems = collectTextNodes(contentEl);
        lastOriginalItems = oldItems;

        // Start fetching in parallel with scramble-out
        var fetchPromise = fetch(href).then(function (r) { return r.text(); });

        // Scramble out the current page
        scrambleOut(oldItems).then(function () {
            if (myId !== currentScrambleId) return; // cancelled
            return fetchPromise;
        }).then(function (html) {
            if (!html || myId !== currentScrambleId) return; // cancelled
            lastOriginalItems = null;

            var parser = new DOMParser();
            var newDoc = parser.parseFromString(html, 'text/html');
            var newBody = newDoc.querySelector('body');
            var hasInlineScripts = newBody && newBody.querySelectorAll('script:not([src])').length > 0;
            var hasPageStyles = newDoc.querySelector('head style') !== null;

            // If the target page has inline scripts or embedded styles,
            // do a real navigation so everything initializes cleanly
            if (hasInlineScripts || hasPageStyles) {
                window.location.href = href;
                return;
            }

            // Remove previously injected page-specific stylesheets and scripts
            document.querySelectorAll('[data-spa-injected]').forEach(function (el) {
                el.parentNode.removeChild(el);
            });

            // Resolve relative hrefs against the target page URL
            var baseUrl = new URL(href, window.location.href);

            // Inject page-specific stylesheets not present in current page
            var currentSheets = new Set(
                Array.from(document.querySelectorAll('link[rel="stylesheet"]:not([data-spa-injected])'))
                    .map(function (l) { return new URL(l.getAttribute('href'), window.location.href).href; })
            );
            newDoc.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
                var resolvedHref = new URL(l.getAttribute('href'), baseUrl).href;
                if (!currentSheets.has(resolvedHref)) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = resolvedHref;
                    link.setAttribute('data-spa-injected', 'true');
                    document.head.appendChild(link);
                }
            });

            // Collect page-specific scripts to load after content swap
            var currentScripts = new Set(
                Array.from(document.querySelectorAll('script[src]:not([data-spa-injected])'))
                    .map(function (s) { return new URL(s.getAttribute('src'), window.location.href).href; })
            );
            var scriptsToLoad = [];
            newDoc.querySelectorAll('script[src]').forEach(function (s) {
                var resolvedSrc = new URL(s.getAttribute('src'), baseUrl).href;
                if (!currentScripts.has(resolvedSrc)) {
                    scriptsToLoad.push(resolvedSrc);
                }
            });

            var newContent = newDoc.querySelector('.content');
            var newTitle = newDoc.querySelector('title');

            if (newContent) {
                contentEl.innerHTML = newContent.innerHTML;
            }
            if (newTitle) {
                document.title = newTitle.textContent;
            }

            if (!skipPushState) {
                history.pushState(null, '', href);
            }
            reinitPage();

            // Load page-specific scripts sequentially
            function loadScripts(srcs, i) {
                if (i >= srcs.length) return Promise.resolve();
                return new Promise(function (resolve) {
                    var script = document.createElement('script');
                    script.src = srcs[i];
                    script.setAttribute('data-spa-injected', 'true');
                    script.onload = resolve;
                    script.onerror = resolve;
                    document.body.appendChild(script);
                }).then(function () { return loadScripts(srcs, i + 1); });
            }

            return loadScripts(scriptsToLoad, 0).then(function () {
                if (myId !== currentScrambleId) return; // cancelled
                var newItems = collectTextNodes(contentEl);
                lastOriginalItems = newItems;
                return scrambleIn(newItems);
            });
        }).then(function () {
            if (myId === currentScrambleId) {
                isTransitioning = false;
                lastOriginalItems = null;
            }
        }).catch(function () {
            if (myId === currentScrambleId) {
                isTransitioning = false;
                lastOriginalItems = null;
            }
            window.location.href = href;
        });
    }

    // ── Re-initialize page features after SPA swap ──
    function reinitPage() {
        // Year
        var yr = document.getElementById('year');
        if (yr) yr.textContent = new Date().getFullYear();

        // Fade-in observer
        document.querySelectorAll('.section').forEach(function (s) {
            s.classList.add('fade-in');
            observer.observe(s);
        });

        // Populate lists if data script elements exist
        if (typeof siteData !== 'undefined') {
            populateList('projects-list', siteData.projects || []);
            populateList('recipes-list', siteData.recipes || []);
            var all = [].concat(siteData.projects || [], siteData.recipes || [],
                siteData.pages || [], siteData.music || [], siteData.blogs || []);
            populateList('toc-list', all);
        }

        // Re-highlight current nav
        var currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.classList.remove('is-current');
            try {
                var u = new URL(link.getAttribute('href'), window.location.href);
                if (u.pathname === currentPath) link.classList.add('is-current');
            } catch (e) {}
        });

        // Re-attach link handlers on new content
        attachLinkHandlers(contentEl);

        // Search
        var tocSearch = document.getElementById('contents-search');
        if (tocSearch) {
            tocSearch.addEventListener('input', function () {
                var q = tocSearch.value.toLowerCase();
                document.querySelectorAll('#toc-list li').forEach(function (li) {
                    li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }
    }

    // ── Handle back/forward ──
    window.addEventListener('popstate', function () {
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
    var sidebarBusy = false;

    function openSidebar() {
        if (!sidebar || !toggleBtn) return;
        body.classList.add('sidebar-open');
        sidebar.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        scrim.hidden = false;
        requestAnimationFrame(function () { scrim.classList.add('visible'); });

        if (!sidebarBusy) {
            sidebarBusy = true;
            scrambleIn(collectTextNodes(sidebar)).then(function () { sidebarBusy = false; });
        }
    }

    function closeSidebar() {
        if (!sidebar || !toggleBtn) return;
        if (!sidebarBusy) {
            sidebarBusy = true;
            var items = collectTextNodes(sidebar);
            scrambleOut(items).then(function () {
                items.forEach(function (t) { t.node.textContent = t.original; });
                sidebarBusy = false;
            });
        }
        body.classList.remove('sidebar-open');
        sidebar.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        scrim.classList.remove('visible');
        setTimeout(function () {
            if (!body.classList.contains('sidebar-open')) scrim.hidden = true;
        }, 500);
    }

    if (sidebar && toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.addEventListener('click', function () {
            body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
        });
    }
    scrim.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && body.classList.contains('sidebar-open')) closeSidebar();
    });

    // ── Intersection Observer ──
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(function (s) {
        s.classList.add('fade-in');
        observer.observe(s);
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
            title.textContent = item.section ? (item.title + ' | ' + item.section) : item.title;
            a.appendChild(title);
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

    // ── Highlight current nav ──
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        try {
            var u = new URL(link.getAttribute('href'), window.location.href);
            if (u.pathname === window.location.pathname) link.classList.add('is-current');
        } catch (e) {}
    });

    // ── Attach link handlers ──
    function shouldAnimate(link, url) {
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;
        if (url.origin !== window.location.origin) return false;
        return true;
    }

    function attachLinkHandlers(root) {
        (root || document).querySelectorAll('a[href]').forEach(function (link) {
            // Skip if already handled
            if (link._glyphHandled) return;
            link._glyphHandled = true;

            var url;
            try { url = new URL(link.href, window.location.href); } catch (e) { return; }
            if (!shouldAnimate(link, url)) return;

            link.addEventListener('click', function (event) {
                if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                closeSidebar();
                doPageTransition(url.href);
            });
        });
    }

    attachLinkHandlers();

    // ── Populate dynamic lists ──
    if (typeof siteData !== 'undefined') {
        populateList('projects-list', siteData.projects || []);
        populateList('recipes-list', siteData.recipes || []);
        var all = [].concat(siteData.projects || [], siteData.recipes || [],
            siteData.pages || [], siteData.music || [], siteData.blogs || []);
        populateList('toc-list', all);
    }

    // ── Search ──
    var tocSearch = document.getElementById('contents-search');
    if (tocSearch) {
        tocSearch.addEventListener('input', function () {
            var q = tocSearch.value.toLowerCase();
            document.querySelectorAll('#toc-list li').forEach(function (li) {
                li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
})();

/* GraphView — the shared engine behind the site map (home) and the
 * career map (about).
 *
 * The caller supplies nodes (with kind/area/title/meta/desc/url and a
 * parent link), edges, and a layout function. The engine renders nodes
 * as real links/buttons, measures them, runs the layout, draws edges in
 * world-space SVG, and provides:
 *   camera   — one transform; tweened with log-space zoom; time-limited
 *   input    — drag to pan, Ctrl/⌘ + wheel or pinch to zoom, +/−/fit
 *   keyboard — arrows move spatially between nodes, Enter opens, Esc fits
 *   preview  — a card (bottom sheet on phones) for the selected node
 *   filters  — [data-map-filter] buttons mute other areas and refit
 * Touch: first tap selects, the preview's Open acts.
 */
(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    function bounds(list) {
        var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
        list.forEach(function (n) {
            b.x0 = Math.min(b.x0, n.x - n.w / 2); b.x1 = Math.max(b.x1, n.x + n.w / 2);
            b.y0 = Math.min(b.y0, n.y - n.h / 2); b.y1 = Math.max(b.y1, n.y + n.h / 2);
        });
        return b;
    }

    function defaultEdgePath(e) {
        var mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2;
        var cx = mx + (e.a.x - mx) * 0.25 + (e.b.y - e.a.y) * 0.08;
        var cy = my + (e.a.y - my) * 0.25 - (e.b.x - e.a.x) * 0.08;
        return 'M' + e.a.x.toFixed(1) + ' ' + e.a.y.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + e.b.x.toFixed(1) + ' ' + e.b.y.toFixed(1);
    }

    // Rectangle-overlap relaxation with springs back toward the seeded layout.
    // Shared by every map so they settle the same way.
    function relax(nodes, pinned) {
        var PAD = 18;
        nodes.forEach(function (n) { n.hx = n.x; n.hy = n.y; });
        for (var it = 0; it < 220; it++) {
            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    var a = nodes[i], b = nodes[j];
                    var ox = (a.w + b.w) / 2 + PAD - Math.abs(a.x - b.x);
                    var oy = (a.h + b.h) / 2 + PAD - Math.abs(a.y - b.y);
                    if (ox <= 0 || oy <= 0) continue;
                    var wa = a === pinned ? 0 : 1, wb = b === pinned ? 0 : 1;
                    if (!wa && !wb) continue;
                    var sa = wa / (wa + wb), sb = wb / (wa + wb);
                    if (ox < oy) {
                        var dx = (a.x < b.x ? -1 : 1) * ox;
                        a.x += dx * sa; b.x -= dx * sb;
                    } else {
                        var dy = (a.y < b.y ? -1 : 1) * oy;
                        a.y += dy * sa; b.y -= dy * sb;
                    }
                }
            }
            nodes.forEach(function (n) {
                if (n === pinned) return;
                n.x += (n.hx - n.x) * 0.02;
                n.y += (n.hy - n.y) * 0.02;
            });
        }
    }

    // Portrait screens: turn the tree 90 degrees so it grows down, not across.
    function rotateForPortrait(nodes) {
        nodes.forEach(function (n) { var x = n.x; n.x = n.y * 0.92; n.y = x; });
    }

    function GraphView(host, opts) {
        var viewport = host.querySelector('.map-viewport');
        var world = host.querySelector('.map-world');
        var svg = host.querySelector('.map-edges');
        var preview = host.querySelector('.map-preview');
        var nodes = opts.nodes, edges = opts.edges;
        var portrait = viewport.clientHeight > viewport.clientWidth * 1.15;
        var listeners = [];

        function on(target, type, fn, o) {
            target.addEventListener(type, fn, o);
            listeners.push([target, type, fn, o]);
        }

        // ── Render nodes ──
        nodes.forEach(function (n) {
            var el = document.createElement(n.url ? 'a' : 'button');
            if (n.url) { el.href = n.url; el.setAttribute('data-no-spa', ''); }
            else el.type = 'button';
            el.className = 'map-node is-' + n.kind + (opts.nodeClass ? ' ' + opts.nodeClass : '');
            if (n.id) el.id = n.id;
            var depth = 0; for (var p = n.parent; p; p = p.parent) depth++;
            el.dataset.depth = String(Math.min(depth, 3));
            el.dataset.area = n.area || '';
            if (n.tag) {
                var tag = document.createElement('span');
                tag.className = 'map-tag';
                tag.textContent = n.tag;
                el.appendChild(tag);
            }
            var label = document.createElement('span');
            label.className = 'map-label';
            label.textContent = n.title;
            el.appendChild(label);
            if (n.meta && n.kind !== 'leaf') {
                var meta = document.createElement('span');
                meta.className = 'map-meta';
                meta.textContent = n.meta;
                el.appendChild(meta);
            }
            el.setAttribute('aria-label', n.title + (n.tag ? ', ' + n.tag : '') + (n.meta ? ', ' + n.meta : ''));
            world.appendChild(el);
            n.el = el;
            el._node = n;
            n.children = n.children || [];
        });
        nodes.forEach(function (n) { n.w = n.el.offsetWidth; n.h = n.el.offsetHeight; });

        opts.layout(nodes, { portrait: portrait });

        if (opts.decorate) opts.decorate(svg, nodes, { portrait: portrait, SVG_NS: SVG_NS });
        var edgePath = opts.edgePath || defaultEdgePath;
        edges.forEach(function (e) {
            var p = document.createElementNS(SVG_NS, 'path');
            p.setAttribute('d', edgePath(e, portrait));
            p.setAttribute('class', 'map-edge area-' + (e.b.area || '') + (e.cls ? ' ' + e.cls : ''));
            p.setAttribute('pathLength', '1');
            svg.appendChild(p);
            e.el = p;
        });
        nodes.forEach(function (n) {
            n.el.style.transform = 'translate(' + (n.x - n.w / 2).toFixed(1) + 'px,' + (n.y - n.h / 2).toFixed(1) + 'px)';
        });

        // ── Camera ──
        var cam = { x: 0, y: 0, k: 1 };
        var tweenRaf = 0;
        var minK = opts.minK || 0.3, maxK = opts.maxK || 2.2;
        function apply() {
            world.style.transform = 'translate(' + cam.x.toFixed(2) + 'px,' + cam.y.toFixed(2) + 'px) scale(' + cam.k.toFixed(4) + ')';
            host.style.setProperty('--map-k', cam.k.toFixed(3));
        }
        function clampK(k) { return Math.max(minK, Math.min(maxK, k)); }
        function moveTo(t, animate, duration) {
            cancelAnimationFrame(tweenRaf);
            if (!animate || reduce.matches) {
                cam.x = t.x; cam.y = t.y; cam.k = t.k; apply();
                return Promise.resolve();
            }
            var from = { x: cam.x, y: cam.y, k: cam.k };
            var start = 0, dur = duration || 520;
            return new Promise(function (resolve) {
                var done = false;
                function finish() { if (done) return; done = true; cam.x = t.x; cam.y = t.y; cam.k = t.k; apply(); resolve(); }
                function step(now) {
                    if (done) return;
                    if (!start) start = now;
                    var p = Math.min(1, (now - start) / dur);
                    var e = 1 - Math.pow(1 - p, 4);
                    cam.k = Math.exp(Math.log(from.k) + (Math.log(t.k) - Math.log(from.k)) * e);
                    cam.x = from.x + (t.x - from.x) * e;
                    cam.y = from.y + (t.y - from.y) * e;
                    apply();
                    if (p < 1) tweenRaf = requestAnimationFrame(step); else finish();
                }
                tweenRaf = requestAnimationFrame(step);
                setTimeout(finish, dur + 200);           // never wait on throttled frames
            });
        }
        function fitTo(list, animate) {
            var b = bounds(list);
            var vw = viewport.clientWidth, vh = viewport.clientHeight;
            var padX = Math.min(80, vw * 0.08), padY = opts.fitPadY || 60;
            var k = clampK(Math.min((vw - padX * 2) / (b.x1 - b.x0), (vh - padY * 2) / (b.y1 - b.y0), opts.fitMaxK || 1.25));
            var cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
            return moveTo({ x: vw / 2 - cx * k, y: vh / 2 - cy * k, k: k }, animate);
        }
        function centerOn(n, k, animate, duration) {
            var vw = viewport.clientWidth, vh = viewport.clientHeight;
            k = clampK(k || cam.k);
            // Leave room for the preview card on wide screens.
            var offsetX = (opts.previewSide && vw > 900 && preview && !preview.hidden) ? -Math.min(170, vw * 0.12) : 0;
            var offsetY = (vw <= 700 && preview && !preview.hidden) ? -Math.min(110, vh * 0.16) : 0;
            return moveTo({ x: vw / 2 + offsetX - n.x * k, y: vh / 2 + offsetY - n.y * k, k: k }, animate, duration);
        }
        function zoomAt(px, py, factor) {
            cancelAnimationFrame(tweenRaf);
            var k = clampK(cam.k * factor);
            var f = k / cam.k;
            cam.x = px - (px - cam.x) * f;
            cam.y = py - (py - cam.y) * f;
            cam.k = k;
            apply();
        }

        // ── Selection / preview ──
        var active = null;
        function lineage(n) {
            if (opts.lineage) return opts.lineage(n);
            var set = new Set();
            for (var p = n; p; p = p.parent) set.add(p);
            n.children.forEach(function (c) { set.add(c); });
            return set;
        }
        function setActive(n, o) {
            o = o || {};
            active = n;
            var lit = n ? lineage(n) : null;
            nodes.forEach(function (m) {
                m.el.classList.toggle('is-active', m === n);
                m.el.classList.toggle('is-lit', !!lit && lit.has(m));
            });
            edges.forEach(function (e) { e.el.classList.toggle('is-lit', !!lit && lit.has(e.a) && lit.has(e.b)); });
            host.classList.toggle('has-active', !!n);
            if (!preview) return;
            if (!n) { preview.hidden = true; return; }
            preview.hidden = false;
            preview.querySelector('.map-preview-kind').textContent = n.kicker || n.meta || '';
            preview.querySelector('.map-preview-title').textContent = n.title;
            preview.querySelector('.map-preview-desc').textContent = n.desc || '';
            var openBtn = preview.querySelector('.map-preview-open');
            openBtn.hidden = !n.url;
            if (n.url) { openBtn.href = n.url; openBtn._node = n; }
            if (opts.onSelect) opts.onSelect(n);
            if (o.reveal) {
                var r = n.el.getBoundingClientRect(), vr = viewport.getBoundingClientRect();
                if (r.left < vr.left + 40 || r.right > vr.right - 40 || r.top < vr.top + 40 || r.bottom > vr.bottom - 40) {
                    centerOn(n, Math.max(cam.k, opts.revealK || 0.8), true);
                }
            }
        }

        function open(n) {
            if (!n) return;
            if (!n.url) { setActive(n); centerOn(n, Math.max(cam.k, opts.revealK || 0.9), true); return; }
            // Resolve now: by the time the camera lands, the location may have changed.
            var href = new URL(n.url, window.location.href).href;
            setActive(n);
            centerOn(n, Math.min(maxK, Math.max(cam.k * 1.8, 1.4)), true).then(function () {
                if (!host.isConnected) return;               // another navigation already replaced this page
                if (typeof window.spaNavigate === 'function') window.spaNavigate(href);
                else window.location.href = href;
            });
        }

        function visibleNodes() {
            return nodes.filter(function (n) { return !n.el.classList.contains('is-muted'); });
        }

        // ── Filters ──
        host.querySelectorAll('[data-map-filter]').forEach(function (btn) {
            on(btn, 'click', function () {
                var filter = btn.dataset.mapFilter;
                host.querySelectorAll('[data-map-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
                var shown = nodes.filter(function (n) { return filter === 'all' || n.area === filter || n.kind === 'root'; });
                nodes.forEach(function (n) { n.el.classList.toggle('is-muted', shown.indexOf(n) === -1); });
                edges.forEach(function (e) { e.el.classList.toggle('is-muted', shown.indexOf(e.b) === -1); });
                setActive(null);
                fitTo(shown, true);
            });
        });

        // ── Pointer: pan, pinch, tap ──
        var pointers = new Map();
        var drag = null, pinch = null, moved = false;
        on(viewport, 'pointerdown', function (e) {
            if (e.button !== 0) return;
            if (opts.onInteract) opts.onInteract();
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size === 1) {
                drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y };
                moved = false;
            } else if (pointers.size === 2) {
                var pts = Array.from(pointers.values());
                pinch = { d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), k: cam.k };
                drag = null;
            }
        });
        on(viewport, 'pointermove', function (e) {
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinch && pointers.size === 2) {
                var pts = Array.from(pointers.values());
                var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                var vr = viewport.getBoundingClientRect();
                zoomAt((pts[0].x + pts[1].x) / 2 - vr.left, (pts[0].y + pts[1].y) / 2 - vr.top, (pinch.k * d / pinch.d) / cam.k);
                moved = true;
                return;
            }
            if (!drag) return;
            var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
            if (!moved && Math.hypot(dx, dy) < 5) return;
            if (!moved) {
                moved = true;
                viewport.setPointerCapture(e.pointerId);
                host.classList.add('is-dragging');
                cancelAnimationFrame(tweenRaf);
            }
            cam.x = drag.cx + dx;
            cam.y = drag.cy + dy;
            apply();
        });
        function endPointer(e) {
            pointers.delete(e.pointerId);
            if (pointers.size < 2) pinch = null;
            if (pointers.size === 0) { drag = null; host.classList.remove('is-dragging'); }
        }
        on(viewport, 'pointerup', endPointer);
        on(viewport, 'pointercancel', endPointer);

        on(viewport, 'click', function (e) {
            var a = e.target.closest('.map-node');
            if (!a) { if (!moved) setActive(null); return; }
            e.preventDefault();
            if (moved) return;
            if (a._node.url && (e.metaKey || e.ctrlKey || e.shiftKey)) { window.open(a.href, '_blank'); return; }
            if (!fine.matches && active !== a._node) { setActive(a._node, { reveal: true }); return; }
            open(a._node);
        });
        if (preview) {
            on(preview.querySelector('.map-preview-open'), 'click', function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                open(e.currentTarget._node);
            });
        }
        on(viewport, 'pointerover', function (e) {
            if (!fine.matches || drag || opts.selectOnHover === false) return;
            var a = e.target.closest('.map-node');
            if (a) setActive(a._node);
        });

        on(viewport, 'wheel', function (e) {
            if (!e.ctrlKey && !e.metaKey) {
                host.classList.add('show-zoom-hint');
                clearTimeout(host._hintTimer);
                host._hintTimer = setTimeout(function () { host.classList.remove('show-zoom-hint'); }, 1100);
                return;
            }
            e.preventDefault();
            if (opts.onInteract) opts.onInteract();
            var vr = viewport.getBoundingClientRect();
            zoomAt(e.clientX - vr.left, e.clientY - vr.top, Math.exp(-e.deltaY * 0.0022));
        }, { passive: false });

        var zin = host.querySelector('[data-map-zoom="in"]'), zout = host.querySelector('[data-map-zoom="out"]'), zfit = host.querySelector('[data-map-zoom="fit"]');
        if (zin) on(zin, 'click', function () { zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1.3); });
        if (zout) on(zout, 'click', function () { zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1 / 1.3); });
        if (zfit) on(zfit, 'click', function () { if (opts.onInteract) opts.onInteract(); setActive(null); fitTo(visibleNodes(), true); });

        // ── Keyboard: spatial navigation ──
        on(host, 'focusin', function (e) {
            var a = e.target.closest('.map-node');
            if (a) setActive(a._node, { reveal: true });
        });
        on(host, 'keydown', function (e) {
            var a = e.target.closest('.map-node');
            if (e.key === 'Escape') { if (opts.onInteract) opts.onInteract(); setActive(null); fitTo(visibleNodes(), true); return; }
            if (!a) return;
            if (e.key === 'Enter' || (e.key === ' ' && !a._node.url)) { e.preventDefault(); open(a._node); return; }
            var dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
            if (!dir) return;
            e.preventDefault();
            if (opts.onInteract) opts.onInteract();
            var from = a._node, best = null, bestScore = Infinity;
            visibleNodes().forEach(function (n) {
                if (n === from) return;
                var dx = n.x - from.x, dy = n.y - from.y;
                var along = dx * dir[0] + dy * dir[1];
                if (along <= 4) return;
                var across = Math.abs(dx * dir[1] - dy * dir[0]);
                var score = along + across * 2.2;
                if (score < bestScore) { bestScore = score; best = n; }
            });
            if (best) best.el.focus({ preventScroll: true });
        });

        // ── Size + entrance ──
        function layoutCamera() {
            fitTo(visibleNodes(), false);
            if (opts.legibleK && cam.k < opts.legibleK && opts.legibleFocus) {
                var f = opts.legibleFocus, k = opts.legibleK;
                var vw = viewport.clientWidth, vh = viewport.clientHeight;
                // Portrait: the tree grows downward, so start with its root near the top.
                var fy = portrait ? Math.min(vh * 0.24, 70 + f.h * k) : vh / 2;
                moveTo({ x: vw / 2 - f.x * k, y: fy - f.y * k, k: k }, false);
            }
        }
        var ro = new ResizeObserver(function () {
            if (!host.isConnected) { ro.disconnect(); return; }
            if (!active) layoutCamera();
        });
        ro.observe(viewport);
        layoutCamera();

        if (!reduce.matches) {
            host.classList.add('is-pending');
            var io = new IntersectionObserver(function (entries) {
                if (!entries[0].isIntersecting) return;
                io.disconnect();
                host.classList.remove('is-pending');
                host.classList.add('is-entering');
                setTimeout(function () { host.classList.remove('is-entering'); }, 1400);
            }, { threshold: 0.25 });
            io.observe(host);
        }

        return {
            nodes: nodes,
            select: setActive,
            centerOn: centerOn,
            fitAll: function (animate) { return fitTo(visibleNodes(), animate); },
            get active() { return active; },
            get camera() { return cam; }
        };
    }

    GraphView.SVG_NS = SVG_NS;
    GraphView.relax = relax;
    GraphView.rotateForPortrait = rotateForPortrait;
    window.GraphView = GraphView;
})();

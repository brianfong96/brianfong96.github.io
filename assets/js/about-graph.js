/* Career map — the About page, built on the same graph as the home site map.
 *
 * Same engine (GraphView), same radial tree, same curved edges, same
 * relaxation and staged entrance. You are the root; each branch is a path
 * (study, Microsoft — internships and career — and life outside work)
 * and grows outward in the order it happened. Stops show only the tag
 * written for them. "Play the story" walks the camera through every stop
 * in order; any interaction stops it.
 */
(function () {
    'use strict';

    // Flatten siteData.about (a nested tree) into graph nodes. The story is
    // the tree read in order: each branch from its start to its latest stop.
    function data() {
        var nodes = [], edges = [], byId = {}, story = [];
        (function walk(src, parent) {
            var n = {
                id: 'node-' + src.id,
                kind: src.kind || 'stop',
                area: src.area,
                tag: src.tag,
                title: src.title,
                meta: src.meta,
                kicker: src.kicker || src.tag,
                desc: src.desc,
                url: src.url,
                external: src.external,
                cta: src.cta,
                children: [],
                parent: parent || null
            };
            nodes.push(n);
            byId[n.id] = n;
            story.push(n.id);
            if (parent) { parent.children.push(n); edges.push({ a: parent, b: n }); }
            (src.children || []).forEach(function (c) { walk(c, n); });
        })(siteData.about, null);
        return { nodes: nodes, edges: edges, byId: byId, root: nodes[0], story: story };
    }

    // Radial seed in the home map's style: each branch leaves the root at its
    // own angle and keeps growing outward; siblings fan around their parent.
    function seed(root) {
        root.x = 0; root.y = 0;
        var angles = { study: Math.PI * 1.18, microsoft: -0.1, personal: Math.PI * 0.62 };
        (function place(parent, depth) {
            var n = parent.children.length;
            parent.children.forEach(function (c, i) {
                var spread = depth === 0 ? 0 : (n === 1 ? 0 : (n === 2 ? 1.1 : 0.95));
                var t = n === 1 ? 0 : (i / (n - 1) - 0.5);
                c.angle = depth === 0 ? angles[c.area] : parent.angle + t * spread;
                var dist = depth === 0 ? 250 : 210;
                c.x = parent.x + Math.cos(c.angle) * dist;
                c.y = parent.y + Math.sin(c.angle) * dist;
                place(c, depth + 1);
            });
        })(root, 0);
    }

    function init() {
        var host = document.getElementById('career-map');
        if (!host || host.dataset.ready === 'true' || typeof window.GraphView !== 'function' || typeof siteData === 'undefined' || !siteData.about) return;
        host.dataset.ready = 'true';
        var g = data();
        var playBtn = host.querySelector('[data-story]');
        var tour = { on: false, timer: 0, i: 0 };
        var view;

        function stopTour() {
            if (!tour.on) return;
            tour.on = false;
            clearTimeout(tour.timer);
            host.classList.remove('is-touring');
            playBtn.setAttribute('aria-pressed', 'false');
            playBtn.querySelector('.story-label').textContent = 'Play the story';
        }
        function step() {
            if (!tour.on) return;
            if (tour.i >= g.story.length) {
                stopTour();
                view.select(null);
                view.fitAll(true);
                return;
            }
            var n = g.byId[g.story[tour.i++]];
            view.select(n);
            view.centerOn(n, host.clientWidth < 700 ? 0.85 : 1.05, true, 760);
            var dwell = Math.max(3200, Math.min(9000, 1600 + (n.desc || '').length * 30));
            tour.timer = setTimeout(step, dwell);
        }
        function startTour() {
            tour.on = true;
            tour.i = view.active ? Math.max(0, g.story.indexOf(view.active.id)) : 0;
            host.classList.add('is-touring');
            playBtn.setAttribute('aria-pressed', 'true');
            playBtn.querySelector('.story-label').textContent = 'Pause';
            step();
        }

        view = window.GraphView(host, {
            nodes: g.nodes,
            edges: g.edges,
            nodeClass: 'graph-node',
            layout: function (nodes, ctx) {
                seed(g.root);
                if (ctx.portrait) window.GraphView.rotateForPortrait(nodes);
                window.GraphView.relax(nodes, g.root);
            },
            previewSide: true,
            revealK: 0.95,
            fitMaxK: 1.1,
            legibleK: 0.6,
            legibleFocus: g.root,
            onInteract: stopTour
        });

        playBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (tour.on) stopTour(); else startTour();
        });
        var watch = setInterval(function () {
            if (!host.isConnected) { stopTour(); clearInterval(watch); }
        }, 1000);
    }

    window.initAboutGraph = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

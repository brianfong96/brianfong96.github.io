/* Site map — everything on the site as one navigable graph (home page).
 *
 * Data comes from siteData; the camera, input, keyboard and preview come
 * from GraphView (graph-view.js). This file owns the layout: seeded
 * radial fans (you → areas → topics → pages), rotated 90° on portrait
 * screens, then a rectangle-overlap relaxation pass so labels never collide.
 */
(function () {
    'use strict';

    function slug(s) { return s.toLowerCase().replace(/\s+/g, '-'); }

    function formatDate(d) {
        try {
            return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        } catch (e) { return d; }
    }

    function buildGraph(data) {
        var nodes = [], edges = [];
        function add(n, parent) {
            n.children = [];
            n.parent = parent || null;
            nodes.push(n);
            if (parent) { parent.children.push(n); edges.push({ a: parent, b: n }); }
            return n;
        }
        var root = add({ kind: 'root', area: 'about', title: 'Brian Fong', meta: 'Senior software engineer', kicker: 'About', desc: 'Mixed reality, game development, cybersecurity, red teaming, and AI. Open the career map.', url: 'about.html' });
        var writing = add({ kind: 'hub', area: 'writing', title: 'Writing', meta: (data.blogs || []).length + ' posts', desc: 'Research and visual explanations across finance, technology, personal systems, and recipes.', url: 'blog.html' }, root);
        var learn = add({ kind: 'hub', area: 'learnings', title: 'Learnings', meta: (data.learnings || []).length + ' tutorials', desc: 'Interactive tutorials with explanations, pseudocode, and animations.', url: 'learnings.html' }, root);
        var work = add({ kind: 'hub', area: 'work', title: 'Projects', meta: (data.projects || []).length + ' built', desc: "Things I've built.", url: 'projects.html' }, root);

        var topics = {};
        (data.blogs || []).forEach(function (b) {
            var cat = b.category || 'Other';
            if (!topics[cat]) topics[cat] = add({ kind: 'topic', area: 'writing', title: cat, meta: '', kicker: 'Topic', desc: '', url: 'blog.html#' + slug(cat), count: 0 }, writing);
            topics[cat].count++;
            add({ kind: 'leaf', area: 'writing', title: b.title, meta: cat + (b.date ? ' / ' + formatDate(b.date) : ''), desc: b.description || '', url: b.url }, topics[cat]);
        });
        Object.keys(topics).forEach(function (k) { topics[k].meta = topics[k].count + (topics[k].count === 1 ? ' post' : ' posts'); });
        (data.learnings || []).forEach(function (l) {
            add({ kind: 'leaf', area: 'learnings', title: l.title, meta: l.category || 'Learnings', desc: l.description || '', url: l.url }, learn);
        });
        (data.projects || []).forEach(function (p) {
            add({ kind: 'leaf', area: 'work', title: p.title, meta: 'Project', desc: p.description || '', url: p.url }, work);
        });
        return { nodes: nodes, edges: edges, root: root };
    }

    function seed(root) {
        root.x = 0; root.y = 0; root.angle = 0;
        var hubAngles = { writing: -0.15, learnings: Math.PI * 0.86, work: Math.PI * 1.32 };
        var hubDist = { writing: 300, learnings: 280, work: 250 };
        root.children.forEach(function (h) {
            h.angle = hubAngles[h.area];
            h.x = Math.cos(h.angle) * hubDist[h.area];
            h.y = Math.sin(h.angle) * hubDist[h.area];
        });
        function fan(parent, dist, spread) {
            var n = parent.children.length;
            parent.children.forEach(function (c, i) {
                var t = n === 1 ? 0 : (i / (n - 1) - 0.5);
                c.angle = parent.angle + t * spread;
                c.x = parent.x + Math.cos(c.angle) * dist;
                c.y = parent.y + Math.sin(c.angle) * dist;
            });
        }
        root.children.forEach(function (h) {
            if (h.area === 'writing') {
                fan(h, 230, Math.PI * 1.05);
                h.children.forEach(function (t) { fan(t, 180, Math.min(Math.PI * 0.9, 0.42 * t.children.length)); });
            } else {
                fan(h, 200, Math.min(Math.PI, 0.5 * h.children.length));
            }
        });
    }

    function init() {
        var host = document.getElementById('site-map');
        if (!host || host.dataset.ready === 'true' || typeof siteData === 'undefined' || typeof window.GraphView !== 'function') return;
        host.dataset.ready = 'true';
        var graph = buildGraph(siteData);
        window.GraphView(host, {
            nodes: graph.nodes,
            edges: graph.edges,
            layout: function (nodes, ctx) {
                seed(graph.root);
                if (ctx.portrait) window.GraphView.rotateForPortrait(nodes);
                window.GraphView.relax(nodes, graph.root);
            },
            previewSide: true,
            legibleK: 0.56,
            legibleFocus: graph.root
        });
    }

    window.initSiteMap = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

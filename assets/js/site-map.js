/* Site map — everything on the site as one navigable graph (home page).
 *
 * Data comes from siteData; the camera, input, keyboard and preview come
 * from GraphView (graph-view.js). This file owns the layout: seeded
 * radial fans (you → areas → topics → pages), rotated 90° on portrait
 * screens, then a rectangle-overlap relaxation pass so labels never collide.
 */
(function () {
    'use strict';


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
        var writing = add({ kind: 'hub', area: 'writing', title: '~/posts', meta: (data.posts || []).length + ' posts', desc: 'Tutorials, research, and guides across computer science, technology, finance, personal systems, and recipes.', url: 'posts.html' }, root);
        var work = add({ kind: 'hub', area: 'work', title: '~/projects', meta: (data.projects || []).length + ' built', desc: "Things I've built.", url: 'projects.html' }, root);

        (data.folders || []).forEach(function (f) {
            var items = (data.posts || []).filter(function (p) { return p.folder === f.slug; });
            if (!items.length) return;
            var topic = add({ kind: 'topic', area: 'writing', title: f.slug + '/', meta: items.length + (items.length === 1 ? ' post' : ' posts'), kicker: 'Folder', desc: f.description || '', url: 'posts/' + f.slug + '/' }, writing);
            items.forEach(function (b) {
                add({ kind: 'leaf', area: 'writing', title: b.title, meta: f.name + (b.date ? ' / ' + formatDate(b.date) : ''), desc: b.description || '', url: b.url }, topic);
            });
        });
        (data.projects || []).forEach(function (p) {
            add({ kind: 'leaf', area: 'work', title: p.title, meta: 'Project' + (p.date ? ' / ' + formatDate(p.date) : ''), desc: p.description || '', url: p.url }, work);
        });
        return { nodes: nodes, edges: edges, root: root };
    }

    function seed(root) {
        root.x = 0; root.y = 0; root.angle = 0;
        var hubAngles = { writing: -0.1, work: Math.PI * 1.05 };
        var hubDist = { writing: 300, work: 260 };
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

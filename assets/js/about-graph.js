/* Career map — the About page, built on the same graph as the home site map.
 *
 * Same engine (GraphView), same radial tree, same curved edges, same
 * relaxation and staged entrance. You are the root; each branch is a path
 * (study, the internships, full-time security into AI, life outside work)
 * and grows outward in the order it happened. Stops show only the tag
 * written for them. "Play the story" walks the camera through every stop
 * in order; any interaction stops it.
 */
(function () {
    'use strict';

    function data() {
        var nodes = [], edges = [], byId = {};
        function add(n, parent) {
            n.children = [];
            n.parent = parent || null;
            nodes.push(n);
            byId[n.id] = n;
            if (parent) { parent.children.push(n); edges.push({ a: parent, b: n }); }
            return n;
        }
        var root = add({ id: 'node-center', kind: 'root', area: 'about', title: 'Brian Fong', meta: 'Senior software engineer', kicker: 'Start here', desc: 'Senior software engineer. My work spans mixed reality, game development, cybersecurity, red teaming, and AI.' });
        add({ id: 'node-edu', kind: 'stop', area: 'study', tag: '2014–2019', title: 'Education', kicker: '2014–2019', desc: 'I earned my Bachelor of Science in Computer Science from Simon Fraser University. During that time, I interned at Microsoft for three terms and also worked as a Microsoft contractor for an additional term.' }, root);
        var mr = add({ id: 'node-mr', kind: 'stop', area: 'intern', tag: 'Fall 2018', title: 'Mixed Reality', kicker: 'Fall 2018', desc: 'I started my software engineering career as an intern at Microsoft Vancouver through the Garage program, where I got the chance to work on the HoloLens. I helped build a mixed reality application in partnership with BC Cancer to support cancer research.' }, root);
        var bp = add({ id: 'node-bigpark', kind: 'stop', area: 'intern', tag: 'Internship', title: 'Big Park', kicker: 'Internship', desc: 'I interned at Microsoft Big Park, where I worked on the 3D engine in Windows.' }, mr);
        add({ id: 'node-azurert', kind: 'stop', area: 'intern', tag: 'Internship', title: 'Azure Red Team Intern', kicker: 'Internship', desc: 'I interned at Microsoft in Redmond on the Azure Red Team, where I worked on visualizing attack graphs across the company on the HoloLens. I also had the chance to mentor the Garage program team of interns there.' }, bp);
        var acs = add({ id: 'node-cyber', kind: 'stop', area: 'career', tag: 'March 2020', title: 'Azure Core Security', kicker: 'March 2020', desc: 'This is where I started my full-time software engineering career in Redmond, right when COVID work-from-home began. I worked at Microsoft in Azure Core Security Services on trusted VMs.' }, root);
        var rt = add({ id: 'node-redteam', kind: 'stop', area: 'career', tag: '5+ Years', title: 'Red Team', kicker: '5+ years', desc: "I've been on the red team for over five years, working on the Azure Red Team and then the Microsoft Red Team. I helped build a graph of cloud assets to identify attack paths and developed a system to programmatically identify all attack paths that violate security boundaries." }, acs);
        add({ id: 'node-ai', kind: 'stop', area: 'career', tag: 'Current', title: 'Artificial Intelligence', kicker: 'Current', desc: "This is where I am right now — I'm currently working on M365 Copilot at Microsoft, building AI-powered experiences that help people get more done." }, rt);
        var hobby = add({ id: 'node-hobby', kind: 'stop', area: 'personal', tag: 'Personal', title: 'Hobby', kicker: 'Personal', desc: 'Outside of work I spend my time on creative and physical pursuits that keep me sharp and energized.' }, root);
        add({ id: 'node-gamedev', kind: 'stop', area: 'personal', tag: 'Creative', title: 'Game Dev', kicker: 'Creative', desc: 'Game dev is a hobby I like to pursue in my free time. I work primarily with Unity, which is actually how I landed my first internship at Microsoft. I enjoy prototyping interactive experiences, experimenting with mechanics, and building things just for the fun of it.' }, hobby);
        add({ id: 'node-ma', kind: 'stop', area: 'personal', tag: 'Physical', title: 'Martial Arts', kicker: 'Physical', desc: "I've been learning LiuHeBaFa for over a decade under Mario Lam. Beyond the physical practice, it has taught me a great deal about applying its theories and philosophies to different facets of my life. It complements the mental work of engineering with a discipline that demands focus, consistency, and continuous self-reflection." }, hobby);
        return {
            nodes: nodes, edges: edges, byId: byId, root: root,
            story: ['node-center', 'node-edu', 'node-mr', 'node-bigpark', 'node-azurert', 'node-cyber', 'node-redteam', 'node-ai', 'node-hobby', 'node-gamedev', 'node-ma']
        };
    }

    // Radial seed in the home map's style: each branch leaves the root at its
    // own angle and keeps growing outward; siblings fan around their parent.
    function seed(root) {
        root.x = 0; root.y = 0;
        var angles = { study: Math.PI * 1.22, intern: Math.PI * 0.8, career: -0.12, personal: Math.PI * 0.42 };
        (function place(parent, depth) {
            var n = parent.children.length;
            parent.children.forEach(function (c, i) {
                var spread = depth === 0 ? 0 : (n === 1 ? 0 : 0.85);
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
        if (!host || host.dataset.ready === 'true' || typeof window.GraphView !== 'function') return;
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

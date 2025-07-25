function getData() {
    if (window.familyTreeData) {
        return Promise.resolve(window.familyTreeData);
    }
    return Promise.reject(new Error('No data available'));
}

function computeDepths(data) {
    const map = new Map(data.map(p => [p.id, p]));
    const depth = new Map();

    function dfs(id, stack = new Set()) {
        if (depth.has(id)) return depth.get(id);
        if (stack.has(id)) return 0; // guard against cycles
        stack.add(id);
        const node = map.get(id);
        let d = 0;
        if (node && node.parents && node.parents.length > 0) {
            d = Math.max(...node.parents.map(pid => dfs(pid, stack) + 1));
        }
        stack.delete(id);
        depth.set(id, d);
        return d;
    }

    map.forEach((_, id) => dfs(id));
    return depth;
}

function buildHierarchy(data) {
    const map = new Map(data.map(p => [p.id, { ...p, children: [] }]));
    const depthMap = computeDepths(data);
    const extraLinks = [];

    data.forEach(p => {
        const parentDepth = depthMap.get(p.id) || 0;
        p.children.forEach(cid => {
            const child = map.get(cid);
            if (!child) return;
            if (!child._parent) {
                child._parent = p.id;
                child._parentDepth = parentDepth;
                map.get(p.id).children.push(child);
            } else if (parentDepth > (child._parentDepth || -1)) {
                extraLinks.push({ source: child._parent, target: cid });
                const prev = map.get(child._parent);
                if (prev) {
                    prev.children = prev.children.filter(c => c.id !== child.id);
                }
                child._parent = p.id;
                child._parentDepth = parentDepth;
                map.get(p.id).children.push(child);
            } else {
                extraLinks.push({ source: p.id, target: cid });
            }
        });
    });

    const roots = [];
    map.forEach(node => {
        if (!node._parent) roots.push(node);
    });
    return { children: roots, extraLinks };
}

let nodeSelection;
let zoom, svg, g, container, width, height;
let displayData;
let dragEnabled = false;
let dragBehavior;
const NODE_RADIUS = 20;
const NODE_V_SPACING = 80;
const NODE_H_SPACING = 160;

function offsetTarget(link) {
    const dx = link.target.y - link.source.y;
    const dy = link.target.x - link.source.x;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return link.target;
    return {
        x: link.target.x - dy / dist * NODE_RADIUS,
        y: link.target.y - dx / dist * NODE_RADIUS
    };
}

function initTree(rootData) {
    displayData = rootData;
    container = d3.select('#tree');
    width = container.node().clientWidth;
    height = container.node().clientHeight;

    zoom = d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

    svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M0,0 L10,5 L0,10 Z')
        .attr('fill', '#ccc');

    g = svg.append('g')
        .attr('transform', 'translate(80,0)');

    dragBehavior = d3.drag()
        .on('drag', function(event, d) {
            d.x += event.dy;
            d.y += event.dx;
            d3.select(this).attr('transform', `translate(${d.y},${d.x})`);
            updateLinks();
        });

    updateTree();
}

function updateLinks() {
    const linkGenerator = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    g.selectAll('.link')
        .attr('d', d => linkGenerator({
            source: d.source,
            target: offsetTarget(d)
        }));
}

function updateTree() {
    const root = d3.hierarchy(displayData);
    const treeLayout = d3.tree()
        .nodeSize([NODE_V_SPACING, NODE_H_SPACING])
        .separation(() => 1);
    treeLayout(root);
    const nodeMap = new Map(root.descendants().map(n => [n.data.id, n]));
    const mainLinks = root.links().filter(d => d.source.depth > 0);
    const extraLinks = (displayData.extraLinks || []).map(l => ({
        source: nodeMap.get(l.source),
        target: nodeMap.get(l.target)
    }));
    const allLinks = mainLinks.concat(extraLinks);

    const linkSel = g.selectAll('.link')
        .data(allLinks, d => d.source.data.id + '-' + d.target.data.id);

    const linkGenerator = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    linkSel.enter().append('path')
        .attr('class', d => extraLinks.includes(d) ? 'link extra-link' : 'link')
        .attr('marker-end', 'url(#arrow)')
        .merge(linkSel)
        .attr('marker-end', 'url(#arrow)')
        .attr('d', d => linkGenerator({
            source: d.source,
            target: offsetTarget(d)
        }));

    linkSel.exit().remove();

    nodeSelection = g.selectAll('.node')
        .data(root.descendants().slice(1), d => d.data.id);

    const nodeEnter = nodeSelection.enter().append('g')
        .attr('class', 'node')
        .on('click', (event, d) => {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            updateTree();
        });

    nodeEnter.append('circle')
        .attr('r', 20);

    nodeEnter.append('title')
        .text(d => d.data.references ? d.data.references.join(', ') : '');

    nodeEnter.append('text')
        .attr('dy', 4)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name);

    nodeSelection = nodeEnter.merge(nodeSelection);

    nodeSelection
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .classed('collapsed', d => !d.children && d._children);

    if (dragEnabled) {
        nodeSelection.call(dragBehavior);
    } else {
        nodeSelection.on('.drag', null);
    }

    linkSel.lower();
}

function highlightNodes(query) {
    query = query.trim().toLowerCase();
    if (!nodeSelection) return;
    nodeSelection.classed('highlight', d => {
        if (!query) return false;
        return d.data.id.toLowerCase().includes(query) ||
               d.data.name.toLowerCase().includes(query) ||
               (d.data.aliases || []).some(a => a.toLowerCase().includes(query));
    });
}

function centerOnNode(d) {
    if (!svg) return;
    svg.transition().duration(750)
        .call(zoom.transform,
            d3.zoomIdentity.translate(width / 2 - d.y, height / 2 - d.x));
}

document.addEventListener('DOMContentLoaded', () => {
    getData()
        .then(data => {
            const hierarchy = buildHierarchy(data);
            initTree(hierarchy);
            const input = document.getElementById('search');
            if (input) {
                input.addEventListener('input', e => highlightNodes(e.target.value));
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        const q = e.target.value.trim().toLowerCase();
                        const match = nodeSelection.filter(d =>
                            d.data.id.toLowerCase().includes(q) ||
                            d.data.name.toLowerCase().includes(q) ||
                            (d.data.aliases || []).some(a => a.toLowerCase().includes(q))
                        );
                        if (!match.empty()) {
                            centerOnNode(match.datum());
                        }
                    }
                });
            }
            const toggle = document.getElementById('drag-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => {
                    dragEnabled = !dragEnabled;
                    toggle.textContent = dragEnabled ? 'Disable Dragging' : 'Enable Dragging';
                    updateTree();
                });
            }
        })
        .catch(err => {
            document.getElementById('tree').textContent = err.message;
            console.error(err);
        });
});

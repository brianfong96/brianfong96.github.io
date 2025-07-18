function getData() {
    if (window.familyTreeData) {
        return Promise.resolve(window.familyTreeData);
    }
    return Promise.reject(new Error('No data available'));
}

function buildHierarchy(data) {
    const map = new Map(data.map(p => [p.id, { ...p, children: [] }]));
    const extraLinks = [];
    // attach each child to the first parent for layout but keep other links
    data.forEach(p => {
        p.children.forEach(cid => {
            const child = map.get(cid);
            if (!child) return;
            if (!child._parent) {
                child._parent = p.id;
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
    g.selectAll('.link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
}

function updateTree() {
    const root = d3.hierarchy(displayData);
    const treeLayout = d3.tree().size([height, width - 160]);
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

    linkSel.enter().append('path')
        .attr('class', d => extraLinks.includes(d) ? 'link extra-link' : 'link')
        .merge(linkSel)
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

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
        .attr('r', 8);

    nodeEnter.append('title')
        .text(d => d.data.references ? d.data.references.join(', ') : '');

    nodeEnter.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -10 : 10)
        .style('text-anchor', d => d.children ? 'end' : 'start')
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

    linkSel.raise();
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

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

function renderTree(rootData) {
    container = d3.select('#tree');
    width = container.node().clientWidth;
    height = container.node().clientHeight;

    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().size([height, width - 160]);
    treeLayout(root);
    const nodeMap = new Map(root.descendants().map(n => [n.data.id, n]));
    const mainLinks = root.links().filter(d => d.source.depth > 0);
    const extraLinks = (rootData.extraLinks || []).map(l => ({
        source: nodeMap.get(l.source),
        target: nodeMap.get(l.target)
    }));

    zoom = d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

    svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    g = svg.append('g')
        .attr('transform', 'translate(80,0)');

    const allLinks = mainLinks.concat(extraLinks);
    g.selectAll('.link')
        .data(allLinks)
        .enter().append('path')
        .attr('class', d => extraLinks.includes(d) ? 'link extra-link' : 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    nodeSelection = g.selectAll('.node')
        .data(root.descendants().slice(1))
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    nodeSelection.append('circle')
        .attr('r', 5);

    nodeSelection.append('title')
        .text(d => d.data.references ? d.data.references.join(', ') : '');

    nodeSelection.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -10 : 10)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
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
            renderTree(hierarchy);
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
        })
        .catch(err => {
            document.getElementById('tree').textContent = err.message;
            console.error(err);
        });
});

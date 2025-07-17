function getData() {
    if (window.familyTreeData) {
        return Promise.resolve(window.familyTreeData);
    }
    return Promise.reject(new Error('No data available'));
}

function buildHierarchy(data) {
    const map = new Map(data.map(p => [p.id, { ...p }]));
    const roots = [];
    map.forEach(node => {
        node.children = node.children.map(id => map.get(id)).filter(Boolean);
    });
    map.forEach(node => {
        if (node.parents.length === 0) roots.push(node);
    });
    return { id: 'root', name: 'Root', children: roots };
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

    zoom = d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

    svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    g = svg.append('g')
        .attr('transform', 'translate(80,0)');

    g.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    nodeSelection = g.selectAll('.node')
        .data(root.descendants())
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

async function loadData() {
    const resp = await fetch('./data/family_tree.json');
    if (!resp.ok) throw new Error('Failed to load data');
    return resp.json();
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

function renderTree(rootData) {
    const width = document.getElementById('tree').clientWidth;
    const height = document.getElementById('tree').clientHeight;

    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().size([height, width - 160]);
    treeLayout(root);

    const svg = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(80,0)');

    svg.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
        .attr('r', 5);

    node.append('title')
        .text(d => d.data.references ? d.data.references.join(', ') : '');

    node.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -10 : 10)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
}

document.addEventListener('DOMContentLoaded', () => {
    loadData()
        .then(data => {
            const hierarchy = buildHierarchy(data);
            renderTree(hierarchy);
        })
        .catch(err => {
            document.getElementById('tree').textContent = err.message;
            console.error(err);
        });
});

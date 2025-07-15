// Update footer year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Intersection Observer for fade-in effect
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});


// Sidebar toggle behavior
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
if (sidebar && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
        sidebar.classList.toggle('open');
    });
}


// Helper to populate lists from siteData
function populateList(id, items) {
    const ul = document.getElementById(id);
    if (!ul || !items) return;
    ul.innerHTML = '';
    ul.classList.add('list-buttons');
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        li.appendChild(a);
        if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'item-desc';
            desc.textContent = item.description;
            li.appendChild(desc);
        }
        ul.appendChild(li);
    });
}

// Search filter for table of contents page
const tocSearch = document.getElementById('contents-search');
if (tocSearch) {
    tocSearch.addEventListener('input', () => {
        const q = tocSearch.value.toLowerCase();
        document.querySelectorAll('#toc-list li').forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(q) ? '' : 'none';
        });
    });
}

// Populate dynamic lists when siteData is available
if (typeof siteData !== 'undefined') {
    populateList('projects-list', siteData.projects);
    populateList('recipes-list', siteData.recipes);
    const all = [].concat(siteData.projects, siteData.recipes, siteData.blogs);
    populateList('toc-list', all);
}

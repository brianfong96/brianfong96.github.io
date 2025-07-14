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

// Toggle dropdown menus for navigation
document.querySelectorAll('.nav-links li.dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
    });
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

// Simple search filter for navigation links
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll('.nav-links li').forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

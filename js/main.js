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

(function () {
    'use strict';

    function initLindaProblem() {
        var root = document.querySelector('.linda-article');
        if (!root || root.dataset.lindaInitialized === 'true') return;
        if (typeof window.__lindaProblemCleanup === 'function') window.__lindaProblemCleanup();

        root.dataset.lindaInitialized = 'true';

        var sections = Array.from(root.querySelectorAll('[data-linda-section]'));
        var routeLinks = Array.from(root.querySelectorAll('[data-linda-route]'));
        var progress = document.querySelector('.linda-progress');
        var choiceFrame = root.querySelector('.choice-block');
        var choiceButtons = Array.from(root.querySelectorAll('[data-linda-choice]'));
        var choiceReadout = document.getElementById('choice-readout');
        var sectionObserver = null;
        var lifecycleObserver = null;
        var sectionVisibility = new Map();
        var progressFrame = 0;
        var cleanedUp = false;

        function setActiveSection(section) {
            if (!section) return;

            sections.forEach(function (item) {
                item.classList.toggle('is-active', item === section);
            });

            routeLinks.forEach(function (link) {
                if (link.dataset.lindaRoute === section.dataset.lindaChapter) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        function updateActiveSection() {
            var active = sections
                .map(function (section) {
                    return { section: section, visibility: sectionVisibility.get(section) || 0 };
                })
                .sort(function (left, right) {
                    if (right.visibility !== left.visibility) return right.visibility - left.visibility;
                    return Math.abs(left.section.getBoundingClientRect().top) - Math.abs(right.section.getBoundingClientRect().top);
                })[0];

            if (active && active.visibility > 0) setActiveSection(active.section);
        }

        function updateProgress() {
            progressFrame = 0;
            if (!progress) return;

            var rootTop = root.getBoundingClientRect().top + window.scrollY;
            var distance = Math.max(1, root.scrollHeight - window.innerHeight);
            var current = window.scrollY - rootTop + window.innerHeight * 0.18;
            var ratio = Math.max(0, Math.min(1, current / distance));
            progress.style.setProperty('--linda-progress', ratio.toFixed(4));
        }

        function scheduleProgressUpdate() {
            if (progressFrame) return;
            progressFrame = window.requestAnimationFrame(updateProgress);
        }

        function chooseAnswer(event) {
            var selected = event.currentTarget;
            var answer = selected.dataset.lindaChoice;

            choiceButtons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button === selected));
            });

            choiceFrame.dataset.choiceResult = answer;
            if (answer === 'b') {
                choiceReadout.textContent = 'Correct: the broad event contains every version of the conjunction.';
            } else {
                choiceReadout.textContent = 'That is the tempting conjunction. The next view shows why it cannot win.';
            }
        }

        function cleanupLindaProblem() {
            if (cleanedUp) return;
            cleanedUp = true;
            if (sectionObserver) sectionObserver.disconnect();
            if (lifecycleObserver) lifecycleObserver.disconnect();
            if (progressFrame) window.cancelAnimationFrame(progressFrame);
            window.removeEventListener('scroll', scheduleProgressUpdate);
            window.removeEventListener('resize', scheduleProgressUpdate);
            choiceButtons.forEach(function (button) {
                button.removeEventListener('click', chooseAnswer);
            });
            routeLinks.forEach(function (link) {
                link.removeAttribute('aria-current');
            });
            if (window.__lindaProblemCleanup === cleanupLindaProblem) delete window.__lindaProblemCleanup;
        }

        window.__lindaProblemCleanup = cleanupLindaProblem;

        choiceButtons.forEach(function (button) {
            button.addEventListener('click', chooseAnswer);
        });

        if ('IntersectionObserver' in window) {
            sectionObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    sectionVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
                });
                updateActiveSection();
            }, {
                rootMargin: '-10% 0px -14% 0px',
                threshold: [0, 0.2, 0.4, 0.6, 0.8]
            });

            sections.forEach(function (section) {
                sectionObserver.observe(section);
            });
        } else {
            setActiveSection(sections[0]);
        }

        window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
        window.addEventListener('resize', scheduleProgressUpdate);
        updateProgress();
        setActiveSection(sections[0]);

        var contentHost = root.closest('.content');
        if ('MutationObserver' in window && contentHost) {
            lifecycleObserver = new MutationObserver(function () {
                if (!root.isConnected) cleanupLindaProblem();
            });
            lifecycleObserver.observe(contentHost, { childList: true });
        }
    }

    window.initLindaProblem = initLindaProblem;
    initLindaProblem();
}());

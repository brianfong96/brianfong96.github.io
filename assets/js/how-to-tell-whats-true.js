(function () {
    'use strict';

    function initTruthArticle() {
        var root = document.querySelector('.truth-article');
        if (!root || root.dataset.truthInitialized === 'true') return;
        if (window.__truthArticleCleanup) window.__truthArticleCleanup();
        root.dataset.truthInitialized = 'true';

        var links = Array.from(root.querySelectorAll('.truth-rail a'));
        var sections = links.map(function (link) { return root.querySelector(link.hash); });
        var frame = 0;

        function update() {
            frame = 0;
            var active = sections[0];
            sections.forEach(function (section) {
                if (section.getBoundingClientRect().top <= window.innerHeight * 0.3) active = section;
            });
            links.forEach(function (link) {
                if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }

        function schedule() {
            if (!frame) frame = window.requestAnimationFrame(update);
        }

        function cleanup() {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            window.cancelAnimationFrame(frame);
            lifecycle.disconnect();
            if (window.__truthArticleCleanup === cleanup) delete window.__truthArticleCleanup;
        }

        // The shared router replaces .content without reloading the document.
        var lifecycle = new MutationObserver(function () {
            if (!root.isConnected) cleanup();
        });
        lifecycle.observe(root.closest('.content'), { childList: true });
        window.__truthArticleCleanup = cleanup;
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        update();
    }

    window.initTruthArticle = initTruthArticle;
    initTruthArticle();
})();

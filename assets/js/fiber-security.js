(function () {
    'use strict';

    var root = document.querySelector('.fiber-article');
    if (!root || root.dataset.fiberInitialized === 'true') return;
    if (typeof window.__fiberSecurityCleanup === 'function') window.__fiberSecurityCleanup();
    root.dataset.fiberInitialized = 'true';

    var glossary = {};
    root.querySelectorAll('[data-glossary-term]').forEach(function (entry) {
        glossary[entry.dataset.glossaryTerm] = {
            title: entry.querySelector('dt').textContent.trim(),
            definition: entry.querySelector('dd').textContent.trim()
        };
    });

    var flowCopy = {
        downstream: '<strong>Downstream:</strong> the OLT broadcasts one optical stream through the splitter. Every ONT on that tree receives the light.',
        upstream: '<strong>Upstream:</strong> the OLT schedules tiny time slots. Each ONT transmits only during its assigned turn to avoid collisions.'
    };

    document.querySelectorAll('[data-flow-direction]').forEach(function (button) {
        button.addEventListener('click', function () {
            var direction = button.dataset.flowDirection;
            document.querySelectorAll('[data-flow-direction]').forEach(function (item) {
                item.setAttribute('aria-pressed', String(item === button));
            });
            document.querySelector('.topology-stage').dataset.direction = direction;
            document.getElementById('flow-readout').innerHTML = flowCopy[direction];
        });
    });

    var scenarios = {
        normal: {
            layers: { filter: ['Enforced', 'protected'], gpon: ['Enabled', 'protected'], tls: ['Enabled', 'protected'] },
            receives: 'The shared optical signal',
            receivesDetail: 'The neighboring ONT physically receives the downstream beam, but normal firmware discards GEM frames that are not assigned to it.',
            understands: 'Only its own assigned traffic',
            understandsDetail: 'Other subscribers\' payloads do not pass the local Port-ID filter.'
        },
        rogue: {
            layers: { filter: ['Bypassed', 'bypassed'], gpon: ['Enabled', 'protected'], tls: ['Enabled', 'protected'] },
            receives: 'Other subscribers\' GEM frames',
            receivesDetail: 'Modified firmware keeps frames that a normal ONT would discard and can record them for later analysis.',
            understands: 'Encrypted payloads plus traffic patterns',
            understandsDetail: 'Frame sizes, timing, active Port-IDs, and ciphertext may be visible. Correct GPON AES still protects subscriber payloads.'
        },
        'weak-pon': {
            layers: { filter: ['Bypassed', 'bypassed'], gpon: ['Absent', 'absent'], tls: ['Enabled', 'protected'] },
            receives: 'Ethernet and IP traffic from the tree',
            receivesDetail: 'Without downstream GPON encryption, the capture can expose network headers, unencrypted DNS, and plaintext legacy protocols.',
            understands: 'Metadata and TLS ciphertext',
            understandsDetail: 'HTTPS content remains encrypted end to end, but destination and traffic metadata may be more revealing.'
        },
        plaintext: {
            layers: { filter: ['Bypassed', 'bypassed'], gpon: ['Absent', 'absent'], tls: ['Absent', 'absent'] },
            receives: 'Unencrypted subscriber traffic',
            receivesDetail: 'The access-network and application encryption boundaries are both gone for the affected flow.',
            understands: 'Plaintext application content',
            understandsDetail: 'Legacy HTTP, Telnet, FTP, mail, or poorly protected IoT traffic can become readable. This is the high-severity case.'
        }
    };

    function setScenario(name) {
        var lab = document.querySelector('.exposure-lab');
        var scenario = scenarios[name];
        if (!lab || !scenario) return;

        lab.dataset.scenarioState = name;
        document.querySelectorAll('[data-scenario]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.scenario === name));
        });

        Object.keys(scenario.layers).forEach(function (layerName) {
            var layer = document.querySelector('[data-layer="' + layerName + '"]');
            var status = document.querySelector('[data-layer-status="' + layerName + '"]');
            var layerState = scenario.layers[layerName];
            layer.classList.toggle('is-bypassed', layerState[1] === 'bypassed');
            layer.classList.toggle('is-absent', layerState[1] === 'absent');
            status.textContent = layerState[0];
        });

        document.getElementById('attacker-receives').textContent = scenario.receives;
        document.getElementById('receives-detail').textContent = scenario.receivesDetail;
        document.getElementById('attacker-understands').textContent = scenario.understands;
        document.getElementById('understands-detail').textContent = scenario.understandsDetail;
    }

    document.querySelectorAll('[data-scenario]').forEach(function (button) {
        button.addEventListener('click', function () {
            setScenario(button.dataset.scenario);
        });
    });

    var scopes = {
        onu: {
            label: 'Same PON tree',
            title: 'Local, constrained, and potentially continuous',
            description: 'A rogue ONU must be optically connected to the relevant tree. It can keep receiving while its transmit laser is disabled, but it does not gain Internet-wide reach.',
            access: 'Compatible ONU on the same tree',
            scale: 'One shared optical group',
            concern: 'Confidentiality if encryption is weak'
        },
        tap: {
            label: 'One optical branch',
            title: 'A physical tap trades reach for stealth',
            description: 'A splitter inserted into accessible fiber infrastructure can copy light, but it adds loss and still depends on the tap location, optical budget, and encryption state.',
            access: 'Physical access to fiber plant',
            scale: 'One branch or tree segment',
            concern: 'Targeted interception'
        },
        olt: {
            label: 'Provider aggregation point',
            title: 'The OLT turns observation into control',
            description: 'An OLT manages traffic, provisioning, bandwidth, and often ONT firmware workflows. Compromise here can affect many optical trees rather than one local receiver.',
            access: 'OLT management or software flaw',
            scale: 'Many subscriber groups',
            concern: 'Critical control-plane compromise'
        },
        ems: {
            label: 'Multiple OLTs',
            title: 'Fleet management has the largest blast radius',
            description: 'An EMS can coordinate many OLTs. Quarkslab\'s 2026 lab research showed why unauthenticated flaws in this layer deserve priority even though it did not target live ISP networks.',
            access: 'Fleet-management foothold',
            scale: 'Multiple OLTs and their subscribers',
            concern: 'Potentially systemic compromise'
        }
    };

    function setScope(name) {
        var explorer = document.querySelector('.scope-explorer');
        var scope = scopes[name];
        if (!explorer || !scope) return;

        explorer.dataset.scopeState = name;
        document.querySelectorAll('[data-scope]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.scope === name));
        });
        document.getElementById('scope-label').textContent = scope.label;
        document.getElementById('scope-title').textContent = scope.title;
        document.getElementById('scope-description').textContent = scope.description;
        document.getElementById('scope-access').textContent = scope.access;
        document.getElementById('scope-scale').textContent = scope.scale;
        document.getElementById('scope-concern').textContent = scope.concern;
    }

    document.querySelectorAll('[data-scope]').forEach(function (button) {
        button.addEventListener('click', function () {
            setScope(button.dataset.scope);
        });
    });

    var popover = document.getElementById('fiber-term-popover');
    var popoverTitle = document.getElementById('term-popover-title');
    var popoverDefinition = document.getElementById('term-popover-definition');
    var activeTerm = null;
    var pinnedTerm = null;
    var hideTimer = null;
    var sectionObserver = null;
    var lifecycleObserver = null;
    var cleanedUp = false;

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            var termToFocus = activeTerm;
            hideTerm(true);
            if (termToFocus) termToFocus.focus();
        }
    }

    function handleOutsidePointer(event) {
        if (pinnedTerm && !popover.contains(event.target) && !event.target.closest('.term')) hideTerm(true);
    }

    function handleViewportChange() {
        if (activeTerm && !popover.hidden) positionPopover(activeTerm);
    }

    function cleanupFiberPage() {
        if (cleanedUp) return;
        cleanedUp = true;
        clearTimeout(hideTimer);
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('pointerdown', handleOutsidePointer);
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('scroll', handleViewportChange);
        if (sectionObserver) sectionObserver.disconnect();
        if (lifecycleObserver) lifecycleObserver.disconnect();
        activeTerm = null;
        pinnedTerm = null;
        if (window.__fiberSecurityCleanup === cleanupFiberPage) delete window.__fiberSecurityCleanup;
    }

    window.__fiberSecurityCleanup = cleanupFiberPage;

    function positionPopover(term) {
        var rect = term.getBoundingClientRect();
        var margin = 14;
        var width = Math.min(300, window.innerWidth - margin * 2);
        var left = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin);
        var top = rect.bottom + 10;
        popover.style.width = width + 'px';
        popover.style.left = left + 'px';
        popover.style.top = top + 'px';
        popover.hidden = false;

        var popoverRect = popover.getBoundingClientRect();
        if (popoverRect.bottom > window.innerHeight - margin && rect.top > popoverRect.height + margin) {
            popover.style.top = Math.max(margin, rect.top - popoverRect.height - 10) + 'px';
        }
    }

    function showTerm(term, pin) {
        var entry = glossary[term.dataset.term];
        if (!entry) return;
        clearTimeout(hideTimer);
        if (activeTerm && activeTerm !== term) activeTerm.classList.remove('is-active');
        activeTerm = term;
        if (pin) pinnedTerm = term;
        popoverTitle.textContent = entry.title;
        popoverDefinition.textContent = entry.definition;
        term.classList.add('is-active');
        positionPopover(term);
    }

    function hideTerm(force) {
        if (pinnedTerm && !force) return;
        if (activeTerm) activeTerm.classList.remove('is-active');
        activeTerm = null;
        pinnedTerm = null;
        popover.hidden = true;
    }

    function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (!popover.matches(':hover')) hideTerm(false);
        }, 140);
    }

    document.querySelectorAll('.term[data-term]').forEach(function (term) {
        term.addEventListener('pointerenter', function () { showTerm(term, false); });
        term.addEventListener('pointerleave', scheduleHide);
        term.addEventListener('focus', function () { showTerm(term, false); });
        term.addEventListener('blur', scheduleHide);
        term.addEventListener('click', function (event) {
            event.preventDefault();
            if (pinnedTerm === term) {
                hideTerm(true);
            } else {
                showTerm(term, true);
            }
        });
    });

    popover.addEventListener('pointerenter', function () { clearTimeout(hideTimer); });
    popover.addEventListener('pointerleave', scheduleHide);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('pointerdown', handleOutsidePointer);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { passive: true });

    var routeLinks = Array.from(document.querySelectorAll('[data-section-link]'));
    var observedSections = Array.from(document.querySelectorAll('[data-article-section]'));
    if ('IntersectionObserver' in window && routeLinks.length && observedSections.length) {
        sectionObserver = new IntersectionObserver(function (entries) {
            var visible = entries
                .filter(function (entry) { return entry.isIntersecting; })
                .sort(function (left, right) { return left.boundingClientRect.top - right.boundingClientRect.top; });
            if (!visible.length) return;
            var activeId = visible[0].target.id;
            routeLinks.forEach(function (link) {
                if (link.dataset.sectionLink === activeId) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
        observedSections.forEach(function (section) { sectionObserver.observe(section); });
    }

    var contentHost = root.closest('.content');
    if ('MutationObserver' in window && contentHost) {
        lifecycleObserver = new MutationObserver(function () {
            if (!root.isConnected) cleanupFiberPage();
        });
        lifecycleObserver.observe(contentHost, { childList: true });
    }
}());

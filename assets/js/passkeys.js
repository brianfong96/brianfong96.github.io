(function () {
    'use strict';

    var ceremonies = {
        register: {
            playLabel: 'Play registration',
            steps: [
                { title: 'Registration begins', description: 'The website asks the browser to create a new public-key credential for its RP ID.', name: 'Request', detail: 'Site asks to create a credential' },
                { title: 'A fresh challenge leaves the server', description: 'Random, single-use bytes bind the response to this registration attempt.', name: 'Challenge', detail: 'Server sends fresh random bytes' },
                { title: 'The browser binds the request to the origin', description: 'The browser checks that the requested RP ID is valid for the page that called WebAuthn.', name: 'Origin check', detail: 'Browser enforces the site boundary' },
                { title: 'The user approves on the authenticator', description: 'A local PIN, fingerprint, face, or touch authorizes the credential operation. It is not sent to the site.', name: 'Local approval', detail: 'PIN, biometric, or physical touch' },
                { title: 'The authenticator creates the key pair', description: 'The private key remains under authenticator control. The public key and credential ID are prepared for the site.', name: 'Key creation', detail: 'Private stays; public can travel' },
                { title: 'The server stores the public record', description: 'After verifying challenge, origin, RP ID hash, flags, and policy, the server saves the credential ID and public key.', name: 'Store public half', detail: 'Server verifies and saves the record' }
            ]
        },
        signin: {
            playLabel: 'Play sign-in',
            steps: [
                { title: 'Sign-in begins', description: 'The website requests a passkey assertion instead of asking for a reusable password.', name: 'Request', detail: 'Site requests an assertion' },
                { title: 'A new challenge leaves the server', description: 'A new random challenge makes an old captured assertion unusable.', name: 'Challenge', detail: 'Server sends one-time bytes' },
                { title: 'The real origin selects the credential', description: 'The browser and authenticator match only credentials scoped to this RP ID.', name: 'Site binding', detail: 'Fake domains cannot request it' },
                { title: 'The user authorizes the private-key operation', description: 'Local user presence and optional verification release use of the private key.', name: 'Local approval', detail: 'User presence and verification' },
                { title: 'The authenticator signs fresh context', description: 'It signs authenticator data joined with the hash of client data containing the challenge and origin.', name: 'Sign assertion', detail: 'Private key creates a signature' },
                { title: 'The server verifies and creates a session', description: 'The stored public key verifies the signature only after challenge, origin, RP ID, flags, and account checks pass.', name: 'Verify', detail: 'Public key accepts or rejects' }
            ]
        }
    };

    function initPasskeyArticle() {
        var root = document.getElementById('passkey-article');
        if (!root || root.dataset.passkeyInitialized === 'true') return;
        if (typeof window.__passkeyArticleCleanup === 'function') window.__passkeyArticleCleanup();

        root.dataset.passkeyInitialized = 'true';
        var controller = new AbortController();
        var signal = controller.signal;
        var lab = root.querySelector('.ceremony-lab');
        var playButton = document.getElementById('ceremony-play');
        var title = document.getElementById('ceremony-title');
        var description = document.getElementById('ceremony-description');
        var mode = 'register';
        var stage = 0;
        var playTimer = 0;
        var sectionObserver = null;
        var lifecycleObserver = null;
        var activeTerm = null;
        var pinnedTerm = null;
        var hideTimer = 0;
        var popover = document.getElementById('passkey-term-popover');
        var popoverTitle = document.getElementById('passkey-term-title');
        var popoverDefinition = document.getElementById('passkey-term-definition');

        function stopPlayback() {
            window.clearInterval(playTimer);
            playTimer = 0;
            playButton.textContent = stage === ceremonies[mode].steps.length - 1 ? 'Replay ' + (mode === 'register' ? 'registration' : 'sign-in') : ceremonies[mode].playLabel;
        }

        function cleanup() {
            controller.abort();
            stopPlayback();
            window.clearTimeout(hideTimer);
            if (sectionObserver) sectionObserver.disconnect();
            if (lifecycleObserver) lifecycleObserver.disconnect();
            if (window.__passkeyArticleCleanup === cleanup) delete window.__passkeyArticleCleanup;
        }

        window.__passkeyArticleCleanup = cleanup;

        function renderSteps() {
            var list = document.getElementById('ceremony-steps');
            list.innerHTML = ceremonies[mode].steps.map(function (item, index) {
                return [
                    '<li><button type="button" data-ceremony-step="' + index + '"' + (index === stage ? ' aria-current="step"' : '') + '>',
                    '<span>' + (index + 1) + '</span>',
                    '<strong>' + item.name + '</strong>',
                    '<small>' + item.detail + '</small>',
                    '</button></li>'
                ].join('');
            }).join('');
        }

        function setStage(nextStage, preservePlayback) {
            stage = Math.max(0, Math.min(ceremonies[mode].steps.length - 1, nextStage));
            var step = ceremonies[mode].steps[stage];
            lab.dataset.stage = String(stage);
            title.textContent = step.title;
            description.textContent = step.description;
            var mobilePositions = [2, 2, 1, 0, 0, 2];
            var mobileArtifacts = mode === 'register'
                ? ['Registration request starts', 'Challenge travels to the browser', 'Browser checks the site binding', 'Local approval reaches the authenticator', 'Private/public key pair is created', 'Public key reaches the website']
                : ['Sign-in request starts', 'Challenge travels to the browser', 'Browser selects the RP-scoped credential', 'Local approval reaches the authenticator', 'Private key creates the signature', 'Signature reaches the website'];
            document.getElementById('mobile-stage-artifact').textContent = mobileArtifacts[stage];
            root.querySelectorAll('[data-mobile-position]').forEach(function (item) {
                if (Number(item.dataset.mobilePosition) === mobilePositions[stage]) item.setAttribute('aria-current', 'step');
                else item.removeAttribute('aria-current');
            });
            root.querySelectorAll('[data-ceremony-step]').forEach(function (button) {
                if (Number(button.dataset.ceremonyStep) === stage) button.setAttribute('aria-current', 'step');
                else button.removeAttribute('aria-current');
            });
            if (!preservePlayback && playTimer) stopPlayback();
            if (!playTimer) {
                playButton.textContent = stage === ceremonies[mode].steps.length - 1
                    ? 'Replay ' + (mode === 'register' ? 'registration' : 'sign-in')
                    : ceremonies[mode].playLabel;
            }
        }

        function setMode(nextMode) {
            stopPlayback();
            mode = nextMode;
            stage = 0;
            lab.dataset.ceremony = mode;
            root.querySelectorAll('[data-ceremony-mode]').forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.ceremonyMode === mode));
            });
            renderSteps();
            setStage(0, false);
        }

        root.querySelectorAll('[data-ceremony-mode]').forEach(function (button) {
            button.addEventListener('click', function () {
                setMode(button.dataset.ceremonyMode);
            }, { signal: signal });
        });

        document.getElementById('ceremony-steps').addEventListener('click', function (event) {
            var button = event.target.closest('[data-ceremony-step]');
            if (button) setStage(Number(button.dataset.ceremonyStep), false);
        }, { signal: signal });

        playButton.addEventListener('click', function () {
            if (playTimer) {
                stopPlayback();
                return;
            }
            if (stage === ceremonies[mode].steps.length - 1) setStage(0, false);
            playButton.textContent = 'Pause';
            playTimer = window.setInterval(function () {
                if (stage >= ceremonies[mode].steps.length - 1) {
                    stopPlayback();
                    return;
                }
                setStage(stage + 1, true);
            }, 2400);
        }, { signal: signal });

        root.querySelectorAll('[data-quiz]').forEach(function (quiz) {
            var buttons = Array.from(quiz.querySelectorAll('[data-choice]'));
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var correct = button.dataset.choice === quiz.dataset.answer;
                    buttons.forEach(function (candidate) {
                        candidate.setAttribute('aria-pressed', String(candidate === button));
                        candidate.classList.toggle('is-correct', candidate === button && correct);
                        candidate.classList.toggle('is-incorrect', candidate === button && !correct);
                    });
                    quiz.querySelector('.quiz-feedback').textContent = correct
                        ? 'Correct. The protocol depends on this boundary.'
                        : button.dataset.feedback;
                }, { signal: signal });
            });
        });

        var glossary = {};
        root.querySelectorAll('[data-glossary-term]').forEach(function (entry) {
            glossary[entry.dataset.glossaryTerm] = {
                title: entry.querySelector('dt').textContent.trim(),
                definition: entry.querySelector('dd').textContent.trim()
            };
        });

        var aliases = [
            { label: 'public-key cryptography', key: 'public-key' },
            { label: 'discoverable credential', key: 'discoverable' },
            { label: 'signature counter', key: 'counter' },
            { label: 'user verification', key: 'user-verification' },
            { label: 'relying party', key: 'rp' },
            { label: 'private key', key: 'private-key' },
            { label: 'public key', key: 'public-key-value' },
            { label: 'authenticator', key: 'authenticator' },
            { label: 'attestation', key: 'attestation' },
            { label: 'assertion', key: 'assertion' },
            { label: 'challenge', key: 'challenge' },
            { label: 'RP ID', key: 'rp-id' },
            { label: 'origin', key: 'origin' },
            { label: 'passkey', key: 'passkey' },
            { label: 'passkeys', key: 'passkey' }
        ];
        aliases.sort(function (left, right) { return right.label.length - left.label.length; });

        function escapePattern(text) {
            return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        var expression = new RegExp('(^|[^A-Za-z0-9])(' + aliases.map(function (item) {
            return escapePattern(item.label);
        }).join('|') + ')(?=$|[^A-Za-z0-9])', 'gi');

        function keyForLabel(label) {
            var found = aliases.find(function (item) {
                return item.label.toLowerCase() === label.toLowerCase();
            });
            return found ? found.key : null;
        }

        function wrapTerms() {
            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            var nodes = [];
            var node;
            while ((node = walker.nextNode())) {
                var parent = node.parentElement;
                expression.lastIndex = 0;
                if (!parent || !parent.closest('p') || parent.closest('.term, .passkey-glossary, script, style, code, pre, svg')) continue;
                if (expression.test(node.nodeValue)) nodes.push(node);
            }

            nodes.forEach(function (textNode) {
                var text = textNode.nodeValue;
                var fragment = document.createDocumentFragment();
                var cursor = 0;
                var match;
                expression.lastIndex = 0;
                while ((match = expression.exec(text))) {
                    var prefix = match[1];
                    var label = match[2];
                    var start = match.index + prefix.length;
                    if (start > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, start)));
                    var key = keyForLabel(label);
                    var term = document.createElement('dfn');
                    term.className = 'term';
                    term.tabIndex = 0;
                    term.dataset.term = key;
                    term.setAttribute('role', 'button');
                    term.setAttribute('aria-label', label + ': ' + glossary[key].definition);
                    term.textContent = label;
                    fragment.appendChild(term);
                    cursor = start + label.length;
                    expression.lastIndex = cursor;
                }
                if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
                textNode.parentNode.replaceChild(fragment, textNode);
            });
        }

        function positionPopover(term) {
            var rect = term.getBoundingClientRect();
            var margin = 14;
            var width = Math.min(320, window.innerWidth - margin * 2);
            popover.style.width = width + 'px';
            popover.style.left = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin) + 'px';
            popover.style.top = rect.bottom + 10 + 'px';
            popover.hidden = false;
            var popoverRect = popover.getBoundingClientRect();
            if (popoverRect.bottom > window.innerHeight - margin && rect.top > popoverRect.height + margin) {
                popover.style.top = Math.max(margin, rect.top - popoverRect.height - 10) + 'px';
            }
        }

        function showTerm(term, pin) {
            var entry = glossary[term.dataset.term];
            if (!entry) return;
            window.clearTimeout(hideTimer);
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
            window.clearTimeout(hideTimer);
            hideTimer = window.setTimeout(function () {
                if (!popover.matches(':hover')) hideTerm(false);
            }, 120);
        }

        root.addEventListener('pointerover', function (event) {
            var term = event.target.closest('.term');
            if (term) showTerm(term, false);
        }, { signal: signal });
        root.addEventListener('pointerout', function (event) {
            if (event.target.closest('.term')) scheduleHide();
        }, { signal: signal });
        root.addEventListener('focusin', function (event) {
            var term = event.target.closest('.term');
            if (term) showTerm(term, false);
        }, { signal: signal });
        root.addEventListener('focusout', function (event) {
            if (event.target.closest('.term')) scheduleHide();
        }, { signal: signal });
        root.addEventListener('click', function (event) {
            var term = event.target.closest('.term');
            if (!term) return;
            event.preventDefault();
            if (pinnedTerm === term) hideTerm(true);
            else showTerm(term, true);
        }, { signal: signal });
        popover.addEventListener('pointerenter', function () {
            window.clearTimeout(hideTimer);
        }, { signal: signal });
        popover.addEventListener('pointerleave', scheduleHide, { signal: signal });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') hideTerm(true);
        }, { signal: signal });

        var routeLinks = Array.from(root.querySelectorAll('[data-section-link]'));
        var sections = routeLinks.map(function (link) {
            return document.getElementById(link.dataset.sectionLink);
        }).filter(Boolean);
        if ('IntersectionObserver' in window) {
            sectionObserver = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function (entry) { return entry.isIntersecting; })
                    .sort(function (left, right) { return right.intersectionRatio - left.intersectionRatio; });
                if (!visible.length) return;
                routeLinks.forEach(function (link) {
                    if (link.dataset.sectionLink === visible[0].target.id) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            }, { rootMargin: '-24% 0px -56% 0px', threshold: [0] });
            sections.forEach(function (section) { sectionObserver.observe(section); });
        }

        var contentHost = root.closest('.content');
        if (contentHost && 'MutationObserver' in window) {
            lifecycleObserver = new MutationObserver(function () {
                if (!root.isConnected) cleanup();
            });
            lifecycleObserver.observe(contentHost, { childList: true });
        }

        renderSteps();
        setStage(0, false);
        wrapTerms();
    }

    window.initPasskeyArticle = initPasskeyArticle;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPasskeyArticle);
    } else {
        initPasskeyArticle();
    }
}());

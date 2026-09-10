(function () {
    'use strict';

    function initOptionsVolatility() {
        var root = document.getElementById('options-guide');
        if (!root || root.dataset.optionsInitialized === 'true') return;
        if (typeof window.__optionsVolatilityCleanup === 'function') window.__optionsVolatilityCleanup();

        root.dataset.optionsInitialized = 'true';
        var controller = new AbortController();
        var signal = controller.signal;
        var sectionObserver = null;
        var lifecycleObserver = null;
        var hideTimer = 0;
        var activeTerm = null;
        var pinnedTerm = null;
        var popover = document.getElementById('options-term-popover');
        var popoverTitle = document.getElementById('options-term-title');
        var popoverDefinition = document.getElementById('options-term-definition');

        function cleanup() {
            controller.abort();
            window.clearTimeout(hideTimer);
            if (sectionObserver) sectionObserver.disconnect();
            if (lifecycleObserver) lifecycleObserver.disconnect();
            if (window.__optionsVolatilityCleanup === cleanup) delete window.__optionsVolatilityCleanup;
        }

        window.__optionsVolatilityCleanup = cleanup;

        root.querySelectorAll('[data-quiz]').forEach(function (quiz) {
            var buttons = Array.from(quiz.querySelectorAll('[data-quiz-choice]'));
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var correct = button.dataset.quizChoice === quiz.dataset.answer;
                    buttons.forEach(function (candidate) {
                        candidate.setAttribute('aria-pressed', String(candidate === button));
                        candidate.classList.toggle('is-correct', candidate === button && correct);
                        candidate.classList.toggle('is-incorrect', candidate === button && !correct);
                    });
                    quiz.querySelector('.quiz-answer').textContent = correct
                        ? quiz.dataset.correctFeedback
                        : button.dataset.feedback;
                }, { signal: signal });
            });
        });

        function renderHistory(data) {
            var chart = document.getElementById('msft-history-chart');
            var tableBody = document.getElementById('msft-history-body');
            if (!chart || !tableBody) return;

            var rows = data.callHistory;
            var width = 900;
            var left = 82;
            var right = 28;
            var plotWidth = width - left - right;
            var panelHeight = 104;
            var panelGap = 40;
            var top = 48;
            var chartSpecs = [
                { key: 'msft', title: 'MSFT closing price', prefix: '$', suffix: '', className: 'chart-stock', pointClass: 'stock-point', decimals: 2 },
                { key: 'call', title: '$490 call last price', prefix: '$', suffix: '', className: 'chart-call', pointClass: 'call-point', decimals: 2 },
                { key: 'iv', title: 'Call implied volatility', prefix: '', suffix: '%', className: 'chart-iv', pointClass: 'iv-point', decimals: 3 },
                { key: 'itmProbability', title: 'Estimated probability above $490', prefix: '', suffix: '%', className: 'chart-probability', pointClass: 'probability-point', decimals: 1 }
            ];

            function x(index) {
                return left + (plotWidth * index / (rows.length - 1));
            }

            function formatDate(date) {
                var parts = date.split('-');
                return Number(parts[1]) + '/' + Number(parts[2]);
            }

            var panels = chartSpecs.map(function (spec, panelIndex) {
                var values = rows.map(function (row) { return row[spec.key]; });
                var minimum = Math.min.apply(Math, values);
                var maximum = Math.max.apply(Math, values);
                var padding = Math.max((maximum - minimum) * 0.14, maximum * 0.01);
                var low = minimum - padding;
                var high = maximum + padding;
                var yTop = top + panelIndex * (panelHeight + panelGap);

                function y(value) {
                    return yTop + panelHeight - ((value - low) / (high - low)) * panelHeight;
                }

                var points = values.map(function (value, index) {
                    return x(index).toFixed(1) + ',' + y(value).toFixed(1);
                }).join(' ');
                var circles = values.map(function (value, index) {
                    var label = rows[index].date + ': ' + spec.prefix + value.toFixed(spec.decimals) + spec.suffix;
                    return '<circle class="' + spec.pointClass + '" data-history-index="' + index + '" cx="' + x(index).toFixed(1) + '" cy="' + y(value).toFixed(1) +
                        '" r="5"><title>' + label + '</title></circle>';
                }).join('');

                return [
                    '<g>',
                    '<text class="chart-title" x="18" y="' + (yTop - 13) + '">' + spec.title + '</text>',
                    '<line class="chart-grid" x1="' + left + '" y1="' + yTop + '" x2="' + (width - right) + '" y2="' + yTop + '"></line>',
                    '<line class="chart-grid" x1="' + left + '" y1="' + (yTop + panelHeight) + '" x2="' + (width - right) + '" y2="' + (yTop + panelHeight) + '"></line>',
                    '<text x="18" y="' + (yTop + 12) + '">' + spec.prefix + maximum.toFixed(spec.decimals) + spec.suffix + '</text>',
                    '<text x="18" y="' + (yTop + panelHeight) + '">' + spec.prefix + minimum.toFixed(spec.decimals) + spec.suffix + '</text>',
                    '<polyline class="' + spec.className + '" points="' + points + '"></polyline>',
                    circles,
                    '</g>'
                ].join('');
            }).join('');

            var dateLabels = rows.map(function (row, index) {
                return '<text x="' + x(index).toFixed(1) + '" y="630" text-anchor="middle">' + formatDate(row.date) + '</text>';
            }).join('');
            var step = plotWidth / (rows.length - 1);
            var hitZones = rows.map(function (row, index) {
                var start = index === 0 ? left - step / 2 : x(index) - step / 2;
                return '<rect class="history-hit-zone" data-history-index="' + index + '" x="' + Math.max(0, start).toFixed(1) +
                    '" y="20" width="' + step.toFixed(1) + '" height="610"></rect>';
            }).join('');

            chart.innerHTML = [
                '<svg viewBox="0 0 900 650" role="img" aria-labelledby="history-title history-desc">',
                '<title id="history-title">MSFT and October 9 490 dollar call history</title>',
                '<desc id="history-desc">Four aligned line charts show MSFT close, call price, implied volatility, and estimated probability of finishing above 490 dollars from August 27 through September 9, 2026.</desc>',
                panels,
                '<line class="history-crosshair" data-history-crosshair x1="' + x(rows.length - 1) + '" y1="20" x2="' + x(rows.length - 1) + '" y2="610"></line>',
                dateLabels,
                hitZones,
                '</svg>'
            ].join('');

            tableBody.innerHTML = rows.map(function (row) {
                return [
                    '<tr>',
                    '<th scope="row">' + row.date + '</th>',
                    '<td>$' + row.msft.toFixed(2) + '</td>',
                    '<td>$' + row.call.toFixed(2) + '</td>',
                    '<td>' + row.iv.toFixed(3) + '%</td>',
                    '<td>' + row.itmProbability.toFixed(1) + '%</td>',
                    '<td>' + row.daysLeft + '</td>',
                    '</tr>'
                ].join('');
            }).join('');
            chart.dataset.rendered = 'true';

            renderGreekHistory(rows);
            initializeLinkedHistory(rows);
        }

        function renderGreekHistory(rows) {
            var chart = document.getElementById('msft-greek-history-chart');
            var tableBody = document.getElementById('msft-greek-history-body');
            if (!chart || !tableBody) return;

            var width = 900;
            var left = 82;
            var right = 28;
            var plotWidth = width - left - right;
            var panelHeight = 82;
            var panelGap = 42;
            var top = 44;
            var specs = [
                { key: 'delta', title: 'Estimated Delta', decimals: 4, className: 'greek-delta' },
                { key: 'gamma', title: 'Estimated Gamma', decimals: 5, className: 'greek-gamma' },
                { key: 'theta', title: 'Estimated Theta', decimals: 4, className: 'greek-theta' },
                { key: 'vega', title: 'Estimated Vega', decimals: 4, className: 'greek-vega' },
                { key: 'rho', title: 'Estimated Rho', decimals: 4, className: 'greek-rho' }
            ];

            function x(index) {
                return left + (plotWidth * index / (rows.length - 1));
            }

            var panels = specs.map(function (spec, panelIndex) {
                var values = rows.map(function (row) { return row.greeks[spec.key]; });
                var minimum = Math.min.apply(Math, values);
                var maximum = Math.max.apply(Math, values);
                var padding = Math.max((maximum - minimum) * 0.14, Math.abs(maximum) * 0.01, 0.0001);
                var low = minimum - padding;
                var high = maximum + padding;
                var yTop = top + panelIndex * (panelHeight + panelGap);

                function y(value) {
                    return yTop + panelHeight - ((value - low) / (high - low)) * panelHeight;
                }

                var points = values.map(function (value, index) {
                    return x(index).toFixed(1) + ',' + y(value).toFixed(1);
                }).join(' ');
                var circles = values.map(function (value, index) {
                    var label = rows[index].date + ': ' + spec.title + ' ' + value.toFixed(spec.decimals);
                    return '<circle class="' + spec.className + '-point" data-history-index="' + index + '" cx="' + x(index).toFixed(1) + '" cy="' + y(value).toFixed(1) +
                        '" r="4"><title>' + label + '</title></circle>';
                }).join('');

                return [
                    '<g>',
                    '<text class="chart-title" x="18" y="' + (yTop - 13) + '">' + spec.title + '</text>',
                    '<line class="chart-grid" x1="' + left + '" y1="' + yTop + '" x2="' + (width - right) + '" y2="' + yTop + '"></line>',
                    '<line class="chart-grid" x1="' + left + '" y1="' + (yTop + panelHeight) + '" x2="' + (width - right) + '" y2="' + (yTop + panelHeight) + '"></line>',
                    '<text x="18" y="' + (yTop + 12) + '">' + maximum.toFixed(spec.decimals) + '</text>',
                    '<text x="18" y="' + (yTop + panelHeight) + '">' + minimum.toFixed(spec.decimals) + '</text>',
                    '<polyline class="' + spec.className + '" points="' + points + '"></polyline>',
                    circles,
                    '</g>'
                ].join('');
            }).join('');

            var dateLabels = rows.map(function (row, index) {
                var parts = row.date.split('-');
                return '<text x="' + x(index).toFixed(1) + '" y="685" text-anchor="middle">' + Number(parts[1]) + '/' + Number(parts[2]) + '</text>';
            }).join('');
            var step = plotWidth / (rows.length - 1);
            var hitZones = rows.map(function (row, index) {
                var start = index === 0 ? left - step / 2 : x(index) - step / 2;
                return '<rect class="history-hit-zone" data-history-index="' + index + '" x="' + Math.max(0, start).toFixed(1) +
                    '" y="20" width="' + step.toFixed(1) + '" height="665"></rect>';
            }).join('');

            chart.innerHTML = [
                '<svg viewBox="0 0 900 705" role="img" aria-labelledby="greek-history-title greek-history-desc">',
                '<title id="greek-history-title">Estimated historical Greeks for the MSFT October 9 490 dollar call</title>',
                '<desc id="greek-history-desc">Five aligned charts show Black-Scholes estimates of Delta, Gamma, Theta, Vega, and Rho from August 27 through September 9, 2026.</desc>',
                panels,
                '<line class="history-crosshair" data-history-crosshair x1="' + x(rows.length - 1) + '" y1="20" x2="' + x(rows.length - 1) + '" y2="665"></line>',
                dateLabels,
                hitZones,
                '</svg>'
            ].join('');

            tableBody.innerHTML = rows.map(function (row) {
                return [
                    '<tr>',
                    '<th scope="row">' + row.date + '</th>',
                    '<td>' + row.greeks.delta.toFixed(4) + '</td>',
                    '<td>' + row.greeks.gamma.toFixed(5) + '</td>',
                    '<td>' + row.greeks.theta.toFixed(4).replace('-', '−') + '</td>',
                    '<td>' + row.greeks.vega.toFixed(4) + '</td>',
                    '<td>' + row.greeks.rho.toFixed(4) + '</td>',
                    '</tr>'
                ].join('');
            }).join('');
            chart.dataset.rendered = 'true';
        }

        function initializeLinkedHistory(rows) {
            var charts = Array.from(document.querySelectorAll('#msft-history-chart, #msft-greek-history-chart'));
            var plotLeft = 82;
            var plotWidth = 790;
            var selectedIndex = rows.length - 1;

            function x(index) {
                return plotLeft + (plotWidth * index / (rows.length - 1));
            }

            function formatDate(date) {
                return new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            function selectIndex(index) {
                selectedIndex = Math.max(0, Math.min(rows.length - 1, index));
                var row = rows[selectedIndex];
                document.querySelectorAll('[data-history-crosshair]').forEach(function (line) {
                    line.setAttribute('x1', x(selectedIndex).toFixed(1));
                    line.setAttribute('x2', x(selectedIndex).toFixed(1));
                });
                document.querySelectorAll('circle[data-history-index]').forEach(function (point) {
                    point.classList.toggle('is-selected', Number(point.dataset.historyIndex) === selectedIndex);
                });
                document.getElementById('cross-date').textContent = formatDate(row.date);
                document.getElementById('cross-observed').textContent =
                    'MSFT $' + row.msft.toFixed(2) + ' · Call $' + row.call.toFixed(2) + ' · IV ' + row.iv.toFixed(3) +
                    '% · Above strike ' + row.itmProbability.toFixed(1) + '% · ' + row.daysLeft + ' days';
                document.getElementById('cross-greeks').textContent =
                    'Delta ' + row.greeks.delta.toFixed(4) + ' · Gamma ' + row.greeks.gamma.toFixed(5) +
                    ' · Theta ' + row.greeks.theta.toFixed(4).replace('-', '−') + ' · Vega ' + row.greeks.vega.toFixed(4) +
                    ' · Rho ' + row.greeks.rho.toFixed(4);
            }

            charts.forEach(function (chart) {
                chart.tabIndex = 0;
                chart.setAttribute('aria-describedby', 'history-chart-instructions history-cross-readout');
                chart.addEventListener('pointermove', function (event) {
                    var zone = event.target.closest('[data-history-index]');
                    if (zone) selectIndex(Number(zone.dataset.historyIndex));
                }, { signal: signal });
                chart.addEventListener('click', function (event) {
                    var zone = event.target.closest('[data-history-index]');
                    if (zone) selectIndex(Number(zone.dataset.historyIndex));
                }, { signal: signal });
                chart.addEventListener('keydown', function (event) {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                        selectIndex(selectedIndex + (event.key === 'ArrowRight' ? 1 : -1));
                    }
                }, { signal: signal });
            });

            selectIndex(selectedIndex);
        }

        function showHistoryError(message) {
            var chart = document.getElementById('msft-history-chart');
            if (!chart) return;
            chart.classList.add('is-error');
            chart.textContent = message;
        }

        fetch(new URL('../../assets/data/msft-options-snapshot.json', window.location.href), { signal: signal })
            .then(function (response) {
                if (!response.ok) throw new Error('Snapshot request returned ' + response.status + '.');
                return response.json();
            })
            .then(renderHistory)
            .catch(function (error) {
                if (error.name !== 'AbortError') {
                    showHistoryError('The historical MSFT snapshot could not be loaded. Reload the page to try again.');
                }
            });

        var glossary = {};
        var patterns = [];
        root.querySelectorAll('[data-glossary-term]').forEach(function (entry) {
            var key = entry.dataset.glossaryTerm;
            var aliases = (entry.dataset.aliases || '').split(',').map(function (alias) {
                return alias.trim();
            }).filter(Boolean);
            glossary[key] = {
                title: entry.querySelector('dt').textContent.trim(),
                definition: entry.querySelector('dd').textContent.trim()
            };
            [key].concat(aliases).forEach(function (label) {
                patterns.push({ label: label, key: key });
            });
        });
        patterns.sort(function (left, right) { return right.label.length - left.label.length; });

        function escapePattern(text) {
            return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        var expression = new RegExp('(^|[^A-Za-z0-9])(' + patterns.map(function (item) {
            return escapePattern(item.label);
        }).join('|') + ')(?=$|[^A-Za-z0-9])', 'gi');

        function keyForLabel(label) {
            var match = patterns.find(function (item) {
                return item.label.toLowerCase() === label.toLowerCase();
            });
            return match ? match.key : null;
        }

        function wrapGlossaryTerms() {
            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            var nodes = [];
            var node;
            while ((node = walker.nextNode())) {
                expression.lastIndex = 0;
                var parent = node.parentElement;
                if (!parent || !parent.closest('p') || parent.closest('.term, .glossary-source, script, style, code, pre, svg')) continue;
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
        document.addEventListener('pointerdown', function (event) {
            if (pinnedTerm && !popover.contains(event.target) && !event.target.closest('.term')) hideTerm(true);
        }, { signal: signal });

        var navLinks = Array.from(root.querySelectorAll('[data-section-link]'));
        var sections = navLinks.map(function (link) {
            return document.getElementById(link.dataset.sectionLink);
        }).filter(Boolean);
        if ('IntersectionObserver' in window) {
            sectionObserver = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function (entry) {
                    return entry.isIntersecting;
                }).sort(function (left, right) {
                    return right.intersectionRatio - left.intersectionRatio;
                });
                if (!visible.length) return;
                navLinks.forEach(function (link) {
                    if (link.dataset.sectionLink === visible[0].target.id) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            }, { rootMargin: '-18% 0px -62% 0px', threshold: [0] });
            sections.forEach(function (section) { sectionObserver.observe(section); });
        }

        var contentHost = root.closest('.content');
        if (contentHost && 'MutationObserver' in window) {
            lifecycleObserver = new MutationObserver(function () {
                if (!root.isConnected) cleanup();
            });
            lifecycleObserver.observe(contentHost, { childList: true });
        }

        wrapGlossaryTerms();
    }

    window.initOptionsVolatility = initOptionsVolatility;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptionsVolatility);
    } else {
        initOptionsVolatility();
    }
}());

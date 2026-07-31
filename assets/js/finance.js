(function () {
    'use strict';

    var companies = [
        { id: 'microsoft', name: 'Microsoft', operatingCash: 55.44, capex: 35.80, freeCashFlow: 19.64 },
        { id: 'meta', name: 'Meta', operatingCash: 31.86, capex: 31.08, freeCashFlow: 0.78 },
        { id: 'alphabet', name: 'Alphabet', operatingCash: 39.07, capex: 44.92, freeCashFlow: -5.86 },
        { id: 'amazon', name: 'Amazon', operatingCash: 45.39, capex: 53.08, freeCashFlow: -7.69 }
    ];

    var metrics = {
        revenue: {
            title: 'Revenue',
            summary: 'Amazon generated the most revenue by scale. Meta grew fastest, while Alphabet added more than $23B year over year.',
            values: [90.01, 60.80, 119.80, 200.61],
            displays: ['$90.01B', '$60.80B', '$119.80B', '$200.61B'],
            notes: [
                'Microsoft added $13.57B of revenue, up 17.7%.',
                'Meta added $13.29B of revenue, the fastest growth rate at 28.0%.',
                'Alphabet added $23.37B of revenue, up 24.2%.',
                'Amazon added $32.90B—the largest absolute increase.'
            ]
        },
        revenueGrowth: {
            title: 'Revenue growth',
            summary: 'Meta led consolidated growth, followed by Alphabet. Amazon still added the most revenue in absolute dollars.',
            values: [17.7, 28.0, 24.2, 19.6],
            displays: ['+17.7%', '+28.0%', '+24.2%', '+19.6%'],
            notes: [
                'Microsoft revenue increased by $13.57B.',
                'Meta posted the fastest consolidated revenue growth.',
                'Alphabet revenue increased by $23.37B.',
                'Amazon revenue increased by $32.90B.'
            ]
        },
        operatingMargin: {
            title: 'Operating margin',
            summary: 'Microsoft converted nearly half of revenue into operating income. Amazon grew operating profit fastest but remained the lowest-margin business.',
            values: [45.1, 30.9, 34.0, 13.7],
            displays: ['45.1%', '30.9%', '34.0%', '13.7%'],
            notes: [
                'Highest margin in the group, up from 44.9%.',
                'Down from 43.0%, including legal and severance charges.',
                'Up from 32.4% as total operating income grew 30.4%.',
                'Up from 11.4%; operating income grew 43.2%.'
            ]
        },
        cloudGrowth: {
            title: 'Cloud growth',
            summary: 'Google Cloud grew almost twice as fast as Azure and more than twice as fast as AWS. Meta does not report an external cloud business.',
            values: [43, null, 81.8, 36.8],
            displays: ['+43%', 'N/A', '+81.8%', '+36.8%'],
            notes: [
                'Azure and other cloud services growth; exact Azure revenue is not disclosed.',
                'Meta infrastructure primarily supports its own products rather than external cloud customers.',
                'Google Cloud revenue reached $24.77B and operating profit reached $8.81B.',
                'AWS revenue reached $42.23B with $16.62B of operating income.'
            ]
        },
        operatingCash: {
            title: 'Operating cash flow',
            summary: 'Every company generated substantial positive operating cash. The key difference is how much remained after infrastructure spending.',
            values: [55.44, 31.86, 39.07, 45.39],
            displays: ['$55.44B', '$31.86B', '$39.07B', '$45.39B'],
            notes: [
                'Highest operating cash flow in the group, up 30.0%.',
                'Up 24.7% despite unusual operating expenses.',
                'Up 40.8%, but below quarterly cash capex.',
                'Up 39.6%, but below property purchases used in FCF.'
            ]
        },
        capex: {
            title: 'Capex used for free cash flow',
            summary: 'All four accelerated infrastructure spending. Alphabet and Amazon each increased capex by more than $21B year over year.',
            values: [35.80, 31.08, 44.92, 53.08],
            displays: ['$35.80B', '$31.08B', '$44.92B', '$53.08B'],
            notes: [
                'Cash property and equipment purchases increased 109.6%.',
                'Includes finance-lease principal payments; increased 82.7%.',
                'Cash property and equipment purchases increased 100.1%.',
                'Property purchases net of sales and incentives increased 69.2%.'
            ]
        },
        freeCashFlow: {
            title: 'Quarterly free cash flow',
            summary: 'Microsoft retained material cash after capex. Meta barely stayed positive; Alphabet and Amazon spent more than quarterly operating cash flow.',
            values: [19.64, 0.78, -5.86, -7.69],
            displays: ['+$19.64B', '+$0.78B', '−$5.86B', '−$7.69B'],
            notes: [
                '21.8% of revenue remained as free cash flow.',
                'Only 1.3% of revenue remained after infrastructure spending.',
                'Quarterly capex exceeded operating cash flow by $5.86B.',
                'Quarterly and trailing-12-month free cash flow were negative.'
            ]
        },
        marketMove: {
            title: 'Post-earnings stock move',
            summary: 'Microsoft received the strongest response. Meta and Alphabet sold off, while Amazon\'s next-session response remains pending.',
            values: [15.5, -8.0, -7.1, null],
            displays: ['+15.5%', '−8.0%', '−7.1%', 'Pending'],
            notes: [
                'July 30 close of $451.10 versus $390.54 on July 29.',
                'July 30 close of $539.03 versus $585.61 on July 29.',
                'July 23 close of $317.69 versus $342.09 on July 22.',
                'Amazon released after the July 30 close; the July 31 response is not yet available.'
            ]
        },
        trailingPe: {
            title: 'Trailing price-to-earnings ratio',
            summary: 'Microsoft carried the highest reported P/E. Alphabet looked cheaper on reported earnings, but its denominator includes a large investment gain; Amazon remains pending.',
            values: [25.1, 21.3, 15.9, null],
            displays: ['25.1×', '21.3×', '15.9×', 'Pending'],
            notes: [
                'July 30 price divided by $17.95 of reported trailing EPS.',
                'Reported trailing P/E as of July 30.',
                'July 23 price divided by $19.93 of reported trailing EPS; the $99B pre-tax equity gain lowers this multiple.',
                'Amazon\'s post-release price and trailing P/E remain pending.'
            ]
        }
    };

    function createElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) element.className = className;
        if (typeof text === 'string') element.textContent = text;
        return element;
    }

    function renderMetric(metricId) {
        var metric = metrics[metricId];
        var expanded = document.getElementById('scanner-expanded');
        var title = document.getElementById('expanded-title');
        var summary = document.getElementById('expanded-summary');
        var tracks = document.getElementById('company-tracks');
        if (!metric || !expanded || !title || !summary || !tracks) return;

        var numericValues = metric.values.filter(function (value) { return typeof value === 'number'; });
        var maximum = Math.max.apply(Math, numericValues.map(function (value) { return Math.abs(value); }));
        var hasNegative = numericValues.some(function (value) { return value < 0; });

        title.textContent = metric.title;
        summary.textContent = metric.summary;
        tracks.innerHTML = '';

        companies.forEach(function (company, index) {
            var value = metric.values[index];
            var row = createElement('div', 'company-track');
            var name = createElement('span', 'company-name', company.name);
            var shell = createElement('div', 'track-shell');
            var bar = createElement('span', 'track-bar');
            var mark = createElement('button', 'value-mark', metric.displays[index]);
            var tooltip = createElement('span', 'metric-tooltip', metric.notes[index]);

            mark.type = 'button';
            mark.setAttribute('aria-label', company.name + ': ' + metric.displays[index] + '. ' + metric.notes[index]);
            mark.appendChild(tooltip);
            if (hasNegative) shell.classList.add('is-signed');

            if (value === null) {
                bar.classList.add('is-na');
                bar.style.setProperty('--track-ratio', '1');
            } else {
                bar.style.setProperty('--track-ratio', String(Math.max(0.025, Math.abs(value) / maximum)));
                if (value < 0) {
                    bar.classList.add('is-negative');
                    mark.classList.add('is-negative');
                } else if (hasNegative) {
                    bar.classList.add('is-positive');
                }
            }

            shell.appendChild(bar);
            row.appendChild(name);
            row.appendChild(shell);
            row.appendChild(mark);
            tracks.appendChild(row);
        });

        expanded.classList.remove('is-updating');
        void expanded.offsetWidth;
        expanded.classList.add('is-updating');
    }

    function setSelectedMetric(button) {
        document.querySelectorAll('[data-metric]').forEach(function (candidate) {
            var selected = candidate === button;
            candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
            var row = candidate.closest('tr');
            if (row) row.classList.toggle('is-selected', selected);
        });
        renderMetric(button.getAttribute('data-metric'));
    }

    function renderCashFlowMap() {
        var container = document.getElementById('cash-flow-map');
        if (!container || container.dataset.rendered === 'true') return;
        container.dataset.rendered = 'true';

        var rows = companies.map(function (company, index) {
            var y = 92 + index * 112;
            var center = y + 24;
            var absorbed = Math.min(company.operatingCash, company.capex);
            var absorbedWidth = 10 + (absorbed / 55.44) * 24;
            var outcomeWidth = 5 + (Math.abs(company.freeCashFlow) / 19.64) * 13;
            var outcomeClass = company.freeCashFlow < 0 ? 'gap' : 'residual';
            var valueClass = company.freeCashFlow < 0 ? 'flow-value flow-negative' : 'flow-value';
            var outcomeNodeClass = company.freeCashFlow < 0 ? 'flow-node outcome-negative' : 'flow-node';
            var outcomeLabel = company.freeCashFlow < 0 ? 'CAPEX ABOVE OCF' : 'FREE CASH FLOW';
            var fcfDisplay = company.freeCashFlow < 0
                ? '−$' + Math.abs(company.freeCashFlow).toFixed(2) + 'B'
                : '+$' + company.freeCashFlow.toFixed(2) + 'B';
            var ratio = (company.capex / company.operatingCash * 100).toFixed(1);
            var aria = company.name + ': $' + company.operatingCash.toFixed(2) + ' billion operating cash flow, $' +
                company.capex.toFixed(2) + ' billion capex, ' + fcfDisplay + ' quarterly free cash flow. Capex was ' + ratio + '% of operating cash flow.';

            return [
                '<g class="flow-group" tabindex="0" role="img" aria-label="' + aria + '">',
                '<title>' + aria + '</title>',
                '<path class="flow-path" d="M 168 ' + center + ' C 270 ' + center + ', 330 ' + center + ', 432 ' + center + '" stroke-width="' + absorbedWidth.toFixed(1) + '"></path>',
                '<path class="flow-path ' + outcomeClass + '" d="' +
                    (company.freeCashFlow < 0
                        ? 'M 780 ' + center + ' C 704 ' + center + ', 650 ' + center + ', 576 ' + center
                        : 'M 168 ' + center + ' C 380 ' + center + ', 600 ' + center + ', 780 ' + center) +
                    '" stroke-width="' + outcomeWidth.toFixed(1) + '"' +
                    (company.freeCashFlow < 0 ? ' marker-end="url(#negative-arrow)"' : '') + '></path>',
                '<rect class="flow-node" x="20" y="' + y + '" width="148" height="48" rx="8"></rect>',
                '<rect class="flow-node" x="432" y="' + y + '" width="144" height="48" rx="8"></rect>',
                '<rect class="' + outcomeNodeClass + '" x="780" y="' + y + '" width="176" height="48" rx="8"></rect>',
                '<text x="34" y="' + (y + 20) + '">' + company.name.toUpperCase() + '</text>',
                '<text class="flow-value" x="34" y="' + (y + 39) + '">$' + company.operatingCash.toFixed(2) + 'B</text>',
                '<text class="flow-muted" x="444" y="' + (y + 19) + '">CAPEX · ' + ratio + '% OF OCF</text>',
                '<text class="flow-value" x="444" y="' + (y + 39) + '">$' + company.capex.toFixed(2) + 'B</text>',
                '<text class="flow-muted" x="794" y="' + (y + 19) + '">' + outcomeLabel + '</text>',
                '<text class="' + valueClass + '" x="794" y="' + (y + 39) + '">' + fcfDisplay + '</text>',
                '</g>'
            ].join('');
        }).join('');

        container.innerHTML = [
            '<svg viewBox="0 0 980 560" role="group" aria-labelledby="cash-flow-map-title cash-flow-map-desc">',
            '<title id="cash-flow-map-title">Operating cash flow to capital expenditure comparison</title>',
            '<desc id="cash-flow-map-desc">Four focusable company rows compare operating cash flow, capex, and remaining or negative quarterly free cash flow.</desc>',
            '<defs><marker id="negative-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>',
            '<text class="flow-muted" x="20" y="42">OPERATING CASH FLOW</text>',
            '<text class="flow-muted" x="432" y="42">INFRASTRUCTURE ABSORPTION</text>',
            '<text class="flow-muted" x="780" y="42">QUARTERLY OUTCOME</text>',
            rows,
            '</svg>'
        ].join('');
    }

    function initializeRail() {
        var links = Array.from(document.querySelectorAll('.finance-rail a[href^="#"]'));
        var sections = links.map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        }).filter(Boolean);
        if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });

        sections.forEach(function (section) { observer.observe(section); });
    }

    function initFinanceArticle() {
        var scanner = document.getElementById('scanner');
        if (!scanner || scanner.dataset.financeInitialized === 'true') return;
        scanner.dataset.financeInitialized = 'true';

        scanner.querySelectorAll('[data-metric]').forEach(function (button) {
            button.addEventListener('click', function () { setSelectedMetric(button); });
        });

        renderMetric('freeCashFlow');
        renderCashFlowMap();
        initializeRail();
    }

    window.initFinanceArticle = initFinanceArticle;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFinanceArticle);
    } else {
        initFinanceArticle();
    }
})();

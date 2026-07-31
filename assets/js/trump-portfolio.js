(function () {
    'use strict';

    var DATA_PATH = '../../assets/data/trump-portfolio-snapshot.json';
    var HOLDINGS_PATH = '../../assets/data/trump-stock-holdings.json';
    var currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    var textCollator = new Intl.Collator('en-US', { numeric: true, sensitivity: 'base' });

    function createElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) element.className = className;
        if (typeof text === 'string') element.textContent = text;
        return element;
    }

    function formatMillions(value) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
    }

    function renderSectors(sectors) {
        var chart = document.getElementById('sector-chart');
        if (!chart) return;
        chart.innerHTML = '';
        var maximum = Math.max.apply(Math, sectors.map(function (sector) { return sector.minimumValue; }));

        sectors.forEach(function (sector) {
            var row = createElement('div', 'sector-row');
            var name = createElement('span', 'sector-name', sector.name);
            var track = createElement('span', 'sector-track');
            var bar = createElement('span', 'sector-bar');
            var value = createElement('strong', 'sector-value', formatMillions(sector.minimumValue));
            bar.style.setProperty('--bar-size', (sector.minimumValue / maximum * 100).toFixed(2) + '%');
            track.appendChild(bar);
            row.appendChild(name);
            row.appendChild(track);
            row.appendChild(value);
            chart.appendChild(row);
        });
    }

    function renderActivity(months) {
        var chart = document.getElementById('activity-chart');
        var controls = Array.from(document.querySelectorAll('[data-activity-series]'));
        if (!chart || !controls.length) return;

        function draw(series) {
            var values = months.map(function (month) {
                if (series === 'purchases') return month.purchases;
                if (series === 'sales') return month.sales;
                return month.purchases + month.sales;
            });
            var maximum = Math.max.apply(Math, values);
            chart.innerHTML = '';

            months.forEach(function (month, index) {
                var column = createElement('div', 'activity-month');
                var bars = createElement('div', 'activity-bars');
                var purchase = createElement('span', 'activity-bar is-purchase');
                var sale = createElement('span', 'activity-bar is-sale');
                var total = month.purchases + month.sales;
                var label = createElement('strong', 'activity-total', String(values[index]));
                var monthLabel = createElement('span', 'activity-label', month.month);

                purchase.style.setProperty('--bar-scale', series === 'sales' ? '0' : String(month.purchases / maximum));
                sale.style.setProperty('--bar-scale', series === 'purchases' ? '0' : String(month.sales / maximum));
                bars.setAttribute('aria-label', month.month + ': ' + month.purchases + ' purchases and ' + month.sales + ' sales, ' + total + ' total events');
                bars.setAttribute('role', 'img');
                bars.appendChild(purchase);
                bars.appendChild(sale);
                column.appendChild(label);
                column.appendChild(bars);
                column.appendChild(monthLabel);
                chart.appendChild(column);
            });
        }

        controls.forEach(function (button) {
            button.addEventListener('click', function () {
                controls.forEach(function (candidate) {
                    candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
                });
                draw(button.getAttribute('data-activity-series'));
            });
        });

        draw('all');
    }

    function renderDistribution(buckets) {
        var chart = document.getElementById('distribution-chart');
        if (!chart) return;
        chart.innerHTML = '';
        var maximum = Math.max.apply(Math, buckets.map(function (bucket) { return bucket.count; }));

        buckets.forEach(function (bucket) {
            var row = createElement('div', 'distribution-row');
            var label = createElement('span', 'distribution-label', bucket.label);
            var track = createElement('span', 'distribution-track');
            var bar = createElement('span', 'distribution-bar is-' + bucket.side);
            var count = createElement('strong', 'distribution-count', String(bucket.count));
            bar.style.setProperty('--distribution-size', (bucket.count / maximum * 50).toFixed(2) + '%');
            track.appendChild(bar);
            row.appendChild(label);
            row.appendChild(track);
            row.appendChild(count);
            chart.appendChild(row);
        });
    }

    function formatAssetType(value) {
        if (value === 'etf') return 'Equity ETF';
        if (value === 'preferred_stock') return 'Preferred';
        return 'Stock';
    }

    function formatReturn(value) {
        if (value === null || typeof value === 'undefined') return 'N/A';
        return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
    }

    function appendOption(select, value, label) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    }

    function renderHoldingRow(holding) {
        var row = document.createElement('tr');
        var symbol = createElement('th', '', holding.symbol);
        var company = createElement('td', 'is-company', holding.company);
        var industry = createElement('span', '', holding.industry || 'Industry unavailable');
        var type = createElement('td', '', formatAssetType(holding.assetType));
        var sector = createElement('td', '', holding.sector || 'Unclassified');
        var minimum = createElement('td', 'is-numeric', currencyFormatter.format(holding.valueMin));
        var maximum = createElement('td', 'is-numeric', currencyFormatter.format(holding.valueMax));
        var performanceClass = 'is-numeric ';
        if (holding.ytdPercent > 0) performanceClass += 'is-positive';
        else if (holding.ytdPercent < 0) performanceClass += 'is-negative';
        else if (holding.ytdPercent === null) performanceClass += 'is-unavailable';
        var performance = createElement('td', performanceClass.trim(), formatReturn(holding.ytdPercent));
        var purchases = createElement('td', 'is-numeric', holding.purchaseCount.toLocaleString('en-US'));
        var sales = createElement('td', 'is-numeric', holding.saleCount.toLocaleString('en-US'));

        symbol.scope = 'row';
        company.appendChild(industry);
        row.appendChild(symbol);
        row.appendChild(company);
        row.appendChild(type);
        row.appendChild(sector);
        row.appendChild(minimum);
        row.appendChild(maximum);
        row.appendChild(performance);
        row.appendChild(purchases);
        row.appendChild(sales);
        return row;
    }

    function initHoldingsExplorer(data) {
        var explorer = document.getElementById('holdings-explorer');
        var body = document.getElementById('holdings-body');
        var search = document.getElementById('holdings-search');
        var type = document.getElementById('holdings-type');
        var sector = document.getElementById('holdings-sector');
        var performance = document.getElementById('holdings-performance');
        var account = document.getElementById('holdings-account');
        var minimum = document.getElementById('holdings-minimum');
        var reset = document.getElementById('holdings-reset');
        var count = document.getElementById('holdings-count');
        var summary = document.getElementById('holdings-summary');
        var pageSize = document.getElementById('holdings-page-size');
        var previous = document.getElementById('holdings-previous');
        var next = document.getElementById('holdings-next');
        var pageStatus = document.getElementById('holdings-page-status');
        var sortButtons = Array.from(document.querySelectorAll('[data-sort]'));
        var holdings = data.holdings;

        if (!explorer || !body || !search || !holdings || !holdings.length) {
            throw new Error('Complete holdings explorer markup or data is missing');
        }

        Array.from(new Set(holdings.map(function (holding) { return holding.sector; })))
            .filter(Boolean)
            .sort(textCollator.compare)
            .forEach(function (name) { appendOption(sector, name, name); });

        Array.from(new Set(holdings.reduce(function (values, holding) {
            return values.concat(holding.accounts);
        }, [])))
            .sort(function (a, b) { return a - b; })
            .forEach(function (number) { appendOption(account, String(number), 'Account ' + number); });

        var state = {
            query: '',
            type: 'all',
            sector: 'all',
            performance: 'all',
            account: 'all',
            minimum: 0,
            sortKey: 'valueMin',
            sortDirection: 'desc',
            page: 1,
            pageSize: 50
        };

        function matchesPerformance(holding) {
            if (state.performance === 'all') return true;
            if (state.performance === 'positive') return holding.ytdPercent > 0;
            if (state.performance === 'negative') return holding.ytdPercent < 0;
            if (state.performance === 'flat') return holding.ytdPercent === 0;
            return holding.ytdPercent === null;
        }

        function compareHoldings(left, right) {
            var leftValue = left[state.sortKey];
            var rightValue = right[state.sortKey];
            if (leftValue === null || typeof leftValue === 'undefined') return rightValue === null || typeof rightValue === 'undefined' ? 0 : 1;
            if (rightValue === null || typeof rightValue === 'undefined') return -1;

            var comparison = typeof leftValue === 'string'
                ? textCollator.compare(leftValue, rightValue)
                : leftValue - rightValue;
            if (comparison === 0) comparison = textCollator.compare(left.symbol, right.symbol);
            return state.sortDirection === 'desc' ? comparison * -1 : comparison;
        }

        function updateSortLabels() {
            sortButtons.forEach(function (button) {
                var key = button.getAttribute('data-sort');
                var heading = button.closest('th');
                var indicator = button.querySelector('.sort-indicator');
                heading.removeAttribute('aria-sort');
                indicator.textContent = '';
                if (key !== state.sortKey) return;
                heading.setAttribute('aria-sort', state.sortDirection === 'desc' ? 'descending' : 'ascending');
                indicator.textContent = state.sortDirection === 'desc' ? '\u2193' : '\u2191';
            });
        }

        function render() {
            var query = state.query.toLowerCase();
            var filtered = holdings.filter(function (holding) {
                var searchText = [holding.symbol, holding.company, holding.industry, holding.sector].join(' ').toLowerCase();
                return (!query || searchText.indexOf(query) !== -1)
                    && (state.type === 'all' || holding.assetType === state.type)
                    && (state.sector === 'all' || holding.sector === state.sector)
                    && (state.account === 'all' || holding.accounts.indexOf(Number(state.account)) !== -1)
                    && holding.valueMin >= state.minimum
                    && matchesPerformance(holding);
            }).sort(compareHoldings);

            var totalPages = state.pageSize === Infinity ? 1 : Math.max(1, Math.ceil(filtered.length / state.pageSize));
            state.page = Math.min(state.page, totalPages);
            var start = state.pageSize === Infinity ? 0 : (state.page - 1) * state.pageSize;
            var visible = state.pageSize === Infinity ? filtered : filtered.slice(start, start + state.pageSize);
            var end = filtered.length ? start + visible.length : 0;

            body.innerHTML = '';
            if (!visible.length) {
                var emptyRow = document.createElement('tr');
                var emptyCell = createElement('td', 'holdings-empty', 'No securities match these filters. Reset or broaden the search.');
                emptyCell.colSpan = 9;
                emptyRow.appendChild(emptyCell);
                body.appendChild(emptyRow);
            } else {
                var fragment = document.createDocumentFragment();
                visible.forEach(function (holding) { fragment.appendChild(renderHoldingRow(holding)); });
                body.appendChild(fragment);
            }

            count.textContent = filtered.length.toLocaleString('en-US') + (filtered.length === 1 ? ' security' : ' securities');
            summary.textContent = filtered.length
                ? 'Showing ' + (start + 1).toLocaleString('en-US') + '-' + end.toLocaleString('en-US') + ' of ' + filtered.length.toLocaleString('en-US') + ' matches'
                : 'Showing 0 of 0 matches';
            pageStatus.textContent = 'Page ' + state.page + ' of ' + totalPages;
            previous.disabled = state.page <= 1;
            next.disabled = state.page >= totalPages;
            updateSortLabels();
            explorer.dataset.state = 'ready';
        }

        var searchTimer;
        search.addEventListener('input', function () {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(function () {
                state.query = search.value.trim();
                state.page = 1;
                render();
            }, 120);
        });

        [
            [type, 'type'],
            [sector, 'sector'],
            [performance, 'performance'],
            [account, 'account']
        ].forEach(function (binding) {
            binding[0].addEventListener('change', function () {
                state[binding[1]] = binding[0].value;
                state.page = 1;
                render();
            });
        });

        minimum.addEventListener('change', function () {
            state.minimum = Number(minimum.value);
            state.page = 1;
            render();
        });

        pageSize.addEventListener('change', function () {
            state.pageSize = pageSize.value === 'all' ? Infinity : Number(pageSize.value);
            state.page = 1;
            render();
        });

        sortButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var key = button.getAttribute('data-sort');
                if (state.sortKey === key) {
                    state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortKey = key;
                    state.sortDirection = ['symbol', 'company', 'assetType', 'sector'].indexOf(key) !== -1 ? 'asc' : 'desc';
                }
                state.page = 1;
                render();
            });
        });

        previous.addEventListener('click', function () {
            if (state.page <= 1) return;
            state.page -= 1;
            render();
        });

        next.addEventListener('click', function () {
            state.page += 1;
            render();
        });

        reset.addEventListener('click', function () {
            window.clearTimeout(searchTimer);
            search.value = '';
            type.value = 'all';
            sector.value = 'all';
            performance.value = 'all';
            account.value = 'all';
            minimum.value = '0';
            pageSize.value = '50';
            state.query = '';
            state.type = 'all';
            state.sector = 'all';
            state.performance = 'all';
            state.account = 'all';
            state.minimum = 0;
            state.sortKey = 'valueMin';
            state.sortDirection = 'desc';
            state.page = 1;
            state.pageSize = 50;
            render();
            search.focus();
        });

        render();
    }

    function showHoldingsError() {
        var explorer = document.getElementById('holdings-explorer');
        var body = document.getElementById('holdings-body');
        var count = document.getElementById('holdings-count');
        var summary = document.getElementById('holdings-summary');
        if (explorer) explorer.dataset.state = 'error';
        if (count) count.textContent = 'Holdings unavailable';
        if (summary) summary.textContent = 'Download the CSV or JSON file directly to inspect the complete static snapshot.';
        if (body) body.innerHTML = '<tr><td colspan="9" class="holdings-empty">The complete holdings dataset could not be loaded.</td></tr>';
    }

    function showLoadError() {
        ['sector-chart', 'activity-chart', 'distribution-chart'].forEach(function (id) {
            var chart = document.getElementById(id);
            if (!chart) return;
            chart.innerHTML = '';
            chart.appendChild(createElement('p', 'snapshot-error', 'The static snapshot could not be loaded. Use the JSON download to inspect the captured data.'));
        });
    }

    function initTrumpDisclosure() {
        var article = document.getElementById('trump-disclosure');
        if (!article || article.dataset.disclosureInitialized === 'true') return;
        article.dataset.disclosureInitialized = 'true';

        var dataUrl = new URL(DATA_PATH, window.location.href);
        fetch(dataUrl.href)
            .then(function (response) {
                if (!response.ok) throw new Error('Static snapshot request failed with ' + response.status);
                return response.json();
            })
            .then(function (data) {
                renderSectors(data.sectors);
                renderActivity(data.monthlyTransactions);
                renderDistribution(data.ytdDistribution);
                article.dataset.snapshotState = 'ready';
            })
            .catch(function (error) {
                article.dataset.snapshotState = 'error';
                showLoadError();
                console.error('Trump portfolio snapshot failed to load:', error);
            });

        var holdingsUrl = new URL(HOLDINGS_PATH, window.location.href);
        fetch(holdingsUrl.href)
            .then(function (response) {
                if (!response.ok) throw new Error('Static holdings request failed with ' + response.status);
                return response.json();
            })
            .then(function (data) {
                initHoldingsExplorer(data);
                article.dataset.holdingsState = 'ready';
            })
            .catch(function (error) {
                article.dataset.holdingsState = 'error';
                showHoldingsError();
                console.error('Trump holdings snapshot failed to load:', error);
            });
    }

    window.initTrumpDisclosure = initTrumpDisclosure;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrumpDisclosure);
    } else {
        initTrumpDisclosure();
    }
})();

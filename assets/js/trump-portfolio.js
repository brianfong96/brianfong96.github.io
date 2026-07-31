(function () {
    'use strict';

    var DATA_PATH = '../../assets/data/trump-portfolio-snapshot.json';

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
    }

    window.initTrumpDisclosure = initTrumpDisclosure;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrumpDisclosure);
    } else {
        initTrumpDisclosure();
    }
})();

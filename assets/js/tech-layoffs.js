(function () {
    'use strict';

    var cleanupHandle = null;

    function createElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) element.className = className;
        if (typeof text === 'string') element.textContent = text;
        return element;
    }

    function formatCompact(value) {
        if (value >= 1000) {
            var thousands = value / 1000;
            var digits = Number.isInteger(thousands) ? 0 : 1;
            return thousands.toFixed(digits) + 'k';
        }
        return value.toLocaleString('en-US');
    }

    function prettyQuarter(quarter) {
        return quarter.replace('-', ' ');
    }

    function normalizeLabel(label) {
        return String(label).replace(/>=/g, '\u2265');
    }

    function validateData(data) {
        if (!data || !Array.isArray(data.companies) || !Array.isArray(data.events) || !Array.isArray(data.quarters)) {
            throw new Error('The layoff dataset is missing its companies, events, or quarters.');
        }

        var companyIds = new Set();
        data.companies.forEach(function (company) {
            if (!company.id || !company.name || companyIds.has(company.id)) {
                throw new Error('The layoff dataset contains an invalid or duplicate company.');
            }
            companyIds.add(company.id);
        });

        var eventIds = new Set();
        var quarterIds = new Set(data.quarters);
        data.events.forEach(function (event) {
            if (!event.id || eventIds.has(event.id)) {
                throw new Error('The layoff dataset contains an invalid or duplicate event.');
            }
            if (!companyIds.has(event.company) || !quarterIds.has(event.quarter)) {
                throw new Error('Layoff event "' + event.id + '" references an unknown company or quarter.');
            }
            if (event.count !== null && (!Number.isFinite(event.count) || event.count < 0)) {
                throw new Error('Layoff event "' + event.id + '" has an invalid count.');
            }
            eventIds.add(event.id);
        });
    }

    function isWithinWindow(event, windowDefinition, quarterIndex) {
        var eventIndex = quarterIndex[event.quarter];
        return eventIndex >= quarterIndex[windowDefinition.start] && eventIndex <= quarterIndex[windowDefinition.end];
    }

    function getStats(data, companyId, windowDefinition, quarterIndex) {
        var events = data.events.filter(function (event) {
            return event.company === companyId
                && !event.excluded
                && isWithinWindow(event, windowDefinition, quarterIndex);
        });
        var total = events.reduce(function (sum, event) {
            return event.countable === false || event.count === null ? sum : sum + event.count;
        }, 0);
        var unknown = events.some(function (event) {
            return event.qualifier === 'unknown' || event.count === null;
        });
        var quarters = new Set(events.map(function (event) { return event.quarter; }));

        return {
            events: events,
            total: total,
            unknown: unknown,
            cadence: quarters.size
        };
    }

    function renderHero(data, root, quarterIndex) {
        var container = root.querySelector('[data-hero-ranking]');
        if (!container) return;

        var fullWindow = data.windows.full;
        var stats = data.companies.map(function (company) {
            return {
                company: company,
                stats: getStats(data, company.id, fullWindow, quarterIndex)
            };
        }).sort(function (left, right) {
            return right.stats.total - left.stats.total;
        });
        var maximum = Math.max.apply(Math, stats.map(function (entry) { return entry.stats.total; }).concat([1]));

        container.innerHTML = '';
        stats.forEach(function (entry) {
            var row = createElement('div', 'hero-rank-row');
            var name = createElement('strong', '', entry.company.name.replace(' / Alphabet', ''));
            var track = createElement('span', 'hero-rank-track');
            var bar = createElement('i');
            var output = createElement('output', '', normalizeLabel(entry.company.fullTotalLabel));

            row.dataset.company = entry.company.id;
            bar.style.setProperty('--rank-ratio', String(entry.stats.total / maximum));
            track.appendChild(bar);
            row.appendChild(name);
            row.appendChild(track);
            row.appendChild(output);
            container.appendChild(row);
        });
    }

    function initTechLayoffs() {
        var root = document.querySelector('.layoffs-article');
        if (!root || root.dataset.layoffsInitialized === 'true') return;
        if (typeof cleanupHandle === 'function') cleanupHandle();

        var errorBox = root.querySelector('[data-layoffs-error]');
        var data = window.techLayoffsData;
        try {
            validateData(data);
        } catch (error) {
            root.dataset.layoffsState = 'error';
            if (errorBox) {
                errorBox.hidden = false;
                errorBox.textContent = error.message + ' The static tables remain available below.';
            }
            console.error(error);
            return;
        }

        root.dataset.layoffsInitialized = 'true';
        root.dataset.layoffsState = 'ready';
        if (errorBox) errorBox.hidden = true;

        var state = {
            windowId: 'full',
            metric: 'jobs',
            companyId: 'amazon'
        };
        var quarterIndex = {};
        data.quarters.forEach(function (quarter, index) { quarterIndex[quarter] = index; });
        var companyById = {};
        data.companies.forEach(function (company) { companyById[company.id] = company; });

        var comparisonTitle = root.querySelector('[data-comparison-title]');
        var comparisonSummary = root.querySelector('[data-comparison-summary]');
        var comparisonChart = root.querySelector('[data-comparison-chart]');
        var comparisonAxis = root.querySelector('[data-comparison-axis]');
        var timelineTitle = root.querySelector('[data-timeline-title]');
        var timelineSummary = root.querySelector('[data-timeline-summary]');
        var timelineViewport = root.querySelector('.timeline-viewport');
        var timelineAxis = root.querySelector('[data-timeline-axis]');
        var timelineChart = root.querySelector('[data-timeline-chart]');
        var timelineEvents = root.querySelector('[data-timeline-events]');
        var portraitTitle = root.querySelector('[data-portrait-title]');
        var portraitCopy = root.querySelector('[data-portrait-copy]');
        var portraitMechanism = root.querySelector('[data-portrait-mechanism]');
        var portraitAffected = root.querySelector('[data-portrait-affected]');
        var portraitRisk = root.querySelector('[data-portrait-risk]');
        var sectionObserver = null;
        var lifecycleObserver = null;
        var scrollFrame = null;
        var cleanedUp = false;

        function getWindowDefinition() {
            return data.windows[state.windowId];
        }

        function displayValue(company, stats) {
            if (state.metric === 'cadence') {
                return {
                    label: stats.cadence + (stats.cadence === 1 ? ' quarter' : ' quarters'),
                    note: stats.unknown ? 'includes U quarters' : 'quantified quarters'
                };
            }
            if (stats.total === 0 && !stats.unknown) {
                return {
                    label: 'None',
                    note: 'no substantiated program found'
                };
            }
            if (state.windowId === 'full') {
                return {
                    label: normalizeLabel(company.fullTotalLabel),
                    note: stats.unknown ? 'undisclosed rounds excluded' : 'quantified public cuts'
                };
            }
            return {
                label: (stats.total ? formatCompact(stats.total) : '0') + (stats.unknown ? ' + U' : ''),
                note: stats.unknown ? 'known count plus undisclosed' : 'quantified public cuts'
            };
        }

        function renderComparisonAxis(maximum) {
            if (!comparisonAxis) return;
            var title = state.metric === 'jobs' ? 'Employees affected' : 'Quarters with public evidence';
            var midpoint = state.metric === 'jobs' ? maximum / 2 : Math.ceil(maximum / 2);
            var values = [0, midpoint, maximum];
            var ticks = createElement('div');

            comparisonAxis.innerHTML = '';
            comparisonAxis.appendChild(createElement('span', 'axis-title', title));
            values.forEach(function (value) {
                ticks.appendChild(createElement('span', '', state.metric === 'jobs' ? formatCompact(value) : String(value)));
            });
            comparisonAxis.appendChild(ticks);
            comparisonAxis.setAttribute('aria-label', title + ', scale from 0 to ' + values[2]);
        }

        function comparisonTooltip(company, stats, display) {
            if (state.metric === 'cadence' || stats.total === 0) {
                return company.name + ': ' + display.label;
            }
            return company.name + ': ' + stats.total.toLocaleString('en-US') + ' quantified'
                + (stats.unknown ? ' + undisclosed rounds' : '');
        }

        function renderComparison() {
            var windowDefinition = getWindowDefinition();
            var entries = data.companies.map(function (company) {
                return {
                    company: company,
                    stats: getStats(data, company.id, windowDefinition, quarterIndex)
                };
            });
            var valueKey = state.metric === 'jobs' ? 'total' : 'cadence';
            entries.sort(function (left, right) {
                return right.stats[valueKey] - left.stats[valueKey];
            });
            var maximum = Math.max.apply(Math, entries.map(function (entry) {
                return entry.stats[valueKey];
            }).concat([1]));

            comparisonTitle.textContent = state.metric === 'jobs'
                ? 'Quantified cuts in ' + windowDefinition.label
                : 'Quarters with public layoff evidence';
            comparisonSummary.textContent = state.metric === 'jobs'
                ? windowDefinition.description + ' Unknown totals are marked U and never converted into invented estimates. Select a company row to carry it into the timeline and pattern sections.'
                : 'Cadence counts quarters containing a public reduction report, including quarters whose total remained undisclosed. It measures recurrence, not severity. Select a company row to carry it into the timeline and pattern sections.';
            comparisonChart.innerHTML = '';

            entries.forEach(function (entry) {
                var value = entry.stats[valueKey];
                var display = displayValue(entry.company, entry.stats);
                var row = createElement('button', 'comparison-row');
                var name = createElement('span', 'comparison-name', entry.company.name);
                var track = createElement('span', 'comparison-track');
                var bar = createElement('span', 'comparison-bar');
                var tooltip = createElement('span', 'chart-tooltip comparison-tooltip', comparisonTooltip(entry.company, entry.stats, display));
                var output = createElement('span', 'comparison-value', display.label);
                var note = createElement('small', '', display.note);

                row.type = 'button';
                row.dataset.company = entry.company.id;
                row.dataset.companyChoice = entry.company.id;
                row.classList.toggle('is-selected', entry.company.id === state.companyId);
                row.setAttribute('aria-pressed', String(entry.company.id === state.companyId));
                row.setAttribute('aria-label', entry.company.name + ': ' + display.label + '. ' + display.note + '. Focus this company.');
                bar.style.setProperty('--comparison-ratio', String(value / maximum));
                track.appendChild(bar);
                track.appendChild(tooltip);
                output.appendChild(note);
                row.appendChild(name);
                row.appendChild(track);
                row.appendChild(output);
                comparisonChart.appendChild(row);
            });
            renderComparisonAxis(maximum);

            root.querySelectorAll('[data-window]').forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.window === state.windowId));
            });
            root.querySelectorAll('[data-metric]').forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.metric === state.metric));
            });
        }

        function renderTimeline() {
            var company = companyById[state.companyId];
            var companyEvents = data.events.filter(function (event) {
                return event.company === state.companyId;
            });
            var eventsByQuarter = {};
            companyEvents.forEach(function (event) {
                if (!eventsByQuarter[event.quarter]) eventsByQuarter[event.quarter] = [];
                eventsByQuarter[event.quarter].push(event);
            });
            var knownTotals = data.quarters.map(function (quarter) {
                return (eventsByQuarter[quarter] || []).reduce(function (sum, event) {
                    return event.countable === false || event.count === null ? sum : sum + event.count;
                }, 0);
            });
            var maximumCount = Math.max.apply(Math, knownTotals.concat([0]));
            var scaleMaximum = Math.max(1, maximumCount);

            timelineTitle.textContent = company.name + ' across 23 quarters';
            timelineSummary.textContent = company.headline + ' Bar height uses a square-root scale so smaller disclosed events remain visible; outlined marks contain undisclosed or excluded evidence.';
            timelineChart.innerHTML = '';

            data.quarters.forEach(function (quarter, index) {
                var quarterEvents = eventsByQuarter[quarter] || [];
                var knownTotal = knownTotals[index];
                var hasUnknown = quarterEvents.some(function (event) {
                    return event.count === null || event.countable === false || event.qualifier === 'unknown';
                });
                var cell = createElement('div', 'timeline-cell');
                var mark = createElement('div', 'timeline-mark');
                var bar = createElement('span', 'timeline-bar');
                var time = createElement('time', '', prettyQuarter(quarter));
                var eventLabels = quarterEvents.map(function (event) { return normalizeLabel(event.countLabel) + ' ' + event.title; });
                var aria = prettyQuarter(quarter) + ': ' + (eventLabels.length ? eventLabels.join('; ') : 'no substantiated public layoff program found');
                var tooltip = eventLabels.length
                    ? createElement('span', 'chart-tooltip timeline-tooltip', prettyQuarter(quarter) + ': ' + eventLabels.join('; '))
                    : null;

                cell.classList.toggle('has-known', knownTotal > 0);
                cell.classList.toggle('has-unknown', hasUnknown);
                cell.setAttribute('role', 'img');
                cell.setAttribute('aria-label', aria);
                if (tooltip) cell.tabIndex = 0;
                var timelineRatio = knownTotal > 0
                    ? Math.sqrt(knownTotal) / Math.sqrt(scaleMaximum)
                    : (hasUnknown ? 0.06 : 0);
                bar.style.setProperty('--timeline-ratio', String(timelineRatio));
                mark.appendChild(bar);
                if (tooltip) mark.appendChild(tooltip);
                cell.appendChild(mark);
                cell.appendChild(time);
                timelineChart.appendChild(cell);
            });
            renderTimelineAxis(maximumCount);

            if (window.innerWidth <= 760 && timelineViewport) {
                var firstEventIndex = data.quarters.findIndex(function (quarter) {
                    return Boolean(eventsByQuarter[quarter] && eventsByQuarter[quarter].length);
                });
                if (firstEventIndex >= 0) {
                    window.requestAnimationFrame(function () {
                        var firstEventCell = timelineChart.children[firstEventIndex];
                        timelineViewport.scrollLeft = Math.max(0, firstEventCell.offsetLeft - 52);
                    });
                }
            }

            function renderTimelineAxis(maximum) {
                if (!timelineAxis) return;
                var title = 'Employees affected (square-root scale)';
                var values = [maximum, Math.round(maximum * 0.25), 0];
                var classes = ['is-max', 'is-mid', 'is-zero'];

                timelineAxis.innerHTML = '';
                timelineAxis.appendChild(createElement('span', 'axis-title', title));
                timelineAxis.classList.toggle('is-empty', maximum === 0);
                if (maximum === 0) {
                    timelineAxis.appendChild(createElement('span', 'axis-empty', 'No quantified events'));
                    timelineAxis.setAttribute('aria-label', title + ', no quantified events');
                    return;
                }
                values.forEach(function (value, index) {
                    var tick = createElement('div', 'axis-tick ' + classes[index]);
                    tick.appendChild(createElement('span', '', formatCompact(value)));
                    timelineAxis.appendChild(tick);
                });
                timelineAxis.setAttribute('aria-label', title + ', scale from 0 to ' + maximum);
            }

            timelineEvents.innerHTML = '';
            if (!companyEvents.length) {
                var empty = createElement('li');
                var emptyTime = createElement('time', '', '2021-2026');
                var emptyCopy = createElement('span');
                emptyCopy.appendChild(createElement('strong', '', 'No substantiated mass-layoff program found'));
                emptyCopy.appendChild(document.createTextNode(' Public evidence can establish an absence of announcements, not prove that no individual reductions occurred.'));
                empty.appendChild(emptyTime);
                empty.appendChild(emptyCopy);
                timelineEvents.appendChild(empty);
            } else {
                companyEvents.forEach(function (event) {
                    var item = createElement('li');
                    var time = createElement('time', '', prettyQuarter(event.quarter));
                    var copy = createElement('span');
                    var heading = createElement('strong', '', normalizeLabel(event.countLabel) + ' - ' + event.title);
                    var detail = document.createTextNode(' ' + event.detail + ' ');
                    copy.appendChild(heading);
                    copy.appendChild(detail);
                    (event.sourceIds || []).forEach(function (sourceId, sourceIndex) {
                        var source = createElement('a', '', sourceIndex ? 'Additional source' : 'Source');
                        source.href = '#' + sourceId;
                        if (sourceIndex) copy.appendChild(document.createTextNode(' / '));
                        copy.appendChild(source);
                    });
                    item.appendChild(time);
                    item.appendChild(copy);
                    timelineEvents.appendChild(item);
                });
            }
        }

        function renderPortrait() {
            var company = companyById[state.companyId];
            portraitTitle.textContent = company.headline;
            portraitCopy.textContent = company.profile;
            portraitMechanism.textContent = company.mechanism;
            portraitAffected.textContent = company.affected;
            portraitRisk.textContent = company.risk;

            root.querySelectorAll('[data-company-choice]').forEach(function (button) {
                var selected = button.dataset.companyChoice === state.companyId;
                button.setAttribute('aria-pressed', String(selected));
                button.classList.toggle('is-selected', selected);
            });
        }

        function setCompany(companyId) {
            if (!companyById[companyId]) {
                throw new Error('Unknown company selection: ' + companyId);
            }
            state.companyId = companyId;
            renderComparison();
            renderTimeline();
            renderPortrait();
        }

        function handleClick(event) {
            var windowButton = event.target.closest('[data-window]');
            if (windowButton && root.contains(windowButton)) {
                if (!data.windows[windowButton.dataset.window]) {
                    throw new Error('Unknown comparison window: ' + windowButton.dataset.window);
                }
                state.windowId = windowButton.dataset.window;
                renderComparison();
                return;
            }

            var metricButton = event.target.closest('[data-metric]');
            if (metricButton && root.contains(metricButton)) {
                if (metricButton.dataset.metric !== 'jobs' && metricButton.dataset.metric !== 'cadence') {
                    throw new Error('Unknown comparison metric: ' + metricButton.dataset.metric);
                }
                state.metric = metricButton.dataset.metric;
                renderComparison();
                return;
            }

            var companyButton = event.target.closest('[data-company-choice]');
            if (companyButton && root.contains(companyButton)) {
                setCompany(companyButton.dataset.companyChoice);
            }
        }

        function handleChange(event) {
            var routeSelect = event.target.closest('[data-mobile-route]');
            if (!routeSelect || !root.contains(routeSelect)) return;
            var section = document.getElementById(routeSelect.value);
            if (!section) throw new Error('Unknown article section: ' + routeSelect.value);
            section.scrollIntoView();
        }

        function updateProgress() {
            scrollFrame = null;
            var articleRect = root.getBoundingClientRect();
            var travel = Math.max(1, root.offsetHeight - window.innerHeight);
            var progress = Math.min(1, Math.max(0, -articleRect.top / travel));
            document.documentElement.style.setProperty('--layoffs-progress', String(progress));
        }

        function handleScroll() {
            if (scrollFrame !== null) return;
            scrollFrame = window.requestAnimationFrame(updateProgress);
        }

        function cleanup() {
            if (cleanedUp) return;
            cleanedUp = true;
            root.removeEventListener('click', handleClick);
            root.removeEventListener('change', handleChange);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
            if (sectionObserver) sectionObserver.disconnect();
            if (lifecycleObserver) lifecycleObserver.disconnect();
            document.documentElement.style.removeProperty('--layoffs-progress');
            if (window.__techLayoffsCleanup === cleanup) delete window.__techLayoffsCleanup;
            if (cleanupHandle === cleanup) cleanupHandle = null;
        }

        root.addEventListener('click', handleClick);
        root.addEventListener('change', handleChange);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        window.__techLayoffsCleanup = cleanup;
        cleanupHandle = cleanup;

        var railLinks = Array.from(root.querySelectorAll('[data-layoffs-route]'));
        var sections = railLinks.map(function (link) {
            return document.getElementById(link.dataset.layoffsRoute);
        }).filter(Boolean);
        if ('IntersectionObserver' in window && sections.length) {
            sectionObserver = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function (entry) { return entry.isIntersecting; })
                    .sort(function (left, right) { return left.boundingClientRect.top - right.boundingClientRect.top; });
                if (!visible.length) return;
                var activeId = visible[0].target.id;
                railLinks.forEach(function (link) {
                    if (link.dataset.layoffsRoute === activeId) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
                var routeSelect = root.querySelector('[data-mobile-route]');
                if (routeSelect) routeSelect.value = activeId;
            }, { rootMargin: '-24% 0px -62% 0px', threshold: 0 });
            sections.forEach(function (section) { sectionObserver.observe(section); });
        }

        var contentHost = root.closest('.content');
        if ('MutationObserver' in window && contentHost) {
            lifecycleObserver = new MutationObserver(function () {
                if (!root.isConnected) cleanup();
            });
            lifecycleObserver.observe(contentHost, { childList: true });
        }

        renderHero(data, root, quarterIndex);
        renderComparison();
        renderTimeline();
        renderPortrait();
        updateProgress();
    }

    window.initTechLayoffs = initTechLayoffs;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechLayoffs, { once: true });
    } else {
        initTechLayoffs();
    }
}());

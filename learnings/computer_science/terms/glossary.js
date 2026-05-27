/**
 * Shared glossary data and tooltip system.
 * Include this script in any learning page to enable term tooltips.
 * Mark terms with: <span class="term" data-term="p95">p95</span>
 * or use <a class="term-link" data-term="latency">latency</a> for clickable links.
 */
var Glossary = (function () {
    var terms = {
        'p50': {
            title: 'p50 (50th Percentile / Median)',
            short: 'The value below which 50% of observations fall. The median.',
            detail: 'If your API handled 1000 requests and you sort all latencies, p50 is the 500th value. Half were faster, half were slower. p50 tells you the "typical" experience but hides tail pain.',
            formula: 'p50 = value at rank ⌈0.50 × n⌉ in sorted data',
            example: 'Latencies: [2, 5, 8, 12, 15, 18, 22, 45, 90, 500]ms → p50 = 15ms',
            seeAlso: ['p95', 'p99', 'quantile', 'percentile', 'latency']
        },
        'p95': {
            title: 'p95 (95th Percentile)',
            short: 'The value below which 95% of observations fall. Only 5% are worse.',
            detail: 'p95 latency means 95 out of 100 requests finished at or below this time. The remaining 5% were slower. This is the most common SLA/SLO metric because it captures "almost everyone\'s experience" while ignoring the absolute worst outliers.',
            formula: 'p95 = value at rank ⌈0.95 × n⌉ in sorted data',
            example: 'If 1000 requests have latencies sorted, p95 is the 950th value. Say that\'s 230ms — then 950 requests finished in ≤230ms and 50 took longer.',
            seeAlso: ['p50', 'p99', 'percentile', 'quantile', 'latency', 'slo']
        },
        'p99': {
            title: 'p99 (99th Percentile)',
            short: 'The value below which 99% of observations fall. Only 1% are worse.',
            detail: 'p99 captures the "long tail" — the experience of the unluckiest 1% of users. In high-traffic systems, 1% of 1M requests = 10,000 bad experiences per day. That\'s why teams alert on p99.',
            formula: 'p99 = value at rank ⌈0.99 × n⌉ in sorted data',
            example: '1000 requests sorted by latency: p99 = the 990th value. If that\'s 1200ms, then 10 out of 1000 requests took >1.2 seconds.',
            seeAlso: ['p95', 'p999', 'percentile', 'latency', 'tail-latency']
        },
        'p999': {
            title: 'p99.9 (99.9th Percentile)',
            short: 'The value below which 99.9% of observations fall. Only 0.1% are worse.',
            detail: 'The most extreme commonly-tracked percentile. At 1M requests/day, p99.9 represents the worst 1000 requests. Often 5-50× worse than p50. Tracking this requires very precise tail estimation — exactly what T-Digest excels at.',
            formula: 'p99.9 = value at rank ⌈0.999 × n⌉ in sorted data',
            example: 'At scale: if p50 = 20ms, p99 = 200ms, p99.9 might be 2000ms. Those are your timeout-causing requests.',
            seeAlso: ['p99', 'tail-latency', 'tdigest']
        },
        'percentile': {
            title: 'Percentile',
            short: 'A value below which a given percentage of observations fall.',
            detail: 'Percentiles divide your data into 100 equal-sized buckets by rank. "The 95th percentile" means 95% of data points are at or below this value. Percentiles are robust to outliers (unlike averages) and give a clear picture of distribution shape.',
            formula: 'pN = value at rank ⌈N/100 × n⌉ in sorted data',
            example: 'Test scores [60, 70, 75, 80, 85, 90, 92, 95, 98, 100]: p90 = 98 (90% scored ≤ 98).',
            seeAlso: ['quantile', 'p50', 'p95', 'p99']
        },
        'quantile': {
            title: 'Quantile',
            short: 'Same as percentile but expressed as a fraction 0→1 instead of 0→100.',
            detail: 'q=0.95 is the same as p95. Quantiles are the mathematical form used in algorithms and code. When you see "quantile 0.5" that\'s the median (p50). T-Digest and other sketches work in quantile space internally.',
            formula: 'quantile(q) = value at rank ⌈q × n⌉, where q ∈ [0, 1]',
            example: 'quantile(0.95) of [10, 20, 30, ..., 100] = same as p95 = 95',
            seeAlso: ['percentile', 'p95', 'tdigest']
        },
        'latency': {
            title: 'Latency',
            short: 'The time delay between a request and its response. Usually measured in milliseconds (ms).',
            detail: 'In web systems, latency is the time from when a client sends a request to when it receives the complete response. It includes network time, server processing, database queries, and serialization. Latency is NOT throughput — a system can have high throughput but also high latency if requests queue up.',
            formula: 'latency = t_response_received - t_request_sent',
            example: 'Client sends GET /api/users at t=0ms, server responds at t=45ms → latency = 45ms. But if the server is overloaded, the same request might take 2000ms.',
            seeAlso: ['p95', 'p99', 'tail-latency', 'throughput']
        },
        'tail-latency': {
            title: 'Tail Latency',
            short: 'The latency experienced by the slowest requests (p99, p99.9). The "long tail" of the distribution.',
            detail: 'Most requests are fast (the "body"), but a small percentage are very slow (the "tail"). Tail latency matters because: (1) at scale, even 1% affects thousands of users, (2) a single slow microservice call can make an entire page load slow, (3) users remember bad experiences disproportionately.',
            formula: 'tail latency ≈ p99 or p99.9 of the latency distribution',
            example: 'p50 = 20ms, p99 = 800ms, p99.9 = 3000ms. The tail is 150× worse than typical. Causes: GC pauses, cache misses, lock contention, noisy neighbors.',
            seeAlso: ['latency', 'p99', 'p999', 'percentile']
        },
        'throughput': {
            title: 'Throughput',
            short: 'The number of operations completed per unit time (e.g., requests per second).',
            detail: 'Throughput measures capacity: "how many requests can this system handle?" It\'s related to but different from latency. You can have high throughput with high latency (many requests in-flight, all slow) or high throughput with low latency (fast processing, high concurrency).',
            formula: 'throughput = completed_operations / time_period',
            example: '50,000 requests processed in 1 second = 50K RPS throughput.',
            seeAlso: ['latency', 'qps']
        },
        'slo': {
            title: 'SLO (Service Level Objective)',
            short: 'An internal target for service reliability, usually expressed as percentile thresholds.',
            detail: 'An SLO says "p99 latency for /api/orders should be ≤ 300ms, 99.5% of the time." It\'s the engineering team\'s internal goal. SLOs drive alerting: if p99 crosses 300ms, the on-call gets paged. They\'re more specific than SLAs (contracts with customers).',
            formula: 'SLO: metric ≤ threshold for X% of time windows',
            example: 'SLO: p99(latency) ≤ 200ms measured over 5-minute windows, met 99.9% of windows per month.',
            seeAlso: ['p99', 'latency', 'percentile']
        },
        'delta': {
            title: 'δ (Delta / Compression Parameter)',
            short: 'T-Digest\'s tuning knob. Higher δ = more centroids = more memory but better accuracy.',
            detail: 'Delta controls how many centroids the T-Digest maintains. With δ=100, you get roughly 100-500 centroids depending on data. The memory cost is ~12 bytes per centroid. Higher δ means finer granularity at the tails, giving better p99/p99.9 accuracy at the cost of more memory.',
            formula: 'max centroids ≈ δ × π/2 ≈ δ × 1.57 (theoretical), often δ×3-5 in practice',
            example: 'δ=50: ~250 centroids, ~3KB. δ=100: ~500 centroids, ~6KB. δ=300: ~1500 centroids, ~18KB.',
            seeAlso: ['tdigest', 'centroid', 'quantile']
        },
        'centroid': {
            title: 'Centroid',
            short: 'A (mean, count) pair representing a cluster of nearby values in a T-Digest.',
            detail: 'Instead of storing every value, T-Digest groups nearby values into centroids. Each centroid says "I represent N values whose average is M." Centroids near the tails are small (count=1-3) for precision. Centroids in the middle can be large (count=100+) for compression.',
            formula: 'centroid = { mean: weighted_average, count: num_absorbed_values }',
            example: 'Centroid { mean: 45.2, count: 37 } represents 37 values clustered around 45.2ms.',
            seeAlso: ['tdigest', 'delta', 'quantile']
        },
        'hll': {
            title: 'HyperLogLog (HLL)',
            short: 'A probabilistic sketch for counting distinct elements using O(log log n) memory.',
            detail: 'HLL estimates cardinality (distinct count) by hashing elements and tracking the longest run of leading zeros seen in each of 2^b registers. It uses ~1.5KB for b=14 (16384 registers) and achieves ~0.8% error. Crucially, HLL sketches are mergeable — you can combine registers from different data partitions.',
            formula: 'memory = 2^b registers × 6 bits each. Error ≈ 1.04 / √(2^b)',
            example: '100M unique user IDs → exact storage: 800MB. HLL (b=14): 12KB, estimate within ±1%.',
            seeAlso: ['dcount', 'cardinality', 'sketch']
        },
        'tdigest': {
            title: 'T-Digest',
            short: 'A streaming sketch for accurate percentile estimation with bounded memory and exceptional tail accuracy.',
            detail: 'T-Digest maintains a sorted list of centroids that summarize a value stream. It uses asymmetric compression: small centroids at the tails (q≈0, q≈1) for precision, large centroids in the middle for space efficiency. Key property: T-Digests are mergeable, enabling roll-ups across time windows or data partitions.',
            formula: 'memory ≈ δ × 5 × 12 bytes. Tail error typically < 0.1-1%.',
            example: '1B latency values → exact: 8GB sorted array. T-Digest (δ=100): ~6KB, p99 error < 0.5%.',
            seeAlso: ['centroid', 'delta', 'percentile', 'quantile']
        },
        'sketch': {
            title: 'Sketch (Data Sketch)',
            short: 'A compact data structure that summarizes a data stream, supporting approximate queries.',
            detail: 'Sketches trade exact answers for massive memory savings. They process data in a single pass (streaming) and answer specific questions approximately. Different sketches solve different problems: HLL for distinct counts, T-Digest for percentiles, Count-Min Sketch for frequency estimation, Bloom Filters for membership testing.',
            formula: 'memory = O(1/ε²) or O(1/ε) depending on sketch type, where ε is error bound',
            example: 'Instead of storing 1B values (8GB), a sketch uses 1-100KB and answers within controlled error bounds.',
            seeAlso: ['hll', 'tdigest', 'cardinality']
        },
        'dcount': {
            title: 'dcount (Distinct Count / Cardinality)',
            short: 'The number of unique values in a dataset. Also called cardinality.',
            detail: 'Exact distinct counting requires storing all seen values (O(n) memory). For large streams this is impractical. HyperLogLog solves this with ~1KB memory regardless of stream size. In analytics: "how many unique users visited?" is a dcount query. dcounts are NOT additive — dcount(A) + dcount(B) ≠ dcount(A∪B) because of duplicates.',
            formula: 'dcount(S) = |{unique elements in S}|',
            example: 'Users who visited today: [alice, bob, alice, carol, bob] → dcount = 3 (alice, bob, carol).',
            seeAlso: ['hll', 'cardinality', 'sketch']
        },
        'cardinality': {
            title: 'Cardinality',
            short: 'The number of distinct elements in a set. Same as distinct count.',
            detail: 'In database terms, a column with high cardinality has many unique values (e.g., user_id with millions of values). Low cardinality means few unique values (e.g., status_code with values 200, 400, 404, 500). High-cardinality dimensions make data cubes expensive because they create many cells.',
            formula: 'cardinality(column) = COUNT(DISTINCT column)',
            example: 'Column "country" has cardinality ~200. Column "user_id" might have cardinality 50M. Cubing on user_id is usually impractical.',
            seeAlso: ['dcount', 'hll', 'dimension']
        },
        'dimension': {
            title: 'Dimension',
            short: 'A categorical attribute you GROUP BY in analytics. An axis of a data cube.',
            detail: 'Dimensions are the "by what?" of your query: revenue BY region, latency BY endpoint, users BY country. Each unique value in a dimension creates a slice of the cube. Dimensions can have hierarchies (time: second → minute → hour → day → week → month → year).',
            formula: 'Query pattern: SELECT measure FROM facts GROUP BY dimension1, dimension2, ...',
            example: 'Dimensions: [timestamp_hour, endpoint, region, status_code]. A query "p95 latency by endpoint and region" uses 2 of the 4 dimensions.',
            seeAlso: ['measure', 'cuboid', 'cardinality']
        },
        'measure': {
            title: 'Measure',
            short: 'A numeric value you aggregate in analytics. The "what" being computed.',
            detail: 'Measures are the numbers you care about: latency_ms, revenue, request_count, error_rate. They\'re aggregated across dimensions using functions like SUM, COUNT, AVG, MIN, MAX, or approximate functions like dcount (HLL) and percentile (T-Digest). Measures live in cube cells.',
            formula: 'cell_value = AGG(measure) WHERE dimensions match',
            example: 'Measure: latency_ms. Aggregations: AVG(latency_ms)=45, p95(latency_ms)=230, COUNT(*)=4521.',
            seeAlso: ['dimension', 'percentile', 'dcount']
        },
        'cuboid': {
            title: 'Cuboid',
            short: 'One "face" of a data cube — a specific subset of dimensions grouped together.',
            detail: 'A full cube with dimensions (A, B, C) has 8 cuboids: {ABC, AB, AC, BC, A, B, C, ∅}. The base cuboid (ABC) has the most detail. Dropping a dimension (AB) rolls up the missing one. The apex cuboid (∅) is the grand total. Partial materialization means you only store popular cuboids.',
            formula: 'A cube with d dimensions has 2^d possible cuboids (the lattice)',
            example: '3 dimensions (time, endpoint, region) → 8 cuboids: all combos from full detail to grand total.',
            seeAlso: ['dimension', 'lattice', 'rollup']
        },
        'rollup': {
            title: 'Roll-up',
            short: 'Aggregating a cube along a dimension — going from fine detail to coarser summary.',
            detail: 'Roll-up removes a dimension by aggregating its values. Example: rolling up from (endpoint × region × hour) to (endpoint × region) sums/merges all hours. For additive measures (count, sum) this is trivial. For non-additive measures (dcount, percentiles) you need mergeable sketches (HLL, T-Digest).',
            formula: 'roll_up(cube, dim) = for each remaining_dims: AGG(measure) across all values of dim',
            example: 'Hourly data rolled up to daily: merge the 24 hourly HLL sketches to get daily distinct users. Merge the 24 T-Digests to get daily p95.',
            seeAlso: ['cuboid', 'drilldown', 'dimension', 'hll', 'tdigest']
        },
        'drilldown': {
            title: 'Drill-down',
            short: 'Expanding a cube aggregation to show finer detail — the opposite of roll-up.',
            detail: 'Drill-down adds specificity: from monthly revenue → weekly → daily → hourly. Or from "all regions" → "us-east" → specific servers. It requires that the finer-grained cuboid is materialized (or can be computed on demand from raw data).',
            formula: 'drill_down(cuboid, dim, value) = filter to specific dimension value and show sub-groups',
            example: 'Dashboard shows p95=200ms for /api/orders globally. Drill down by region: us-east=180ms, eu-west=350ms, ap-south=420ms. Now you know where the problem is.',
            seeAlso: ['rollup', 'slice', 'cuboid']
        },
        'slice': {
            title: 'Slice',
            short: 'Fixing one dimension to a single value, reducing the cube by one dimension.',
            detail: 'Slicing selects one "layer" of the cube. If you have (time × endpoint × region) and slice region="us-east", you get a 2D result (time × endpoint) showing only us-east data. It\'s like applying a WHERE clause on one dimension.',
            formula: 'slice(cube, dim=value) = sub-cube with dim fixed',
            example: 'Full cube: 5 endpoints × 4 regions × 24 hours = 480 cells. Slice region="us-east": 5 × 24 = 120 cells.',
            seeAlso: ['dice', 'drilldown', 'dimension']
        },
        'dice': {
            title: 'Dice',
            short: 'Selecting a sub-cube by filtering multiple dimensions to subsets of values.',
            detail: 'Dice is like slice but on multiple dimensions at once, and each dimension can have multiple allowed values. Example: endpoint IN ["/api/orders", "/api/search"] AND region IN ["us-east", "eu-west"] gives you a smaller sub-cube.',
            formula: 'dice(cube, dim1 IN [...], dim2 IN [...]) = filtered sub-cube',
            example: 'Dice: endpoint ∈ {orders, search}, region ∈ {us-east, eu-west}, time ∈ last 7 days → small focused cube for investigation.',
            seeAlso: ['slice', 'dimension', 'cuboid']
        },
        'qps': {
            title: 'QPS (Queries Per Second)',
            short: 'The rate of queries or requests a system handles per second.',
            detail: 'QPS measures load on a system. At high QPS, even small per-request costs (like scanning raw data for percentiles) become prohibitive. This is why pre-aggregation (data cubes) and approximate sketches (HLL, T-Digest) matter — they keep per-query cost constant regardless of data volume.',
            formula: 'QPS = total_queries / elapsed_seconds',
            example: 'A dashboard serving 500 QPS with each query scanning 1M rows = 500M row-scans/second. With a cube: 500 lookups/second.',
            seeAlso: ['throughput', 'latency']
        }
    };

    var tooltipEl = null;

    function createTooltip() {
        if (tooltipEl) return;
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'glossary-tooltip';
        tooltipEl.innerHTML = '<div class="glossary-tooltip-title"></div><div class="glossary-tooltip-short"></div><div class="glossary-tooltip-detail"></div><div class="glossary-tooltip-example"></div><div class="glossary-tooltip-footer"></div>';
        document.body.appendChild(tooltipEl);
        document.addEventListener('click', function (e) {
            if (!tooltipEl.contains(e.target) && !e.target.classList.contains('term') && !e.target.classList.contains('term-link')) {
                hideTooltip();
            }
        });
    }

    function showTooltip(termKey, anchorEl) {
        createTooltip();
        var t = terms[termKey];
        if (!t) { tooltipEl.style.display = 'none'; return; }
        tooltipEl.querySelector('.glossary-tooltip-title').textContent = t.title;
        tooltipEl.querySelector('.glossary-tooltip-short').textContent = t.short;
        tooltipEl.querySelector('.glossary-tooltip-detail').textContent = t.detail;
        tooltipEl.querySelector('.glossary-tooltip-example').innerHTML = '<strong>Example:</strong> ' + t.example;
        var footer = t.seeAlso && t.seeAlso.length ? 'See also: ' + t.seeAlso.map(function (s) { return '<span class="glossary-see-also" data-term="' + s + '">' + s + '</span>'; }).join(', ') : '';
        tooltipEl.querySelector('.glossary-tooltip-footer').innerHTML = footer;
        tooltipEl.style.display = 'block';
        // Position
        var rect = anchorEl.getBoundingClientRect();
        var tipW = Math.min(420, window.innerWidth - 32);
        tooltipEl.style.width = tipW + 'px';
        var left = rect.left + rect.width / 2 - tipW / 2;
        if (left < 16) left = 16;
        if (left + tipW > window.innerWidth - 16) left = window.innerWidth - 16 - tipW;
        tooltipEl.style.left = left + 'px';
        var top = rect.bottom + 10 + window.scrollY;
        if (rect.bottom + 300 > window.innerHeight) {
            top = rect.top - tooltipEl.offsetHeight - 10 + window.scrollY;
        }
        tooltipEl.style.top = top + 'px';
        // Wire see-also clicks
        tooltipEl.querySelectorAll('.glossary-see-also').forEach(function (el) {
            el.onclick = function () { showTooltip(el.getAttribute('data-term'), el); };
        });
    }

    function hideTooltip() {
        if (tooltipEl) tooltipEl.style.display = 'none';
    }

    function init() {
        createTooltip();
        document.addEventListener('click', function (e) {
            var el = e.target.closest('.term, .term-link, [data-term]');
            if (el && el.getAttribute('data-term')) {
                e.preventDefault();
                e.stopPropagation();
                showTooltip(el.getAttribute('data-term'), el);
            }
        });
        // Hover support
        document.addEventListener('mouseover', function (e) {
            var el = e.target.closest('.term, .term-link, [data-term]');
            if (el && el.getAttribute('data-term')) {
                showTooltip(el.getAttribute('data-term'), el);
            }
        });
    }

    function getAll() { return terms; }
    function get(key) { return terms[key] || null; }

    return { init: init, getAll: getAll, get: get, show: showTooltip, hide: hideTooltip };
})();

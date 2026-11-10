/* Numesthesia — turn the digits of numbers into a multi-track song.
 *
 * Every track reads one number. Each digit picks a scale degree (or, on
 * a drum kit, a drum) and a note length chosen by the track's length
 * rule. Tracks share one clock measured in steps (an eighth note each),
 * so a held note is drawn as a longer bar in the score. Audio is
 * synthesised with the Web Audio API and scheduled with a look-ahead
 * clock; the canvases read the schedule back so the picture matches
 * what you hear.
 *
 * Digits for the constants come from numesthesia-data.js (generated
 * with mpmath); sequences and patterns are generated here.
 * Exposes window.initNumesthesia for the site's page transitions.
 */
(function () {
    'use strict';

    // ── Numbers ────────────────────────────────────────────────────

    var PATTERN_DIGITS = 1200;

    function concatUntil(next) {
        var s = '';
        while (s.length < PATTERN_DIGITS) s += next();
        return s.slice(0, PATTERN_DIGITS);
    }

    function isPrime(n) {
        if (n < 2) return false;
        for (var d = 2; d * d <= n; d++) if (n % d === 0) return false;
        return true;
    }

    function reciprocal(den) {
        var s = '', r = 1;
        while (s.length < PATTERN_DIGITS) { r *= 10; s += Math.floor(r / den); r %= den; }
        return s;
    }

    var PATTERNS = {
        fibonacci: function () { var a = 1n, b = 1n; return concatUntil(function () { var v = a; a = b; b = v + b; return String(v); }); },
        lucas: function () { var a = 2n, b = 1n; return concatUntil(function () { var v = a; a = b; b = v + b; return String(v); }); },
        primes: function () { var n = 1; return concatUntil(function () { do n++; while (!isPrime(n)); return String(n); }); },
        counting: function () { var n = 0; return concatUntil(function () { return String(++n); }); },
        squares: function () { var n = 0; return concatUntil(function () { n++; return String(n * n); }); },
        triangular: function () { var n = 0; return concatUntil(function () { n++; return String(n * (n + 1) / 2); }); },
        powers2: function () { var p = 1n; return concatUntil(function () { var v = p; p *= 2n; return String(v); }); },
        factorials: function () { var f = 1n, n = 1n; return concatUntil(function () { f *= n; n++; return String(f); }); },
        catalanSeq: function () { var c = 1n, n = 0n; return concatUntil(function () { var v = c; c = c * 2n * (2n * n + 1n) / (n + 2n); n++; return String(v); }); },
        thueMorse: function () {
            var s = '';
            for (var n = 0; s.length < PATTERN_DIGITS; n++) {
                var x = n, bits = 0;
                while (x) { bits ^= x & 1; x >>= 1; }
                s += bits;
            }
            return s;
        },
        kolakoski: function () {
            var seq = [1, 2, 2];
            for (var i = 2; seq.length < PATTERN_DIGITS; i++) {
                var next = seq[seq.length - 1] === 1 ? 2 : 1;
                for (var k = 0; k < seq[i]; k++) seq.push(next);
            }
            return seq.join('').slice(0, PATTERN_DIGITS);
        },
        lookAndSay: function () {
            var term = '1';
            return concatUntil(function () {
                var v = term, out = '';
                for (var i = 0; i < term.length;) {
                    var j = i;
                    while (j < term.length && term[j] === term[i]) j++;
                    out += (j - i) + term[i];
                    i = j;
                }
                term = out;
                return v;
            });
        },
        collatz: function () {
            var s = '';
            for (var n = 27; ; n = n % 2 ? 3 * n + 1 : n / 2) { s += n; if (n === 1) break; }
            return s;
        },
        recaman: function () {
            var a = 0, n = 0, seen = { 0: true };
            return concatUntil(function () {
                var v = a; n++;
                var b = a - n;
                a = b > 0 && !seen[b] ? b : a + n;
                seen[a] = true;
                return String(v);
            });
        },
        pascal: function () {
            var row = [1n];
            return concatUntil(function () {
                var v = row.join('');
                var next = [1n];
                for (var i = 1; i < row.length; i++) next.push(row[i - 1] + row[i]);
                next.push(1n);
                row = next;
                return v;
            });
        },
        fibMod10: function () { var a = 0, b = 1; return concatUntil(function () { var v = a; a = b; b = (v + b) % 10; return String(v); }); },
        liouville: function () {
            var facts = {}, f = 1;
            for (var n = 1; f <= PATTERN_DIGITS; n++) { f *= n; facts[f] = true; }
            var s = '';
            for (var i = 1; i <= PATTERN_DIGITS; i++) s += facts[i] ? '1' : '0';
            return s;
        },
        seventh: function () { return '142857'; },
        seventeenth: function () { return reciprocal(17).slice(0, 16); },
        ninetySeventh: function () { return reciprocal(97).slice(0, 96); }
    };

    // point = digits before the decimal point, for the readout
    var SOURCES = [
        // Irrational and math constants (digits from mpmath)
        { group: 'math', id: 'pi', short: 'π', name: 'π', data: 'pi', point: 1 },
        { group: 'math', id: 'e', short: 'e', name: "Euler's number e", data: 'e', point: 1 },
        { group: 'math', id: 'phi', short: 'φ', name: 'Golden ratio φ', data: 'phi', point: 1 },
        { group: 'math', id: 'sqrt2', short: '√2', name: 'Square root of 2', data: 'sqrt2', point: 1 },
        { group: 'math', id: 'sqrt3', short: '√3', name: 'Square root of 3', data: 'sqrt3', point: 1 },
        { group: 'math', id: 'sqrt5', short: '√5', name: 'Square root of 5', data: 'sqrt5', point: 1 },
        { group: 'math', id: 'sqrt7', short: '√7', name: 'Square root of 7', data: 'sqrt7', point: 1 },
        { group: 'math', id: 'cbrt2', short: '∛2', name: 'Cube root of 2', data: 'cbrt2', point: 1 },
        { group: 'math', id: 'sqrtpi', short: '√π', name: 'Square root of π', data: 'sqrtpi', point: 1 },
        { group: 'math', id: 'pi2', short: 'π²', name: 'π squared', data: 'pi2', point: 1 },
        { group: 'math', id: 'gelfond', short: 'eᵖ', name: "Gelfond's constant e^π", data: 'gelfond', point: 2 },
        { group: 'math', id: 'pie', short: 'πᵉ', name: 'π to the power e', data: 'pie', point: 2 },
        { group: 'math', id: 'ln2', short: 'ln 2', name: 'Natural log of 2', data: 'ln2', point: 0 },
        { group: 'math', id: 'ln10', short: 'ln 10', name: 'Natural log of 10', data: 'ln10', point: 1 },
        { group: 'math', id: 'log2', short: 'log 2', name: 'Base-10 log of 2', data: 'log2', point: 0 },
        { group: 'math', id: 'sin1', short: 'sin 1', name: 'Sine of 1 radian', data: 'sin1', point: 0 },
        { group: 'math', id: 'gamma', short: 'γ', name: 'Euler–Mascheroni constant γ', data: 'gamma', point: 0 },
        { group: 'math', id: 'zeta3', short: 'ζ(3)', name: "Apéry's constant ζ(3)", data: 'zeta3', point: 1 },
        { group: 'math', id: 'catalan', short: 'G', name: "Catalan's constant G", data: 'catalan', point: 0 },
        { group: 'math', id: 'omega', short: 'Ω', name: 'Omega constant Ω', data: 'omega', point: 0 },
        { group: 'math', id: 'dottie', short: 'Dottie', name: 'Dottie number (cos x = x)', data: 'dottie', point: 0 },
        { group: 'math', id: 'gauss', short: 'Gauss', name: "Gauss's constant", data: 'gauss', point: 0 },
        { group: 'math', id: 'lemniscate', short: 'ϖ', name: 'Lemniscate constant ϖ', data: 'lemniscate', point: 1 },
        { group: 'math', id: 'plastic', short: 'ρ', name: 'Plastic ratio ρ', data: 'plastic', point: 1 },
        { group: 'math', id: 'silver', short: 'δS', name: 'Silver ratio 1 + √2', data: 'silver', point: 1 },
        { group: 'math', id: 'twinprime', short: 'C₂', name: 'Twin prime constant C₂', data: 'twinprime', point: 0 },
        { group: 'math', id: 'mertens', short: 'M', name: 'Meissel–Mertens constant', data: 'mertens', point: 0 },
        { group: 'math', id: 'glaisher', short: 'A', name: 'Glaisher–Kinkelin constant A', data: 'glaisher', point: 1 },
        { group: 'math', id: 'khinchin', short: 'K₀', name: "Khinchin's constant K₀", data: 'khinchin', point: 1 },
        { group: 'math', id: 'feigd', short: 'δ', name: 'Feigenbaum constant δ', digits: '4669201609102990671853203820466', value: '4.66920 16091 02990… (31 digits known here)' },
        { group: 'math', id: 'feiga', short: 'α', name: 'Feigenbaum constant α', digits: '2502907875095892822283902873218', value: '2.50290 78750 95892… (31 digits known here)' },

        // Sequences and patterns
        { group: 'pattern', id: 'fibonacci', short: 'Fib', name: 'Fibonacci numbers, joined', gen: 'fibonacci', value: '1 1 2 3 5 8 13 21 34 55…' },
        { group: 'pattern', id: 'lucas', short: 'Lucas', name: 'Lucas numbers, joined', gen: 'lucas', value: '2 1 3 4 7 11 18 29 47…' },
        { group: 'pattern', id: 'primes', short: 'Primes', name: 'Primes, joined (Copeland–Erdős)', gen: 'primes', value: '2 3 5 7 11 13 17 19 23…' },
        { group: 'pattern', id: 'counting', short: 'Count', name: 'Counting numbers (Champernowne)', gen: 'counting', value: '1 2 3 4 5 6 7 8 9 10 11…' },
        { group: 'pattern', id: 'squares', short: 'n²', name: 'Square numbers, joined', gen: 'squares', value: '1 4 9 16 25 36 49…' },
        { group: 'pattern', id: 'triangular', short: 'Tri', name: 'Triangular numbers, joined', gen: 'triangular', value: '1 3 6 10 15 21 28…' },
        { group: 'pattern', id: 'powers2', short: '2ⁿ', name: 'Powers of 2, joined', gen: 'powers2', value: '1 2 4 8 16 32 64 128…' },
        { group: 'pattern', id: 'factorials', short: 'n!', name: 'Factorials, joined', gen: 'factorials', value: '1 2 6 24 120 720 5040…' },
        { group: 'pattern', id: 'catalanSeq', short: 'Cₙ', name: 'Catalan numbers, joined', gen: 'catalanSeq', value: '1 1 2 5 14 42 132 429…' },
        { group: 'pattern', id: 'pascal', short: 'Pascal', name: "Pascal's triangle, row by row", gen: 'pascal', value: '1 · 1 1 · 1 2 1 · 1 3 3 1…' },
        { group: 'pattern', id: 'recaman', short: 'Recamán', name: "Recamán's sequence", gen: 'recaman', value: '0 1 3 6 2 7 13 20 12…' },
        { group: 'pattern', id: 'lookAndSay', short: 'Say', name: 'Look-and-say sequence', gen: 'lookAndSay', value: '1 · 11 · 21 · 1211 · 111221…' },
        { group: 'pattern', id: 'collatz', short: 'Collatz', name: 'Collatz path from 27 to 1', gen: 'collatz', value: '27 82 41 124 62 31… 4 2 1' },
        { group: 'pattern', id: 'fibMod10', short: 'Fib%10', name: 'Fibonacci last digits (repeats every 60)', gen: 'fibMod10', value: '0 1 1 2 3 5 8 3 1 4 5 9…' },
        { group: 'pattern', id: 'thueMorse', short: 'T–M', name: 'Thue–Morse sequence', gen: 'thueMorse', value: '0 1 1 0 1 0 0 1 1 0…' },
        { group: 'pattern', id: 'kolakoski', short: 'Kolak.', name: 'Kolakoski sequence', gen: 'kolakoski', value: '1 2 2 1 1 2 1 2 2 1…' },
        { group: 'pattern', id: 'liouville', short: 'Liouv.', name: "Liouville's constant", gen: 'liouville', value: '0.11000 10000 00000 00001…' },
        { group: 'pattern', id: 'seventh', short: '1/7', name: 'One seventh', gen: 'seventh', value: '0.142857 142857…' },
        { group: 'pattern', id: 'seventeenth', short: '1/17', name: 'One seventeenth', gen: 'seventeenth', value: '0.05882 35294 11764 7 (repeats)' },
        { group: 'pattern', id: 'ninetySeventh', short: '1/97', name: 'One ninety-seventh (96-digit cycle)', gen: 'ninetySeventh', value: '0.01030 92783 50515…' },

        // Science. Since 2019 the SI fixes c, h, e, k and N_A exactly; G and the
        // particle constants are measured (CODATA 2022) and end where the measurement does.
        { group: 'science', id: 'c', short: 'c', name: 'Speed of light c', digits: '299792458', value: '299 792 458 m/s (exact)' },
        { group: 'science', id: 'ly', short: 'ly', name: 'One light-year in metres', digits: '9460730472580800', value: '9 460 730 472 580 800 m (exact)' },
        { group: 'science', id: 'au', short: 'au', name: 'Astronomical unit', digits: '149597870700', value: '149 597 870 700 m (exact)' },
        { group: 'science', id: 'avogadro', short: 'N_A', name: "Avogadro's number", digits: '602214076', value: '6.022 140 76 × 10²³ mol⁻¹ (exact)' },
        { group: 'science', id: 'h', short: 'h', name: 'Planck constant h', digits: '662607015', value: '6.626 070 15 × 10⁻³⁴ J s (exact)' },
        { group: 'science', id: 'hbar', short: 'ħ', name: 'Reduced Planck constant ħ = h/2π', data: 'hbar', value: '1.054 571 817… × 10⁻³⁴ J s (exact, irrational)' },
        { group: 'science', id: 'charge', short: 'e⁻', name: 'Elementary charge e', digits: '1602176634', value: '1.602 176 634 × 10⁻¹⁹ C (exact)' },
        { group: 'science', id: 'k', short: 'k', name: 'Boltzmann constant k', digits: '1380649', value: '1.380 649 × 10⁻²³ J/K (exact)' },
        { group: 'science', id: 'gas', short: 'R', name: 'Molar gas constant R', data: 'gas', value: '8.314 462 618 153 24 J/(mol K) (exact)' },
        { group: 'science', id: 'faraday', short: 'F', name: 'Faraday constant F', data: 'faraday', value: '96 485.332 123 310 0184 C/mol (exact)' },
        { group: 'science', id: 'stefan', short: 'σ', name: 'Stefan–Boltzmann constant σ', data: 'stefan', value: '5.670 374 419… × 10⁻⁸ W m⁻² K⁻⁴ (exact, irrational)' },
        { group: 'science', id: 'wien', short: 'b', name: 'Wien displacement constant b', data: 'wien', value: '2.897 771 955… × 10⁻³ m K (exact, irrational)' },
        { group: 'science', id: 'c2', short: 'c₂', name: 'Second radiation constant hc/k', data: 'c2', value: '1.438 776 877… × 10⁻² m K (exact)' },
        { group: 'science', id: 'josephson', short: 'K_J', name: 'Josephson constant 2e/h', data: 'josephson', value: '483 597.848 4… GHz/V (exact)' },
        { group: 'science', id: 'klitzing', short: 'R_K', name: 'von Klitzing constant h/e²', data: 'klitzing', value: '25 812.807 45… Ω (exact)' },
        { group: 'science', id: 'G', short: 'G', name: 'Gravitational constant G', digits: '667430', value: '6.674 30 × 10⁻¹¹ m³ kg⁻¹ s⁻² (CODATA 2022)' },
        { group: 'science', id: 'alpha', short: '1/α', name: 'Inverse fine-structure constant', digits: '137035999177', value: '137.035 999 177 (CODATA 2022)' },
        { group: 'science', id: 'me', short: 'mₑ', name: 'Electron mass', digits: '91093837139', value: '9.109 383 7139 × 10⁻³¹ kg (CODATA 2022)' },
        { group: 'science', id: 'mp', short: 'mₚ', name: 'Proton mass', digits: '167262192595', value: '1.672 621 925 95 × 10⁻²⁷ kg (CODATA 2022)' },
        { group: 'science', id: 'rydberg', short: 'R∞', name: 'Rydberg constant', digits: '10973731568157', value: '10 973 731.568 157 m⁻¹ (CODATA 2022)' },
        { group: 'science', id: 'planckLength', short: 'ℓP', name: 'Planck length', digits: '1616255', value: '1.616 255 × 10⁻³⁵ m (CODATA 2022)' },
        { group: 'science', id: 'g0', short: 'g', name: 'Standard gravity', digits: '980665', value: '9.806 65 m/s² (exact by definition)' },
        { group: 'science', id: 'atm', short: 'atm', name: 'Standard atmosphere', digits: '101325', value: '101 325 Pa (exact by definition)' },
        { group: 'science', id: 'zeroC', short: '0 °C', name: 'Zero Celsius in kelvin', digits: '27315', value: '273.15 K (exact by definition)' }
    ];

    var GROUP_LABELS = { math: 'Irrational and math constants', pattern: 'Sequences and patterns', science: 'Science', custom: 'Your numbers' };

    var digitCache = {};
    function sourceDigits(src) {
        if (src.digits) return src.digits;
        if (digitCache[src.id]) return digitCache[src.id];
        var d = '';
        if (src.data) d = (window.NUMESTHESIA_DIGITS || {})[src.data] || '';
        else if (src.gen) d = PATTERNS[src.gen]();
        digitCache[src.id] = d || '0';
        return digitCache[src.id];
    }
    function sourceValue(src) {
        if (src.value) return src.value;
        var d = sourceDigits(src), p = src.point || 0;
        var intPart = p ? d.slice(0, p) : '0';
        var frac = d.slice(p, p + 15).replace(/(\d{5})(?=\d)/g, '$1 ');
        return intPart + '.' + frac + '…';
    }

    // ── Music ──────────────────────────────────────────────────────

    var SCALES = [
        { id: 'majorPent', name: 'Major pentatonic', steps: [0, 2, 4, 7, 9] },
        { id: 'minorPent', name: 'Minor pentatonic', steps: [0, 3, 5, 7, 10] },
        { id: 'major', name: 'Major (Ionian)', steps: [0, 2, 4, 5, 7, 9, 11] },
        { id: 'minor', name: 'Natural minor (Aeolian)', steps: [0, 2, 3, 5, 7, 8, 10] },
        { id: 'dorian', name: 'Dorian', steps: [0, 2, 3, 5, 7, 9, 10] },
        { id: 'phrygian', name: 'Phrygian', steps: [0, 1, 3, 5, 7, 8, 10] },
        { id: 'lydian', name: 'Lydian', steps: [0, 2, 4, 6, 7, 9, 11] },
        { id: 'mixolydian', name: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10] },
        { id: 'locrian', name: 'Locrian', steps: [0, 1, 3, 5, 6, 8, 10] },
        { id: 'harmonic', name: 'Harmonic minor', steps: [0, 2, 3, 5, 7, 8, 11] },
        { id: 'melodic', name: 'Melodic minor', steps: [0, 2, 3, 5, 7, 9, 11] },
        { id: 'blues', name: 'Blues', steps: [0, 3, 5, 6, 7, 10] },
        { id: 'hirajoshi', name: 'Hirajōshi', steps: [0, 2, 3, 7, 8] },
        { id: 'insen', name: 'In-sen', steps: [0, 1, 5, 7, 10] },
        { id: 'yo', name: 'Yo', steps: [0, 2, 5, 7, 9] },
        { id: 'egyptian', name: 'Egyptian (suspended)', steps: [0, 2, 5, 7, 10] },
        { id: 'hungarian', name: 'Hungarian minor', steps: [0, 2, 3, 6, 7, 8, 11] },
        { id: 'doubleHarmonic', name: 'Double harmonic', steps: [0, 1, 4, 5, 7, 8, 11] },
        { id: 'prometheus', name: 'Prometheus', steps: [0, 2, 4, 6, 9, 10] },
        { id: 'whole', name: 'Whole tone', steps: [0, 2, 4, 6, 8, 10] },
        { id: 'augmented', name: 'Augmented', steps: [0, 3, 4, 7, 8, 11] },
        { id: 'diminished', name: 'Diminished (octatonic)', steps: [0, 2, 3, 5, 6, 8, 9, 11] },
        { id: 'chromatic', name: 'Chromatic', steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }
    ];
    var SCALE_BY_ID = {};
    SCALES.forEach(function (s) { SCALE_BY_ID[s.id] = s; });

    var NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

    var INSTRUMENTS = [
        { id: 'bell', name: 'Bell' }, { id: 'pluck', name: 'Pluck' }, { id: 'glass', name: 'Glass (FM)' },
        { id: 'marimba', name: 'Marimba' }, { id: 'kalimba', name: 'Music box' }, { id: 'steel', name: 'Steel drum' },
        { id: 'organ', name: 'Organ' }, { id: 'flute', name: 'Flute' }, { id: 'strings', name: 'Strings' },
        { id: 'pad', name: 'Soft pad' }, { id: 'lead', name: 'Saw lead' }, { id: 'chip', name: 'Chiptune' },
        { id: 'bass', name: 'Bass' }, { id: 'toms', name: 'Tuned toms' }
    ];
    var KITS = [
        { id: 'acoustic', name: 'Acoustic kit', map: [null, 'kick', 'kick', 'snare', 'hatC', 'hatC', 'hatO', 'tomL', 'tomH', 'rim'] },
        { id: 'tr808', name: 'Drum machine kit', map: [null, 'kick808', 'kick808', 'clap', 'hatC', 'hatC', 'hatO', 'cowbell', 'tomL', 'clave'] },
        { id: 'electro', name: 'Electro kit', map: [null, 'kick', 'zap', 'snare', 'hatC', 'shaker', 'clap', 'zapHi', 'hatO', 'noise'] },
        { id: 'hand', name: 'Hand percussion', map: [null, 'congaL', 'congaH', 'bongo', 'shaker', 'shaker', 'clave', 'cowbell', 'rim', 'tomM'] },
        { id: 'groove', name: 'Groove (digit = accent)' },
        { id: 'ratchet', name: 'Ratchet hats (digit = hits)' }
    ];
    var KIT_BY_ID = {};
    KITS.forEach(function (k) { KIT_BY_ID[k.id] = k; });
    var INSTRUMENT_NAME = {};
    INSTRUMENTS.concat(KITS).forEach(function (x) { INSTRUMENT_NAME[x.id] = x.name; });
    var GROOVE = ['kick', 'hatC', 'hatC', 'hatC', 'snare', 'hatC', 'kick', 'hatO'];
    var PIECE_NAMES = {
        kick: 'Kick', kick808: 'Boom kick', snare: 'Snare', clap: 'Clap', hatC: 'Closed hat', hatO: 'Open hat',
        tomL: 'Low tom', tomM: 'Mid tom', tomH: 'High tom', rim: 'Rim', cowbell: 'Cowbell', shaker: 'Shaker',
        congaL: 'Low conga', congaH: 'High conga', bongo: 'Bongo', clave: 'Clave', zap: 'Zap', zapHi: 'High zap', noise: 'Noise burst'
    };

    // Note lengths, in steps (one step = an eighth note).
    var LEN10 = [0.5, 0.5, 1, 1, 1, 1.5, 2, 2, 3, 4];
    var RANDOM_LENGTHS = [0.5, 1, 1, 1.5, 2, 3];
    var LENGTHS = [
        { id: 'steady', name: 'Steady: one step each', fixed: function () { return 1; } },
        { id: 'fast', name: 'Fast: half a step each', fixed: function () { return 0.5; } },
        { id: 'slow', name: 'Slow: two steps each', fixed: function () { return 2; } },
        { id: 'digit', name: 'Digit = length (0 rests)', fixed: function (d) { return d ? d * 0.5 : 1; }, rest: function (d) { return d === 0; } },
        { id: 'inverse', name: 'Bigger digit, shorter note', fixed: function (d) { return (10 - d) * 0.5; } },
        { id: 'grouped', name: 'Grouped: 0–3 short, 4–7 mid, 8–9 long', fixed: function (d) { return 1 + Math.floor(d / 4); } },
        { id: 'parity', name: 'Even digits long, odd short', fixed: function (d) { return d % 2 ? 1 : 2; } },
        { id: 'parityInv', name: 'Odd digits long, even short', fixed: function (d) { return d % 2 ? 2 : 1; } },
        { id: 'previous', name: 'Last digit sets the length' },
        { id: 'next', name: 'Next digit sets the length' },
        { id: 'random', name: 'Random lengths' },
        { id: 'swing', name: 'Swing: long-short pairs' },
        { id: 'fibonacci', name: 'Fibonacci lengths: 1 1 2 3 5' },
        { id: 'zero', name: 'Zero is a rest', fixed: function () { return 1; }, rest: function (d) { return d === 0; } },
        { id: 'oddRest', name: 'Odd digits rest', fixed: function () { return 1; }, rest: function (d) { return d % 2 === 1; } }
    ];
    var LENGTH_BY_ID = {};
    LENGTHS.forEach(function (l) { LENGTH_BY_ID[l.id] = l; });

    // ── Mixing inside a track ──────────────────────────────────────
    // A track can weave up to four numbers into one digit stream. Each
    // number keeps its own place, so switching back resumes where it left off.
    var SWITCH_RULES = [
        { id: 'blocks8', name: 'Swap every 8 digits', block: 8 },
        { id: 'blocks4', name: 'Swap every 4 digits', block: 4 },
        { id: 'blocks16', name: 'Swap every 16 digits', block: 16 },
        { id: 'blocks32', name: 'Swap every 32 digits', block: 32 },
        { id: 'interleave', name: 'Take turns, digit by digit', block: 1 },
        { id: 'led', name: 'Each digit picks the next number' },
        { id: 'random', name: 'Random stretches' }
    ];
    var SWITCH_BY_ID = {};
    SWITCH_RULES.forEach(function (r) { SWITCH_BY_ID[r.id] = r; });
    var MAX_MIX = 3;

    function weave(parts, ruleId, seed) {
        var P = parts.length, longest = 0;
        parts.forEach(function (p) { longest = Math.max(longest, p.length); });
        var target = Math.max(64, Math.min(4800, longest * P));
        var rule = SWITCH_BY_ID[ruleId] || SWITCH_RULES[0];
        var ptr = parts.map(function () { return 0; });
        var out = [], origin = new Uint8Array(target), cur = 0, block = 0;
        function take(k) {
            var p = parts[k], d = p.charAt(ptr[k] % p.length);
            ptr[k]++;
            origin[out.length] = k;
            out.push(d);
            return d.charCodeAt(0) - 48;
        }
        while (out.length < target) {
            if (rule.id === 'led') {
                cur = take(cur) % P;
            } else {
                var n = rule.id === 'random' ? 2 + Math.floor(rand01(seed, block) * 15) : rule.block;
                for (var j = 0; j < n && out.length < target; j++) take(cur);
                cur = (cur + 1) % P;
                block++;
            }
        }
        return { digits: out.join(''), origin: origin };
    }

    // ── Arranger: music theory as an algorithm ─────────────────────
    // A tuned randomizer. It picks a mood, then fills roles the way a
    // small band would, with rules that keep the result consonant:
    //  • Scales: pentatonic and modal scales have few or no semitone
    //    clashes, so any two digits sound fine together. Darker moods
    //    allow minor, harmonic minor and Phrygian colour.
    //  • Register: bass sits two octaves under the lead, the counter-line
    //    an octave over it, the pad in the middle and quieter, so parts
    //    don't mask each other.
    //  • Rhythm: drums stay on the step grid; bass and pad move slowly
    //    (long notes), the lead moves at the step, the counter-line
    //    moves fastest. That's the classic division of labour.
    //  • Repetition: short constants (c, h, 1/7…) loop into riffs, so
    //    they make good bass lines and grooves; long irrationals wander,
    //    so they carry melodies.
    //  • Phrasing: when a track mixes in a second number, it swaps on
    //    power-of-two phrase lengths (8 or 16 digits), like an A/B section.
    //  • Balance: the lead is loudest; pad and texture sit underneath;
    //    tempo, space, sustain and drone follow the mood.
    var MOODS = {
        chill: {
            name: 'Chill', bpm: [68, 92], gate: [70, 95], space: [35, 60], drone: 0.5,
            scales: ['minorPent', 'majorPent', 'dorian', 'lydian', 'yo'],
            lead: ['kalimba', 'glass', 'bell', 'flute', 'marimba'], bass: ['bass', 'pad'], pad: ['pad', 'strings'],
            counter: ['kalimba', 'bell', 'glass'], drums: ['hand', 'acoustic'], texture: ['ratchet', 'hand']
        },
        groove: {
            name: 'Groove', bpm: [92, 124], gate: [55, 85], space: [10, 30], drone: 0.15,
            scales: ['dorian', 'minorPent', 'mixolydian', 'blues'],
            lead: ['pluck', 'lead', 'marimba', 'steel', 'organ'], bass: ['bass'], pad: ['organ', 'pad'],
            counter: ['pluck', 'chip', 'marimba'], drums: ['groove', 'tr808', 'acoustic'], texture: ['ratchet', 'hand']
        },
        upbeat: {
            name: 'Upbeat', bpm: [118, 152], gate: [45, 80], space: [10, 30], drone: 0.1,
            scales: ['majorPent', 'major', 'lydian', 'mixolydian'],
            lead: ['chip', 'lead', 'pluck', 'steel'], bass: ['bass', 'chip'], pad: ['strings', 'pad'],
            counter: ['bell', 'kalimba', 'glass'], drums: ['electro', 'tr808'], texture: ['ratchet', 'electro']
        },
        epic: {
            name: 'Epic', bpm: [72, 104], gate: [80, 100], space: [40, 70], drone: 0.6,
            scales: ['minor', 'harmonic', 'dorian', 'phrygian'],
            lead: ['strings', 'lead', 'bell', 'organ'], bass: ['bass', 'toms'], pad: ['strings', 'organ', 'pad'],
            counter: ['bell', 'glass', 'toms'], drums: ['acoustic', 'tr808'], texture: ['hand', 'ratchet']
        }
    };
    var ROLE_ORDER = ['lead', 'drums', 'bass', 'pad', 'counter', 'texture'];
    var ROLE_NAMES = { lead: 'lead', drums: 'drums', bass: 'bass', pad: 'pad', counter: 'counter-melody', texture: 'texture' };

    // rng() returns [0, 1). Dice by default; the digits of a number when asked.
    function diceRng() { return Math.random; }
    function digitRng(digits) {
        var pos = 0, L = digits.length;
        return function () {
            var v = 0;
            for (var k = 0; k < 4; k++) { v = v * 10 + (digits.charCodeAt(pos % L) - 48); pos++; }
            return v / 10000;
        };
    }
    function pickR(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }
    function rangeR(rng, lo, hi) { return Math.round(lo + rng() * (hi - lo)); }

    function riffSources(all) {
        return all.filter(function (s) {
            return (s.digits && s.digits.length <= 16) || ['seventh', 'seventeenth', 'fibMod10', 'thueMorse', 'kolakoski'].indexOf(s.id) >= 0;
        });
    }
    function melodySources(all) {
        return all.filter(function (s) { return (s.group === 'math' && !s.digits) || !!s.data || (s.group === 'custom' && s.digits.length > 16); });
    }
    function patternSources(all) { return all.filter(function (s) { return s.group === 'pattern'; }); }

    function arrange(n, rng, all, moodId) {
        var mood = MOODS[moodId] || MOODS[pickR(rng, Object.keys(MOODS))];
        var melodies = melodySources(all), riffs = riffSources(all), patterns = patternSources(all);
        var used = {};
        function fresh(pool) {
            var options = pool.filter(function (s) { return !used[s.id]; });
            var s = pickR(rng, options.length ? options : pool);
            used[s.id] = true;
            return s.id;
        }
        var tracks = [];
        for (var k = 0; k < n; k++) {
            var role = ROLE_ORDER[k % ROLE_ORDER.length], t;
            if (role === 'lead') {
                t = { instrument: pickR(rng, mood.lead), octave: rng() < 0.6 ? 0 : 1, volume: 0.82,
                    length: pickR(rng, mood.name === 'Groove' ? ['steady', 'swing', 'parity', 'previous'] : ['steady', 'parity', 'grouped', 'previous', 'fibonacci']),
                    sourceId: fresh(melodies) };
                if (t.instrument === 'strings' || t.instrument === 'lead') t.octave = 0;
                if (rng() < 0.55) { t.mixIds = [fresh(melodies)]; t.switchRule = pickR(rng, ['blocks8', 'blocks16']); }
            } else if (role === 'drums') {
                var kit = pickR(rng, mood.drums);
                t = { instrument: kit, octave: 0, volume: 0.72, length: kit === 'groove' ? 'steady' : pickR(rng, ['steady', 'steady', 'zero']),
                    sourceId: fresh(rng() < 0.5 ? riffs : melodies) };
                if (rng() < 0.45) { t.mixIds = [fresh(riffs)]; t.switchRule = 'blocks16'; }
            } else if (role === 'bass') {
                t = { instrument: pickR(rng, mood.bass), octave: -2, volume: 0.76,
                    length: pickR(rng, ['slow', 'parity', 'grouped']), sourceId: fresh(riffs) };
                if (t.instrument === 'pad' || t.instrument === 'chip') t.octave = -1;
            } else if (role === 'pad') {
                t = { instrument: pickR(rng, mood.pad), octave: rng() < 0.5 ? 0 : -1, volume: 0.46,
                    length: pickR(rng, ['slow', 'inverse']), sourceId: fresh(melodies) };
            } else if (role === 'counter') {
                t = { instrument: pickR(rng, mood.counter), octave: 1, volume: 0.52,
                    length: pickR(rng, ['fast', 'parityInv', 'steady']), sourceId: fresh(patterns) };
                if (rng() < 0.4) { t.mixIds = [fresh(patterns)]; t.switchRule = 'interleave'; }
            } else {
                t = { instrument: pickR(rng, mood.texture), octave: 0, volume: 0.44,
                    length: pickR(rng, ['fast', 'oddRest', 'steady']), sourceId: fresh(all) };
            }
            t.role = role;
            t.seed = Math.floor(rng() * 4294967295) >>> 0;
            tracks.push(t);
        }
        return {
            mood: mood, tracks: tracks,
            scale: pickR(rng, mood.scales), key: Math.floor(rng() * 12) % 12,
            bpm: rangeR(rng, mood.bpm[0], mood.bpm[1]), gate: rangeR(rng, mood.gate[0], mood.gate[1]),
            space: rangeR(rng, mood.space[0], mood.space[1]), drone: rng() < mood.drone
        };
    }

    // Truly random: anything goes, including mixing inside tracks.
    function chaos(n, rng, all) {
        var instruments = INSTRUMENTS.concat(KITS), tracks = [];
        for (var k = 0; k < n; k++) {
            var t = {
                sourceId: pickR(rng, all).id, instrument: pickR(rng, instruments).id, length: pickR(rng, LENGTHS).id,
                octave: pickR(rng, [-2, -1, 0, 1, 2]), volume: Math.round((0.55 + rng() * 0.4) * 100) / 100,
                seed: Math.floor(rng() * 4294967295) >>> 0
            };
            if (rng() < 0.4) {
                var m = 1 + Math.floor(rng() * MAX_MIX);
                t.mixIds = [];
                for (var j = 0; j < m; j++) t.mixIds.push(pickR(rng, all).id);
                t.switchRule = pickR(rng, SWITCH_RULES).id;
            }
            tracks.push(t);
        }
        return {
            tracks: tracks, scale: pickR(rng, SCALES).id, key: Math.floor(rng() * 12) % 12,
            bpm: rangeR(rng, 70, 190), gate: rangeR(rng, 35, 100), space: rangeR(rng, 5, 65), drone: rng() < 0.3
        };
    }

    var TRACK_COLORS = ['#5cf08f', '#7fb2e8', '#d2f27a', '#f0b86e', '#6fd6d6', '#f29bb8'];
    var MAX_TRACKS = 6;

    function rand01(seed, i) {
        var x = (seed ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
        x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
        x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
        return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
    }

    function noteLength(track, i) {
        var D = track.digits, L = D.length, d = D.charCodeAt(i) - 48;
        var mode = LENGTH_BY_ID[track.length] || LENGTHS[0];
        var rest = mode.rest ? mode.rest(d) : false;
        var len;
        if (mode.fixed) len = mode.fixed(d);
        else if (mode.id === 'previous') len = LEN10[i ? D.charCodeAt(i - 1) - 48 : d];
        else if (mode.id === 'next') len = LEN10[D.charCodeAt((i + 1) % L) - 48];
        else if (mode.id === 'random') len = RANDOM_LENGTHS[Math.floor(rand01(track.seed, i) * RANDOM_LENGTHS.length)];
        else if (mode.id === 'swing') len = i % 2 ? 2 / 3 : 4 / 3;
        else if (mode.id === 'fibonacci') len = [0.5, 0.5, 1, 1.5, 2.5][i % 5];
        else len = 1;
        return { len: len, rest: rest };
    }

    function semitoneFor(d, scaleId) {
        var s = (SCALE_BY_ID[scaleId] || SCALES[0]).steps;
        return s[d % s.length] + 12 * Math.floor(d / s.length);
    }
    function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function noteName(m) { return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }
    function isKit(id) { return !!KIT_BY_ID[id]; }
    function kitPiece(kitId, d, step) {
        if (kitId === 'groove') return d ? GROOVE[Math.floor(step) % 8] : null;
        if (kitId === 'ratchet') return d ? 'hatC' : null;
        var k = KIT_BY_ID[kitId];
        return k && k.map ? k.map[d] : null;
    }

    // ── Audio engine ───────────────────────────────────────────────

    // Pass an OfflineAudioContext to render a file instead of playing live.
    function Engine(givenCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        var ctx = givenCtx || new AC();
        var master = ctx.createGain();
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
        master.connect(comp); comp.connect(ctx.destination);

        var dry = ctx.createGain(), wet = ctx.createGain(), verb = ctx.createConvolver();
        verb.buffer = impulse(ctx, 2.4, 2.6);
        dry.connect(master); verb.connect(wet); wet.connect(master);
        var bus = ctx.createGain();
        bus.connect(dry); bus.connect(verb);

        var noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        var nd = noise.getChannelData(0);
        for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

        var drone = null;

        function env(g, t, peak, attack, decay) {
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
            g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        }
        function hold(g, t, peak, attack, len, release) {
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
            g.gain.setValueAtTime(Math.max(0.0002, peak), t + Math.max(attack, len));
            g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(attack, len) + release);
        }
        function osc(type, f, t, stop) {
            var o = ctx.createOscillator();
            o.type = type; o.frequency.setValueAtTime(f, t);
            o.start(t); o.stop(stop);
            return o;
        }
        function gainTo(dest) { var g = ctx.createGain(); g.connect(dest); return g; }
        function noiseSrc(t, dur) { var s = ctx.createBufferSource(); s.buffer = noise; s.start(t); s.stop(t + dur); return s; }
        function filter(type, f, q) { var b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; }

        var voices = {
            bell: function (out, f, t, len, v) {
                var g = gainTo(out); env(g, t, 0.32 * v, 0.004, len + 0.9);
                osc('sine', f, t, t + len + 1).connect(g);
                var g2 = gainTo(out); env(g2, t, 0.09 * v, 0.002, 0.35);
                osc('sine', f * 2.756, t, t + 0.5).connect(g2);
            },
            pluck: function (out, f, t, len, v) {
                var lp = filter('lowpass', 1, 2);
                lp.frequency.setValueAtTime(Math.min(9000, f * 9), t);
                lp.frequency.exponentialRampToValueAtTime(Math.max(120, f * 1.2), t + 0.25 + len * 0.4);
                var g = gainTo(out); env(g, t, 0.26 * v, 0.003, 0.35 + len * 0.6);
                osc('sawtooth', f, t, t + len + 0.8).connect(lp); lp.connect(g);
            },
            glass: function (out, f, t, len, v) {
                var car = osc('sine', f, t, t + len + 1.2);
                var mod = osc('sine', f * 3.5, t, t + len + 1.2);
                var mg = ctx.createGain();
                mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.6);
                mod.connect(mg); mg.connect(car.frequency);
                var g = gainTo(out); env(g, t, 0.24 * v, 0.004, len + 1.1);
                car.connect(g);
            },
            marimba: function (out, f, t, len, v) {
                var g = gainTo(out); env(g, t, 0.36 * v, 0.002, 0.35 + Math.min(len, 0.4));
                osc('sine', f, t, t + 1).connect(g);
                var g2 = gainTo(out); env(g2, t, 0.1 * v, 0.001, 0.05);
                osc('sine', f * 4, t, t + 0.1).connect(g2);
            },
            kalimba: function (out, f, t, len, v) {
                var g = gainTo(out); env(g, t, 0.28 * v, 0.002, 0.9 + len * 0.3);
                osc('sine', f * 2, t, t + 1.4).connect(g);
                var g2 = gainTo(out); env(g2, t, 0.06 * v, 0.001, 0.12);
                osc('sine', f * 2 * 5.4, t, t + 0.2).connect(g2);
            },
            steel: function (out, f, t, len, v) {
                var car = osc('sine', f, t, t + len + 0.9);
                var mod = osc('sine', f * 2.5, t, t + len + 0.9);
                var mg = ctx.createGain();
                mg.gain.setValueAtTime(f * 1.4, t); mg.gain.exponentialRampToValueAtTime(f * 0.1, t + 0.3);
                mod.connect(mg); mg.connect(car.frequency);
                var g = gainTo(out); env(g, t, 0.26 * v, 0.003, 0.5 + len * 0.4);
                car.connect(g);
            },
            organ: function (out, f, t, len, v) {
                var g = gainTo(out); hold(g, t, 0.1 * v, 0.01, len, 0.08);
                [[1, 1], [2, 0.6], [3, 0.35], [4, 0.25], [6, 0.12]].forEach(function (p) {
                    var pg = ctx.createGain(); pg.gain.value = p[1];
                    osc('sine', f * p[0], t, t + len + 0.12).connect(pg); pg.connect(g);
                });
            },
            flute: function (out, f, t, len, v) {
                var g = gainTo(out); hold(g, t, 0.2 * v, 0.06, len, 0.12);
                var o = osc('sine', f, t, t + len + 0.2);
                var lfo = osc('sine', 5.2, t, t + len + 0.2), lg = ctx.createGain();
                lg.gain.value = f * 0.004; lfo.connect(lg); lg.connect(o.frequency);
                o.connect(g);
                var bg = gainTo(out); hold(bg, t, 0.025 * v, 0.03, len * 0.6, 0.05);
                var bp = filter('bandpass', f * 2, 1.5);
                noiseSrc(t, len + 0.1).connect(bp); bp.connect(bg);
            },
            strings: function (out, f, t, len, v) {
                var lp = filter('lowpass', 1500, 0.7);
                var g = gainTo(out); hold(g, t, 0.07 * v, Math.min(0.18, len * 0.5 + 0.03), len, 0.45);
                [-9, 0, 9].forEach(function (c) { var o = osc('sawtooth', f, t, t + len + 0.5); o.detune.value = c; o.connect(lp); });
                lp.connect(g);
            },
            pad: function (out, f, t, len, v) {
                var lp = filter('lowpass', 1800);
                var g = gainTo(out); hold(g, t, 0.14 * v, Math.min(0.12, len * 0.5 + 0.01), len, 0.5);
                [-7, 7].forEach(function (c) { var o = osc('triangle', f, t, t + len + 0.55); o.detune.value = c; o.connect(lp); });
                lp.connect(g);
            },
            lead: function (out, f, t, len, v) {
                var lp = filter('lowpass', 1, 4);
                lp.frequency.setValueAtTime(Math.min(8000, f * 8), t);
                lp.frequency.exponentialRampToValueAtTime(Math.min(4000, f * 3), t + 0.2);
                var g = gainTo(out); hold(g, t, 0.08 * v, 0.006, len, 0.06);
                [-6, 6].forEach(function (c) { var o = osc('sawtooth', f, t, t + len + 0.1); o.detune.value = c; o.connect(lp); });
                lp.connect(g);
            },
            chip: function (out, f, t, len, v) {
                var g = gainTo(out); hold(g, t, 0.09 * v, 0.003, len, 0.04);
                osc('square', f, t, t + len + 0.05).connect(g);
            },
            bass: function (out, f, t, len, v) {
                var lp = filter('lowpass', 1, 3);
                lp.frequency.setValueAtTime(Math.min(2400, f * 6), t);
                lp.frequency.exponentialRampToValueAtTime(Math.max(90, f * 1.5), t + 0.18);
                var g = gainTo(out); hold(g, t, 0.24 * v, 0.004, len, 0.08);
                osc('sawtooth', f, t, t + len + 0.1).connect(lp);
                var sg = ctx.createGain(); sg.gain.value = 0.8;
                osc('sine', f, t, t + len + 0.1).connect(sg); sg.connect(lp);
                lp.connect(g);
            },
            toms: function (out, f, t, len, v) {
                var o = osc('sine', f * 1.6, t, t + 0.6);
                o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
                var g = gainTo(out); env(g, t, 0.5 * v, 0.002, 0.32);
                o.connect(g);
            }
        };

        function drumTone(out, f0, f1, sweep, decay, peak, type) {
            return function (t, v) {
                var o = osc(type || 'sine', f0, t, t + decay + 0.05);
                if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
                var g = gainTo(out); env(g, t, peak * v, 0.002, decay);
                o.connect(g);
            };
        }
        function noiseHit(out, type, f, q, decay, peak, attack) {
            return function (t, v) {
                var fl = filter(type, f, q);
                var g = gainTo(out); env(g, t, peak * v, attack || 0.001, decay);
                noiseSrc(t, decay + 0.05).connect(fl); fl.connect(g);
            };
        }

        function pieces(out) {
            return {
                kick: drumTone(out, 150, 44, 0.12, 0.32, 0.8),
                kick808: drumTone(out, 120, 48, 0.25, 0.9, 0.85),
                snare: function (t, v) {
                    noiseHit(out, 'bandpass', 1900, 0.8, 0.16, 0.38)(t, v);
                    drumTone(out, 190, 190, 0, 0.09, 0.2, 'triangle')(t, v);
                },
                clap: function (t, v) {
                    [0, 0.011, 0.022].forEach(function (dt) { noiseHit(out, 'bandpass', 1200, 1.2, 0.03, 0.3)(t + dt, v); });
                    noiseHit(out, 'bandpass', 1200, 1, 0.18, 0.22)(t + 0.03, v);
                },
                hatC: noiseHit(out, 'highpass', 7000, 0, 0.05, 0.18),
                hatO: noiseHit(out, 'highpass', 6500, 0, 0.32, 0.13),
                tomL: drumTone(out, 130, 82, 0.1, 0.38, 0.6),
                tomM: drumTone(out, 190, 125, 0.1, 0.32, 0.55),
                tomH: drumTone(out, 270, 180, 0.1, 0.28, 0.5),
                rim: function (t, v) {
                    drumTone(out, 1700, 1700, 0, 0.03, 0.25, 'triangle')(t, v);
                    noiseHit(out, 'highpass', 3000, 0, 0.015, 0.2)(t, v);
                },
                cowbell: function (t, v) {
                    var bp = filter('bandpass', 2600, 1.5);
                    var g = gainTo(out); env(g, t, 0.3 * v, 0.002, 0.25);
                    osc('square', 540, t, t + 0.3).connect(bp); osc('square', 800, t, t + 0.3).connect(bp);
                    bp.connect(g);
                },
                shaker: noiseHit(out, 'bandpass', 6500, 1.2, 0.07, 0.2, 0.015),
                congaL: drumTone(out, 210, 190, 0.05, 0.22, 0.55),
                congaH: drumTone(out, 320, 300, 0.04, 0.16, 0.5),
                bongo: drumTone(out, 440, 410, 0.03, 0.11, 0.45),
                clave: drumTone(out, 2500, 2500, 0, 0.05, 0.3),
                zap: drumTone(out, 1300, 60, 0.12, 0.16, 0.4),
                zapHi: drumTone(out, 2600, 220, 0.07, 0.09, 0.3, 'triangle'),
                noise: noiseHit(out, 'lowpass', 3000, 0, 0.1, 0.3)
            };
        }

        return {
            ctx: ctx,
            now: function () { return ctx.currentTime; },
            resume: function () { return ctx.state === 'suspended' ? ctx.resume() : Promise.resolve(); },
            channel: function () {
                var g = ctx.createGain(), pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
                if (pan) { g.connect(pan); pan.connect(bus); } else g.connect(bus);
                return {
                    input: g,
                    drums: pieces(g),
                    setVolume: function (v) { g.gain.setTargetAtTime(v, ctx.currentTime, 0.03); },
                    setPan: function (p) { if (pan) pan.pan.setTargetAtTime(p, ctx.currentTime, 0.05); },
                    disconnect: function () { try { g.disconnect(); if (pan) pan.disconnect(); } catch (e) {} }
                };
            },
            note: function (ch, voice, f, t, len, v) { (voices[voice] || voices.bell)(ch.input, f, t, len, v); },
            drum: function (ch, piece, t, v) { if (ch.drums[piece]) ch.drums[piece](t, v); },
            setVolume: function (v) { master.gain.setTargetAtTime(v * v * 1.3, ctx.currentTime, 0.03); },
            setSpace: function (s) {
                wet.gain.setTargetAtTime(s * 0.9, ctx.currentTime, 0.05);
                dry.gain.setTargetAtTime(1 - s * 0.45, ctx.currentTime, 0.05);
            },
            setDrone: function (on, midi) {
                var t = ctx.currentTime;
                if (drone) {
                    var old = drone; drone = null;
                    old.g.gain.cancelScheduledValues(t);
                    old.g.gain.setTargetAtTime(0.0001, t, 0.25);
                    old.oscs.forEach(function (o) { o.stop(t + 1.5); });
                }
                if (!on) return;
                var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.setTargetAtTime(0.05, t, 0.6);
                var lp = filter('lowpass', 700);
                var oscs = [midi - 12, midi - 5].map(function (m, i) {
                    var o = ctx.createOscillator(); o.type = i ? 'triangle' : 'sawtooth';
                    o.frequency.value = midiToFreq(m); o.detune.value = i ? 4 : -4;
                    o.connect(lp); o.start(t); return o;
                });
                lp.connect(g); g.connect(bus);
                drone = { g: g, oscs: oscs };
            },
            close: function () { if (!givenCtx) { try { ctx.close(); } catch (e) {} } }
        };
    }

    function impulse(ctx, seconds, decay) {
        var len = Math.floor(ctx.sampleRate * seconds);
        var buf = ctx.createBuffer(2, len, ctx.sampleRate);
        for (var c = 0; c < 2; c++) {
            var d = buf.getChannelData(c);
            for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
        }
        return buf;
    }

    // ── Helpers ────────────────────────────────────────────────────

    function cssVar(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
    }

    function sizeCanvas(canvas) {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var r = canvas.getBoundingClientRect();
        var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        }
        var c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { c: c, w: w, h: h };
    }

    function roundRect(c, x, y, w, h, r) {
        r = Math.max(0, Math.min(r, w / 2, h / 2));
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }

    function hexA(hex, a) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }

    function codePoints(text) {
        var parts = [];
        for (var ch of text) parts.push({ ch: ch, code: ch.codePointAt(0) });
        return parts;
    }

    function plural(n, word) { return n.toLocaleString() + ' ' + word + (n === 1 ? '' : 's'); }

    function cleanDigits(raw) {
        var digits = '', ignored = 0;
        for (var i = 0; i < raw.length; i++) {
            var ch = raw.charCodeAt(i);
            if (ch >= 48 && ch <= 57) digits += raw[i];
            else if (!/[\s.,_]/.test(raw[i])) ignored++;
        }
        return { digits: digits, ignored: ignored };
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function upperBound(arr, n, x) { var lo = 0, hi = n; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] <= x) lo = m + 1; else hi = m; } return lo; }

    function b64encode(str) {
        var bytes = new TextEncoder().encode(str), bin = '';
        bytes.forEach(function (b) { bin += String.fromCharCode(b); });
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function b64decode(str) {
        var bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder().decode(bytes);
    }

    // ── Page ───────────────────────────────────────────────────────

    function initNumesthesia() {
        var root = document.getElementById('numesthesia');
        if (!root || root.dataset.nmReady === 'true') return;
        if (typeof window.__numesthesiaCleanup === 'function') window.__numesthesiaCleanup();
        root.dataset.nmReady = 'true';

        var $ = function (id) { return document.getElementById(id); };
        var el = {
            name: $('nm-source-name'), value: $('nm-source-value'), pos: $('nm-pos'), len: $('nm-len'),
            roll: $('nm-roll'), tape: $('nm-tape'), play: $('nm-play'), restart: $('nm-restart'),
            loop: $('nm-loop'), seek: $('nm-seek'), input: $('nm-input'), ascii: $('nm-ascii'),
            use: $('nm-use'), file: $('nm-file'), message: $('nm-message'), custom: $('nm-custom'),
            scale: $('nm-scale'), key: $('nm-key'), space: $('nm-space'), volume: $('nm-volume'),
            drone: $('nm-drone'), tempo: $('nm-tempo'), gate: $('nm-gate'),
            tracks: $('nm-tracks'), add: $('nm-add'), randomCount: $('nm-random-count'),
            randomKeep: $('nm-random-keep'), randomize: $('nm-randomize'), share: $('nm-share'),
            randomStyle: $('nm-random-style'), randomDigits: $('nm-random-digits'),
            exportFormat: $('nm-export-format'), exportQuality: $('nm-export-quality'), exportQualityField: $('nm-export-quality-field'),
            exportAmount: $('nm-export-amount'), exportAmountLabel: $('nm-export-amount-label'), exportUnit: $('nm-export-unit'),
            exportStart: $('nm-export-start'), exportFade: $('nm-export-fade'), exportFadeField: $('nm-export-fade-field'),
            exportButton: $('nm-export'), exportStatus: $('nm-export-status'), exportProgress: $('nm-export-progress'),
            exportSummary: $('nm-export-summary'),
            mixMessage: $('nm-mix-message'),
            circle: $('nm-circle'), hist: $('nm-hist'), circleText: $('nm-circle-text'), histText: $('nm-hist-text'),
            table: $('nm-table-body'), tableDrum: $('nm-table-drum'), tableTrack: $('nm-table-track')
        };

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        var colors = {
            ink0: cssVar('--ink-0', '#0b0f0d'), ink1: cssVar('--ink-1', '#111714'), ink2: cssVar('--ink-2', '#172019'),
            ink3: cssVar('--ink-3', '#1f2a23'), line: cssVar('--line', '#223029'), lineStrong: cssVar('--line-strong', '#31443a'),
            text: cssVar('--text', '#e3eae5'), text2: cssVar('--text-2', '#a7b6ac'), text3: cssVar('--text-3', '#7d8f84'),
            signal: cssVar('--signal', '#5cf08f'), signalInk: cssVar('--signal-ink', '#04120a')
        };
        var MONO = '"Geist Mono", "Cascadia Code", ui-monospace, Consolas, monospace';

        var state = {
            tracks: [], focus: 0, customs: [], customCount: 0, mode: 'digits',
            playing: false, loop: true,
            S: 0,              // transport position in steps while paused
            S0: 0, t0: 0,      // anchor: step S0 sounds at audio time t0
            flashDecay: 5
        };
        var engine = null, timer = 0, raf = 0, playToken = 0, trackSeq = 0;

        function globals() {
            return {
                key: parseInt(el.key.value, 10), scale: el.scale.value,
                bpm: parseInt(el.tempo.value, 10), gate: parseInt(el.gate.value, 10) / 100
            };
        }
        function stepDur() { return 60 / globals().bpm / 2; }
        function midiFor(track, d) { var g = globals(); return 60 + g.key + track.octave * 12 + semitoneFor(d, g.scale); }
        function allSources() { return SOURCES.concat(state.customs); }
        function findSource(id) { var all = allSources(); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }
        function anySolo() { return state.tracks.some(function (t) { return t.solo; }); }
        function audible(t) { return !t.mute && (!anySolo() || t.solo); }
        function focused() { return state.tracks[Math.min(state.focus, state.tracks.length - 1)]; }

        // ── Selects ──
        NOTE_NAMES.forEach(function (n, i) {
            var o = document.createElement('option'); o.value = String(i); o.textContent = n; el.key.appendChild(o);
        });
        el.key.value = '0';
        SCALES.forEach(function (s) {
            var o = document.createElement('option'); o.value = s.id; o.textContent = s.name; el.scale.appendChild(o);
        });
        el.scale.value = 'majorPent';
        for (var n = 1; n <= MAX_TRACKS; n++) {
            var o = document.createElement('option'); o.value = String(n); o.textContent = plural(n, 'track'); el.randomCount.appendChild(o);
        }
        el.randomCount.value = '3';

        function sourceOptionsHtml() {
            var html = '', groups = ['math', 'pattern', 'science', 'custom'];
            groups.forEach(function (g) {
                var items = allSources().filter(function (s) { return s.group === g; });
                if (!items.length) return;
                html += '<optgroup label="' + GROUP_LABELS[g] + '">';
                items.forEach(function (s) { html += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>'; });
                html += '</optgroup>';
            });
            return html;
        }
        function instrumentOptionsHtml() {
            var html = '<optgroup label="Instruments">';
            INSTRUMENTS.forEach(function (i) { html += '<option value="' + i.id + '">' + i.name + '</option>'; });
            html += '</optgroup><optgroup label="Drum kits">';
            KITS.forEach(function (k) { html += '<option value="' + k.id + '">' + k.name + '</option>'; });
            return html + '</optgroup>';
        }
        function lengthOptionsHtml() {
            return LENGTHS.map(function (l) { return '<option value="' + l.id + '">' + l.name + '</option>'; }).join('');
        }
        function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

        // ── Tracks ──
        function makeTrack(opts) {
            var used = state.tracks.map(function (t) { return t.color; });
            var color = TRACK_COLORS.filter(function (c) { return used.indexOf(c) < 0; })[0] || TRACK_COLORS[0];
            var t = {
                id: ++trackSeq, color: color,
                sourceId: opts.sourceId || 'pi', instrument: opts.instrument || 'bell',
                mixIds: (opts.mixIds || []).slice(0, MAX_MIX), switchRule: SWITCH_BY_ID[opts.switchRule] ? opts.switchRule : 'blocks8',
                length: opts.length || 'steady', octave: opts.octave || 0,
                volume: opts.volume == null ? 0.8 : opts.volume,
                mute: !!opts.mute, solo: !!opts.solo,
                seed: opts.seed || (Math.random() * 4294967296) >>> 0,
                queue: [], current: -1, flash: 0, counts: new Array(10).fill(0), played: 0, walk: [],
                nextIdx: 0, nextS: 0, done: false, channel: null
            };
            computeTimeline(t);
            return t;
        }

        function computeTimeline(t) {
            var src = findSource(t.sourceId) || SOURCES[0];
            t.sourceId = src.id;
            t.mixIds = t.mixIds.map(function (id) { return findSource(id) ? id : 'e'; });
            if (t.mixIds.length) {
                var woven = weave([sourceDigits(src)].concat(t.mixIds.map(function (id) { return sourceDigits(findSource(id)); })), t.switchRule, t.seed);
                t.digits = woven.digits;
                t.origin = woven.origin;
            } else {
                t.digits = sourceDigits(src);
                t.origin = null;
            }
            var L = t.digits.length;
            t.lens = new Float32Array(L);
            t.rests = new Uint8Array(L);
            t.starts = new Float64Array(L + 1);
            var s = 0;
            for (var i = 0; i < L; i++) {
                var r = noteLength(t, i);
                t.lens[i] = r.len; t.rests[i] = r.rest ? 1 : 0;
                t.starts[i] = s; s += r.len;
            }
            t.starts[L] = s;
            t.total = s;
        }

        function resetStats() {
            state.tracks.forEach(function (t) { t.counts = new Array(10).fill(0); t.played = 0; t.walk = []; t.current = -1; });
        }

        function maxTotal() { return state.tracks.reduce(function (m, t) { return Math.max(m, t.total); }, 0); }

        function attachChannel(t) {
            if (!engine || t.channel) return;
            t.channel = engine.channel();
            updateChannel(t);
        }
        function updateChannel(t) {
            if (!t.channel) return;
            t.channel.setVolume(audible(t) ? t.volume : 0);
            var n = state.tracks.length, k = state.tracks.indexOf(t);
            t.channel.setPan(n > 1 ? (k / (n - 1) - 0.5) * 0.7 : 0);
        }
        function updateAllChannels() { state.tracks.forEach(updateChannel); }

        function renderTracks() {
            el.tracks.innerHTML = '';
            var srcHtml = sourceOptionsHtml(), instHtml = instrumentOptionsHtml(), lenHtml = lengthOptionsHtml();
            state.tracks.forEach(function (t, k) {
                var row = document.createElement('div');
                row.className = 'nm-track' + (k === state.focus ? ' is-focus' : '');
                row.style.setProperty('--track', t.color);
                row.dataset.track = String(t.id);
                var pid = 'nm-t' + t.id;
                row.innerHTML =
                    '<button type="button" class="nm-track-name" data-act="focus" aria-pressed="' + (k === state.focus) + '" title="Show this track in the readout and charts">' +
                        '<span class="nm-swatch" aria-hidden="true"></span>Track ' + (k + 1) + '</button>' +
                    '<div class="nm-tf nm-tf-source"><label for="' + pid + '-src">Number</label><select id="' + pid + '-src" data-k="sourceId">' + srcHtml + '</select></div>' +
                    '<div class="nm-tf nm-tf-sound"><label for="' + pid + '-inst">Sound</label><select id="' + pid + '-inst" data-k="instrument">' + instHtml + '</select></div>' +
                    '<div class="nm-tf nm-tf-length"><label for="' + pid + '-len">Note lengths</label><select id="' + pid + '-len" data-k="length">' + lenHtml + '</select></div>' +
                    '<div class="nm-tf nm-tf-oct"><label for="' + pid + '-oct">Octave</label><select id="' + pid + '-oct" data-k="octave">' +
                        [-2, -1, 0, 1, 2].map(function (o) { return '<option value="' + o + '">' + (o > 0 ? '+' + o : o === 0 ? '0' : '−' + (-o)) + '</option>'; }).join('') + '</select></div>' +
                    '<div class="nm-tf nm-tf-level"><label for="' + pid + '-vol">Level <output>' + Math.round(t.volume * 100) + '%</output></label><input type="range" id="' + pid + '-vol" data-k="volume" min="0" max="100" value="' + Math.round(t.volume * 100) + '" /></div>' +
                    '<div class="nm-track-buttons">' +
                        '<button type="button" class="nm-small" data-act="mute" aria-pressed="' + t.mute + '">Mute</button>' +
                        '<button type="button" class="nm-small" data-act="solo" aria-pressed="' + t.solo + '">Solo</button>' +
                        '<button type="button" class="nm-small nm-remove" data-act="remove" aria-label="Remove track ' + (k + 1) + '" title="Remove track"' + (state.tracks.length === 1 ? ' disabled' : '') + '>' +
                            '<svg class="nm-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
                    '</div>' +
                    '<div class="nm-track-mix">' +
                        '<span class="nm-mix-label">Mix in</span>' +
                        t.mixIds.map(function (id, j) {
                            return '<div class="nm-mix-part"><label class="nm-visually-hidden" for="' + pid + '-mix' + j + '">Mixed-in number ' + (j + 2) + '</label>' +
                                '<span class="nm-mix-shape" data-shape="' + (j + 1) + '" aria-hidden="true"></span>' +
                                '<select id="' + pid + '-mix' + j + '" data-mix="' + j + '">' + srcHtml + '</select>' +
                                '<button type="button" class="nm-small nm-remove" data-act="unmix" data-j="' + j + '" aria-label="Stop mixing in number ' + (j + 2) + '">' +
                                '<svg class="nm-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>';
                        }).join('') +
                        (t.mixIds.length < MAX_MIX ? '<button type="button" class="nm-small nm-mix-add" data-act="mixadd">' +
                            '<svg class="nm-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' + (t.mixIds.length ? 'Another number' : 'Another number in this track') + '</button>' : '') +
                        (t.mixIds.length ? '<div class="nm-mix-rule"><label class="nm-visually-hidden" for="' + pid + '-sw">How the numbers switch</label><select id="' + pid + '-sw" data-k="switchRule">' +
                            SWITCH_RULES.map(function (r) { return '<option value="' + r.id + '">' + r.name + '</option>'; }).join('') + '</select></div>' : '') +
                    '</div>';
                row.querySelector('[data-k="sourceId"]').value = t.sourceId;
                row.querySelector('[data-k="instrument"]').value = t.instrument;
                row.querySelector('[data-k="length"]').value = t.length;
                row.querySelector('[data-k="octave"]').value = String(t.octave);
                t.mixIds.forEach(function (id, j) { row.querySelector('[data-mix="' + j + '"]').value = id; });
                var sw = row.querySelector('[data-k="switchRule"]');
                if (sw) sw.value = t.switchRule;
                el.tracks.appendChild(row);
            });
            el.add.disabled = state.tracks.length >= MAX_TRACKS;
        }

        function trackFromRow(node) {
            var row = node.closest('[data-track]');
            if (!row) return null;
            var id = parseInt(row.dataset.track, 10);
            for (var i = 0; i < state.tracks.length; i++) if (state.tracks[i].id === id) return state.tracks[i];
            return null;
        }

        function setFocus(k) {
            state.focus = Math.max(0, Math.min(state.tracks.length - 1, k));
            el.tracks.querySelectorAll('.nm-track').forEach(function (row, i) {
                row.classList.toggle('is-focus', i === state.focus);
                row.querySelector('[data-act="focus"]').setAttribute('aria-pressed', String(i === state.focus));
            });
            updateHead();
            renderTable();
            redraw();
            updateSeekMax();
        }

        function trackChanged(t, rebuildTimeline) {
            var pos = positionNow();
            if (rebuildTimeline) {
                computeTimeline(t);
                t.counts = new Array(10).fill(0); t.played = 0; t.walk = [];
            }
            if (state.playing) { t.queue = []; placeTrack(t, Math.max(pos, stepAt(engine.now() + 0.05))); }
            updateSeekMax();
            updateHead();
            renderTable();
            redraw();
        }

        function setTracks(list, keepFocus) {
            var playing = state.playing;
            if (playing) pause();
            state.tracks.forEach(function (t) { if (t.channel) t.channel.disconnect(); });
            state.tracks = [];
            list.forEach(function (o) { state.tracks.push(makeTrack(o)); });
            if (!keepFocus) state.focus = 0;
            if (engine) state.tracks.forEach(attachChannel);
            updateAllChannels();
            renderTracks();
            updateSeekMax();
            seekTo(0);
            updateHead();
            renderTable();
            if (playing) play();
        }

        // ── Transport ──
        function stepAt(t) { return state.S0 + (t - state.t0) / stepDur(); }
        function timeAt(S) { return state.t0 + (S - state.S0) * stepDur(); }
        function positionNow() { return state.playing && engine ? Math.max(0, stepAt(engine.now())) : state.S; }

        function placeTrack(t, S) {
            var L = t.digits.length;
            t.done = false;
            if (!t.total) { t.done = true; return; }
            var cycle = 0, local = S;
            if (state.loop) { cycle = Math.floor(S / t.total); local = S - cycle * t.total; }
            else if (S >= t.total) { t.done = true; t.nextIdx = L; t.nextS = t.total; return; }
            // First note that starts at or after S.
            var i = upperBound(t.starts, L, local - 1e-9);
            if (i > 0 && Math.abs(t.starts[i - 1] - local) < 1e-9) i--;
            if (i >= L) { if (state.loop) { i = 0; cycle++; } else { t.done = true; t.nextIdx = L; return; } }
            t.nextIdx = i;
            t.nextS = cycle * t.total + t.starts[i];
        }

        function ensureEngine() {
            if (engine) return engine;
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) { setMessage('This browser has no Web Audio support, so it can draw the digits but not play them.', true); return null; }
            engine = Engine();
            engine.setVolume(el.volume.value / 100);
            engine.setSpace(el.space.value / 100);
            state.tracks.forEach(attachChannel);
            return engine;
        }

        function play() {
            if (!state.tracks.length || !ensureEngine()) return;
            if (!state.loop && state.S >= maxTotal()) state.S = 0;
            state.playing = true;
            el.play.querySelector('.nm-play-label').textContent = 'Pause';
            root.classList.add('is-playing');
            var token = ++playToken;
            engine.resume().then(function () {
                if (token !== playToken || !state.playing || !engine) return;
                state.t0 = engine.now() + 0.06;
                state.S0 = state.S;
                state.tracks.forEach(function (t) { t.queue = []; placeTrack(t, state.S); });
                if (el.drone.checked) engine.setDrone(true, 48 + globals().key);
                clearInterval(timer);
                timer = setInterval(schedule, 25);
                schedule();
                loop();
            });
        }

        function pause() {
            if (state.playing && engine) state.S = Math.max(0, stepAt(engine.now()));
            state.playing = false;
            playToken++;
            clearInterval(timer);
            el.play.querySelector('.nm-play-label').textContent = 'Play';
            root.classList.remove('is-playing');
            if (engine) engine.setDrone(false);
            state.tracks.forEach(function (t) { t.queue = []; });
        }

        function seekTo(S) {
            state.S = Math.max(0, S);
            if (state.playing && engine) {
                state.t0 = engine.now() + 0.04;
                state.S0 = state.S;
                state.tracks.forEach(function (t) { t.queue = []; placeTrack(t, state.S); });
            }
            el.seek.value = String(Math.floor(state.S));
            updateHead();
            redraw();
        }

        function playDigit(t, i, s, when, eng, ch) {
            eng = eng || engine; ch = ch || t.channel;
            var d = t.digits.charCodeAt(i) - 48, g = globals();
            var lenSec = t.lens[i] * stepDur();
            if (t.rests[i] || !ch) return d;
            if (isKit(t.instrument)) {
                if (t.instrument === 'ratchet') {
                    for (var h = 0; h < d; h++) eng.drum(ch, 'hatC', when + h * lenSec / d, h === 0 ? 1 : 0.6);
                } else {
                    var piece = kitPiece(t.instrument, d, s);
                    if (piece) eng.drum(ch, piece, when, t.instrument === 'groove' ? 0.35 + d * 0.07 : 0.65 + d * 0.04);
                }
            } else {
                eng.note(ch, t.instrument, midiToFreq(midiFor(t, d)), when, Math.max(0.03, lenSec * g.gate), 1);
            }
            return d;
        }

        function schedule() {
            if (!state.playing || !engine) return;
            var ahead = document.hidden ? 1.5 : 0.12;
            var horizon = stepAt(engine.now() + ahead);
            state.tracks.forEach(function (t) {
                var L = t.digits.length, guard = 0;
                while (!t.done && t.nextS < horizon && guard++ < 512) {
                    var i = t.nextIdx, s = t.nextS, when = timeAt(s);
                    var d = playDigit(t, i, s, when);
                    t.queue.push({ i: i, d: d, s: s, t: when, rest: !!t.rests[i] });
                    t.nextS += t.lens[i];
                    t.nextIdx++;
                    if (t.nextIdx >= L) {
                        if (state.loop) t.nextIdx = 0;
                        else t.done = true;
                    }
                }
            });
        }

        function record(t, ev) {
            if (!ev.rest) { t.counts[ev.d]++; t.played++; }
            t.walk.push(ev.d);
            if (t.walk.length > 120) t.walk.shift();
            t.flash = 1;
        }

        function retireEvents() {
            if (!engine || !state.playing) return;
            var now = engine.now();
            state.tracks.forEach(function (t) {
                while (t.queue.length && t.queue[0].t <= now) {
                    var ev = t.queue.shift();
                    record(t, ev);
                    t.current = ev.i;
                }
            });
            if (!state.loop && stepAt(now) >= maxTotal() + 0.5) { pause(); seekTo(0); }
        }

        // ── Readouts ──
        function setMessage(text, isError) {
            el.message.textContent = text;
            el.message.classList.toggle('is-error', !!isError);
        }
        function setMixMessage(text) { el.mixMessage.textContent = text; }

        function currentIndex(t, S) {
            if (!t.total) return 0;
            var local = state.loop ? S - Math.floor(S / t.total) * t.total : Math.min(S, t.total - 1e-6);
            return Math.max(0, Math.min(t.digits.length - 1, upperBound(t.starts, t.digits.length, local) - 1));
        }

        function updateHead() {
            var t = focused();
            if (!t) return;
            var src = findSource(t.sourceId) || SOURCES[0];
            el.name.style.setProperty('--track', t.color);
            if (t.mixIds.length) {
                var parts = [src].concat(t.mixIds.map(findSource));
                var at = t.origin ? t.origin[currentIndex(t, positionNow())] : 0;
                el.name.textContent = parts.map(function (p2) { return p2.short || p2.name; }).join(' + ');
                el.value.textContent = SWITCH_BY_ID[t.switchRule].name + ' · now ' + parts[at].name;
            } else {
                el.name.textContent = src.name;
                el.value.textContent = sourceValue(src);
            }
            var i = currentIndex(t, positionNow());
            el.pos.textContent = (i + 1).toLocaleString();
            el.len.textContent = t.digits.length.toLocaleString();
            var start = Math.max(0, i - 14), end = Math.min(t.digits.length, i + 30);
            el.tape.innerHTML = '';
            el.tape.classList.toggle('at-start', start === 0);
            el.tape.style.setProperty('--track', t.color);
            var before = document.createElement('span'); before.className = 'nm-tape-past';
            before.textContent = (start > 0 ? '…' : '') + t.digits.slice(start, i);
            var cur = document.createElement('mark'); cur.textContent = t.digits.charAt(i);
            var after = document.createElement('span');
            after.textContent = t.digits.slice(i + 1, end) + (end < t.digits.length ? '…' : '');
            el.tape.appendChild(before); el.tape.appendChild(cur); el.tape.appendChild(after);
        }

        function updateSeekMax() {
            el.seek.max = String(Math.max(1, Math.ceil(maxTotal())));
            if (typeof updateExportSummary === 'function' && el.exportSummary) updateExportSummary();
        }

        function updateStatsText() {
            var t = focused();
            if (!t || !t.played) {
                el.histText.textContent = 'No digits played yet.';
                el.circleText.textContent = 'Press play to start the walk.';
                return;
            }
            var max = 0, min = 0;
            for (var d = 1; d < 10; d++) {
                if (t.counts[d] > t.counts[max]) max = d;
                if (t.counts[d] < t.counts[min]) min = d;
            }
            var pct = function (n) { return (100 * n / t.played).toFixed(1) + '%'; };
            var k = state.tracks.indexOf(t) + 1;
            el.histText.textContent = 'Track ' + k + ': after ' + plural(t.played, 'note') + ', ' + max + ' leads at ' + pct(t.counts[max]) +
                ' and ' + min + ' trails at ' + pct(t.counts[min]) + '. An even spread is 10% each.';
            el.circleText.textContent = state.tracks.map(function (tr, j) {
                return 'Track ' + (j + 1) + ': ' + (tr.walk.length ? tr.walk.slice(-6).join(' → ') : 'waiting');
            }).join(' · ');
        }

        // ── Drawing ──
        var lanesGeom = { top: 0, laneH: 0 };

        function forEachNote(t, a, b, cb) {
            if (!t.total) return;
            var L = t.digits.length;
            var c0 = state.loop ? Math.floor(a / t.total) : 0, c1 = state.loop ? Math.floor(b / t.total) : 0;
            for (var c = Math.max(0, c0); c <= c1; c++) {
                var base = c * t.total;
                var i = Math.max(0, upperBound(t.starts, L, a - base) - 1);
                for (; i < L; i++) {
                    var s = base + t.starts[i];
                    if (s > b) break;
                    cb(i, s, t.lens[i]);
                }
            }
        }

        function drawRoll(S) {
            var n = state.tracks.length;
            var narrow = el.roll.getBoundingClientRect().width < 560;
            var laneH = narrow ? (n <= 2 ? 130 : n <= 4 ? 96 : 80) : (n <= 2 ? 150 : n <= 4 ? 116 : 96);
            var wantH = n * laneH;
            if (Math.abs(el.roll.getBoundingClientRect().height - wantH) > 1) el.roll.style.height = wantH + 'px';
            var g = sizeCanvas(el.roll), c = g.c, W = g.w, H = g.h;
            lanesGeom.laneH = laneH;
            c.clearRect(0, 0, W, H);

            var gutter = narrow ? 58 : 92;
            var cell = narrow ? 18 : 26;
            var playX = gutter + Math.max(40, (W - gutter) * 0.3);
            var a = S - (playX - gutter) / cell - 1, b = S + (W - playX) / cell + 1;
            var focus = focused();

            state.tracks.forEach(function (t, k) {
                var y0 = k * laneH, pad = 12;
                var rowY = function (d) { return y0 + pad + (laneH - pad * 2) * (1 - d / 9); };
                var muted = !audible(t);
                if (k > 0) {
                    c.strokeStyle = colors.line; c.lineWidth = 1;
                    c.beginPath(); c.moveTo(0, y0 + 0.5); c.lineTo(W, y0 + 0.5); c.stroke();
                }
                if (t === focus && n > 1) {
                    c.fillStyle = hexA(t.color, 0.035);
                    c.fillRect(0, y0 + (k ? 1 : 0), W, laneH - (k ? 1 : 0));
                }
                // Lane header
                c.textBaseline = 'alphabetic'; c.textAlign = 'left';
                var src = findSource(t.sourceId) || SOURCES[0];
                c.fillStyle = muted ? colors.text3 : t.color;
                c.font = '600 12px ' + MONO;
                var laneLabel = (src.short || src.name).slice(0, narrow ? 4 : 7) + (t.mixIds.length ? '+' + t.mixIds.length : '');
                c.fillText(String(k + 1) + ' ' + laneLabel, 10, y0 + 22);
                c.fillStyle = colors.text3;
                c.font = '500 10px ' + MONO;
                var inst = INSTRUMENT_NAME[t.instrument] || '';
                c.fillText(inst.split(' (')[0].slice(0, narrow ? 6 : 12), 10, y0 + 37);
                if (muted) c.fillText(t.mute ? 'muted' : 'not soloed', 10, y0 + 51);
                // Row guides: 0 at the bottom, 9 at the top
                c.strokeStyle = colors.line; c.lineWidth = 1; c.globalAlpha = 0.55;
                for (var d = 0; d < 10; d += 1) {
                    var yy = Math.round(rowY(d)) + 0.5;
                    c.beginPath(); c.moveTo(gutter, yy); c.lineTo(W, yy); c.stroke();
                }
                c.globalAlpha = 1;
                c.fillStyle = colors.text3; c.font = '500 9px ' + MONO; c.textAlign = 'right'; c.textBaseline = 'middle';
                c.fillText('9', gutter - 6, rowY(9)); c.fillText('0', gutter - 6, rowY(0));

                c.save();
                c.beginPath(); c.rect(gutter, y0 + 1, W - gutter, laneH - 2); c.clip();
                if (muted) c.globalAlpha = 0.4;
                var rowGap = (laneH - pad * 2) / 9;
                var h = Math.max(7, Math.min(16, rowGap * 1.5));
                var kit = isKit(t.instrument);

                // Melodic contour
                if (!kit) {
                    c.beginPath();
                    var started = false;
                    forEachNote(t, a, b, function (i, s, len) {
                        if (t.rests[i]) return;
                        var x = playX + (s - S) * cell + 3, y = rowY(t.digits.charCodeAt(i) - 48);
                        if (!started) { c.moveTo(x, y); started = true; } else c.lineTo(x, y);
                    });
                    c.strokeStyle = hexA(t.color, 0.28); c.lineWidth = 1.25; c.stroke();
                }

                forEachNote(t, a, b, function (i, s, len) {
                    var dg = t.digits.charCodeAt(i) - 48;
                    var x = playX + (s - S) * cell, w = Math.max(3, len * cell - 2), y = rowY(dg);
                    var isCur = S >= s && S < s + len && (state.playing || S > 0 || s === 0);
                    var past = s + len <= S;
                    var grow = isCur && !reduceMotion.matches ? t.flash * 3 : 0;
                    // Mixed-in numbers draw with their own corner shape.
                    var shapes = kit ? [h / 2, 4, 1, h / 2] : [4, h / 2, 1, 4];
                    var r = shapes[t.origin ? t.origin[i] : 0];
                    roundRect(c, x - grow / 2, y - h / 2 - grow / 2, w + grow, h + grow, r);
                    if (t.rests[i]) {
                        c.setLineDash([2, 3]);
                        c.strokeStyle = isCur ? t.color : colors.lineStrong; c.lineWidth = 1; c.stroke();
                        c.setLineDash([]);
                        return;
                    }
                    if (isCur) {
                        c.fillStyle = t.color; c.fill();
                    } else if (past) {
                        c.fillStyle = hexA(t.color, 0.16); c.fill();
                        c.strokeStyle = hexA(t.color, 0.45); c.lineWidth = 1; c.stroke();
                    } else {
                        c.fillStyle = colors.ink1; c.fill();
                        c.strokeStyle = colors.lineStrong; c.lineWidth = 1; c.stroke();
                    }
                    if (w >= 11 && h >= 10) {
                        c.fillStyle = isCur ? colors.signalInk : past ? colors.text : colors.text3;
                        c.font = (isCur ? '700 ' : '500 ') + (h >= 13 ? 11 : 9) + 'px ' + MONO;
                        c.textAlign = 'center'; c.textBaseline = 'middle';
                        c.fillText(String(dg), x + Math.min(w / 2, 7), y + 0.5);
                    }
                });
                c.restore();
            });

            // Edge fades so notes slide in and out instead of popping
            var fadeL = c.createLinearGradient(gutter, 0, gutter + 36, 0);
            fadeL.addColorStop(0, colors.ink1); fadeL.addColorStop(1, hexA(colors.ink1, 0));
            c.fillStyle = fadeL; c.fillRect(gutter, 0, 36, H);
            var fadeR = c.createLinearGradient(W - 56, 0, W, 0);
            fadeR.addColorStop(0, hexA(colors.ink1, 0)); fadeR.addColorStop(1, colors.ink1);
            c.fillStyle = fadeR; c.fillRect(W - 56, 0, 56, H);

            // Playhead
            c.strokeStyle = colors.signal; c.globalAlpha = 0.55; c.lineWidth = 1;
            c.beginPath(); c.moveTo(Math.round(playX) + 0.5, 2); c.lineTo(Math.round(playX) + 0.5, H - 2); c.stroke();
            c.globalAlpha = 1;
        }

        function drawCircle() {
            var g = sizeCanvas(el.circle), c = g.c, W = g.w, H = g.h;
            c.clearRect(0, 0, W, H);
            var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 30;
            var pt = function (d, r) {
                var ang = -Math.PI / 2 + d * Math.PI / 5;
                return { x: cx + Math.cos(ang) * (r || R), y: cy + Math.sin(ang) * (r || R) };
            };
            c.strokeStyle = colors.line; c.lineWidth = 1;
            c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();

            var focus = focused(), current = {};
            state.tracks.forEach(function (t) {
                var w = t.walk, n = Math.min(w.length, 70), off = w.length - n;
                for (var i = 1; i < n; i++) {
                    var p = w[off + i - 1], q = w[off + i];
                    var a = pt(p), b = pt(q), newest = i === n - 1;
                    c.beginPath();
                    if (p === q) { var o = pt(q, R - 12); c.arc(o.x, o.y, 12, 0, Math.PI * 2); }
                    else {
                        c.moveTo(a.x, a.y);
                        c.quadraticCurveTo(cx + ((a.x + b.x) / 2 - cx) * 0.25, cy + ((a.y + b.y) / 2 - cy) * 0.25, b.x, b.y);
                    }
                    var age = (n - i) / n;
                    c.strokeStyle = t.color;
                    c.globalAlpha = newest ? 1 : Math.max(0.04, (t === focus ? 0.5 : 0.28) * (1 - age));
                    c.lineWidth = newest ? 2 : 1;
                    c.stroke();
                }
                if (w.length) current[w[w.length - 1]] = current[w[w.length - 1]] || t.color;
            });
            c.globalAlpha = 1;

            c.font = '500 12px ' + MONO; c.textAlign = 'center'; c.textBaseline = 'middle';
            for (var d = 0; d < 10; d++) {
                var p = pt(d), lp = pt(d, R + 17), col = current[d];
                c.beginPath(); c.arc(p.x, p.y, col ? 6 : 4, 0, Math.PI * 2);
                c.fillStyle = col || colors.ink2; c.fill();
                c.strokeStyle = col || colors.lineStrong; c.lineWidth = 1; c.stroke();
                c.fillStyle = col || colors.text2;
                c.fillText(String(d), lp.x, lp.y);
            }
        }

        function drawHist() {
            var g = sizeCanvas(el.hist), c = g.c, W = g.w, H = g.h;
            c.clearRect(0, 0, W, H);
            var padL = 36, padR = 4, padT = 16, padB = 28;
            var gw = (W - padL - padR) / 10;
            var tracks = state.tracks, n = tracks.length;
            var maxShare = 0.2;
            tracks.forEach(function (t) { for (var d = 0; d < 10; d++) if (t.played) maxShare = Math.max(maxShare, t.counts[d] / t.played * 1.15); });
            var y0 = H - padB, span = y0 - padT;
            var focus = focused();
            for (var d = 0; d < 10; d++) {
                var gx = padL + d * gw + gw * 0.12, inner = gw * 0.76, bw = inner / n;
                c.fillStyle = colors.ink2;
                roundRect(c, gx, padT, inner, span, 4); c.fill();
                tracks.forEach(function (t, k) {
                    var share = t.played ? t.counts[d] / t.played : 0, h = span * share / maxShare;
                    if (h < 0.5) return;
                    var x = gx + k * bw + (n > 1 ? 1 : 0), w = Math.max(2, bw - (n > 1 ? 2 : 0));
                    c.fillStyle = t === focus || n === 1 ? t.color : hexA(t.color, 0.55);
                    roundRect(c, x, y0 - h, w, h, Math.min(3, w / 2)); c.fill();
                });
                c.fillStyle = colors.text2; c.font = '500 12px ' + MONO; c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(String(d), gx + inner / 2, H - padB / 2);
            }
            var ey = Math.round(y0 - span * 0.1 / maxShare) + 0.5;
            c.strokeStyle = colors.text3; c.setLineDash([3, 4]); c.lineWidth = 1;
            c.beginPath(); c.moveTo(padL, ey); c.lineTo(W - padR, ey); c.stroke();
            c.setLineDash([]);
            c.fillStyle = colors.text3; c.font = '500 10px ' + MONO; c.textAlign = 'right'; c.textBaseline = 'middle';
            c.fillText('10%', padL - 6, ey);
        }

        function redraw() {
            if (state.playing) return; // the animation loop is drawing
            drawRoll(state.S); drawCircle(); drawHist();
        }

        var lastFrame = 0, lastText = 0, lastHead = 0;
        function loop(ts) {
            cancelAnimationFrame(raf);
            if (!root.isConnected) return;
            var dt = lastFrame && ts ? Math.min(0.1, (ts - lastFrame) / 1000) : 0.016;
            lastFrame = ts || 0;
            retireEvents();
            var anyFlash = false;
            state.tracks.forEach(function (t) { t.flash = Math.max(0, t.flash - dt * state.flashDecay); if (t.flash > 0) anyFlash = true; });
            var S = positionNow();
            if (reduceMotion.matches && state.playing) S = Math.floor(S * 2) / 2;
            drawRoll(S); drawCircle(); drawHist();
            var now = performance.now();
            if (now - lastHead > 90) { updateHead(); el.seek.value = String(Math.floor(S)); lastHead = now; }
            if (now - lastText > 250) { updateStatsText(); lastText = now; }
            if (state.playing || anyFlash) raf = requestAnimationFrame(loop);
            else { lastFrame = 0; raf = 0; updateStatsText(); }
        }

        // ── Mapping table ──
        function renderTable() {
            var t = focused();
            if (!t) return;
            var k = state.tracks.indexOf(t) + 1;
            var kit = isKit(t.instrument) ? t.instrument : 'acoustic';
            el.tableTrack.textContent = 'Track ' + k;
            el.tableDrum.textContent = 'Drum (' + INSTRUMENT_NAME[kit] + ')';
            var mode = LENGTH_BY_ID[t.length];
            el.table.innerHTML = '';
            for (var d = 0; d < 10; d++) {
                var midi = midiFor(t, d), tr = document.createElement('tr');
                var len;
                if (mode.rest && mode.rest(d)) len = 'Rest';
                else if (mode.fixed) { var v = mode.fixed(d); len = (v % 1 ? v.toFixed(1) : v) + (v === 1 ? ' step' : ' steps'); }
                else len = { previous: 'Set by the digit before', next: 'Set by the digit after', random: 'Random', swing: 'Long or short by position', fibonacci: 'By position: 1 1 2 3 5' }[mode.id];
                var piece = kit === 'groove' ? (d ? 'Groove step, accent ' + d : 'Silence') : kit === 'ratchet' ? (d ? plural(d, 'hat hit') : 'Silence') : (PIECE_NAMES[kitPiece(kit, d, 0)] || 'Silence');
                [String(d), noteName(midi), midiToFreq(midi).toFixed(1) + ' Hz', len, piece].forEach(function (val, i) {
                    var td = document.createElement(i === 0 ? 'th' : 'td');
                    if (i === 0) td.scope = 'row';
                    td.textContent = val;
                    tr.appendChild(td);
                });
                el.table.appendChild(tr);
            }
        }

        // ── Your numbers ──
        function setMode(mode) {
            state.mode = mode;
            el.custom.querySelectorAll('[data-nm-mode]').forEach(function (b) {
                b.setAttribute('aria-checked', String(b.dataset.nmMode === mode));
            });
            el.input.placeholder = mode === 'text' ? 'Type any text, e.g. your name' : 'Type or paste digits, e.g. 8675309';
            renderAscii();
        }

        function renderAscii() {
            var text = el.input.value;
            if (state.mode !== 'text' || !text) { el.ascii.hidden = true; el.ascii.textContent = ''; return; }
            var parts = codePoints(text);
            el.ascii.hidden = false;
            el.ascii.innerHTML = '';
            parts.slice(0, 24).forEach(function (p) {
                var span = document.createElement('span');
                var ch = document.createElement('b');
                ch.textContent = p.ch === ' ' ? '␣' : p.ch;
                span.appendChild(ch);
                span.appendChild(document.createTextNode(String(p.code)));
                el.ascii.appendChild(span);
            });
            if (parts.length > 24) el.ascii.appendChild(document.createTextNode('…'));
        }

        function addCustom(name, digits, extra) {
            var src = { group: 'custom', id: 'u' + (++state.customCount), short: extra.short || 'Yours', name: name, digits: digits, value: extra.value, text: extra.text };
            state.customs.push(src);
            var t = focused();
            t.sourceId = src.id;
            renderTracks();
            trackChanged(t, true);
            return src;
        }

        function useInput() {
            var text = el.input.value;
            if (!text.trim()) { setMessage('Type some ' + (state.mode === 'text' ? 'text' : 'digits') + ' first.', true); el.input.focus(); return; }
            var k = state.focus + 1;
            if (state.mode === 'text') {
                var codes = codePoints(text).map(function (p) { return p.code; }).join('');
                var preview = text.length > 24 ? text.slice(0, 24) + '…' : text;
                addCustom('“' + preview + '” as character codes', codes, { short: 'Text', value: codes.slice(0, 40) + (codes.length > 40 ? '…' : ''), text: text });
                setMessage(plural(codePoints(text).length, 'character') + ' became ' + plural(codes.length, 'digit') + ', now on track ' + k + '.');
            } else {
                var r = cleanDigits(text);
                if (!r.digits) { setMessage('No digits found. Switch to Text → ASCII to play words.', true); return; }
                addCustom('Your number ' + r.digits.slice(0, 12) + (r.digits.length > 12 ? '…' : ''), r.digits, { short: 'Yours', value: r.digits.slice(0, 40) + (r.digits.length > 40 ? '…' : '') });
                setMessage('Now on track ' + k + '.' + (r.ignored ? ' Skipped ' + plural(r.ignored, 'character') + ' that ' + (r.ignored === 1 ? 'was' : 'were') + ' not a digit.' : ''));
            }
        }

        function readFile(file) {
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { setMessage(file.name + ' is over 5 MB. Trim it to the digits you want to hear.', true); return; }
            var reader = new FileReader();
            reader.onload = function () {
                var r = cleanDigits(String(reader.result || ''));
                if (!r.digits) { setMessage('No digits found in ' + file.name + '. The file needs at least one 0–9.', true); return; }
                addCustom(file.name, r.digits, { short: file.name.replace(/\.txt$/i, '').slice(0, 8), value: r.digits.slice(0, 40) + (r.digits.length > 40 ? '…' : '') });
                setMessage('Loaded ' + plural(r.digits.length, 'digit') + ' onto track ' + (state.focus + 1) + (r.ignored ? ', skipped ' + plural(r.ignored, 'other character') + '.' : '.'));
            };
            reader.onerror = function () { setMessage('Could not read ' + file.name + '. Try saving it as plain text.', true); };
            reader.readAsText(file);
        }

        // ── Randomize ──
        function randomize() {
            var n = parseInt(el.randomCount.value, 10) || 3;
            var keep = el.randomKeep.checked, style = el.randomStyle.value;
            var t0 = focused();
            var fromDigits = el.randomDigits.checked && t0;
            // Rolling with a number: its digits make every choice and it stays
            // the first track, so the same number always gives the same song.
            var seedSrc = fromDigits ? findSource(t0.sourceId) : null;
            var rng = fromDigits ? digitRng(sourceDigits(seedSrc)) : diceRng();
            var all = allSources();
            var plan = style === 'chaos' ? chaos(n, rng, all) : arrange(n, rng, all, style === 'theory' ? null : style);
            if (seedSrc) {
                plan.tracks[0].sourceId = seedSrc.id;
                plan.tracks[0].mixIds = (plan.tracks[0].mixIds || []).filter(function (id) { return id !== seedSrc.id; });
            }
            if (!keep) {
                el.key.value = String(plan.key);
                el.scale.value = plan.scale;
                el.tempo.value = String(plan.bpm);
                el.gate.value = String(plan.gate);
                el.space.value = String(plan.space);
                el.drone.checked = !!plan.drone;
                syncOutputs();
                if (engine) engine.setSpace(el.space.value / 100);
            }
            resetStats();
            setTracks(plan.tracks);
            var g = globals();
            var lead = (plan.mood ? plan.mood.name + ' arrangement' : 'Fully random mix') + (fromDigits ? ', rolled from the digits of ' + (findSource(t0.sourceId) || {}).name : '') +
                ': ' + NOTE_NAMES[g.key] + ' ' + SCALE_BY_ID[g.scale].name.toLowerCase() + ' at ' + g.bpm + ' bpm. ';
            setMixMessage(lead + state.tracks.map(function (t, k) {
                var names = [findSource(t.sourceId)].concat(t.mixIds.map(findSource)).map(function (x) { return x.name; }).join(' + ');
                var role = plan.tracks[k].role ? ROLE_NAMES[plan.tracks[k].role] + ': ' : '';
                return (k + 1) + ') ' + role + names + ' on ' + INSTRUMENT_NAME[t.instrument].toLowerCase() + ', ' +
                    LENGTH_BY_ID[t.length].name.charAt(0).toLowerCase() + LENGTH_BY_ID[t.length].name.slice(1) +
                    (t.mixIds.length ? ' (' + SWITCH_BY_ID[t.switchRule].name.toLowerCase() + ')' : '');
            }).join('; ') + '.');
        }

        // ── Share links ──
        function encodeMix() {
            var g = globals();
            var used = {};
            var data = {
                v: 1, k: g.key, sc: g.scale, t: g.bpm, ga: Math.round(g.gate * 100),
                sp: parseInt(el.space.value, 10), vo: parseInt(el.volume.value, 10), dr: el.drone.checked ? 1 : 0, lp: state.loop ? 1 : 0,
                tr: state.tracks.map(function (t) {
                    function keepable(id) {
                        var src = findSource(id);
                        if (src.group !== 'custom') return id;
                        if (src.digits.length > 400) return 'pi';
                        used[src.id] = src;
                        return id;
                    }
                    return [keepable(t.sourceId), t.instrument, t.length, t.octave, Math.round(t.volume * 100), t.mute ? 1 : 0, t.solo ? 1 : 0, t.seed,
                        t.mixIds.map(keepable), t.switchRule];
                }),
                cu: Object.keys(used).map(function (id) { var s = used[id]; return [s.id, s.name, s.digits, s.short]; })
            };
            return b64encode(JSON.stringify(data));
        }

        function applyMix(str) {
            var data = JSON.parse(b64decode(str));
            if (!data || data.v !== 1 || !Array.isArray(data.tr)) throw new Error('bad mix');
            (data.cu || []).forEach(function (cst) {
                if (!/^\d+$/.test(cst[2])) return;
                state.customs.push({ group: 'custom', id: String(cst[0]), short: String(cst[3] || 'Yours').slice(0, 8), name: String(cst[1]).slice(0, 80), digits: cst[2] });
                state.customCount = Math.max(state.customCount, parseInt(String(cst[0]).slice(1), 10) || 0);
            });
            if (data.k >= 0 && data.k < 12) el.key.value = String(data.k);
            if (SCALE_BY_ID[data.sc]) el.scale.value = data.sc;
            if (data.t) el.tempo.value = String(data.t);
            if (data.ga) el.gate.value = String(data.ga);
            if (data.sp != null) el.space.value = String(data.sp);
            if (data.vo != null) el.volume.value = String(data.vo);
            el.drone.checked = !!data.dr;
            state.loop = data.lp !== 0;
            el.loop.setAttribute('aria-pressed', String(state.loop));
            syncOutputs();
            var list = data.tr.slice(0, MAX_TRACKS).map(function (a) {
                return {
                    sourceId: findSource(a[0]) ? a[0] : 'pi',
                    instrument: INSTRUMENT_NAME[a[1]] ? a[1] : 'bell',
                    length: LENGTH_BY_ID[a[2]] ? a[2] : 'steady',
                    octave: Math.max(-2, Math.min(2, a[3] | 0)),
                    volume: Math.max(0, Math.min(1, (a[4] == null ? 80 : a[4]) / 100)),
                    mute: !!a[5], solo: !!a[6], seed: a[7] >>> 0,
                    mixIds: Array.isArray(a[8]) ? a[8].filter(function (id) { return findSource(id); }).slice(0, MAX_MIX) : [],
                    switchRule: SWITCH_BY_ID[a[9]] ? a[9] : 'blocks8'
                };
            });
            if (!list.length) throw new Error('no tracks');
            setTracks(list);
        }

        function copyShareLink() {
            var url = location.origin + location.pathname + '#mix=' + encodeMix();
            var done = function () { setMixMessage('Link copied. Anyone who opens it hears this exact mix.'); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); });
            } else fallbackCopy(url);
            function fallbackCopy(u) {
                history.replaceState(history.state, '', u);
                setMixMessage('Copying was blocked, so the link is in the address bar now.');
            }
        }

        // ── Export ──
        // Audio renders offline (faster than real time) through the same
        // engine; MIDI and CSV are written from the same note schedule.
        var MP3_URL = 'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js';
        var MP3_SRI = 'sha384-xuasJXVcyv3hZq0eYpelEkBC8l4yufatZXDsKuyCU2rqfhDCb+ftuE/mSfZAteiK';
        var MAX_AUDIO_SECONDS = 20 * 60, MAX_DATA_SECONDS = 60 * 60;
        var GM_PROGRAM = { bell: 14, pluck: 25, glass: 98, marimba: 12, kalimba: 108, steel: 114, organ: 16, flute: 73, strings: 48, pad: 89, lead: 81, chip: 80, bass: 38, toms: 117 };
        var GM_DRUM = { kick: 36, kick808: 35, snare: 38, clap: 39, hatC: 42, hatO: 46, tomL: 45, tomM: 47, tomH: 50, rim: 37, cowbell: 56, shaker: 70, congaL: 64, congaH: 63, bongo: 60, clave: 75, zap: 40, zapHi: 81, noise: 49 };
        var FORMATS = {
            wav: { ext: 'wav', label: 'WAV', audio: true, quality: [['44100', '44.1 kHz, 16-bit'], ['48000', '48 kHz, 16-bit']] },
            mp3: { ext: 'mp3', label: 'MP3', audio: true, quality: [['192', '192 kbps'], ['320', '320 kbps'], ['128', '128 kbps']] },
            midi: { ext: 'mid', label: 'MIDI' },
            csv: { ext: 'csv', label: 'CSV' }
        };
        var exporting = false;

        function setExportStatus(text, isError) {
            el.exportStatus.textContent = text;
            el.exportStatus.classList.toggle('is-error', !!isError);
        }
        function setProgress(frac) {
            if (frac == null) { el.exportProgress.hidden = true; return; }
            el.exportProgress.hidden = false;
            el.exportProgress.value = Math.max(0, Math.min(1, frac));
        }

        function syncQuality() {
            var f = FORMATS[el.exportFormat.value];
            el.exportQuality.innerHTML = '';
            (f.quality || []).forEach(function (q) {
                var o = document.createElement('option'); o.value = q[0]; o.textContent = q[1]; el.exportQuality.appendChild(o);
            });
            el.exportQualityField.hidden = !f.quality;
            el.exportFadeField.hidden = !f.audio;
            updateExportSummary();
        }

        function exportStartStep() { return el.exportStart.value === 'playhead' ? Math.floor(positionNow()) : 0; }

        // Length of the export in steps, from the amount and unit.
        function exportSteps() {
            var amount = Math.max(0, parseFloat(el.exportAmount.value) || 0);
            var unit = el.exportUnit.value, sd = stepDur();
            if (unit === 'seconds') return amount / sd;
            if (unit === 'minutes') return amount * 60 / sd;
            if (unit === 'bars') return amount * 8;          // a 4/4 bar is eight eighth-note steps
            if (unit === 'digits') {
                var t = focused(), L = t.digits.length, n = Math.round(amount);
                if (!state.loop) n = Math.min(n, L);
                return Math.floor(n / L) * t.total + t.starts[n % L];
            }
            if (unit === 'once') return maxTotal();           // every track plays through once
            return 0;
        }

        function updateExportSummary() {
            if (!state.tracks.length) return;
            var unit = el.exportUnit.value;
            el.exportAmount.disabled = unit === 'once';
            el.exportAmountLabel.textContent = unit === 'digits' ? 'Digits on track ' + (state.focus + 1) : 'Length';
            var steps = exportSteps(), secs = steps * stepDur();
            var f = FORMATS[el.exportFormat.value];
            var cap = f.audio ? MAX_AUDIO_SECONDS : MAX_DATA_SECONDS;
            var mins = Math.floor(secs / 60), rest = Math.round(secs % 60);
            if (rest === 60) { mins++; rest = 0; }
            var text = mins + ':' + (rest < 10 ? '0' : '') + rest + ' long · ' + Math.round(steps).toLocaleString() + ' steps · ' + plural(state.tracks.length, 'track');
            if (f.audio) {
                var sr = el.exportFormat.value === 'wav' ? parseInt(el.exportQuality.value || '44100', 10) : 44100;
                var bytes = el.exportFormat.value === 'wav' ? secs * sr * 4 : secs * (parseInt(el.exportQuality.value || '192', 10) * 1000 / 8);
                text += ' · about ' + (bytes > 1e6 ? (bytes / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1e3)) + ' KB');
            }
            el.exportSummary.textContent = text;
            var tooLong = secs > cap, empty = steps < 0.5;
            el.exportButton.disabled = exporting || tooLong || empty;
            if (tooLong) setExportStatus('That is longer than the ' + (cap / 60) + '-minute limit for ' + f.label + '. Shorten it to export.', true);
            else if (empty) setExportStatus('Set a length above zero to export.', true);
            else if (!exporting && el.exportStatus.classList.contains('is-error')) setExportStatus('');
        }

        // Every note that starts inside [startS, endS), in time order per track.
        function eachExportNote(startS, endS, cb) {
            state.tracks.forEach(function (t, k) {
                forEachNote(t, startS, endS, function (i, s) {
                    if (s < startS - 1e-9 || s >= endS - 1e-9) return;
                    cb(t, k, i, s);
                });
            });
        }

        function exportName() {
            var parts = state.tracks.map(function (t) { return t.sourceId.replace(/^u\d+$/, 'yours'); });
            var unique = parts.filter(function (p, i) { return parts.indexOf(p) === i; }).slice(0, 4);
            return 'numesthesia-' + unique.join('-').toLowerCase().replace(/[^a-z0-9-]+/g, '') + '.' + FORMATS[el.exportFormat.value].ext;
        }

        function download(blob, name) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url; a.download = name; a.style.display = 'none';
            document.body.appendChild(a); a.click();
            setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
        }

        function renderAudio(startS, steps, sampleRate) {
            var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (!OAC) return Promise.reject(new Error('This browser cannot render audio offline.'));
            var sd = stepDur(), seconds = steps * sd;
            var off = new OAC(2, Math.max(1, Math.ceil(seconds * sampleRate)), sampleRate);
            var eng = Engine(off);
            eng.setVolume(el.volume.value / 100);
            eng.setSpace(el.space.value / 100);
            if (el.drone.checked) eng.setDrone(true, 48 + globals().key);
            var n = state.tracks.length, solo = anySolo();
            var chans = state.tracks.map(function (t, k) {
                var ch = eng.channel();
                ch.setVolume(!t.mute && (!solo || t.solo) ? t.volume : 0);
                ch.setPan(n > 1 ? (k / (n - 1) - 0.5) * 0.7 : 0);
                return ch;
            });
            var endS = startS + steps;
            function scheduleChunk(a, b) {
                eachExportNote(a, Math.min(b, endS), function (t, k, i, s) {
                    playDigit(t, i, s, (s - startS) * sd, eng, chans[k]);
                });
            }
            // Schedule in chunks while rendering when the browser can pause the
            // render; otherwise schedule everything up front.
            var chunk = Math.max(8, Math.round(10 / sd));
            var canSuspend = typeof off.suspend === 'function';
            if (canSuspend) {
                scheduleChunk(startS, startS + chunk);
                for (var c = startS + chunk; c < endS; c += chunk) {
                    (function (from) {
                        var at = (from - startS) * sd - 2;
                        if (at <= 0) { scheduleChunk(from, from + chunk); return; }
                        try {
                            off.suspend(at).then(function () {
                                scheduleChunk(from, from + chunk);
                                setProgress(0.05 + 0.8 * (from - startS) / steps);
                                off.resume();
                            });
                        } catch (e) { scheduleChunk(from, from + chunk); }
                    })(c);
                }
            } else {
                scheduleChunk(startS, endS);
            }
            return off.startRendering().then(function (buffer) {
                if (el.exportFade.checked) {
                    var fadeLen = Math.min(buffer.length, Math.round(Math.min(3, seconds / 4) * sampleRate));
                    for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
                        var data = buffer.getChannelData(ch), start = buffer.length - fadeLen;
                        for (var j = 0; j < fadeLen; j++) data[start + j] *= Math.pow(1 - j / fadeLen, 2);
                    }
                }
                return buffer;
            });
        }

        function toInt16(f) { var v = Math.max(-1, Math.min(1, f)); return v < 0 ? v * 0x8000 : v * 0x7fff; }

        function encodeWav(buffer) {
            var chs = buffer.numberOfChannels, len = buffer.length, sr = buffer.sampleRate;
            var out = new DataView(new ArrayBuffer(44 + len * chs * 2));
            function str(o, s) { for (var i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); }
            str(0, 'RIFF'); out.setUint32(4, 36 + len * chs * 2, true); str(8, 'WAVE');
            str(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, chs, true);
            out.setUint32(24, sr, true); out.setUint32(28, sr * chs * 2, true); out.setUint16(32, chs * 2, true); out.setUint16(34, 16, true);
            str(36, 'data'); out.setUint32(40, len * chs * 2, true);
            var data = [];
            for (var c = 0; c < chs; c++) data.push(buffer.getChannelData(c));
            var o = 44;
            for (var i = 0; i < len; i++) for (c = 0; c < chs; c++) { out.setInt16(o, toInt16(data[c][i]), true); o += 2; }
            return new Blob([out], { type: 'audio/wav' });
        }

        var lamePromise = null;
        function loadLame() {
            if (window.lamejs && window.lamejs.Mp3Encoder) return Promise.resolve(window.lamejs);
            if (lamePromise) return lamePromise;
            lamePromise = new Promise(function (resolve, reject) {
                var sc = document.createElement('script');
                sc.src = MP3_URL; sc.integrity = MP3_SRI; sc.crossOrigin = 'anonymous'; sc.async = true;
                sc.onload = function () { window.lamejs && window.lamejs.Mp3Encoder ? resolve(window.lamejs) : reject(new Error('The MP3 encoder did not load.')); };
                sc.onerror = function () { lamePromise = null; reject(new Error('Could not load the MP3 encoder. Check your connection, or export WAV instead.')); };
                document.head.appendChild(sc);
            });
            return lamePromise;
        }

        function encodeMp3(buffer, kbps, onProgress) {
            return loadLame().then(function (lame) {
                var enc = new lame.Mp3Encoder(2, buffer.sampleRate, kbps);
                var L = buffer.getChannelData(0), R = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : L;
                var block = 1152, parts = [], i = 0;
                var l16 = new Int16Array(block), r16 = new Int16Array(block);
                return new Promise(function (resolve) {
                    function step() {
                        var until = Math.min(buffer.length, i + block * 200);
                        for (; i < until; i += block) {
                            var n = Math.min(block, buffer.length - i);
                            var lb = n === block ? l16 : new Int16Array(n), rb = n === block ? r16 : new Int16Array(n);
                            for (var j = 0; j < n; j++) { lb[j] = toInt16(L[i + j]); rb[j] = toInt16(R[i + j]); }
                            var bytes = enc.encodeBuffer(lb, rb);
                            if (bytes.length) parts.push(new Uint8Array(bytes));
                        }
                        onProgress(i / buffer.length);
                        if (i < buffer.length) setTimeout(step, 0);
                        else {
                            var tail = enc.flush();
                            if (tail.length) parts.push(new Uint8Array(tail));
                            resolve(new Blob(parts, { type: 'audio/mpeg' }));
                        }
                    }
                    step();
                });
            });
        }

        function buildMidi(startS, steps) {
            var TPQ = 480, STEP = TPQ / 2, g = globals();
            function vlq(n) {
                var bytes = [n & 0x7f];
                while ((n >>= 7)) bytes.unshift((n & 0x7f) | 0x80);
                return bytes;
            }
            function text(type, s) {
                var b = Array.from(new TextEncoder().encode(s)).slice(0, 120);
                return [0xff, type].concat(vlq(b.length), b);
            }
            function chunk(events) {
                var body = [];
                events.sort(function (a, b) { return a.tick - b.tick || a.order - b.order; });
                var last = 0;
                events.forEach(function (e) { body = body.concat(vlq(e.tick - last), e.data); last = e.tick; });
                body = body.concat([0, 0xff, 0x2f, 0]);
                var n = body.length;
                return [0x4d, 0x54, 0x72, 0x6b, (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].concat(body);
            }
            var tempo = Math.round(60000000 / g.bpm);
            var conductor = chunk([
                { tick: 0, order: 0, data: text(0x03, 'Numesthesia') },
                { tick: 0, order: 0, data: [0xff, 0x51, 3, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255] },
                { tick: 0, order: 0, data: [0xff, 0x58, 4, 4, 2, 24, 8] }
            ]);
            var perTrack = state.tracks.map(function () { return []; });
            var melodicChannels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12], nextCh = 0;
            var chanOf = state.tracks.map(function (t) { return isKit(t.instrument) ? 9 : melodicChannels[nextCh++]; });
            var solo = anySolo();
            state.tracks.forEach(function (t, k) {
                var ch = chanOf[k], src = findSource(t.sourceId), ev = perTrack[k];
                ev.push({ tick: 0, order: 0, data: text(0x03, 'Track ' + (k + 1) + ': ' + src.name + ' (' + INSTRUMENT_NAME[t.instrument] + ')') });
                if (ch !== 9) ev.push({ tick: 0, order: 0, data: [0xc0 | ch, GM_PROGRAM[t.instrument] || 0] });
                var audibleNow = !t.mute && (!solo || t.solo);
                ev.push({ tick: 0, order: 0, data: [0xb0 | ch, 7, Math.round((audibleNow ? t.volume : 0) * 127)] });
                var pan = state.tracks.length > 1 ? (k / (state.tracks.length - 1) - 0.5) * 0.7 : 0;
                ev.push({ tick: 0, order: 0, data: [0xb0 | ch, 10, Math.round(64 + pan * 63)] });
            });
            function note(k, ch, tick, dur, key, vel) {
                key = Math.max(0, Math.min(127, key)); vel = Math.max(1, Math.min(127, Math.round(vel)));
                perTrack[k].push({ tick: tick, order: 2, data: [0x90 | ch, key, vel] });
                perTrack[k].push({ tick: tick + Math.max(1, dur), order: 1, data: [0x80 | ch, key, 0] });
            }
            eachExportNote(startS, startS + steps, function (t, k, i, s) {
                if (t.rests[i]) return;
                var d = t.digits.charCodeAt(i) - 48, ch = chanOf[k];
                var tick = Math.round((s - startS) * STEP), lenTicks = Math.round(t.lens[i] * STEP);
                if (isKit(t.instrument)) {
                    if (t.instrument === 'ratchet') {
                        for (var h = 0; h < d; h++) note(k, ch, tick + Math.round(h * lenTicks / d), 30, GM_DRUM.hatC, h ? 70 : 105);
                    } else {
                        var piece = kitPiece(t.instrument, d, s);
                        if (piece) note(k, ch, tick, 60, GM_DRUM[piece], (t.instrument === 'groove' ? 0.35 + d * 0.07 : 0.65 + d * 0.04) * 110);
                    }
                } else {
                    note(k, ch, tick, Math.round(lenTicks * g.gate), midiFor(t, d), 96);
                }
            });
            var tracks = [conductor].concat(perTrack.map(chunk));
            var header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, tracks.length, (TPQ >> 8) & 255, TPQ & 255];
            var bytes = header;
            tracks.forEach(function (tr) { bytes = bytes.concat(tr); });
            return new Blob([new Uint8Array(bytes)], { type: 'audio/midi' });
        }

        function buildCsv(startS, steps) {
            var sd = stepDur(), rows = [['track', 'number', 'sound', 'digit_index', 'digit', 'start_step', 'start_seconds', 'length_steps', 'rest', 'note', 'midi', 'frequency_hz', 'drum']];
            var list = [];
            eachExportNote(startS, startS + steps, function (t, k, i, s) { list.push([s, k, t, i]); });
            list.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
            list.forEach(function (r) {
                var s = r[0], k = r[1], t = r[2], i = r[3], d = t.digits.charCodeAt(i) - 48, kit = isKit(t.instrument);
                var midi = midiFor(t, d), piece = kit ? (t.instrument === 'ratchet' ? (d ? 'hatC x' + d : '') : kitPiece(t.instrument, d, s) || '') : '';
                rows.push([k + 1, findSource(t.sourceId).name, INSTRUMENT_NAME[t.instrument], i, d,
                    +(s - startS).toFixed(4), +((s - startS) * sd).toFixed(4), +t.lens[i].toFixed(4), t.rests[i] ? 1 : 0,
                    kit || t.rests[i] ? '' : noteName(midi), kit || t.rests[i] ? '' : midi,
                    kit || t.rests[i] ? '' : midiToFreq(midi).toFixed(2), PIECE_NAMES[piece] || piece]);
            });
            var csv = rows.map(function (row) {
                return row.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',');
            }).join('\r\n');
            return new Blob(['﻿' + csv + '\r\n'], { type: 'text/csv' });
        }

        function runExport() {
            if (exporting || !state.tracks.length) return;
            var fmt = el.exportFormat.value, f = FORMATS[fmt];
            var startS = exportStartStep(), steps = exportSteps();
            if (steps < 0.5) return;
            var name = exportName();
            exporting = true;
            el.exportButton.disabled = true;
            setExportStatus(f.audio ? 'Rendering audio…' : 'Writing ' + f.label + '…');
            setProgress(f.audio ? 0.02 : null);
            var job;
            if (fmt === 'midi') job = Promise.resolve(buildMidi(startS, steps));
            else if (fmt === 'csv') job = Promise.resolve(buildCsv(startS, steps));
            else {
                var sr = fmt === 'wav' ? parseInt(el.exportQuality.value, 10) : 44100;
                job = renderAudio(startS, steps, sr).then(function (buffer) {
                    if (fmt === 'wav') { setProgress(0.95); return encodeWav(buffer); }
                    setExportStatus('Encoding MP3…');
                    return encodeMp3(buffer, parseInt(el.exportQuality.value, 10), function (p) { setProgress(0.85 + p * 0.15); });
                });
            }
            job.then(function (blob) {
                download(blob, name);
                var size = blob.size > 1e6 ? (blob.size / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(blob.size / 1e3)) + ' KB';
                setExportStatus('Saved ' + name + ' (' + size + ').');
            }).catch(function (err) {
                setExportStatus((err && err.message) || 'The export failed. Try a shorter length or another format.', true);
            }).then(function () {
                exporting = false;
                setProgress(null);
                updateExportSummary();
            });
        }

        // ── Controls ──
        function syncOutputs() {
            $('nm-tempo-out').textContent = el.tempo.value + ' bpm';
            $('nm-gate-out').textContent = el.gate.value + '%';
            $('nm-space-out').textContent = el.space.value + '%';
            $('nm-volume-out').textContent = el.volume.value + '%';
        }

        var listeners = [];
        function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); }

        on(el.tracks, 'change', function (e) {
            var t = trackFromRow(e.target), k = e.target.dataset.k;
            if (t && e.target.dataset.mix != null) {
                t.mixIds[parseInt(e.target.dataset.mix, 10)] = e.target.value;
                trackChanged(t, true);
                return;
            }
            if (!t || !k || k === 'volume') return;
            if (k === 'octave') { t.octave = parseInt(e.target.value, 10); trackChanged(t, false); return; }
            t[k] = e.target.value;
            trackChanged(t, k === 'sourceId' || k === 'length' || k === 'switchRule');
        });
        on(el.tracks, 'input', function (e) {
            var t = trackFromRow(e.target);
            if (!t || e.target.dataset.k !== 'volume') return;
            t.volume = e.target.value / 100;
            e.target.parentNode.querySelector('output').textContent = e.target.value + '%';
            updateChannel(t);
        });
        on(el.tracks, 'click', function (e) {
            var btn = e.target.closest('[data-act]');
            if (!btn) return;
            var t = trackFromRow(btn), k = state.tracks.indexOf(t);
            if (!t) return;
            var act = btn.dataset.act;
            if (act === 'focus') setFocus(k);
            else if (act === 'mixadd' && t.mixIds.length < MAX_MIX) {
                var taken = [t.sourceId].concat(t.mixIds);
                var options = SOURCES.filter(function (s2) { return taken.indexOf(s2.id) < 0 && (s2.data || s2.gen); });
                t.mixIds.push(pick(options.length ? options : SOURCES).id);
                renderTracks();
                trackChanged(t, true);
                var sel = el.tracks.querySelector('[data-track="' + t.id + '"] [data-mix="' + (t.mixIds.length - 1) + '"]');
                if (sel) sel.focus();
            } else if (act === 'unmix') {
                t.mixIds.splice(parseInt(btn.dataset.j, 10), 1);
                renderTracks();
                trackChanged(t, true);
                var again = el.tracks.querySelector('[data-track="' + t.id + '"] [data-act="mixadd"]');
                if (again) again.focus();
            }
            else if (act === 'mute' || act === 'solo') {
                t[act] = !t[act];
                btn.setAttribute('aria-pressed', String(t[act]));
                updateAllChannels();
                redraw();
            } else if (act === 'remove' && state.tracks.length > 1) {
                if (t.channel) t.channel.disconnect();
                state.tracks.splice(k, 1);
                if (state.focus >= state.tracks.length) state.focus = state.tracks.length - 1;
                renderTracks(); updateAllChannels(); updateSeekMax(); updateHead(); renderTable(); redraw();
                var next = el.tracks.querySelectorAll('[data-act="focus"]')[Math.min(k, state.tracks.length - 1)];
                if (next) next.focus();
            }
        });
        on(el.add, 'click', function () {
            if (state.tracks.length >= MAX_TRACKS) return;
            var prev = state.tracks[state.tracks.length - 1];
            var t = makeTrack({ sourceId: pick(SOURCES).id, instrument: pick(INSTRUMENTS).id, length: 'steady', octave: prev ? prev.octave : 0 });
            state.tracks.push(t);
            attachChannel(t);
            updateAllChannels();
            if (state.playing) placeTrack(t, Math.max(positionNow(), stepAt(engine.now() + 0.05)));
            state.focus = state.tracks.length - 1;
            renderTracks(); updateSeekMax(); updateHead(); renderTable(); redraw();
            setMixMessage('Added track ' + state.tracks.length + ': ' + findSource(t.sourceId).name + ' on ' + INSTRUMENT_NAME[t.instrument].toLowerCase() + '.');
        });
        on(el.randomize, 'click', randomize);
        on(el.exportFormat, 'change', syncQuality);
        [el.exportQuality, el.exportUnit, el.exportStart].forEach(function (x) { on(x, 'change', updateExportSummary); });
        on(el.exportAmount, 'input', updateExportSummary);
        on(el.exportButton, 'click', runExport);
        on(el.share, 'click', copyShareLink);

        on(el.roll, 'click', function (e) {
            if (!lanesGeom.laneH) return;
            var r = el.roll.getBoundingClientRect();
            var k = Math.floor((e.clientY - r.top) / lanesGeom.laneH);
            if (k >= 0 && k < state.tracks.length && k !== state.focus) setFocus(k);
        });

        on(el.custom, 'click', function (e) {
            var b = e.target.closest('[data-nm-mode]');
            if (b) setMode(b.dataset.nmMode);
        });
        on(el.custom, 'keydown', function (e) {
            var b = e.target.closest('[data-nm-mode]');
            if (!b || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
            e.preventDefault();
            var next = b.dataset.nmMode === 'digits' ? 'text' : 'digits';
            setMode(next);
            el.custom.querySelector('[data-nm-mode="' + next + '"]').focus();
        });
        on(el.input, 'input', renderAscii);
        on(el.input, 'keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); useInput(); } });
        on(el.use, 'click', useInput);
        on(el.file, 'change', function () { readFile(el.file.files[0]); el.file.value = ''; });
        on(el.custom, 'dragover', function (e) { e.preventDefault(); el.custom.classList.add('is-drop'); });
        on(el.custom, 'dragleave', function (e) { if (!el.custom.contains(e.relatedTarget)) el.custom.classList.remove('is-drop'); });
        on(el.custom, 'drop', function (e) {
            e.preventDefault(); el.custom.classList.remove('is-drop');
            if (e.dataTransfer && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
        });

        on(el.play, 'click', function () { state.playing ? pause() : play(); });
        on(el.restart, 'click', function () { resetStats(); seekTo(0); updateStatsText(); if (!state.playing) { drawCircle(); drawHist(); } });
        on(el.loop, 'click', function () {
            state.loop = !state.loop;
            el.loop.setAttribute('aria-pressed', String(state.loop));
            if (state.playing && engine) {
                var S = stepAt(engine.now() + 0.05);
                state.tracks.forEach(function (t) { t.queue = []; placeTrack(t, S); });
            }
            redraw();
        });
        on(el.seek, 'input', function () { seekTo(parseInt(el.seek.value, 10)); });

        on(el.tempo, 'input', function () {
            if (state.playing && engine) { var now = engine.now(); state.S0 = stepAt(now); state.t0 = now; }
            syncOutputs();
            updateExportSummary();
        });
        on(el.gate, 'input', syncOutputs);
        on(el.space, 'input', function () { syncOutputs(); if (engine) engine.setSpace(el.space.value / 100); });
        on(el.volume, 'input', function () { syncOutputs(); if (engine) engine.setVolume(el.volume.value / 100); });
        [el.scale, el.key].forEach(function (s) {
            on(s, 'change', function () {
                renderTable(); redraw();
                if (engine && state.playing && el.drone.checked) engine.setDrone(true, 48 + globals().key);
            });
        });
        on(el.drone, 'change', function () { if (engine && state.playing) engine.setDrone(el.drone.checked, 48 + globals().key); });

        on(document, 'keydown', function (e) {
            if (!root.isConnected || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            var t = e.target, tag = t && t.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
            if (document.body.classList.contains('sidebar-open') || document.querySelector('[role="dialog"]:not([hidden])')) return;
            if (e.key === ' ' && tag !== 'BUTTON' && tag !== 'A') {
                e.preventDefault(); state.playing ? pause() : play();
            } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !state.playing && tag !== 'BUTTON') {
                e.preventDefault();
                var S = Math.max(0, Math.floor(state.S + 1e-6) + (e.key === 'ArrowRight' ? 1 : -1));
                seekTo(S);
                previewAt(S);
            }
        });

        // Paused: sound every note that starts inside this step.
        function previewAt(S) {
            if (!ensureEngine()) return;
            engine.resume();
            var when = engine.now() + 0.01, saved = { S0: state.S0, t0: state.t0 };
            state.S0 = S; state.t0 = when;
            state.tracks.forEach(function (t) {
                forEachNote(t, S - 1e-6, S + 1 - 1e-6, function (i, s) {
                    if (s < S - 1e-6) return;
                    var d = playDigit(t, i, s, timeAt(s));
                    record(t, { d: d, rest: !!t.rests[i] });
                    t.current = i;
                });
            });
            state.S0 = saved.S0; state.t0 = saved.t0;
            updateStatsText();
            if (!raf) loop();
        }

        var resizeTimer = 0;
        on(window, 'resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(redraw, 80);
        });

        // ── Lifecycle ──
        var observer = null;
        function cleanup() {
            pause();
            cancelAnimationFrame(raf);
            listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
            listeners = [];
            if (engine) { engine.close(); engine = null; }
            if (observer) observer.disconnect();
            window.__numesthesiaCleanup = null;
        }
        window.__numesthesiaCleanup = cleanup;
        var host = root.closest('.content');
        if ('MutationObserver' in window && host) {
            observer = new MutationObserver(function () { if (!root.isConnected) cleanup(); });
            observer.observe(host, { childList: true });
        }

        // ── Start ──
        syncOutputs();
        syncQuality();
        var loaded = false;
        var m = /[#&]mix=([A-Za-z0-9_-]+)/.exec(location.hash);
        if (m) {
            try { applyMix(m[1]); loaded = true; setMixMessage('Loaded a shared mix. Press play to hear it.'); }
            catch (err) { setMixMessage('That shared link could not be read, so the default mix is loaded instead.'); }
        }
        if (!loaded) {
            setTracks([
                { sourceId: 'pi', instrument: 'bell', length: 'steady', octave: 0, volume: 0.8 },
                { sourceId: 'e', instrument: 'acoustic', length: 'parity', octave: 0, volume: 0.75 },
                { sourceId: 'phi', instrument: 'bass', length: 'digit', octave: -1, volume: 0.7 }
            ]);
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
    }

    window.initNumesthesia = initNumesthesia;
    initNumesthesia();
}());

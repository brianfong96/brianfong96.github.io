/* Number Music — turn the digits of a number into a melody and a beat.
 *
 * Each digit picks a scale degree (pitch) and, optionally, a drum and a
 * note length. Audio is synthesised with the Web Audio API and scheduled
 * ahead of time with a look-ahead clock; the canvases read the scheduled
 * events back so the picture always matches what you hear.
 *
 * Exposes window.initNumberMusic so the site's page transition can
 * re-run it, and cleans itself up when its root leaves the page.
 */
(function () {
    'use strict';

    // ── Digits ─────────────────────────────────────────────────────

    var DIGITS = 2000;
    var cache = {};

    function pow10(n) { return 10n ** BigInt(n); }

    function isqrt(n) {
        // Newton's method from above: converges to floor(sqrt(n)).
        if (n < 2n) return n;
        var x = 1n << BigInt(Math.ceil(n.toString(2).length / 2) + 1);
        for (;;) {
            var y = (x + n / x) >> 1n;
            if (y >= x) return x;
            x = y;
        }
    }

    function arctanInv(x, scale) {
        var X = BigInt(x), x2 = X * X;
        var term = scale / X, sum = term, k = 1n, sign = -1n;
        while (term !== 0n) {
            term /= x2;
            k += 2n;
            sum += sign * (term / k);
            sign = -sign;
        }
        return sum;
    }

    var GENERATORS = {
        pi: function (n) {
            var scale = pow10(n + 10);
            var pi = 16n * arctanInv(5, scale) - 4n * arctanInv(239, scale);
            return pi.toString().slice(0, n);
        },
        e: function (n) {
            var scale = pow10(n + 10), sum = 0n, term = scale, k = 1n;
            while (term !== 0n) { sum += term; term /= k; k++; }
            return sum.toString().slice(0, n);
        },
        sqrt2: function (n) { return isqrt(2n * pow10(2 * n)).toString().slice(0, n); },
        phi: function (n) { return ((pow10(n) + isqrt(5n * pow10(2 * n))) / 2n).toString().slice(0, n); },
        champernowne: function (n) {
            var s = '', i = 1;
            while (s.length < n) s += i++;
            return s.slice(0, n);
        },
        copeland: function (n) {
            var s = '', c = 2;
            while (s.length < n) {
                var prime = true;
                for (var d = 2; d * d <= c; d++) if (c % d === 0) { prime = false; break; }
                if (prime) s += c;
                c++;
            }
            return s.slice(0, n);
        },
        fibonacci: function (n) {
            var s = '', a = 1n, b = 1n;
            while (s.length < n) { s += a; var t = a + b; a = b; b = t; }
            return s.slice(0, n);
        }
    };

    var PRESETS = [
        { group: 'Math', id: 'pi', label: 'π', name: 'π', value: '3.14159 26535 89793…', gen: 'pi', point: 1 },
        { group: 'Math', id: 'e', label: 'e', name: "Euler's number e", value: '2.71828 18284 59045…', gen: 'e', point: 1 },
        { group: 'Math', id: 'phi', label: 'φ', name: 'Golden ratio φ', value: '1.61803 39887 49894…', gen: 'phi', point: 1 },
        { group: 'Math', id: 'sqrt2', label: '√2', name: 'Square root of 2', value: '1.41421 35623 73095…', gen: 'sqrt2', point: 1 },
        { group: 'Math', id: 'seventh', label: '1/7', name: 'One seventh', value: '0.142857 142857…', digits: '142857', point: 0 },
        { group: 'Patterns', id: 'fibonacci', label: 'Fibonacci', name: 'Fibonacci numbers, joined', value: '1 1 2 3 5 8 13 21 34…', gen: 'fibonacci' },
        { group: 'Patterns', id: 'copeland', label: 'Primes', name: 'Copeland–Erdős constant', value: '0.2 3 5 7 11 13 17 19…', gen: 'copeland' },
        { group: 'Patterns', id: 'champernowne', label: 'Counting', name: 'Champernowne constant', value: '0.1 2 3 4 5 6 7 8 9 10 11…', gen: 'champernowne' },
        { group: 'Nature', id: 'c', label: 'Light', name: 'Speed of light c', value: '299 792 458 m/s (exact)', digits: '299792458' },
        { group: 'Nature', id: 'ly', label: 'Light-year', name: 'One light-year', value: '9 460 730 472 580 800 m (exact)', digits: '9460730472580800' },
        { group: 'Nature', id: 'avogadro', label: 'Avogadro', name: "Avogadro's number", value: '6.022 140 76 × 10²³ mol⁻¹ (exact)', digits: '602214076' },
        { group: 'Nature', id: 'G', label: 'G', name: 'Gravitational constant G', value: '6.674 30 × 10⁻¹¹ m³ kg⁻¹ s⁻² (CODATA 2022)', digits: '667430' },
        { group: 'Nature', id: 'h', label: 'Planck h', name: 'Planck constant h', value: '6.626 070 15 × 10⁻³⁴ J s (exact)', digits: '662607015' },
        { group: 'Nature', id: 'charge', label: 'Charge e', name: 'Elementary charge e', value: '1.602 176 634 × 10⁻¹⁹ C (exact)', digits: '1602176634' },
        { group: 'Nature', id: 'k', label: 'Boltzmann', name: 'Boltzmann constant k', value: '1.380 649 × 10⁻²³ J/K (exact)', digits: '1380649' },
        { group: 'Nature', id: 'alpha', label: '1/α', name: 'Inverse fine-structure constant', value: '137.035 999 177 (CODATA 2022)', digits: '137035999177' }
    ];

    function presetDigits(p) {
        if (p.digits) return p.digits;
        if (!cache[p.id]) cache[p.id] = GENERATORS[p.gen](DIGITS);
        return cache[p.id];
    }

    // ── Music theory ───────────────────────────────────────────────

    var SCALES = {
        majorPent: [0, 2, 4, 7, 9],
        minorPent: [0, 3, 5, 7, 10],
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
        dorian: [0, 2, 3, 5, 7, 9, 10],
        harmonic: [0, 2, 3, 5, 7, 8, 11],
        whole: [0, 2, 4, 6, 8, 10],
        chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    };
    var NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    var DRUM_NAMES = { kick: 'Kick', hat: 'Hi-hat', snare: 'Snare', none: 'Silence' };

    function semitoneFor(d, scale) {
        var s = SCALES[scale];
        return s[d % s.length] + 12 * Math.floor(d / s.length);
    }
    function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function noteName(m) { return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }
    function digitDrum(d) { return d === 0 ? 'none' : d <= 3 ? 'kick' : d <= 6 ? 'hat' : 'snare'; }
    function stepsFor(d, mode) {
        if (mode === 'parity') return d % 2 === 0 ? 2 : 1;
        if (mode === 'size') return 1 + Math.floor(d / 4);
        return 1;
    }
    function isRest(d, mode) { return mode === 'zero' && d === 0; }

    // ── Audio engine ───────────────────────────────────────────────

    function Engine() {
        var AC = window.AudioContext || window.webkitAudioContext;
        var ctx = new AC();
        var master = ctx.createGain();
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
        master.connect(comp); comp.connect(ctx.destination);

        var dry = ctx.createGain(), wet = ctx.createGain(), verb = ctx.createConvolver();
        verb.buffer = impulse(ctx, 2.4, 2.6);
        dry.connect(master); verb.connect(wet); wet.connect(master);

        var bus = ctx.createGain(); // everything tonal and percussive enters here
        bus.connect(dry); bus.connect(verb);

        var noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        var nd = noise.getChannelData(0);
        for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

        var drone = null;

        function env(g, t, peak, attack, decay) {
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(peak, t + attack);
            g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        }

        function osc(type, f, t, stop) {
            var o = ctx.createOscillator();
            o.type = type; o.frequency.setValueAtTime(f, t);
            o.start(t); o.stop(stop);
            return o;
        }

        var voices = {
            bell: function (f, t, len) {
                var g = ctx.createGain(); env(g, t, 0.32, 0.004, len + 0.9); g.connect(bus);
                osc('sine', f, t, t + len + 1).connect(g);
                var g2 = ctx.createGain(); env(g2, t, 0.09, 0.002, 0.35); g2.connect(bus);
                osc('sine', f * 2.756, t, t + 0.5).connect(g2);
            },
            pluck: function (f, t, len) {
                var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
                lp.frequency.setValueAtTime(Math.min(9000, f * 9), t);
                lp.frequency.exponentialRampToValueAtTime(Math.max(120, f * 1.2), t + 0.25 + len * 0.4);
                var g = ctx.createGain(); env(g, t, 0.26, 0.003, 0.35 + len * 0.6);
                osc('sawtooth', f, t, t + len + 0.8).connect(lp); lp.connect(g); g.connect(bus);
            },
            glass: function (f, t, len) {
                var car = osc('sine', f, t, t + len + 1.2);
                var mod = osc('sine', f * 3.5, t, t + len + 1.2);
                var mg = ctx.createGain();
                mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.6);
                mod.connect(mg); mg.connect(car.frequency);
                var g = ctx.createGain(); env(g, t, 0.24, 0.004, len + 1.1);
                car.connect(g); g.connect(bus);
            },
            chip: function (f, t, len) {
                var g = ctx.createGain();
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(0.09, t + 0.003);
                g.gain.setValueAtTime(0.09, t + len);
                g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.04);
                osc('square', f, t, t + len + 0.05).connect(g); g.connect(bus);
            },
            pad: function (f, t, len) {
                var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
                var g = ctx.createGain();
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(0.14, t + Math.min(0.12, len * 0.5));
                g.gain.setValueAtTime(0.14, t + len);
                g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.5);
                [-7, 7].forEach(function (cents) {
                    var o = osc('triangle', f, t, t + len + 0.55); o.detune.value = cents; o.connect(lp);
                });
                lp.connect(g); g.connect(bus);
            }
        };

        var drums = {
            kick: function (t, v) {
                var o = osc('sine', 150, t, t + 0.4);
                o.frequency.exponentialRampToValueAtTime(44, t + 0.12);
                var g = ctx.createGain(); env(g, t, 0.7 * v, 0.002, 0.32);
                o.connect(g); g.connect(dry);
            },
            hat: function (t, v) {
                var s = ctx.createBufferSource(); s.buffer = noise;
                var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
                var g = ctx.createGain(); env(g, t, 0.16 * v, 0.001, 0.05);
                s.connect(hp); hp.connect(g); g.connect(bus); s.start(t); s.stop(t + 0.08);
            },
            snare: function (t, v) {
                var s = ctx.createBufferSource(); s.buffer = noise;
                var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.8;
                var g = ctx.createGain(); env(g, t, 0.34 * v, 0.001, 0.16);
                s.connect(bp); bp.connect(g); g.connect(bus); s.start(t); s.stop(t + 0.2);
                var o = osc('triangle', 190, t, t + 0.12);
                var g2 = ctx.createGain(); env(g2, t, 0.2 * v, 0.001, 0.09);
                o.connect(g2); g2.connect(bus);
            }
        };

        return {
            ctx: ctx,
            now: function () { return ctx.currentTime; },
            resume: function () { return ctx.state === 'suspended' ? ctx.resume() : Promise.resolve(); },
            note: function (voice, f, t, len) { (voices[voice] || voices.bell)(f, t, len); },
            drum: function (kind, t, v) { if (drums[kind]) drums[kind](t, v || 1); },
            setVolume: function (v) { master.gain.setTargetAtTime(v * v * 1.4, ctx.currentTime, 0.03); },
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
                var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
                var oscs = [midi - 12, midi - 5].map(function (m, i) {
                    var o = ctx.createOscillator(); o.type = i ? 'triangle' : 'sawtooth';
                    o.frequency.value = midiToFreq(m); o.detune.value = i ? 4 : -4;
                    o.connect(lp); o.start(t); return o;
                });
                lp.connect(g); g.connect(bus);
                drone = { g: g, oscs: oscs };
            },
            close: function () { try { ctx.close(); } catch (e) {} }
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
        r = Math.min(r, w / 2, h / 2);
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }

    function asciiDigits(text) {
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

    // ── Page ───────────────────────────────────────────────────────

    function initNumberMusic() {
        var root = document.getElementById('number-music');
        if (!root || root.dataset.nmReady === 'true') return;
        if (typeof window.__numberMusicCleanup === 'function') window.__numberMusicCleanup();
        root.dataset.nmReady = 'true';

        var $ = function (id) { return document.getElementById(id); };
        var el = {
            name: $('nm-source-name'), value: $('nm-source-value'), pos: $('nm-pos'), len: $('nm-len'),
            roll: $('nm-roll'), tape: $('nm-tape'), play: $('nm-play'), restart: $('nm-restart'),
            loop: $('nm-loop'), seek: $('nm-seek'), presets: $('nm-presets'), input: $('nm-input'),
            ascii: $('nm-ascii'), use: $('nm-use'), file: $('nm-file'), message: $('nm-message'),
            custom: $('nm-custom'), voice: $('nm-voice'), scale: $('nm-scale'), key: $('nm-key'),
            register: $('nm-register'), space: $('nm-space'), volume: $('nm-volume'), drone: $('nm-drone'),
            tempo: $('nm-tempo'), rhythm: $('nm-rhythm'), drums: $('nm-drums'), gate: $('nm-gate'),
            circle: $('nm-circle'), hist: $('nm-hist'), circleText: $('nm-circle-text'), histText: $('nm-hist-text'),
            table: $('nm-table-body')
        };

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        var colors = {
            ink0: cssVar('--ink-0', '#0b0f0d'), ink1: cssVar('--ink-1', '#111714'), ink2: cssVar('--ink-2', '#172019'),
            line: cssVar('--line', '#223029'), lineStrong: cssVar('--line-strong', '#31443a'),
            text: cssVar('--text', '#e3eae5'), text2: cssVar('--text-2', '#a7b6ac'), text3: cssVar('--text-3', '#7d8f84'),
            signal: cssVar('--signal', '#5cf08f'), signalStrong: cssVar('--signal-strong', '#9dffbd'),
            signalDim: cssVar('--signal-dim', '#2f9c5b'), signalInk: cssVar('--signal-ink', '#04120a'),
            blue: '#7fb2e8', blueSoft: '#16263a'
        };
        var MONO = '"Geist Mono", "Cascadia Code", ui-monospace, Consolas, monospace';

        var state = {
            digits: '', source: null, mode: 'digits',
            index: 0,            // next digit to schedule
            current: -1,         // digit sounding now
            playing: false, loop: true,
            step: 0,             // running step counter (for the pulse drums)
            nextTime: 0,
            counts: new Array(10).fill(0), played: 0,
            walk: [],            // recent digits, for the circle
            flash: 0
        };
        var engine = null, timer = 0, raf = 0, queue = [];

        function settings() {
            return {
                voice: el.voice.value, scale: el.scale.value,
                key: parseInt(el.key.value, 10), register: parseInt(el.register.value, 10),
                bpm: parseInt(el.tempo.value, 10), rhythm: el.rhythm.value, drums: el.drums.value,
                gate: parseInt(el.gate.value, 10) / 100
            };
        }
        function stepDur(s) { return 60 / s.bpm / 2; } // eighth notes
        function midiFor(d, s) { return s.register + s.key + semitoneFor(d, s.scale); }

        // Key list
        NOTE_NAMES.forEach(function (n, i) {
            var o = document.createElement('option'); o.value = String(i); o.textContent = n;
            el.key.appendChild(o);
        });
        el.key.value = '0';

        // Preset chips, grouped
        var groups = {};
        PRESETS.forEach(function (p) {
            if (!groups[p.group]) {
                var wrap = document.createElement('div'); wrap.className = 'nm-preset-group';
                var label = document.createElement('span'); label.className = 'nm-preset-label'; label.textContent = p.group;
                var row = document.createElement('div'); row.className = 'nm-chips';
                wrap.appendChild(label); wrap.appendChild(row); el.presets.appendChild(wrap);
                groups[p.group] = row;
            }
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'nm-chip'; b.textContent = p.label;
            b.dataset.preset = p.id; b.setAttribute('aria-pressed', 'false');
            b.title = p.name;
            groups[p.group].appendChild(b);
        });

        // ── Source ──
        function setSource(digits, source) {
            var wasPlaying = state.playing;
            if (wasPlaying) pause();
            state.digits = digits;
            state.source = source;
            el.name.textContent = source.name;
            el.value.textContent = source.value;
            el.len.textContent = digits.length.toLocaleString();
            el.seek.max = String(Math.max(0, digits.length - 1));
            el.presets.querySelectorAll('.nm-chip').forEach(function (b) {
                b.setAttribute('aria-pressed', String(b.dataset.preset === source.id));
            });
            resetStats();
            seekTo(0);
            if (wasPlaying) play();
        }

        function choosePreset(id) {
            var p = PRESETS.filter(function (x) { return x.id === id; })[0];
            if (!p) return;
            setSource(presetDigits(p), { id: p.id, name: p.name, value: p.value });
            setMessage('');
        }

        function setMessage(text, isError) {
            el.message.textContent = text;
            el.message.classList.toggle('is-error', !!isError);
        }

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
            var parts = asciiDigits(text).slice(0, 24);
            el.ascii.hidden = false;
            el.ascii.innerHTML = '';
            parts.forEach(function (p) {
                var span = document.createElement('span');
                var ch = document.createElement('b');
                ch.textContent = p.ch === ' ' ? '␣' : p.ch;
                span.appendChild(ch);
                span.appendChild(document.createTextNode(String(p.code)));
                el.ascii.appendChild(span);
            });
            if (asciiDigits(text).length > 24) el.ascii.appendChild(document.createTextNode('…'));
        }

        function useInput() {
            var text = el.input.value;
            if (!text.trim()) { setMessage('Type some ' + (state.mode === 'text' ? 'text' : 'digits') + ' first.', true); el.input.focus(); return; }
            if (state.mode === 'text') {
                var codes = asciiDigits(text).map(function (p) { return p.code; }).join('');
                var preview = text.length > 28 ? text.slice(0, 28) + '…' : text;
                setSource(codes, { id: 'custom', name: '“' + preview + '” as character codes', value: codes.slice(0, 40) + (codes.length > 40 ? '…' : '') });
                setMessage(plural(asciiDigits(text).length, 'character') + ' became ' + plural(codes.length, 'digit') + '.');
            } else {
                var r = cleanDigits(text);
                if (!r.digits) { setMessage('No digits found. Switch to Text → ASCII to play words.', true); return; }
                setSource(r.digits, { id: 'custom', name: 'Your number', value: r.digits.slice(0, 40) + (r.digits.length > 40 ? '…' : '') });
                setMessage(r.ignored ? 'Skipped ' + plural(r.ignored, 'character') + ' that ' + (r.ignored === 1 ? 'was' : 'were') + ' not a digit.' : '');
            }
        }

        function readFile(file) {
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { setMessage(file.name + ' is over 5 MB. Trim it to the digits you want to hear.', true); return; }
            var reader = new FileReader();
            reader.onload = function () {
                var r = cleanDigits(String(reader.result || ''));
                if (!r.digits) { setMessage('No digits found in ' + file.name + '. The file needs at least one 0–9.', true); return; }
                setSource(r.digits, { id: 'file', name: file.name, value: r.digits.slice(0, 40) + (r.digits.length > 40 ? '…' : '') });
                setMessage('Loaded ' + r.digits.length.toLocaleString() + ' digits' + (r.ignored ? ', skipped ' + plural(r.ignored, 'other character') + '.' : '.'));
            };
            reader.onerror = function () { setMessage('Could not read ' + file.name + '. Try saving it as plain text.', true); };
            reader.readAsText(file);
        }

        // ── Transport ──
        function ensureEngine() {
            if (engine) return engine;
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) { setMessage('This browser has no Web Audio support, so it can draw the digits but not play them.', true); return null; }
            engine = Engine();
            engine.setVolume(el.volume.value / 100);
            engine.setSpace(el.space.value / 100);
            return engine;
        }

        function play() {
            if (!state.digits.length) return;
            if (!ensureEngine()) return;
            if (state.index >= state.digits.length) state.index = 0;
            state.playing = true;
            el.play.querySelector('.nm-play-label').textContent = 'Pause';
            root.classList.add('is-playing');
            var token = ++playToken;
            // Start the clock only once audio is actually running, so nothing bunches up.
            engine.resume().then(function () {
                if (token !== playToken || !state.playing || !engine) return;
                state.nextTime = engine.now() + 0.06;
                if (el.drone.checked) engine.setDrone(true, settings().register + settings().key);
                clearInterval(timer);
                timer = setInterval(schedule, 25);
                schedule();
                loop();
            });
        }
        var playToken = 0;

        function pause() {
            state.playing = false;
            playToken++;
            clearInterval(timer);
            el.play.querySelector('.nm-play-label').textContent = 'Play';
            root.classList.remove('is-playing');
            if (engine) engine.setDrone(false);
            // Resume after the digit on screen, not from the look-ahead.
            if (state.currentEv) state.index = state.current + 1;
            else state.index = Math.max(0, state.current);
            state.currentEv = null;
            queue = [];
            if (state.index >= state.digits.length) state.index = state.loop ? 0 : state.digits.length;
        }

        function seekTo(i) {
            i = Math.max(0, Math.min(state.digits.length - 1, i | 0));
            state.index = i;
            state.current = i;
            state.currentEv = null;
            queue = [];
            if (state.playing && engine) state.nextTime = engine.now() + 0.05;
            el.seek.value = String(i);
            updateReadout(i);
            drawAll(i);
        }

        function schedule() {
            if (!state.playing || !engine) return;
            var s = settings();
            var ahead = document.hidden ? 1.5 : 0.12;
            var sd = stepDur(s);
            while (state.nextTime < engine.now() + ahead) {
                if (state.index >= state.digits.length) {
                    if (state.loop) state.index = 0;
                    else {
                        var endAt = state.nextTime;
                        queue.push({ end: true, t: endAt });
                        clearInterval(timer);
                        return;
                    }
                }
                var i = state.index, d = state.digits.charCodeAt(i) - 48;
                var steps = stepsFor(d, s.rhythm), rest = isRest(d, s.rhythm);
                var t = state.nextTime, dur = steps * sd;
                var midi = midiFor(d, s);
                if (!rest) engine.note(s.voice, midiToFreq(midi), t, Math.max(0.03, dur * s.gate));
                if (s.drums === 'digit') {
                    var kind = digitDrum(d);
                    if (kind !== 'none') engine.drum(kind, t, 0.6 + d * 0.045);
                } else if (s.drums === 'pulse') {
                    for (var k = 0; k < steps; k++) {
                        var st = state.step + k, tt = t + k * sd;
                        if (st % 4 === 0) engine.drum('kick', tt, 1);
                        if (st % 8 === 4) engine.drum('snare', tt, 0.9);
                        if (st % 2 === 1) engine.drum('hat', tt, 0.7);
                    }
                }
                queue.push({ i: i, d: d, t: t, dur: dur, rest: rest, midi: midi });
                state.step += steps;
                state.nextTime += dur;
                state.index++;
            }
        }

        // ── Readouts ──
        function updateReadout(i) {
            el.pos.textContent = (Math.max(0, i) + 1).toLocaleString();
            var start = Math.max(0, i - 14), end = Math.min(state.digits.length, i + 30);
            el.tape.innerHTML = '';
            el.tape.classList.toggle('at-start', start === 0);
            var before = document.createElement('span'); before.className = 'nm-tape-past';
            before.textContent = (start > 0 ? '…' : '') + state.digits.slice(start, i);
            var cur = document.createElement('mark'); cur.textContent = state.digits.charAt(i);
            var after = document.createElement('span');
            after.textContent = state.digits.slice(i + 1, end) + (end < state.digits.length ? '…' : '');
            el.tape.appendChild(before); el.tape.appendChild(cur); el.tape.appendChild(after);
        }

        function resetStats() {
            state.counts = new Array(10).fill(0);
            state.played = 0;
            state.walk = [];
            state.step = 0;
        }

        function record(ev) {
            state.counts[ev.d]++;
            state.played++;
            state.walk.push(ev.d);
            if (state.walk.length > 160) state.walk.shift();
            state.flash = 1;
        }

        function updateStatsText() {
            if (!state.played) {
                el.histText.textContent = 'No digits played yet.';
                el.circleText.textContent = 'Press play to start the walk.';
                return;
            }
            var max = 0, min = 0;
            for (var d = 1; d < 10; d++) {
                if (state.counts[d] > state.counts[max]) max = d;
                if (state.counts[d] < state.counts[min]) min = d;
            }
            var pct = function (n) { return (100 * n / state.played).toFixed(1) + '%'; };
            el.histText.textContent = 'After ' + state.played.toLocaleString() + ' digits, ' + max + ' leads at ' + pct(state.counts[max]) +
                ' and ' + min + ' trails at ' + pct(state.counts[min]) + '. An even spread is 10% each.';
            var w = state.walk, last = w.slice(-8).join(' → ');
            el.circleText.textContent = 'Latest steps: ' + last + '.';
        }

        // ── Drawing ──
        var lastStatsText = 0;

        function drawRoll(pos) {
            var g = sizeCanvas(el.roll), c = g.c, W = g.w, H = g.h;
            var s = settings();
            c.clearRect(0, 0, W, H);
            var semis = [];
            for (var d = 0; d < 10; d++) semis.push(semitoneFor(d, s.scale));
            var lo = semis[0], hi = semis[9];
            var padT = 18, padB = 18, gutter = 44;
            var rowY = function (semi) { return padT + (H - padT - padB) * (1 - (semi - lo) / Math.max(1, hi - lo)); };

            // Rows: one per digit, labelled with the digit and its note
            c.font = '500 11px ' + MONO;
            c.textBaseline = 'middle';
            for (d = 0; d < 10; d++) {
                var y = Math.round(rowY(semis[d])) + 0.5;
                c.strokeStyle = colors.line; c.lineWidth = 1;
                c.beginPath(); c.moveTo(gutter, y); c.lineTo(W, y); c.stroke();
                c.fillStyle = colors.text2; c.textAlign = 'right';
                c.fillText(String(d), gutter - 22, y);
                c.fillStyle = colors.text3;
                c.fillText(noteName(midiFor(d, s)).replace(/\d+$/, ''), gutter - 6, y);
            }

            var cell = W < 560 ? 22 : 28;
            var playX = gutter + Math.max(60, (W - gutter) * 0.32);
            // With loop on, the score wraps: the start of the number follows its end.
            var L = state.digits.length;
            var wrap = state.loop && L > 0;
            var first = Math.floor(pos - (playX - gutter) / cell) - 1;
            var last = Math.ceil(pos + (W - playX) / cell) + 1;
            if (!wrap || !state.played) first = Math.max(0, first);
            if (!wrap) last = Math.min(L - 1, last);
            var digitAt = function (k) { return state.digits.charCodeAt(((k % L) + L) % L) - 48; };

            c.save();
            c.beginPath(); c.rect(gutter, 0, W - gutter, H); c.clip();

            // Contour line through the notes
            c.lineWidth = 1.5;
            for (var pass = 0; pass < 2; pass++) {
                c.beginPath();
                var started = false;
                for (var i = first; i <= last; i++) {
                    var past = i < pos;
                    if ((pass === 0) !== past && !(pass === 0 && i === Math.ceil(pos))) continue;
                    var di = digitAt(i);
                    var x = playX + (i - pos) * cell, yy = rowY(semis[di]);
                    if (!started) { c.moveTo(x, yy); started = true; } else c.lineTo(x, yy);
                }
                c.strokeStyle = pass === 0 ? colors.signalDim : colors.lineStrong;
                c.globalAlpha = pass === 0 ? 0.7 : 0.8;
                c.stroke();
            }
            c.globalAlpha = 1;

            // Notes
            var cur = state.current;
            for (i = first; i <= last; i++) {
                di = digitAt(i);
                x = playX + (i - pos) * cell;
                yy = rowY(semis[di]);
                var steps = stepsFor(di, s.rhythm), rest = isRest(di, s.rhythm);
                var w = Math.min(cell * steps, cell * 0.72 + (steps - 1) * cell * 0.5), h = 18;
                var isCur = i === cur;
                var grow = isCur && !reduceMotion.matches ? state.flash * 3 : 0;
                roundRect(c, x - w / 2 - grow / 2, yy - h / 2 - grow / 2, w + grow, h + grow, 5);
                if (rest) {
                    c.strokeStyle = isCur ? colors.signal : colors.lineStrong; c.lineWidth = 1; c.stroke();
                } else if (isCur) {
                    c.fillStyle = colors.signal; c.fill();
                } else if (i < pos) {
                    c.fillStyle = colors.ink2; c.fill();
                    c.strokeStyle = colors.signalDim; c.globalAlpha = 0.55; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1;
                } else {
                    c.fillStyle = colors.ink1; c.fill();
                    c.strokeStyle = colors.lineStrong; c.lineWidth = 1; c.stroke();
                }
                c.fillStyle = isCur ? colors.signalInk : (i < pos ? colors.text2 : colors.text3);
                c.textAlign = 'center';
                c.font = (isCur ? '600 ' : '500 ') + '11px ' + MONO;
                c.fillText(String(di), x, yy + 0.5);
            }

            // Playhead
            c.strokeStyle = colors.signal; c.globalAlpha = 0.5; c.lineWidth = 1;
            c.beginPath(); c.moveTo(Math.round(playX) + 0.5, 4); c.lineTo(Math.round(playX) + 0.5, H - 4); c.stroke();
            c.globalAlpha = 1;
            c.restore();

            // Edge fades so notes slide in and out instead of popping
            var fadeL = c.createLinearGradient(gutter, 0, gutter + 40, 0);
            fadeL.addColorStop(0, colors.ink1); fadeL.addColorStop(1, 'rgba(17,23,20,0)');
            c.fillStyle = fadeL; c.fillRect(gutter, 0, 40, H);
            var fadeR = c.createLinearGradient(W - 60, 0, W, 0);
            fadeR.addColorStop(0, 'rgba(17,23,20,0)'); fadeR.addColorStop(1, colors.ink1);
            c.fillStyle = fadeR; c.fillRect(W - 60, 0, 60, H);
        }

        function drawCircle() {
            var g = sizeCanvas(el.circle), c = g.c, W = g.w, H = g.h;
            c.clearRect(0, 0, W, H);
            var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 30;
            var pt = function (d, r) {
                var a = -Math.PI / 2 + d * Math.PI / 5;
                return { x: cx + Math.cos(a) * (r || R), y: cy + Math.sin(a) * (r || R) };
            };
            c.strokeStyle = colors.line; c.lineWidth = 1;
            c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();

            var w = state.walk, n = w.length;
            for (var i = 1; i < n; i++) {
                var a = pt(w[i - 1]), b = pt(w[i]);
                var age = (n - i) / n;
                var newest = i === n - 1;
                c.beginPath();
                if (w[i - 1] === w[i]) {
                    // A repeated digit draws a small loop just inside its node.
                    var o = pt(w[i], R - 12);
                    c.arc(o.x, o.y, 12, 0, Math.PI * 2);
                } else {
                    c.moveTo(a.x, a.y);
                    c.quadraticCurveTo(cx + ((a.x + b.x) / 2 - cx) * 0.25, cy + ((a.y + b.y) / 2 - cy) * 0.25, b.x, b.y);
                }
                c.strokeStyle = newest ? colors.signal : colors.blue;
                c.globalAlpha = newest ? 1 : Math.max(0.05, 0.55 * (1 - age));
                c.lineWidth = newest ? 2 : 1;
                c.stroke();
            }
            c.globalAlpha = 1;

            var curD = n ? w[n - 1] : -1;
            c.font = '500 12px ' + MONO; c.textAlign = 'center'; c.textBaseline = 'middle';
            for (var d = 0; d < 10; d++) {
                var p = pt(d), lp = pt(d, R + 17);
                var isCur = d === curD;
                c.beginPath(); c.arc(p.x, p.y, isCur ? 6 + (reduceMotion.matches ? 0 : state.flash * 2) : 4, 0, Math.PI * 2);
                c.fillStyle = isCur ? colors.signal : colors.ink2; c.fill();
                c.strokeStyle = isCur ? colors.signal : colors.lineStrong; c.lineWidth = 1; c.stroke();
                c.fillStyle = isCur ? colors.signal : colors.text2;
                c.fillText(String(d), lp.x, lp.y);
            }
        }

        function drawHist() {
            var g = sizeCanvas(el.hist), c = g.c, W = g.w, H = g.h;
            c.clearRect(0, 0, W, H);
            var padL = 36, padR = 4, padT = 16, padB = 28;
            var bw = (W - padL - padR) / 10;
            var maxShare = 0.2;
            for (var d = 0; d < 10; d++) maxShare = Math.max(maxShare, state.played ? state.counts[d] / state.played * 1.15 : 0);
            var y0 = H - padB, span = y0 - padT;
            var curD = state.walk.length ? state.walk[state.walk.length - 1] : -1;

            for (d = 0; d < 10; d++) {
                var share = state.played ? state.counts[d] / state.played : 0;
                var h = span * share / maxShare;
                var x = padL + d * bw + bw * 0.18, w = bw * 0.64;
                c.fillStyle = colors.ink2;
                roundRect(c, x, padT, w, span, 4); c.fill();
                if (h > 0.5) {
                    c.fillStyle = d === curD ? colors.signal : colors.blue;
                    roundRect(c, x, y0 - h, w, h, 4); c.fill();
                }
                c.fillStyle = d === curD ? colors.signal : colors.text2;
                c.font = '500 12px ' + MONO; c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(String(d), x + w / 2, H - padB / 2);
            }
            // Even-spread line at 10%
            var ey = Math.round(y0 - span * 0.1 / maxShare) + 0.5;
            c.strokeStyle = colors.text3; c.setLineDash([3, 4]); c.lineWidth = 1;
            c.beginPath(); c.moveTo(padL, ey); c.lineTo(W - padR, ey); c.stroke();
            c.setLineDash([]);
            c.fillStyle = colors.text3; c.font = '500 10px ' + MONO; c.textAlign = 'right'; c.textBaseline = 'middle';
            c.fillText('10%', padL - 6, ey);
        }

        function drawAll(pos) {
            drawRoll(pos);
            drawCircle();
            drawHist();
        }

        // Move scheduled events whose start time has passed into "now playing".
        function retireEvents() {
            if (!engine || !state.playing) return;
            var now = engine.now();
            while (queue.length && queue[0].t <= now) {
                var ev = queue.shift();
                if (ev.end) { pause(); seekTo(0); return; }
                record(ev);
                if (queue.length && queue[0].t <= now) continue; // skipped frame: count it, don't show it
                state.current = ev.i;
                state.currentEv = ev;
                el.seek.value = String(ev.i);
                updateReadout(ev.i);
            }
        }

        var lastFrame = 0;
        function loop(ts) {
            cancelAnimationFrame(raf);
            if (!root.isConnected) return;
            var dt = lastFrame && ts ? Math.min(0.1, (ts - lastFrame) / 1000) : 0.016;
            lastFrame = ts || 0;
            retireEvents();
            state.flash = Math.max(0, state.flash - dt * 5);
            // The sounding note sits on the playhead, then the score glides toward the next one.
            var e = state.currentEv, pos = Math.max(0, state.current);
            if (state.playing && e && !reduceMotion.matches) pos = e.i + Math.min(1, Math.max(0, (engine.now() - e.t) / e.dur));
            drawAll(pos);
            var now = performance.now();
            if (now - lastStatsText > 250) { updateStatsText(); lastStatsText = now; }
            if (state.playing || state.flash > 0) raf = requestAnimationFrame(loop);
            else { lastFrame = 0; raf = 0; updateStatsText(); }
        }

        // ── Mapping table ──
        function renderTable() {
            var s = settings();
            el.table.innerHTML = '';
            for (var d = 0; d < 10; d++) {
                var midi = midiFor(d, s), tr = document.createElement('tr');
                var steps = stepsFor(d, s.rhythm);
                var len = isRest(d, s.rhythm) ? 'Rest' : steps + (steps === 1 ? ' step' : ' steps');
                [String(d), noteName(midi), midiToFreq(midi).toFixed(1) + ' Hz', len, DRUM_NAMES[digitDrum(d)]].forEach(function (v, i) {
                    var td = document.createElement(i === 0 ? 'th' : 'td');
                    if (i === 0) td.scope = 'row';
                    td.textContent = v;
                    tr.appendChild(td);
                });
                el.table.appendChild(tr);
            }
        }

        function refreshStill() {
            renderTable();
            if (!state.playing) drawAll(Math.max(0, state.current));
        }

        // ── Events ──
        var listeners = [];
        function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); }

        on(el.presets, 'click', function (e) {
            var b = e.target.closest('[data-preset]');
            if (b) choosePreset(b.dataset.preset);
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
        on(el.input, 'keydown', function (e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); useInput(); }
        });
        on(el.use, 'click', useInput);
        on(el.file, 'change', function () { readFile(el.file.files[0]); el.file.value = ''; });
        on(el.custom, 'dragover', function (e) { e.preventDefault(); el.custom.classList.add('is-drop'); });
        on(el.custom, 'dragleave', function (e) { if (!el.custom.contains(e.relatedTarget)) el.custom.classList.remove('is-drop'); });
        on(el.custom, 'drop', function (e) {
            e.preventDefault(); el.custom.classList.remove('is-drop');
            if (e.dataTransfer && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
        });

        on(el.play, 'click', function () { state.playing ? pause() : play(); });
        on(el.restart, 'click', function () { resetStats(); seekTo(0); updateStatsText(); });
        on(el.loop, 'click', function () {
            state.loop = !state.loop;
            el.loop.setAttribute('aria-pressed', String(state.loop));
            if (!state.playing) drawAll(Math.max(0, state.current));
        });
        on(el.seek, 'input', function () { seekTo(parseInt(el.seek.value, 10)); });

        function bindRange(input, out, fmt, after) {
            var update = function () { out.textContent = fmt(input.value); if (after) after(); };
            on(input, 'input', update); update();
        }
        bindRange(el.tempo, $('nm-tempo-out'), function (v) { return v + ' bpm'; });
        bindRange(el.gate, $('nm-gate-out'), function (v) { return v + '%'; });
        bindRange(el.space, $('nm-space-out'), function (v) { return v + '%'; }, function () { if (engine) engine.setSpace(el.space.value / 100); });
        bindRange(el.volume, $('nm-volume-out'), function (v) { return v + '%'; }, function () { if (engine) engine.setVolume(el.volume.value / 100); });

        [el.scale, el.key, el.register, el.rhythm, el.drums, el.voice].forEach(function (s) { on(s, 'change', refreshStill); });
        [el.key, el.register].forEach(function (s) {
            on(s, 'change', function () { if (engine && state.playing && el.drone.checked) engine.setDrone(true, settings().register + settings().key); });
        });
        on(el.drone, 'change', function () {
            if (engine && state.playing) engine.setDrone(el.drone.checked, settings().register + settings().key);
        });

        on(document, 'keydown', function (e) {
            if (!root.isConnected || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            var t = e.target, tag = t && t.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
            if (document.body.classList.contains('sidebar-open') || document.querySelector('[role="dialog"]:not([hidden])')) return;
            if (e.key === ' ' && tag !== 'BUTTON' && tag !== 'A') {
                e.preventDefault(); state.playing ? pause() : play();
            } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !state.playing && tag !== 'BUTTON') {
                e.preventDefault();
                var i = Math.max(0, state.current) + (e.key === 'ArrowRight' ? 1 : -1);
                seekTo(i); state.current = Math.max(0, Math.min(state.digits.length - 1, i));
                previewDigit(state.current);
                drawAll(state.current);
            }
        });

        function previewDigit(i) {
            if (!ensureEngine()) return;
            engine.resume();
            var s = settings(), d = state.digits.charCodeAt(i) - 48;
            if (isRest(d, s.rhythm)) return;
            var t = engine.now() + 0.01;
            engine.note(s.voice, midiToFreq(midiFor(d, s)), t, stepDur(s) * stepsFor(d, s.rhythm) * s.gate);
            if (s.drums === 'digit' && digitDrum(d) !== 'none') engine.drum(digitDrum(d), t, 0.6 + d * 0.045);
            state.index = i + 1;
            record({ d: d });
            updateReadout(i);
            el.seek.value = String(i);
            updateStatsText();
            if (!raf || !state.playing) loop();
        }

        var resizeTimer = 0;
        on(window, 'resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { if (!state.playing) drawAll(Math.max(0, state.current)); }, 80);
        });

        // ── Lifecycle ──
        function cleanup() {
            pause();
            cancelAnimationFrame(raf);
            listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
            listeners = [];
            if (engine) { engine.close(); engine = null; }
            if (observer) observer.disconnect();
            window.__numberMusicCleanup = null;
        }
        window.__numberMusicCleanup = cleanup;

        var observer = null;
        var host = root.closest('.content');
        if ('MutationObserver' in window && host) {
            observer = new MutationObserver(function () { if (!root.isConnected) cleanup(); });
            observer.observe(host, { childList: true });
        }

        // ── Start ──
        renderTable();
        choosePreset('pi');
        state.current = 0;
        updateReadout(0);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!state.playing) drawAll(Math.max(0, state.current)); });
    }

    window.initNumberMusic = initNumberMusic;
    initNumberMusic();
}());

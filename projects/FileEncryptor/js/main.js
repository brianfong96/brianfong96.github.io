// Deterministic PRNG from RPRPG
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
    return min + rnd * (max - min);
};

function randomInt(min, max) {
    var r = Math.round(Math.seededRandom() * max);
    if (r < min) r = min;
    else if (r >= max) r = max - 1;
    return r;
}

function randomSort(s) {
    var l = s.length;
    var ret = "";
    var pos = [];
    for (var i = 0; i < l; i++) pos.push(i);
    for (var i = 0; i < l; i++) {
        var p = randomInt(0, pos.length);
        ret += s[pos[p]];
        pos[p] = pos[pos.length - 1];
        pos.pop();
    }
    return ret;
}

function randomSortAll(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = randomSort(arr[i]);
    }
    return arr;
}

function generateSeed(seed, fields) {
    var ids = ["firstname", "lastname", "bday", "email", "username", "account", "length", "exclude", "extra", "include"];
    for (var i = 0; i < ids.length; i++) {
        var element = fields[ids[i]] || "";
        for (var char = 0; char < element.length; char++) {
            seed += element.charCodeAt(char) + (i + 1) * (char + 1);
        }
    }
    return seed;
}

function newGenerateSeed(seed, fields) {
    var ids = ["firstname", "lastname", "bday", "email", "username", "account", "length", "exclude", "extra", "include"];
    for (var i = 0; i < ids.length; i++) {
        var element = fields[ids[i]] || "";
        for (var char = 0; char < element.length; char++) {
            seed += element.charCodeAt(char) * (i + char + 1);
        }
    }
    return seed;
}

function generatePassword(fields) {
    var length = parseInt(fields.length, 10) || 16;
    var lower = 'qwertyuiopasdfghjklzxcvbnm';
    var upper = lower.toUpperCase();
    var numbers = '1234567890';
    var symbols = "!@#$%^&*()-=_+[]:;',./?`~";
    var include = fields.include || '';
    var includeLower = fields.includeLower;
    var includeUpper = fields.includeUpper;
    var includeNumber = fields.includeNumbers;
    var includeSymbols = fields.includeSymbols;
    var exclude = fields.exclude || '';
    var allchar = [];
    var seed = 1;

    if (includeLower) { allchar.push(lower); seed *= 2; }
    if (includeUpper) { allchar.push(upper); seed *= 3; }
    if (includeNumber) { allchar.push(numbers); seed *= 4; }

    if (include.length > 0) {
        if (includeSymbols) {
            allchar.push(symbols + include);
            seed *= 5;
        } else {
            allchar.push(include);
            seed *= 6;
        }
    } else if (includeSymbols) {
        allchar.push(symbols);
        seed *= 7;
    }

    for (var i = 0; i < exclude.length; i++) {
        for (var j = 0; j < allchar.length; j++) {
            var pos = allchar[j].indexOf(exclude[i]);
            if (pos != -1) {
                allchar[j] = allchar[j].substr(0, pos) + allchar[j].substr(pos + 1, allchar[j].length);
            }
            if (allchar[j].length == 0) {
                allchar[j] = allchar[allchar.length - 1];
                allchar.pop();
            }
        }
    }

    Math.seed = generateSeed(seed, fields);
    if (fields.newSeedGen) {
        Math.seed = newGenerateSeed(seed, fields);
    }

    var pw = '';
    for (var i = 0; i < length; i++) {
        allchar = randomSortAll(allchar);
        var setNum = randomInt(0, allchar.length);
        if (i < allchar.length && i < length) {
            setNum = i;
        }
        var charPos = randomInt(0, allchar[setNum].length);
        pw += allchar[setNum][charPos];
    }
    return randomSort(pw);
}

function getFields() {
    return {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        bday: document.getElementById('bday').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        account: document.getElementById('account').value,
        length: document.getElementById('length').value,
        exclude: document.getElementById('exclude').value,
        extra: document.getElementById('extra').value,
        include: document.getElementById('include').value,
        includeLower: document.getElementById('includeLower').checked,
        includeUpper: document.getElementById('includeUpper').checked,
        includeNumbers: document.getElementById('includeNumbers').checked,
        includeSymbols: document.getElementById('includeSymbols').checked,
        newSeedGen: document.getElementById('newSeedGenYes').checked
    };
}

async function deriveKey(password) {
    const enc = new TextEncoder();
    const pwUtf8 = enc.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', pwUtf8);
    return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptArrayBuffer(password, buffer) {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buffer);
    const result = new Uint8Array(iv.byteLength + cipher.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(cipher), iv.byteLength);
    return result.buffer;
}

async function decryptArrayBuffer(password, buffer) {
    const key = await deriveKey(password);
    const iv = buffer.slice(0, 12);
    const data = buffer.slice(12);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, data);
    return plain;
}

function downloadBlob(buffer, filename) {
    const blob = new Blob([buffer]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function handleEncrypt() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) return;
    const fields = getFields();
    const pw = generatePassword(fields);
    const arrayBuffer = await fileInput.files[0].arrayBuffer();
    const encrypted = await encryptArrayBuffer(pw, arrayBuffer);
    downloadBlob(encrypted, fileInput.files[0].name + '.enc');
}

async function handleDecrypt() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) return;
    const fields = getFields();
    const pw = generatePassword(fields);
    const arrayBuffer = await fileInput.files[0].arrayBuffer();
    try {
        const decrypted = await decryptArrayBuffer(pw, arrayBuffer);
        downloadBlob(decrypted, fileInput.files[0].name.replace(/\.enc$/, ''));
    } catch (e) {
        alert('Decryption failed. Did you enter the same details?');
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('encryptBtn').addEventListener('click', handleEncrypt);
    document.getElementById('decryptBtn').addEventListener('click', handleDecrypt);
}

// Export for Node testing
if (typeof module !== 'undefined') {
    module.exports = {
        generatePassword,
        encryptArrayBuffer,
        decryptArrayBuffer,
        deriveKey
    };
}

const assert = require('assert');
const path = require('path');
const {
    generatePassword,
    encryptArrayBuffer,
    decryptArrayBuffer
} = require('../js/main.js');

async function bufferFromString(str) {
    return Buffer.from(str, 'utf-8');
}

(async () => {
    const fields = {
        firstname: 'John',
        lastname: 'Doe',
        bday: '1990-01-01',
        email: 'john@example.com',
        username: 'jdoe',
        account: 'test',
        length: '16',
        exclude: '',
        extra: 'pass',
        include: '',
        includeLower: true,
        includeUpper: true,
        includeNumbers: true,
        includeSymbols: true,
        newSeedGen: false
    };

    const pw = generatePassword(fields);
    const buf = await bufferFromString('secret data');
    const enc = await encryptArrayBuffer(pw, buf);
    const dec = await decryptArrayBuffer(pw, enc);
    assert.strictEqual(Buffer.from(dec).toString('utf-8'), 'secret data');

    let failed = false;
    try {
        await decryptArrayBuffer('wrong', enc);
    } catch (e) {
        failed = true;
    }
    assert.ok(failed, 'decryption with wrong password should fail');

    console.log('All tests passed');
})();

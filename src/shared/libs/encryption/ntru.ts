import NTRU from 'ntrujs';

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        // @ts-ignore
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

const keypair = NTRU.createKey();
const pub = toHexString(keypair.public);
console.log(pub);
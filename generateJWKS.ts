import generateKeyPair from 'jose/util/generate_key_pair'
import * as fs from "fs";
import parseJwk from 'jose/jwk/parse';
import * as crypto from "crypto";

const numKeys = 30;

async function genPS256() {
    return await generateKeyPair('PS256');

}

async function genRSA() {
    return await generateKeyPair('RSA-OAEP-256');

}

async function genEC() {
    return await generateKeyPair('ec', {crv:'secp256k1'});

}

(async () => {
    const Keys = [];

    for (let i=0;i<numKeys;i++) {


        crypto.generateKeyPairSync("x448");




    }
})()




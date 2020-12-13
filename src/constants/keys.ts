import NodeRSA from 'node-rsa';
import path from "path";
import * as fs from "fs";

const n = new NodeRSA();
const k = fs.readFileSync(path.resolve(__dirname, '../..', '.server_keys')).toString("utf8");
const SK = n.importKey(k, 'private');
const SKP = n.importKey(k, 'public');
export default {
    priv:SK,
    pub:SKP
};
import NodeRSA from "node-rsa";
import * as fs from "fs";

const key = new NodeRSA({b:2048});

const keyStr = `${key.exportKey('private').toString()}\n\n${key.exportKey('public').toString()}`;

fs.writeFileSync("./.server_keys", keyStr);
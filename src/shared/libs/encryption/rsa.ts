import NodeRSA from "node-rsa";
import * as fs from "fs";
import * as path from "path";

export class Rsa {

    protected bits:number;
    protected key:NodeRSA;
    protected keyPath: { serverPath:string, otherPath:string }

    constructor(createKeypair:boolean=false, isServer?:boolean,bits?:number) {

    }

    createKeyPair() {

     this.key = new NodeRSA({b:this.bits});

    }


    get privateKey() {
        return this.key.exportKey('private');
    }

    get publicKey() {
        return this.key.exportKey('public');
    }

    get serverKeyPath() {
        return this.keyPath.serverPath
    }

    get otherKeyPath() {
        return this.keyPath.otherPath;
    }

    save(keyType:string | 'server') {

        if(keyType === 'server') {
            const fileName = path.resolve(__dirname, this.keyPath.serverPath, 'serverKey.key');
        } else {
            const fileName = path.resolve(__dirname, this.keyPath.otherPath, `${keyType}.key`);
        }



    }

}
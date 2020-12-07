import * as JWKS from "node-jose";
import * as hash from "object-hash";
import * as fs from "fs";
import * as path from "path";

export class Keystore {


    protected _keystore:JWKS.JWK.KeyStore;
    protected jwks:string[] = [];

    constructor(createNew:boolean=false) {

        if(createNew === true) {
            this.createNewKeyStore().then((response:JWKS.JWK.KeyStore) => {
                    this._keystore = response;
            }).catch(err => {
                console.log(err);
            });
        } else {
            this.loadKeys().then().catch(err => console.log(err));
        }



    }

    async createNewKeyStore():Promise<any> {
        this._keystore = JWKS.JWK.createKeyStore();
        this.addNewRSAKeyToKeyStore("sig").then(() => {
            this._keystore.add(this.jwks.pop()).then((res) => {
                console.log(res);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    async generateKey(keyType:string, size:number, props:any=""):Promise<JWKS.JWK.Key | void> {
        let key;
        try{
            key = await JWKS.JWK.createKey(keyType, size, props);
            if(key) return key;
        } catch(e) {
            console.log(e);
            return e;
        }

    }

    async addNewRSAKeyToKeyStore(usage:string | "sig"):Promise<void> {

        let key;
        try {
            key = await this.generateKey("RSA", 1024, {use:usage});
            if(key) {

                this.jwks.push(key);


            }
        } catch(e) {

            return e;
        }

    }

    async addManyKeys(keyType:string,size:number, usage:string) {

        let keys = [];
        for(let i =0; i<size; i++) {
            let key;
            try {
                key = await this.generateKey(keyType, size, {use:usage});
                if(key) {
                    keys.push(key);
                    if(keys.length-1 === size) {
                        return keys;
                    }
                }
            } catch(e) {
                return e;
            }
        }

    }

     writeKeystoreToDisk() {

        const data = this._keystore.toJSON(true);
         const keyPath = path.resolve(__dirname, "../..", ".keys");
         if(!fs.existsSync(keyPath)) {
             fs.mkdirSync(keyPath, {recursive:true});
         }
         fs.writeFileSync(keyPath, JSON.stringify(data));
            return;
     }

     async serveKeys() {

        let keys;
        try {
            keys = await this.loadKeys();
            if(keys) {
                return this._keystore.toJSON(false);
            }
        } catch(err) {
            return err;
        }

     }

     async loadKeys() {

        const keyPath = path.resolve(__dirname, "../..", ".keys", "jwks.json");
        const keys = [fs.readFileSync(keyPath).toString()];
        let keystore;
        try {
            keystore = await JWKS.JWK.asKeyStore(keys);
            if(keystore) {
                this._keystore = keystore;
                return true;
            }
        } catch(err) {
            return err;
        }

     }

}
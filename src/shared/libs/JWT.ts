import parseJwk from 'jose/jwk/parse';
import {Keystore} from "./Keystore";
import * as fs from "fs";
import * as path from "path";
import * as JWKS from "node-jose";
import * as JWT from "jsonwebtoken";


const keyPath = path.resolve(__dirname, '../..', '.keys', 'jwks.json');
let KS:Keystore;
if(!fs.existsSync(keyPath)) {
    KS = new Keystore(true);
} else {
    KS = new Keystore();
}

export class JsonWebToken {

    readonly keystore:Keystore = KS;
    private token:string;
    private refresh_token:string;
    private raw_token:any;
    private private_key:any;


    constructor(createToken:boolean=false, type?:string, data?:string) {



        if(!!(createToken)) {

        } else {

            this.createNewToken(type, data);

        }

    }

    async getPrivateKey(key:any) {

        let pk;
        try {
            pk = await parseJwk(key);
            if(pk) {
                this.private_key = pk;
            }
        } catch(e) {
            return e;
        }

    }

    createNewToken(type:string, data:any) {

        switch(type){
            case "authentication" :
                this.createNewAuthenticationToken(data);
                break;
            case "id_token":
                this.createNewIDToken(data);
                break;
            case "registration":
                this.createNewRegToken(data);
                break;
            case "refresh_token":
                this.createRefreshToken(data);
                break;
            default:
                break;

        }

    }

    createNewAuthenticationToken(data:any) {



    }

    createNewIDToken(data:any):any {

    }

    createNewRegToken(data:any):any {

    }

    createRefreshToken(token:string) {

    }

    async encryptToken(token:string):Promise<string | void> {

        try{
            let ks = await this.keystore.loadKeys();
            let key = await JWKS.JWK.asKey(ks.all({use: 'enc'}), 'private');
            if (key){
                let encToken = await JWKS.JWE.createEncrypt({zip:true, format:'flattened'},key).update(Buffer.from(token)).final();
                if (encToken){
                    return encToken;
                }
            }

        } catch(e) {
            return e;
        }


    }

    async decryptToken(token:string):Promise<any | void> {

        try {

            try{
                let ks = await this.keystore.loadKeys();
                let key = await JWKS.JWK.asKey(ks.all({use: 'enc'}), 'private');
                if (key){
                    let decToken = await JWKS.JWE.createDecrypt(key).decrypt(token);
                    if (decToken){
                        return decToken;
                    }
                }

            } catch(e) {
                return e;
            }


        } catch(e)  {
            return e;
        }

    }

    async signToken(data:any):Promise<any | void> {
        try {

            let ks = await this.keystore.loadKeys();
            let key = await JWKS.JWK.asKey(ks.get({use: 'sig'}), 'private');
            if(key) {
                let sig = await JWKS.JWS.createSign(key).update(data).final();
                if(sig) {
                    return sig;
                }
            }


        } catch(e)  {
            return e;
        }
    }

    async verifySignature(token:string):Promise<any | void> {
        try {

            let ks = await this.keystore.loadKeys();
            let key = await JWKS.JWK.asKey(ks.all({use: 'sig'}), 'private');
            if(key) {
                let valid = await JWKS.JWS.createVerify(key).verify(token, {allowEmbeddedKey:true})
                if(valid) {
                    return valid;
                }
            }


        } catch(e)  {
            return e;
        }
    }

    archiveToken(token:string, type:"token"|"refresh") {

    }

    deleteToken(token:string,type:"token"|"refresh") {

    }

    storeActiveToken(token:string,type:"token"|"refresh") {

    }

    //create unique token id
    createJTI():string {

        return "";

    }

    //encrypt token claims data such as user infos
    encryptTokenClaimsData(sig_alg:string,enc_alg:string, data:any) {

    }

    //verify the claims before decrypting them
    verifyTokenClaimsData(data:any, sig_alg:string, enc_alg:string, signature:string) {

    }




}

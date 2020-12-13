import parseJwk from 'jose/jwk/parse';
import {Keystore} from "./Keystore";
import * as fs from "fs";
import * as path from "path";
import * as JWKS from "node-jose";
import SignJWT from 'jose/jwt/sign'
import FlattenedEncrypt from 'jose/jwe/flattened/encrypt'
import CompactEncrypt from 'jose/jwe/compact/encrypt'
import {ID_TOKEN_CLAIMS} from "../../constants/token";
import KEYS from "../../constants/keys";
import compactDecrypt from 'jose/jwe/compact/decrypt';
import jwtVerify from 'jose/jwt/verify'


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
    private default_claims:any;
    private data:any;
    private tokentype:string;

    constructor(type?:string, data?:any) {




           this.tokentype = type || 'id_token';
           this.data = data;



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

    async createNewToken() {

        switch(this.tokentype){
            case "authentication" :
                this.createNewAuthenticationToken(this.data);
                break;
            case "id_token":
                return await
                    this.createNewIDToken(this.data);

            default:
                break;

        }

    }

    createNewAuthenticationToken(data:any) {



    }

    async createNewIDToken(data:any):Promise<any> {




        try {
            const claims = this.createDefaultClaims();
            console.log(data);
            claims.sub = `${data[0].id}`;
                let e = await this.encryptToken(data);
                if(e) {
                    claims.userinfo = e;
                    let s = await this.signToken(claims);
                    if(s) {
                        return s;
                    }
                }

        } catch(err) {
            return err;
        }


    }

    createNewRegToken(data:any):any {

    }

    createRefreshToken(token:string) {

    }

    async encryptToken(token:string):Promise<any> {
       try {
           const encoder = new TextEncoder()
           let ks = fs.readFileSync(path.resolve(__dirname, "../../.keys/jwks.json")).toString();
           if (ks) {
               let key = JSON.parse(ks).keys;
               let k1;
               if (key) {
                   key.forEach((k) => {
                       if (k.use === 'enc') {
                           k1 = k;
                           return;
                       }
                   })
                   let k2 = await parseJwk(k1);
                   if (k2) {
                       let enc = await new CompactEncrypt(encoder.encode(token)).setProtectedHeader({
                           alg: 'RSA-OAEP-256',
                           enc: 'A256GCM'
                       }).encrypt(k2);
                       if (enc) {
                           console.log(`encryption:${enc}\n\n`);
                           return enc;
                       }
                   }
               }
           }
       } catch(err) {
           return err;
       }


    }

    async decryptToken(token:string):Promise<any | void> {


            try{
                const decoder = new TextDecoder();
                let ks = fs.readFileSync(path.resolve(__dirname, "../../.keys/jwks.json")).toString();
                if (ks) {
                    let key = JSON.parse(ks).keys;
                    let k1;
                    if (key) {
                        key.forEach((k) => {
                            if (k.use === 'enc') {
                                k1 = k;
                                return;
                            }
                        })
                        let k2 = await parseJwk(k1);
                        if (k2) {
                            const { plaintext, protectedHeader } = await compactDecrypt(token, k2);
                            if(plaintext) {
                                console.log(plaintext);
                                return plaintext;
                            }
                        }
                    }
                }

            } catch(e) {
                return e;
            }




    }

    async signToken(data:any):Promise<any | void> {
        try {



            let ks = fs.readFileSync(path.resolve(__dirname, "../../.keys/jwks.json")).toString();
            if(ks) {
                let key = JSON.parse(ks).keys[0];
                if (key) {
                    let k = await parseJwk(key);
                    if(k) {
                        let sig = await new SignJWT(data).setProtectedHeader({alg:'RS256'}).setIssuedAt().setIssuer('urn:wyzer.wizegene.com:issuer').setAudience('urn:swaggit.net:audience').setExpirationTime('1 day').sign(k);
                        if (sig) {
                            console.log(sig);
                            return sig;
                        }
                    }
                }
            }


        } catch(e)  {
            return e;
        }
    }

    async verifySignature(token:string):Promise<any | void> {
        try {

            const issuer = "urn:wyzer.wizegene.com:issuer";
            const audience = "urn:swaggit.net:audience";

            let ks = fs.readFileSync(path.resolve(__dirname, "../../.keys/jwks.json")).toString();
            if(ks) {
                let key = JSON.parse(ks).keys[0];
                if (key) {
                    let k = await parseJwk(key);
                    if(k) {
                        try {
                            const {payload, protectedHeader} = await jwtVerify(token, k, {
                                issuer: issuer,
                                audience: audience,
                                algorithms: ['RS256']
                            });

                            if (payload) {

                                console.log(protectedHeader);
                                return payload;
                            }
                        } catch(err) {

                            return err;

                        }

                    }
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

    createDefaultClaims() {

        const claims = ID_TOKEN_CLAIMS;
        return claims;

    }




}

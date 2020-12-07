import {Fetcher} from "./fetcher";
import * as IVault from "../interfaces/wizesecrets";
import {EventEmitter} from "events";
import * as path from "path";
import * as fs from "fs";

export class Vault implements IVault.VaultRequestSchema {
    header: { authorization: { name: string; value: string }; contentType: string; allowOrigins: string[] };
    method: { type: string };
    path: { type: string };
    event:EventEmitter;
    protected addr:string;
    protected token:string;
    protected unsealKey:string;
    protected fetcher:Fetcher;
    protected health:any;

    protected static vaultInstance:Vault;

    protected constructor(addr:string,token:string,unseal_key:string) {

        this.addr = addr;
        this.token = token;
        this.unsealKey = unseal_key;
        this.event = new EventEmitter();
        this.fetcher = new Fetcher();


    }



    public static getInstance(addr:string,token:string,unseal_key:string) {

        if(!(this.vaultInstance instanceof Vault)) {
            this.vaultInstance = new Vault(addr,token,unseal_key);
        }
        return this.vaultInstance;

    }

    async init():Promise<any> {
        let r;
        if(this.health.initialized === true) {
            return Error("already initialized");
        } else {
            try {
                r = await this.fetcher.Query(`${this.addr}/v1/sys/init`, "GET");
                if(r) return r;
            } catch(e) {
                return e;
            }
        }

    }

   async unsealVault(keys?:string | string[]):Promise<any> {

        let r;
        try {
            r = await this.checkIfVaultIsSealed();
            if(r) {
                if(r === true) {
                    let u;
                    u = await this.fetcher.Query(`${this.addr}/v1/sys/unseal`, "PUT", null, {key:this.unsealKey});
                    if(typeof u !== undefined) {

                        if(u.sealed === false) {
                            return u;
                        } else {
                            return Error('failed to unlock vault.');
                        }

                    }
                }
            }
        } catch(e) {
            return e;
        }


    }

    protected async getSealStatus():Promise<any> {
        return await this.fetcher.Query(`${this.addr}/v1/sys/seal-status`, "GET");
    }

    async checkIfVaultIsSealed() {
        let r;
        try {

            r = await this.getSealStatus();
            if(r) {
                return r.sealed;
            }

        } catch(e) {
            return e;
        }
    }

    async checkHealthStatus() {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/sys/health`, "GET");
            if(r) {
                this.health = r;
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async enableSecretEngine(version:number=2) {

    }

    async enableAuthMethod() {

    }

    async createOrUpdateUser(data:VaultUser) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users/${data.username}`, "POST", null, {data});
            if(r) {
                let u = await this.getUser(data.username);
                if(u){
                    return u;
                }
            }
        } catch(e) {
            return e;
        }
    }

    async getUser(username:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users/${username}`, "GET");
            if(r) {
               return r;
            }
        } catch(e) {
            return e;
        }
    }

    async deleteUser(username:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users/${username}`, "DELETE");
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async updateUserPassword(username:string, password:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users/${username}/password`, "POST", null,{password:password});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async updateUserPolicies(username:string, policies:string[]) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users/${username}/policies`, "POST", null,{policies:policies});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async listUsers() {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/users`, "LIST");
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async userLogin(username:string,password:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/userpass/login/${username}`, "POST", null,{password:password});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }




}

const VAULT_ADDR = process.env.VAULT_ADDR;
const UNSEAL_KEY = process.env.UNSEAL_KEY;
const VAULT_TOKEN = process.env.WIZE_VAULT_API_TOKEN;

export class VaultOIDC extends Vault {


    protected _config:any;


    constructor() {
        super(VAULT_ADDR, VAULT_TOKEN, UNSEAL_KEY);
        this.getConfigFromJSON();
        this.initOIDCJWT(this._config.oidc).catch(err => {console.log(err)});
    }

    getConfigFromJSON() {
        const configFile = path.resolve(__dirname, "../", "oidc.config.json");
        this._config = JSON.parse(fs.readFileSync(configFile).toString());
    }

    async initOIDCJWT(data:any) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/jwt/config`, "POST", null,{data});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async createRole(data:OIDCRoleRequestPayload) {

        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/jwt/role/${data.name}`, "POST", null, {data});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }

    }

    async getAuthorizationURL(redirect_uri:string, role?:string) {

        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/jwt/oidc/auth_url`, "POST", null, {redirect_uri:redirect_uri, role:role || null});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }

    }

    async OIDCCallback(state:string, nonce:string, code:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/jwt/oidc/callback`, "POST", null, {state:state,nonce:nonce,code:code});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }

    async JWTLogin(jwt:string, role?:string) {
        let r;
        try {
            r = await this.fetcher.Query(`${this.addr}/v1/auth/jwt/login`, "POST", null, {jwt:jwt, role:role || null});
            if(r) {
                return r;
            }
        } catch(e) {
            return e;
        }
    }


}

export class VaultIdentity extends Vault {


    constructor(){
        super(VAULT_ADDR, VAULT_TOKEN, UNSEAL_KEY);
    }
}


export class VaultKVSecrets extends Vault {


    constructor(){
        super(VAULT_ADDR, VAULT_TOKEN, UNSEAL_KEY);
    }
}


export class VaultTransit extends Vault {


    constructor(){
        super(VAULT_ADDR, VAULT_TOKEN, UNSEAL_KEY);
    }
}



export interface VaultUser {
    username:string;
    password?:string; //only needed at creation
    token_ttl:number | string;
    token_policies:string[];
    token_bound_cidrs?:string[];
    token_explicit_max_ttl?:number;
    token_no_default_policy?:boolean;
    token_num_uses?:number;
    token_period?:number;
    token_type?:string;

}

export interface OIDCRoleRequestPayload {
    name:string;
    role_type?:"oidc"|"jwt";
    bound_audiences?:string[];
    user_claim:string;
    clock_skew_leeway?:number;
    expiration_leeway?:number;
    not_before_leeway?:number;
    bound_subject?:string;
    bound_claims?:Map<string,string>;
    bound_claims_type?:string;
    groups_claim?:string;
    claim_mappings?:Map<string,string>;
    oidc_scopes?:string[];
    allowed_redirect_uris:string[];
    token_ttl:number;
    token_max_ttl:number;
    token_policies:string[];
    token_bound_cidrs?:string[];
    token_explicit_max_ttl?:number;
    token_no_default_policy?:boolean;
    token_num_uses?:number;
    token_period?:number;
    token_type?:string;
}

